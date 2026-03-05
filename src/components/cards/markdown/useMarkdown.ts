import { ref, computed } from 'vue';
import { createMarkdown, type Heading } from './markdown.config';


export function useMarkdown() {
  /** 标题列表（用于生成目录） */
  const headings = ref<Heading[]>([])
  
  /** MarkdownIt 实例（传入标题列表用于收集标题信息） */
  const md = createMarkdown(headings.value);

  /** 渲染 Markdown 字符串 */
  const render = (markdown: string): string => {
    // 重置标题列表（每次渲染前清空）
    headings.value.length = 0;
    
    // 使用 MarkdownIt 渲染字符串
    return md.render(markdown);
  }

  /** 生成目录（用于侧边栏/目录导航） */
  const toc = computed(() => {
    return headings.value
      .filter(heading => heading.level >= 2 && heading.level <= 4)
      .map(heading => ({
        level: heading.level,
        title: heading.title,
        slug: heading.slug
      }))
  })

  /** 获取当前渲染的 HTML */
  const html = ref<string>('');

  /** 渲染并更新 HTML */
  const renderAndStore = (markdown: string) => {
    html.value = render(markdown);
  }

  // 当前激活的标题 ID（用于高亮目录）
  const activeSlug = ref<string>('');

  /**
   * 滚动到指定锚点（带偏移量，避免被 Header 遮挡）
   * @param slug - 锚点 ID
   * @param offset - 顶部偏移量（默认 80px）
   */
  const scrollToAnchor = (slug: string, offset = 80) => {
    const element = document.getElementById(slug);
    if (element) {
      // 计算偏移位置
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // 更新当前激活状态
      activeSlug.value = slug;
    }
  }

  return {
    render,
    headings,
    toc,
    html,
    renderAndStore,
    scrollToAnchor,
    activeSlug
  }
}