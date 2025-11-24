<script lang="ts" setup>
import { useThemeStore } from '@/stores/theme.store';
import type { ThemeState } from '@/stores/theme.store';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

/** ---------- 组件参数 ---------- */
defineProps<{
  height?: string;
}>()

/** ---------- 状态管理 ---------- */
const themeStore = useThemeStore();
const { theme } = storeToRefs(themeStore);

/** ---------- 固定变量 ---------- */
const THEME_WAVE_MAP = {
  dark: [
    { y: 0, fill: 'rgba(11,15,17, 0.5)' },
    { y: 3, fill: 'rgba(11,15,17, 0.3)' },
    { y: 5, fill: 'rgba(11,15,17, 0.1)' },
    { y: 7, fill: 'rgba(11,15,17, 0.8)' },
  ],
  light: [
    { y: 0, fill: 'rgba(234, 239, 248, 0.8)' },
    { y: 3, fill: 'rgba(234, 239, 248, 0.5)' },
    { y: 5, fill: 'rgba(234, 239, 248, 0.2)' },
    { y: 7, fill: 'rgba(234, 239, 248, 1)' },
  ],
} as const; // as const 让TS推导更精准，避免类型溢出

const waves = computed(() => THEME_WAVE_MAP[theme.value as ThemeState])
</script>

<template>
  <div 
    class="waves"
    :style="{
      '--wave-height': height??'50px'
    }"
  >
    <svg
      class="waves"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 24 150 28"
      preserveAspectRatio="none"
      shape-rendering="auto"
    >
      <defs>
        <path
          id="gentle-wave"
          d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
        />
      </defs>
      <g class="parallax">
        <template v-for="item in waves">
          <use
            xlink:href="#gentle-wave"
            x="48"
            :y="item.y"
            :fill="item.fill"
          />
        </template>
      </g>
    </svg>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:map';

.waves {
  @include mix.position-style($p: absolute, $b: 0, $l: 0);
  @include mix.size(100%, var(--wave-height));
}

.parallax>use {
  animation: move-forever 25s cubic-bezier(.55, .5, .45, .5) infinite;
}

$parallax-layers: (
  1: (delay: -2s, duration: 10s),
  2: (delay: -4s, duration: 13s),
  3: (delay: -6s, duration: 16s),
  4: (delay: -8s, duration: 23s),
);

@each $i, $config in $parallax-layers {
  .parallax>use:nth-child(#{$i}) {
    animation-delay: map.get($config, delay);
    animation-duration: map.get($config, duration);
  }
}
</style>