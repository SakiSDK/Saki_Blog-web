<script lang="ts" setup>
import { computed } from 'vue';

/** 目录节点类型定义 */
export interface TocItem {
  title: string
  slug: string
  level: number
  children?: TocItem[]
  isOpen?: boolean
}

const props = defineProps<{
  items: TocItem[]
  activeSlug: string
}>()

const emit = defineEmits<{
  (e: 'node-click', event: MouseEvent, slug: string): void
  (e: 'toggle', item: TocItem): void
}>()

const handleLinkClick = (e: MouseEvent, item: TocItem) => {
  emit('node-click', e, item.slug);
}

const handleToggleClick = (e: MouseEvent, item: TocItem) => {
  e.preventDefault();
  e.stopPropagation();
  emit('toggle', item);
}
</script>

<template>
  <ul class="toc-list">
    <li v-for="item in items" :key="item.slug" class="toc-item">
      <div class="toc-link-wrapper">
        <a 
          :href="'#' + item.slug" 
          class="toc-link" 
          :class="[
            `level-${item.level}`,
            { 'active': item.slug === activeSlug }
          ]"
          @click="handleLinkClick($event, item)"
        >
          <span class="toc-text">{{ item.title }}</span>
          <!-- 折叠图标：阻止冒泡，只触发切换 -->
          <span 
            v-if="item.children && item.children.length" 
            class="toc-toggle-icon"
            @click="handleToggleClick($event, item)"
          >
            <svg viewBox="0 0 1024 1024" width="12" height="12" :class="{ 'is-open': item.isOpen }">
              <path d="M340.864 149.312a30.592 30.592 0 0 0 0 42.752L652.736 512 340.864 831.872a30.592 30.592 0 0 0 0 42.752 29.12 29.12 0 0 0 41.728 0L714.24 534.336a32 32 0 0 0 0-44.672L382.592 149.376a29.12 29.12 0 0 0-41.728 0z" fill="currentColor"></path>
            </svg>
          </span>
        </a>
      </div>
      
      <div 
        class="toc-children" 
        :class="{ 'is-expanded': item.isOpen }"
      >
        <ArticleTocList 
          v-if="item.children && item.children.length" 
          :items="item.children" 
          :active-slug="activeSlug"
          @node-click="(e, slug) => emit('node-click', e, slug)" 
          @toggle="(itm) => emit('toggle', itm)"
        />
      </div>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
.toc-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem; // md spacing
}
.toc-item,
.toc-link-wrapper {
  width: 100%;
}
.toc-link {
  @include mix.flex-box($a: center, $j: space-between);
  width: 100%;
  @include mix.padding(xs);
  @include mix.font-style($s: title, $w: bold);
  @include hov.color(var(--primary-base));
  @include anim.transition;
  border-radius: rem(8); // 统一圆角
  cursor: pointer;
  // 基础样式
  &.level-2 {
    @include mix.font-style($s: xl);
    opacity: 0.9;
  }
  &.level-3 {
    @include mix.padding-d(l, lg);
    @include mix.font-style($s: lg);
    opacity: 0.8;
  }
  &.level-4, &.level-5, &.level-6 {
    @include mix.padding-d(l, xxl);
    @include mix.font-style($s: md);
    opacity: 0.7;
  }

  // 激活状态
  &.active {
    position: relative;
    @include mix.container-style($p: xs lg, $bg: var(--primary-ghost));
    // 保持圆角一致
    @include mix.radius(0);
    @include mix.radius-d(tr, md);
    @include mix.radius-d(br, md);
    
    @include mix.font-style($w: bold, $c: var(--primary-base));
    opacity: 1;

    // 左侧高亮条
    &::before {
      content: '';
      @include mix.position-style(absolute,$l:0,$t:0);
      @include mix.size(3px,100%);
      background: var(--primary-base);
      transform: scaleY(1.1); // 直接展开
    }
  }
  .toc-text {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .toc-toggle-icon {
    @extend %flex-center;
    @include mix.radius(sm);
    margin-left: 0.5rem;
    padding: 0.2rem;
    &:hover {
      background-color: var(--primary-transparent);
    }
    svg {
      @include anim.transition($p: transform);
      &.is-open {
        transform: rotate(90deg);
      }
    }
  }
}
.toc-children {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s ease-out;
  overflow: hidden;
  
  &.is-expanded {
    grid-template-rows: 1fr;
    margin-top: 0.5rem; // 展开时增加一点间距
  }
  
  > :deep(.toc-list) {
    min-height: 0;
  }
}
</style>