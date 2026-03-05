<script lang="ts" setup>
import { useMarkdown } from './useMarkdown';
import { watch, nextTick, onMounted, onUnmounted, ref, computed } from 'vue';
import 'highlight.js/styles/atom-one-dark.css'; // 引入代码高亮样式
import mermaid from 'mermaid';
import { useThemeStore } from '@/stores/theme.store';
import { storeToRefs } from 'pinia';


/** ---------- 状态管理 ---------- */
const themeStore = useThemeStore();
const { theme } = storeToRefs(themeStore);


/** ---------- 计算属性 ---------- */
/** mermaid 主题 */
const mermaidTheme = computed(() => theme.value === 'dark' ? 'dark' : 'base');

// 初始化 mermaid 配置
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
});

// 定义组件 props
const props = defineProps<{
  markdown: string
}>();

// 使用 useMarkdown hook
const { html, renderAndStore, toc, headings } = useMarkdown();
const containerRef = ref<HTMLElement>();
const renderKey = ref(0);

// 渲染 Mermaid 图表
const renderMermaid = async () => {
  await nextTick();
  if (!containerRef.value) return;
  
  const mermaidNodes = containerRef.value.querySelectorAll('.mermaid') as NodeListOf<HTMLElement>;
  if (mermaidNodes.length > 0) {
    try {
      await mermaid.run({
        nodes: mermaidNodes
      });
      // 渲染完成后显示（配合 CSS opacity: 0 使用，防止闪烁）
      // 重新查询以处理节点可能被替换的情况
      const processedNodes = containerRef.value.querySelectorAll('.mermaid, svg[id^="mermaid-"]');
      processedNodes.forEach(node => {
        (node as HTMLElement).style.opacity = '1';
      });
    } catch (error) {
      console.error('Mermaid rendering failed:', error);
      // 失败时也要显示原始内容
      mermaidNodes.forEach(node => {
        node.style.opacity = '1';
        node.style.color = 'red';
      });
    }
  }
};

/** ---------- Details 折叠块交互逻辑 ---------- */
const handleDetailsClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  const summary = target.closest('summary');
  if (!summary) return;

  const details = summary.parentElement as HTMLDetailsElement;
  if (!details) return;
  
  const content = details.querySelector('.details-content') as HTMLElement;
  if (!content) return;

  // 如果正在进行动画，忽略点击 (防止重复点击导致状态错乱)
  if (details.dataset.isAnimating === 'true') {
    e.preventDefault();
    return;
  }

  details.dataset.isAnimating = 'true';

  if (details.open) {
    // 准备收起 (Closing)
    e.preventDefault(); // 阻止默认的立即收起行为
    
    // 1. 获取当前高度并锁定 (从 auto 变为具体数值)
    const startHeight = content.offsetHeight;
    content.style.maxHeight = `${startHeight}px`;
    
    // 2. 强制重绘，确保 max-height 生效
    // eslint-disable-next-line no-unused-expressions
    content.offsetHeight;
    
    // 3. 设置结束状态 (触发 CSS transition)
    requestAnimationFrame(() => {
      // 强制设置 transition 覆盖 CSS 定义，确保收起动画一致性 (300ms)
      content.style.transition = 'max-height 0.3s ease-out, opacity 0.3s ease-out, padding 0.3s ease-out';
      content.style.maxHeight = '0px';
      content.style.opacity = '0';
      content.style.paddingTop = '0px';
      content.style.paddingBottom = '0px';
    });
    
    // 4. 等待动画结束
    const timer = setTimeout(() => {
      details.removeAttribute('open');
      // 清理内联样式，恢复 CSS 定义的默认状态
      content.style.maxHeight = '';
      content.style.opacity = '';
      content.style.paddingTop = '';
      content.style.paddingBottom = '';
      content.style.transition = ''; // 清理内联 transition
      details.dataset.isAnimating = 'false';
    }, 300); // 300ms 对应 CSS transition 时间
    timeoutIds.push(timer);
  } else {
    // 准备展开 (Opening)
    // 允许默认行为发生 (添加 open 属性)，但锁定点击直到动画完成
    // 注意：展开时的动画由 CSS 处理 (max-height: 2000px)，我们只需要加锁
    const timer = setTimeout(() => {
      details.dataset.isAnimating = 'false';
    }, 500); // 500ms 对应 CSS 展开动画时间
    timeoutIds.push(timer);
  }
};

// 记录定时器ID以便清理
const timeoutIds: ReturnType<typeof setTimeout>[] = [];

onUnmounted(() => {
  timeoutIds.forEach(id => clearTimeout(id));
});

// 监听 markdown 内容变化并重新渲染
watch(() => props.markdown, async (newContent) => {
  if (newContent) {
    renderAndStore(newContent);
    await renderMermaid();
  }
}, { immediate: true });

// 监听主题变化并重新渲染 mermaid 图表
watch(() => theme.value, async () => {
  mermaid.initialize({
    startOnLoad: false,
    theme: mermaidTheme.value,
    securityLevel: 'loose',
  });
  
  // 强制 DOM 重新渲染以恢复原始代码块（因为 mermaid.run 会替换 DOM 元素）
  // 即使 props.markdown 没变，我们也需要通过 key 变化触发 v-html 重新挂载
  if (props.markdown) {
    renderKey.value++;
    await nextTick(); // 等待 DOM 更新
    await renderMermaid();
  }
});

onMounted(() => {
  renderMermaid();
});

// 暴露 toc 和 headings 给父组件（例如用于侧边栏目录）
defineExpose({
  toc,
  headings
});

</script>

<template>
  <div 
    :key="renderKey" 
    ref="containerRef" 
    class="markdown-body markdown" 
    v-html="html"
    @click="handleDetailsClick"
  ></div>
</template>

<style lang="scss" scoped>
.markdown-body {
  width: 100%;
  overflow-x: hidden;
  :deep(.mermaid) {
    @extend %flex-center;
  }
}
</style>