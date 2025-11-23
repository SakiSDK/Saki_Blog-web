<script lang="ts" setup>
import { computed } from 'vue';

defineOptions({
  name: 'Icon',
});

// 1. 定义 props
const props = defineProps<{
  // 图标名称 (对应 symbol 的 id: #icon-xxx)
  name: string;
  // 图标颜色 (默认继承父元素颜色)
  color?: string;
  // 图标大小 (默认 1em)
  size?: string | number;
  // 额外类名
  className?: string;
  // 图标标题 (无障碍访问)
  title?: string;
}>();

// 2. 计算样式
const iconStyle = computed(() => {
  const style: Record<string, string> = {};
  
  // 处理颜色
  if (props.color) {
    style.color = props.color;
  }
  
  // 处理大小
  if (props.size) {
    style.fontSize = typeof props.size === 'number' ? `${props.size}px` : props.size;
  }
  
  return style;
});
</script>

<template>
  <svg
    :class="['icon', className]"
    :style="iconStyle"
    aria-hidden="true"
    :title="title"
  >
    <use :xlink:href="`#icon-${name}`"></use>
  </svg>
</template>

<style lang="scss" scoped>
/* 基础样式 (与你提供的通用 CSS 一致) */
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>