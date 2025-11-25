<script lang="ts" setup>
import type { SmallJoyCardContent } from '@/types/components/Aboutme';
import { createI18nUtil } from '@/utils/i18n.util';
import { useIntervalFn } from '@vueuse/core';
import { computed, onMounted, ref } from 'vue';


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
      <div class="small-joy-tag">{{ smallJoyContent.tag }}</div>
      <div class="small-joy-title">
        {{ smallJoyContent.tag }}
      </div>
      <div class="small-joy-prefix">
        {{ smallJoyContent.prefixed }}
      </div>
      <div 
        class="small-joy-word"
        :style="{
          '--word-color': currentColor
        }"
        :key="currentIndex"
      >
        {{ currentWord }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// 文字轮播动画
@keyframes wordSlide {
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  50% {
    opacity: 0.5;
    transform: translateY(50%);
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
.small-joy {
  position: relative;
  height: 200px;
  &__container {
    @extend %aboutme-container;
    @include mix.flex-box($d: column, $a: flex-start);
    &:hover {
      .small-joy-title {
        &::after {
          width: 100%;
        }
      }
    }
  }
  &-tag {
    @extend %aboutme-tag;
  }
  &-title,
  &-prefix {
    @include mix.margin-d(b, md);
  }
  &-title {
    @include mix.font-style($s: title, $f: 'title', $c: var(--primary-base));
    @include hov.underline-style;
  }
  &-prefix {
    @include mix.font-style($s: xxl, $f: 'title');
  }
  &-word {
    @include mix.font-style($s: title, $f: 'title', $c: var(--word-color));
    animation: wordSlide 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }
}
</style>