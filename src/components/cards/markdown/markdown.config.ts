import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import anchor from 'markdown-it-anchor'
import toc from 'markdown-it-toc-done-right'
import container from 'markdown-it-container'//支持自定义容器语法
import { full as emoji } from 'markdown-it-emoji'


/** 标题接口 */
export interface Heading {
  level: number
  title: string
  slug: string
}


/** ---------- 辅助函数 ---------- */
/**
 * 安全的代码高亮处理函数（防 XSS + 异常兜底）
 * @param code - 需要高亮的代码字符串
 * @param lang - 代码语言标识（如 "javascript", "html"），可选
 * @returns 安全的高亮 HTML 或转义后的原始代码
 */
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
/** 
 * 把标题文本转成 slug（一般是 URL 友好的字符串，比如 "Hello World" -> "hello-world"）
 * @param s - 标题文本
 * @returns slug字符串
 */
const slugify = (s: string) => s.trim().toLowerCase().replace(/[^\\w\\u4e00-\\u9fa5]+/g, '-')


/** ---------- 主函数 ---------- */
/** 
 * 创建一个markdownit实例，配置各种插件
 * @param localHeadings - 用于收集标题信息的数组
 * @returns markdownit实例
 */
export const createMarkdown = (localHeadings: Heading[] = []) => {
  /** markdown-it 示例 */
  const md = new MarkdownIt({
    /** 允许 html 标签 */
    html: true,
    /** 启用链接转换 */
    linkify: true,
    /** 启用排版优化（例如给...转成…, --转成-） */
    typographer: true,
    /** 代码块 class 前缀 */
    langPrefix: 'language-',
    /** 高亮代码块 */
    highlight: safeHightlight
  })

  // 拦截 mermaid 代码块，输出 <div class="mermaid">
  const defaultFence = md.renderer.rules.fence || function(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

  // 自定义分割线渲染
  md.renderer.rules.hr = (tokens, idx, options, env, self) => {
    return `
      <div class="article-divider">
        <div class="line"></div>
        <div class="chase-wrapper">
          <svg t="1772099222418" class="fish" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="29685" width="200" height="200"><path d="M832.8 515.6c-1 0.2-2.2 0.2-3.2 0.2h-3.2c-1 0-2.2-0.2-3.2-0.4s-2.2-0.4-3.2-0.8l-3-1.2c-1-0.4-2-1-3-1.4-1-0.6-1.8-1.2-2.8-1.8-1-0.6-1.8-1.4-2.6-2.2l-2.4-2.4c-0.8-0.8-1.4-1.8-2.2-2.6-0.6-1-1.2-1.8-1.8-2.8-0.6-1-1.2-2-1.6-3-0.4-1-1-2.2-1.2-3.2-0.4-1-0.8-2.2-1-3.4-0.2-1.2-0.4-2.2-0.6-3.4-0.2-1.2-0.2-2.4-0.4-3.4v-3.4c0-1.2 0.2-2.4 0.4-3.4 0.2-1.2 0.4-2.2 0.6-3.4 0.2-1.2 0.6-2.2 1-3.4 0.4-1 0.8-2.2 1.4-3.2s1-2 1.6-3c0.6-1 1.2-2 2-2.8 0.6-1 1.4-1.8 2.2-2.6l2.4-2.4c0.8-0.8 1.8-1.4 2.6-2 1-0.6 1.8-1.2 2.8-1.8 1-0.6 2-1 3-1.4 1-0.4 2-0.8 3.2-1 1-0.4 2.2-0.6 3.2-0.8 1-0.2 2.2-0.4 3.2-0.4h3.2c1 0 2.2 0.2 3.2 0.4s2.2 0.4 3.2 0.6c1 0.2 2 0.6 3.2 1 1 0.4 2 0.8 3 1.4s2 1 2.8 1.8c1 0.6 1.8 1.2 2.6 2s1.6 1.4 2.4 2.2c0.8 0.8 1.6 1.6 2.2 2.6 0.8 0.8 1.4 1.8 2 2.8 0.6 1 1.2 2 1.6 3 0.6 1 1 2 1.4 3.2 0.4 1 0.8 2.2 1 3.2 0.4 1.2 0.6 2.2 0.8 3.4 0.2 1.2 0.4 2.4 0.4 3.4 0 1.2 0.2 2.4 0 3.4 0 1.2-0.2 2.4-0.2 3.4-0.2 1.8-0.6 3.6-1 5.4-0.6 1.8-1.2 3.4-1.8 5.2-0.8 1.6-1.6 3.2-2.6 4.8-1 1.6-2.2 3-3.4 4.2-1.2 1.4-2.6 2.4-4 3.6-1.4 1-2.8 2-4.4 2.8-1.6 0.8-3.2 1.4-4.8 2-1.6 0.4-3.4 0.8-5 1z m185.2 0.4c0-34.8-28.2-98.6-90-156-17.6-16.2-36.4-30.8-56.4-43.6s-40.8-23.6-62.4-32.6c-0.8-0.2-1.4-0.4-2.2-0.4-0.8 0-1.6 0.2-2.2 0.4-0.8 0.4-1.4 0.8-2 1.2-0.6 0.6-1 1.2-1.4 2-0.2 0.6-0.6 1.2-1 1.8l-19 33.6c-4 7.4-7.8 14.8-11.2 22.4-3.6 7.6-6.8 15.2-9.8 23.2-3 7.8-5.8 15.8-8.4 23.8-2.6 8-4.8 16.2-7 24.2-2 8.2-3.8 16.4-5.4 24.8-1.6 8.4-2.8 16.6-3.8 25-1 8.4-1.8 16.8-2.4 25.2-0.6 8.4-0.8 16.8-0.8 25.4 0 8.4 0.2 17 0.8 25.4 0.6 8.4 1.4 16.8 2.4 25.2 1 8.4 2.4 16.8 3.8 25 1.6 8.2 3.4 16.6 5.4 24.8 2 8.2 4.4 16.2 7 24.2 2.6 8 5.4 16 8.4 23.8 3 7.8 6.4 15.6 9.8 23 3.6 7.6 7.2 15 11.2 22.4l0.4 0.8 17.2 33.8c0.4 0.8 1 1.6 1.8 2.4 0.8 0.6 1.6 1.2 2.4 1.6 0.8 0.4 1.8 0.6 2.8 0.6 1 0 1.8-0.2 2.8-0.6C954.2 687.8 1018 569.8 1018 516z" p-id="29686" fill="var(--primary-base)"></path><path d="M669.8 516c0-20 1.2-39.8 3.6-59.4 2.4-19.8 6-39.2 11-58.4 4.8-19.2 10.8-38 18-56.4 7.2-18.4 15.4-36.2 24.8-53.4l0.2-0.4 9.2-16.2c0.4-0.6 0.6-1.2 0.8-1.8 0.2-0.6 0.4-1.4 0.4-2v-2c-0.2-0.6-0.2-1.4-0.6-2-0.2-0.6-0.6-1.2-1-1.8-0.4-0.6-0.8-1-1.4-1.4-0.4-0.4-1-0.8-1.6-1s-1.2-0.6-1.8-0.6c-25.6-5.8-51.4-9.6-77.4-11.4-3.2-0.2-6-1.4-8.4-3.4-38-31-113.4-85-190.2-99-1.4-0.2-2.6-0.4-4-0.4s-2.6 0-4 0.2-2.6 0.4-4 0.6c-1.2 0.4-2.6 0.6-3.8 1.2-1.2 0.4-2.4 1-3.6 1.6-1.2 0.6-2.4 1.4-3.4 2.2-1.2 0.8-2.2 1.6-3.2 2.6s-2 2-2.8 3c-0.8 1-1.6 2.2-2.4 3.4-0.8 1.2-1.4 2.4-2 3.6-0.6 1.2-1.2 2.6-1.6 3.8-0.4 1.4-0.8 2.6-1.2 4-0.2 1.4-0.6 2.8-0.6 4.2-0.2 1.4-0.2 2.8-0.2 4.2 0 1.4 0.2 2.8 0.4 4.2s0.4 2.8 0.8 4.2l21 78.4c0.2 1 0.4 2 0.2 3.2 0 1-0.4 2-0.8 3s-1 1.8-1.8 2.4c-0.8 0.8-1.6 1.2-2.4 1.6-72.6 28.8-135.2 81.8-181 122-0.6 0.6-1.4 1.2-2.2 1.6l-2.4 1.2c-0.8 0.4-1.8 0.6-2.6 0.8-0.8 0.2-1.8 0.2-2.6 0.2s-1.8 0-2.6-0.2-1.8-0.4-2.6-0.8l-2.4-1.2c-0.8-0.4-1.6-1-2.2-1.6-6.2-5.2-12.6-10.4-19.2-15.6-78.2-61-170-69.2-174-69.4-1.2 0-2.4-0.2-3.6 0s-2.4 0.2-3.6 0.4-2.4 0.4-3.6 0.8c-1.2 0.4-2.4 0.8-3.4 1.2-1.2 0.4-2.2 1-3.4 1.8-1 0.6-2.2 1.4-3.2 2.2-1 0.8-2 1.6-2.8 2.4-1 0.8-1.8 1.8-2.6 2.8-0.8 1-1.6 2-2.2 3.2-0.6 1-1.4 2.2-1.8 3.4-0.6 1.2-1 2.4-1.6 3.6-0.4 1.2-0.8 2.4-1.2 3.8-0.4 1.2-0.6 2.6-0.6 3.8-0.2 1.4-0.2 2.6-0.2 4s0 2.6 0.2 4 0.4 2.6 0.6 3.8c0.8 4 18.2 85.8 62.6 151 1 1.4 1.8 3 2.2 4.8 0.6 1.8 0.8 3.4 0.8 5.2s-0.2 3.6-0.8 5.2c-0.6 1.8-1.2 3.4-2.2 4.8-44.4 65.2-61.6 147-62.6 151-0.2 1.2-0.4 2.6-0.6 3.8-0.2 1.4-0.2 2.6-0.2 4s0.2 2.6 0.2 4c0.2 1.4 0.4 2.6 0.6 3.8 0.4 1.2 0.6 2.6 1.2 3.8 0.4 1.2 1 2.4 1.6 3.6 0.6 1.2 1.2 2.2 1.8 3.4 0.6 1 1.4 2.2 2.2 3.2 0.8 1 1.6 2 2.6 2.8 1 0.8 1.8 1.8 2.8 2.4s2 1.4 3.2 2.2c1 0.6 2.2 1.2 3.4 1.8 1.2 0.4 2.2 1 3.4 1.2 1.2 0.4 2.4 0.6 3.6 0.8 1.2 0.2 2.4 0.4 3.6 0.4h3.6c4-0.2 95.8-8.4 173.8-69.4 6.4-5 12.6-10 18.6-15.2 0.8-0.6 1.4-1.2 2.2-1.6l2.4-1.2c0.8-0.4 1.8-0.6 2.6-0.8 0.8-0.2 1.8-0.2 2.6-0.2s1.8 0 2.6 0.2 1.8 0.4 2.6 0.8l2.4 1.2c0.8 0.4 1.6 1 2.2 1.6 45.8 40.4 108.6 93.4 181.4 122.4 1 0.4 1.8 1 2.4 1.6 0.8 0.8 1.4 1.6 1.8 2.4 0.4 1 0.8 2 0.8 3s0 2-0.2 3l-21 78.4c-0.4 1.4-0.6 2.8-0.8 4.2-0.2 1.4-0.4 2.8-0.4 4.2 0 1.4 0 2.8 0.2 4.2l0.6 4.2c0.2 1.4 0.6 2.8 1.2 4 0.4 1.4 1 2.6 1.6 3.8 0.6 1.2 1.2 2.4 2 3.6 0.8 1.2 1.6 2.2 2.4 3.4 0.8 1 1.8 2 2.8 3 1 1 2 1.8 3.2 2.6 1.2 0.8 2.2 1.6 3.4 2.2 1.2 0.6 2.4 1.2 3.6 1.6 1.2 0.4 2.6 0.8 3.8 1.2 1.2 0.4 2.6 0.6 4 0.6 1.4 0.2 2.6 0.2 4 0.2s2.6-0.2 4-0.4c33.8-6.2 102.4-27.2 189.4-98.8 2.6-2 5.4-3.2 8.6-3.4 26-1.8 51.8-5.6 77.4-11.2l1.8-0.6c0.6-0.2 1-0.6 1.6-1 0.4-0.4 1-0.8 1.2-1.4 0.4-0.6 0.6-1 1-1.6l0.6-1.8c0.2-0.6 0.2-1.2 0.2-2 0-0.6-0.2-1.4-0.2-2l-0.6-1.8-8.8-17.4c-9.4-17.2-17.6-35-24.8-53.4-7.2-18.4-13.2-37.2-18-56.4s-8.4-38.6-10.8-58.4c-2.6-20-3.8-39.8-3.8-59.6z" p-id="29687" fill="var(--primary-base)"></path></svg>
          <svg t="1772099153074" class="cat" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="27093" width="200" height="200"><path d="M569 196q46-54 96-93 79-60 146-60 9 14 18 39 19 50 20 104 0 77-37 152l6 8q18 28 24 41 9 20 11 47l83 12-9 42-75-11-6 30 67 40-20 38-62-38q-36 76-123 118-84 39-196 39t-196-39q-87-42-123-118l-62 38-20-38 67-40-6-30-75 11-9-42 83-12q2-27 11-47 6-13 24-41l6-8q-23-47-32-96-7-40-3-81 3-32 12-63 7-22 16-41l8-14q67 0 146 60 50 39 96 93l57-4 57 4zM384 320q-18 0-30.5 12.5T341 363q0 18 12.5 30.5T384 406q18 0 30.5-12.5T427 363q0-18-12.5-30.5T384 320z m256 0q-18 0-30.5 12.5T597 363q0 18 12.5 30.5T640 406q18 0 30.5-12.5T683 363q0-18-12.5-30.5T640 320zM499 508q-6 21-23 34t-39 13q-26 0-45-18.5T373 491h-21q0 35 25 60t60 25q24 0 44-11.5t31-30.5q11 19 31 30.5t44 11.5q35 0 60-25t25-60h-21q0 27-19 45.5T587 555q-22 0-39-13t-23-34l30-60h-86l30 60z" fill="var(--primary-base)" p-id="27094"></path></svg>        </div>
        <div class="line"></div>
      </div>
    `;
  };

  md.renderer.rules.fence = (tokens: any, idx: number, options: any, env: any, self: any) => {
    const token = tokens[idx];
    const info = token.info ? md.utils.unescapeAll(token.info).trim() : '';
    
    if (info === 'mermaid') {
      return `<div class="mermaid-container"><div class="mermaid">${md.utils.escapeHtml(token.content.trim())}</div></div>`;
    }
    
    return defaultFence(tokens, idx, options, env, self);
  };

  // 加入 emoji 插件
  md.use(emoji)

  // anchor: 给标题加锚点#，并收集heading数据
  md.use(anchor, {
    slugify, // 把标题文本转成 slug（一般是 URL 友好的字符串，比如 "Hello World" -> "hello-world"）
    permalink: anchor.permalink.ariaHidden({ // 给标题加锚点#
      placement: 'before', // before: 在标题前添加锚点
      symbol: '#', // 锚点符号
      space: true, // 添加空格
      class: "header-anchor", // 锚点class名
    }),
    // 作用： 将标题信息收集到localHeadings里，用于生成目录(toc)
    callback: (token: any, info: { slug: string, title: string }) => {
      if (token?.tag && /^h[1-6]$/.test(token.tag)) {
        localHeadings.push({
          level: Number(token.tag.substring(1)),
          title: info.title,
          slug: info.slug
        })
      }
    }
  })

  // 生成目录(ul 目录)
  md.use(toc, {
    level: [2, 3, 4],
    containerClass: 'custom-toc',
    listType: 'ul',
    format: (heading: string) => heading,
    slugify,
  })

  // 支持自定义容器 (tip/warning/danger/details)
  const createContainer = (klass: string, defaultTitle: string) => {
    md.use(container, klass, {
      validate(params: string) {
        return params.trim().match(new RegExp(`^${klass}\\s*(.*)$`))
      },
      render(tokens: any, idx: number) {
        const m = tokens[idx].info.trim().match(new RegExp(`^${klass}\\s*(.*)$`))
        if (tokens[idx].nesting === 1) {
          // opening tag
          const title = m && m[1] ? md.utils.escapeHtml(m[1]) : defaultTitle
          return `<div class="custom-block ${klass}">\n<p class="custom-block-title">${title}</p>\n`
        } else {
          // closing tag
          return `</div>\n`
        }
      }
    })
  }

  createContainer('tip', 'TIP')
  createContainer('warning', 'WARNING')
  createContainer('danger', 'DANGER')
  // 兼容 info
  createContainer('info', 'INFO')

  // details 容器
  md.use(container, 'details', {
    validate(params: string) {
      return params.trim().match(/^details\s*(.*)$/)
    },
    render(tokens: any, idx: number) {
      const m = tokens[idx].info.trim().match(/^details\s*(.*)$/)
      if (tokens[idx].nesting === 1) {
        // opening tag
        const title = m && m[1] ? md.utils.escapeHtml(m[1]) : 'Details'
        return `<details class="custom-block details">\n<summary>${title}</summary>\n<div class="details-content">\n`
      } else {
        // closing tag
        return `</div>\n</details>\n`
      }
    }
  })

  // 优化图片渲染：增加懒加载、语义化 figure 标签和样式钩子
  md.renderer.rules.image = (tokens, idx) => {
    const token = tokens[idx]
    if (!token) return ''

    // 获取图片属性
    const src = token.attrGet('src') || ''
    const alt = token.content || '' // alt 文本
    const title = token.attrGet('title') || '' // title 文本

    // 构建 img 标签
    // loading="lazy": 原生懒加载
    // data-idx: 用于后续可能的图片预览插件定位
    const imgHtml = `<img src="${src}" alt="${alt}" title="${title}" loading="lazy" class="md-image" data-idx="${idx}" />`

    // 如果有 title，则作为 figcaption 显示
    if (title) {
      return `<figure class="md-figure has-caption">${imgHtml}<figcaption class="md-figcaption">${title}</figcaption></figure>`
    }

    // 默认返回 figure 包裹的图片
    return `<figure class="md-figure">${imgHtml}</figure>`
  }

  // 自定义插件：将 ~ 视为行内代码标识符 (等效于 `)
  md.inline.ruler.before('backticks', 'tilde_inline', (state, silent) => {
    const start = state.pos
    const max = state.posMax

    // 检查起始字符是否为 ~
    if (state.src.charCodeAt(start) !== 0x7E/* ~ */) { return false }

    // 扫描连续的 ~ 数量
    let pos = start + 1
    while (pos < max && state.src.charCodeAt(pos) === 0x7E) { pos++ }

    const marker = state.src.slice(start, pos)
    const openerLength = marker.length

    // 如果是 silent 模式，只需要返回 true (既然匹配到了起始)
    // 但通常 inline rule 需要验证是否有闭合才能算匹配成功？
    // backticks rule 如果找不到闭合，会作为 text 处理。
    
    // 寻找闭合 ~
    let matchStart = pos
    let matchEnd = -1

    while ((matchStart = state.src.indexOf('~', matchStart)) !== -1) {
      let matchLen = 1
      let mPos = matchStart + 1
      while (mPos < max && state.src.charCodeAt(mPos) === 0x7E) {
        mPos++
        matchLen++
      }

      if (matchLen === openerLength) {
        matchEnd = matchStart
        break
      }
      matchStart = mPos
    }

    if (matchEnd === -1) {
      // 没找到闭合，不是 inline code，回退，当做普通文本处理
      if (!silent) state.pending += marker
      state.pos += openerLength
      return true
    }
    
    // 找到了闭合
    if (silent) return true

    const content = state.src.slice(pos, matchEnd).replace(/\n/g, ' ')
    let text = content
    // 去除首尾空格 (模拟 backticks 行为)
    if (text.startsWith(' ') && text.endsWith(' ') && text.trim().length > 0) {
        text = text.slice(1, -1)
    }

    const token = state.push('code_inline', 'code', 0)
    token.markup = marker
    token.content = text

    state.pos = matchEnd + openerLength
    return true
  })

  return md
}