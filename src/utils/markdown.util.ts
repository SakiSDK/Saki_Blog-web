import MarkdownIt from 'markdown-it'         //引入markdown渲染主模块
import hljs from 'highlight.js'              //代码高亮模块
import anchor from 'markdown-it-anchor'      //锚点跳转
import toc from 'markdown-it-toc-done-right' //根据title自动生成目录
import container from 'markdown-it-container'//支持自定义容器语法
import markdownItEmoji from 'markdown-it-emoji/dist/markdown-it-emoji.js'

import { ref, isRef, watch, type Ref } from 'vue'

// Heading类型：每个标题的基本信息
type Heading = {
    level: number,
    title: string,
    slug: string,
}
// toctree类型：树形结构
export type TocTree = {
    level: number,
    title: string,
    slug: string,
    children?: TocTree[]
}

// slugify: 生成锚点ID，支持中英文
const slugify = (s: string) => {
    const slug = s.trim().toLowerCase()
        .replace(/[^\\w\\u4e00-\\u9fa5]+/g, '-')
        .replace(/^-+|-+$/g, '');
    return slug || 'section';
}


// highlight.js 安全封装，如果失败就转义为普通文本
// code: 需要高亮的代码字符串
//lang: 代码语言
const safeHightlight = (code: string, lang?: string) => {
    try {
        //如果传入了语言，并且hightlight.js支持该语言，就进行高亮
        if (lang && hljs.getLanguage(lang)) {
            return hljs.highlight(code, {language: lang}).value;
        }
        //否则使用自动检测
        return hljs.highlightAuto(code).value;
    } catch (error) {
        //如果高亮过程出错（比如输入了特殊字符导致报错）
        //使用markdown-it的HTML转义方法转义，避免xss报错
        return MarkdownIt().utils.escapeHtml(code);
    }
}

// buildMd: 构建一个markdownit实例，配置各种插件
const buildMd = (localHeadings: Heading[]) => {
    const md = new MarkdownIt({
        html: true, // 允许html标签 
        langPrefix: 'language-', // 代码块class前缀
        highlight: (code: string, lang?: string) => safeHightlight(code, lang),
        typographer: true,       // 启用排版优化（例如给...转成…, --转成-）
    })

    //加入emoji插件
    md.use(markdownItEmoji)

    // anchor: 给标题加锚点#，并收集heading数据
    md.use(anchor, {
        slugify,// 把标题文本转成 slug（一般是 URL 友好的字符串，比如 "Hello World" -> "hello-world"）
        permalink: anchor.permalink.ariaHidden({//给标题加锚点#
            placement: 'before',    // before: 在标题前添加锚点
            symbol: '#',            // 锚点符号
            space: true,            // 添加空格
            class: "header-anchor", // 锚点class名
        }),
        // slugify: () => '',
        // permalink: false,
        // 作用： 讲标题信息收集到localHeadings里，用于生成目录(toc)
        callback: (token: any, info: { slug: string, title: string }) => {
            if (token.tag && /^h[1-6]$/.test(token.tag)) {
                localHeadings.push({
                    level: Number(token.tag[1]),
                    title: info.title,
                    slug: info.slug
                })
            }
        }
    })

    //生成目录（ul目录）
    md.use(toc, {
        level: [2, 3, 4],
        containerClass: 'custom-toc',
        listType: 'ul',
        format: (heading: string) => heading,
        slugify,
    })

    md.use(container, 'summary', {
        validate(params: string) {// 判断当前自定义容器是否支持summary类型
            return params.trim().match(/^summary\s+(.*)$/)
        },
        //渲染函数决定如何输出HTML
        render(tokens: any, idx: number) {
            // 从tokens中取出参数（标题文本）
            const m = tokens[idx].info.trim().match(/^summary\s+(.*)$/)
            if (tokens[idx].nesting === 1) {
                // opening tag
                const title = m ? md.utils.escapeHtml(m[1]) : ''
                return `<details class="md-summary"><summary>${title}</summary>\n`
            } else {
                // closing tag
                return '</details>\n'
            }
        }
    })  

    const defaultImageReanderer = md.renderer.rules.image || ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options))
    md.renderer.rules.image = (tokens, idx, options, env, self) => {
        const token = tokens[idx]
        if (!token) return '';
        const src = token.attrGet('src')
        const alt = token.content || ''
        return `
            <figure>
                <img imageId="${idx}" src="${src}" alt="${alt}" />
            </figure>
        `
    }

    // info/warning/danger容器
    const makeContrainer = (name: string) => {
        md.use(container, name, {
            validate: (params: string) => params.trim().match(`^${name}\\s*(.*)$`),
            render: (tokens: any, idx: number) => {
                const m = tokens[idx].info.trim().match(new RegExp(`^${name}\\s*(.*)$`))
                if (tokens[idx].nesting === 1) {
                    const title = m ? md.utils.escapeHtml(m[1]) : ''
                    return `<div class="md-${name}"><div class="md-${name}-title">${title}</div>\n`
                } else {
                    return '</div>\n'
                }
            }
        })
    }
    ;['info', 'warning', 'danger'].forEach(makeContrainer);
    
    return md
}


// buildTocTree: 把扁平的headings转成树结构
const buildTocTree = (headings: Heading[]): TocTree[] => { 
    const tree: TocTree[] = []
    let currentH2: TocTree | null = null

    for (const h of headings) {
        if (h.level === 2) {
            const node: TocTree = { ...h, children: [] }
            tree.push(node)
            currentH2 = node
        } else if (h.level === 3 && currentH2) {
            currentH2.children!.push({ ...h })
        }
    }
    return tree
}

// renderMarkdown: 核心渲染函数
const renderMarkdown = (text: string | Ref<string>) => {
    const localHeadings: Heading[] = []
    const md = buildMd(localHeadings);

    const html = ref('')
    const toc = ref<Heading[]>([])          //扁平Toc
    const tocTree = ref<Heading[]>([])      //树形Toc
    const activeSlug = ref<string>('')      //当前高亮的锚点

    const doRender = (raw: string) => {
        localHeadings.length = 0
        html.value = md.render(raw || '')
        toc.value = [...localHeadings]
        tocTree.value = buildTocTree(localHeadings)
        // 👇 初始化时默认选中第一个标题
        if (localHeadings.length > 0) {
            if(localHeadings[0])
                activeSlug.value = localHeadings[0].slug
        }
    }
    if (isRef(text)) {
        doRender(text.value)
        watch(text, (newVal) => {
            doRender(newVal||'')
        }, {
            immediate: true
        })
    } else {
        doRender(text || '')
    }
    
    //自动高亮逻辑，监听scroll，找到离顶部最近heading
    const updateActiveSlug = () => {
        const headingEls = localHeadings
            .map((h) => document.getElementById(h.slug))
            .filter(Boolean) as HTMLElement[];
        let active: string | null = null
        for (const el of headingEls) {
            const rect = el.getBoundingClientRect()
            if (rect.top <= 100) {//离顶部小于100，则认为该heading是当前激活的
                active = el.id
            }
        }
        if(active) activeSlug.value = active
    }
    window.addEventListener('scroll', updateActiveSlug)
    
    return {
        html, toc, tocTree, activeSlug
    }
}   

export default renderMarkdown