<script lang="ts" setup>
import { ref, watch } from 'vue';
import CardHeader from '@/components/bases/CardHeader.vue';
import ArticleTocList, { type TocItem } from './ArticleTocList.vue';

/** ---------- 类型定义 ---------- */
/** 目录树类型定义 (扁平结构) */
export interface TocTree {
  title: string
  slug: string
  level: number
}

const props = defineProps<{
  toc: TocTree[],
  activeSlug: string,
}>()

// 树形结构数据
const tocTreeData = ref<TocItem[]>([]);

/**
 * 将扁平 TOC 转换为树形结构
 */
const buildTocTree = (flatToc: TocTree[]): TocItem[] => {
  const tree: TocItem[] = [];
  const stack: TocItem[] = [];

  flatToc.forEach(item => {
    // 创建新节点，默认 isOpen 为 false
    const node: TocItem = { 
      ...item, 
      children: [], 
      isOpen: false // 默认全部折叠
    };

    // 找到当前节点的父节点（父节点 level < 当前节点 level）
    while (stack.length > 0 && stack[stack.length - 1]!.level >= node.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      // 根节点
      tree.push(node);
    } else {
      // 子节点
      const parent = stack[stack.length - 1];
      if (parent && parent.children) {
        parent.children.push(node);
      }
    }

    stack.push(node);
  });

  return tree;
}

// 监听 toc 变化重建树
watch(() => props.toc, (newToc) => {
  if (newToc && newToc.length) {
    tocTreeData.value = buildTocTree(newToc);
  } else {
    tocTreeData.value = [];
  }
}, { immediate: true });

// 递归查找并展开路径
const expandPathToSlug = (nodes: TocItem[], slug: string): boolean => {
  for (const node of nodes) {
    if (node.slug === slug) {
      node.isOpen = true; // 展开当前节点（如果想看子节点）
      return true;
    }
    
    if (node.children && node.children.length > 0) {
      const found = expandPathToSlug(node.children, slug);
      if (found) {
        node.isOpen = true; // 展开父节点
        return true;
      }
    }
  }
  return false;
}

// 监听 activeSlug 自动展开
watch(() => props.activeSlug, (newSlug) => {
  if (newSlug) {
    expandPathToSlug(tocTreeData.value, newSlug);
  }
});

const handleToggle = (item: TocItem) => {
  item.isOpen = !item.isOpen;
}

/** 
 * 处理点击锚点跳转
 */
const handleAnchorClick = (e: MouseEvent, slug: string) => {
  e.preventDefault();
  const element = document.getElementById(slug);
  if (element) {
    const offset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}
</script>

<template>
  <div class="toc-card sticky-card">
    <div class="toc-card__container">
      <div class="toc-card__header">
        <CardHeader icon="title" title="文章目录" fontSize="xxl"/>
      </div>
      <div class="toc-card__content">
        <ArticleTocList 
          :items="tocTreeData" 
          :active-slug="activeSlug"
          @node-click="handleAnchorClick"
          @toggle="handleToggle"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sticky-card {
  @include mix.position-style($p: sticky, $t: 70px);
}
.toc-card {
  width: 100%;
  @include mix.container-style($p: 0, $r: lg, $bg: var(--surface-base), $b: var(--border-base));
  
  &__content {
    width: 100%;
    @include mix.padding(lg);
    // 限制最大高度并允许滚动，防止目录过长
    max-height: calc(100vh - 150px);
    overflow-y: auto;
    
    // 自定义滚动条样式
    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background: var(--border-base);
      border-radius: 2px;
    }
  }
}
</style>