<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useResizeObserver } from '@vueuse/core';
import { useRoute } from 'vue-router';

const scrollY = ref(0);
const scrollHeight = ref(0);
const clientHeight = ref(0);
const thumbHeight = ref(0);
const thumbTop = ref(0);
const isDragging = ref(false);
const startY = ref(0);
const startTop = ref(0);
const isVisible = ref(false);
let hideTimer: number | null = null;
const route = useRoute();

// 计算滚动条位置和高度
const updateScrollbar = () => {
  scrollY.value = window.scrollY || document.documentElement.scrollTop;
  scrollHeight.value = document.documentElement.scrollHeight;
  clientHeight.value = window.innerHeight || document.documentElement.clientHeight;

  // 只有当内容超出视口时才显示滚动条
  if (scrollHeight.value <= clientHeight.value) {
    thumbHeight.value = 0;
    isVisible.value = false;
    return;
  }

  // 计算滑块高度 (最小高度 30px)
  const ratio = clientHeight.value / scrollHeight.value;
  thumbHeight.value = Math.max(clientHeight.value * ratio, 30);

  // 计算滑块位置
  // 可滚动区域高度
  const maxScrollTop = scrollHeight.value - clientHeight.value;
  // 滑块可移动区域高度
  const maxThumbTop = clientHeight.value - thumbHeight.value;
  
  if (maxScrollTop > 0) {
    // 确保 thumbTop 不会超出边界
    const calculatedTop = (scrollY.value / maxScrollTop) * maxThumbTop;
    thumbTop.value = Math.min(Math.max(calculatedTop, 0), maxThumbTop);
  } else {
    thumbTop.value = 0;
  }
};

// 滚动监听
const handleScroll = () => {
  updateScrollbar();
  showScrollbar();
};

// 监听内容高度变化（重要：解决动态加载内容后滚动条不更新的问题）
useResizeObserver(document.body, () => {
  updateScrollbar();
});

// 监听路由变化，重置状态
watch(() => route.path, () => {
  setTimeout(updateScrollbar, 100); // 等待 DOM 更新
});

// 显示滚动条并在停止滚动后隐藏
const showScrollbar = () => {
  isVisible.value = true;
  if (hideTimer) clearTimeout(hideTimer);
  if (!isDragging.value) {
    hideTimer = window.setTimeout(() => {
      isVisible.value = false;
    }, 1500);
  }
};

// 拖拽开始
const onMouseDown = (e: MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  isDragging.value = true;
  startY.value = e.clientY;
  startTop.value = thumbTop.value;
  isVisible.value = true;
  if (hideTimer) clearTimeout(hideTimer);
  
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
  document.body.style.userSelect = 'none';
};

// 拖拽中
const onMouseMove = (e: MouseEvent) => {
  if (!isDragging.value) return;
  
  const deltaY = e.clientY - startY.value;
  const maxThumbTop = clientHeight.value - thumbHeight.value;
  let newThumbTop = startTop.value + deltaY;
  
  // 限制滑块位置
  newThumbTop = Math.max(0, Math.min(newThumbTop, maxThumbTop));
  
  // 计算对应的页面滚动位置
  const maxScrollTop = scrollHeight.value - clientHeight.value;
  const scrollRatio = newThumbTop / maxThumbTop;
  
  window.scrollTo(0, scrollRatio * maxScrollTop);
};

// 拖拽结束
const onMouseUp = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
  document.body.style.userSelect = '';
  showScrollbar(); // 重新启动隐藏计时器
};

// 点击轨道跳转
const onTrackClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) {
    const clickY = e.clientY;
    const ratio = clickY / clientHeight.value;
    window.scrollTo({
      top: ratio * (scrollHeight.value - clientHeight.value),
      behavior: 'smooth'
    });
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', updateScrollbar);
  // 初始化一次
  updateScrollbar();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', updateScrollbar);
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
  document.body.style.userSelect = '';
  if (hideTimer) clearTimeout(hideTimer);
});
</script>

<template>
  <div 
    class="custom-scrollbar" 
    :class="{ 'visible': isVisible || isDragging }"
    @mouseenter="showScrollbar"
  >
    <div 
      class="scrollbar-track"
      @click="onTrackClick"
    ></div>
    <div 
      class="scrollbar-thumb"
      :style="{ 
        height: `${thumbHeight}px`, 
        transform: `translateY(${thumbTop}px)` 
      }"
      @mousedown="onMouseDown"
    ></div>
  </div>
</template>

<style lang="scss" scoped>
.custom-scrollbar {
  @include mix.size(rem(8), 100vh);
  @include mix.position-style($p: fixed, $t: 0, $r: 0, $z: scrollbar);
  opacity: 0;
  @include anim.transition($p: opacity width, $dr: 0.3s, $tf: ease);
  /* 只有鼠标在附近或滚动时才显示 */
  &.visible {
    opacity: 1;
  }
  /* 鼠标悬停时稍微变宽，方便点击 */
  &:hover {
    width: rem(12);
    background: rgba(0, 0, 0, 0.05); /* 轨道背景 */
    .scrollbar-thumb {
      background: var(--primary-base); /* 激活色 */
    }
  }
}
.scrollbar-track {
  @extend %full-size;
  @include mix.position-style($p: absolute, $t: 0, $l: 0);
  cursor: pointer;
}
.scrollbar-thumb {
  @include mix.position-style($p: absolute, $t: 0, $r: rem(1));
  width: rem(6); /* 滑块宽度 */
  @include mix.radius(sm);
  background: var(--text-base); /* 默认颜色改为 text-base 确保可见性 */
  opacity: 0.3; /* 降低默认不透明度 */
  cursor: grab;
  /* 避免拖拽时选中 */
  user-select: none; 
  @include anim.transition($p: background-color width opacity, $dr: 0.3s, $tf: ease);
  /* 拖拽时样式 */
  &:active {
    background: var(--primary-base);
    opacity: 0.8;
    cursor: grabbing;
    width: rem(10); /* 拖拽时变宽 */
    right: rem(1);
  }
}
/* 悬停在滚动条区域时，滑块也变宽 */
.custom-scrollbar:hover .scrollbar-thumb {
  width: rem(8);
  right: rem(2);
  opacity: 0.6;
}
</style>