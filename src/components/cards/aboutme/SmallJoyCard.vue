<script lang="ts" setup>
import { createI18nUtil } from '@/utils/i18n.util';
import { useIntervalFn } from '@vueuse/core';
import { computed, onMounted, ref } from 'vue';


interface SmallJoyCardContent {
  title: string;
  tag: string;
  prefixed: string;
  default: string;
}

/** ---------- SmallJoy State ---------- */
const currentIndex = ref<number>(0)
const colors = ref<string[]>([]);

/** ---------- SmallJoy Text ---------- */
const { tWithPrefix, tList } = createI18nUtil();
const joyT = tWithPrefix('aboutme.smallJoyCard');
const words: string[] = tList('aboutme.smallJoyCard.words')
const smallJoyContent: SmallJoyCardContent = {
  title: joyT('title'),
  tag: joyT('tag'),
  prefixed: joyT('prefix'),
  default: joyT('default')
}

/** ---------- Computed State ---------- */
// 当前文字和颜色
const currentWord = computed(() => words[currentIndex.value]);
const currentColor = computed(() => colors.value[currentIndex.value]);

/** ---------- 逻辑方法 ---------- */
// 随机颜色生成器
const getRandomColor = (): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
  ];
  return colors[Math.floor(Math.random() * colors.length)] as string;
};


onMounted(() => {
  colors.value = words.map(() => getRandomColor());
  
  // 每3秒切换文字
  useIntervalFn(() => {
    currentIndex.value = (currentIndex.value + 1) % words.length;
  }, 3000);
})
</script>

<template>
  <div class="small-joy">
    <div class="small-joy__container">
      <!-- 顶部标签 -->
      <div class="small-joy-header">
        <span class="header-text">{{ smallJoyContent.tag }}</span>
      </div>
      
      <!-- 主要内容区域 -->
      <div class="small-joy-content">
        <div class="prefix-text">
          {{ smallJoyContent.prefixed }}
        </div>
        <div 
          class="animated-word"
          :style="{ color: currentColor }"
          :key="currentIndex"
        >
          {{ currentWord }}
        </div>
      </div>
      
      <!-- 装饰背景 -->
      <div 
        class="decoration-circle" 
        :style="{ background: currentColor }"
      ></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// 文字进入动画
@keyframes wordSlideIn {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.9);
    filter: blur(4px);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}
// 背景呼吸动画
@keyframes breathe {
  0%, 100% { transform: scale(1); opacity: 0.1; }
  50% { transform: scale(1.2); opacity: 0.2; }
}
.small-joy {
  height: rem(200);
  &__container {
    position: relative;
    @extend %aboutme-container;
    overflow: hidden;
    @include mix.flex-box($d: column, $j: center, $a: center);
    @include mix.padding(xl);
    background: var(--surface-base);
  }
  &-header {
    @include mix.position-style($p: absolute, $t: md, $l: lg);
    @include mix.flex-box($a: center, $g: xs);
    .header-text {
      @include mix.font-style($s: sm, $w: bold, $c: var(--text-weak));
      letter-spacing: 1px;
      text-transform: uppercase;
    }
  }
  &-content {
    width: 100%;
    @include mix.flex-box($d: column, $a: center, $g: sm);
    z-index: 1;
    @extend %text-center;
    .prefix-text {
      @include mix.font-style($s: xxl, $c: var(--text-secondary), $w: 500);
    }
    .animated-word {
      @include mix.font-style($s: title-lg, $w: 900, $f: 'title', $l: 1.2);
      animation: wordSlideIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
      text-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  }
  .decoration-circle {
    @include mix.position-style($p: absolute, $b: -30%, $r: -10%, $z: 0);
    @include mix.size(rem(180));
    border-radius: 50%;
    filter: blur(60px);
    animation: breathe 4s ease-in-out infinite;
    pointer-events: none;
  }
}
</style>