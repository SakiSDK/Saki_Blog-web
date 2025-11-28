<script setup lang="ts">
import type { ButtonEmits, ButtonProps } from '@/types/components/Base';
import { computed } from 'vue'
defineOptions({
  name: 'VButton',
})


// Props
const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'primary',
  size: 'default',
  icon: '',
  loading: false,
  disabled: false,
  block: false,
  ripple: true,
  noWrap: false,
  border: false
})

// Emits
const emit = defineEmits<ButtonEmits>()

// 计算类名
const buttonClasses = computed(() => [
  'btn',
  `btn-${props.type}`,
  `btn-${props.size === 'default' ? 'default' : props.size}`,
  {
    'btn-loading': props.loading,
    'btn-block': props.block,
    'btn-disabled': props.disabled,
    'btn-text-wrap': props.noWrap,
    'btn-border': props.border
  }
])

// 点击事件处理
const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="handleClick"
    v-ripple
  >
    <i v-if="loading" class="fas fa-spinner fa-spin"></i>
    <i v-else-if="icon">
      <Icon :name="icon"/>
    </i>
    <span v-if="$slots.default">
      <slot></slot>
    </span>
  </button>
</template>

<style lang="scss" scoped>
@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

.btn {
  position: relative;
  @include mix.container-style($b: none, $p: sm xl, $r: sm, $o: hidden);
  @include mix.inline-flex-box($j: center, $a: center, $g: sm);
  @include mix.font-style($w: 600, $s: md);
  @include mix.text-style($ta: center, $lh: 1, $tw: nowrap);
  cursor: pointer;
  @include anim.transition($p: bg color box-shadow transform);
  @include hov.move-y;
  @include hov.shadow;
  &-text-wrap {
    text-wrap: nowrap;
  }
  &-border {
    border: var(--border-base);
  }
}


.btn:disabled,
.btn-disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
}

/* 按钮类型 */
.btn-primary {
  background: var(--primary-base);
  color: white;
}
.btn-primary:hover:not(.btn-disabled):not(:disabled) {
  background: var(--primary-strong);
}
.btn-secondary {
  background: var(--bg-base);
  color: var(--text-base);
}
.btn-secondary:hover:not(.btn-disabled):not(:disabled) {
  background: var(--bg-strong);
}
.btn-outline {
  background: transparent;
  color: var(--primary-base);
  border: 2px solid var(--primary-base);
}
.btn-outline:hover:not(.btn-disabled):not(:disabled) {
  background: var(--primary-strong);
  color: var(--white-base);
}
.btn-success {
  background: var(--green-base);
  color: var(--white-base);
}
.btn-success:hover:not(.btn-disabled):not(:disabled) {
  background: var(--green-strong);
}
.btn-warning {
  background: #ad5d3a;
  color: var(--white-base);
}
.btn-warning:hover:not(.btn-disabled):not(:disabled) {
  background: #dd7723;
}
.btn-danger {
  background: var(--red-base);
  color: var(--white-base);
}
.btn-danger:hover:not(.btn-disabled):not(:disabled) {
  background: var(--red-strong);
}


$button-sizes: (
  // 按钮尺寸
  extra-small: (padding: xs sm, font-size: xs),
  small: ( padding: sm md, font-size: sm ),
  default: ( padding: 12px 25px, font-size: md ),
  large: ( padding: md xxl, font-size: lg ),
  // 块级按钮
  block: (
    display: flex,
    width: 100%
  ),
  // 加载状态
  loading: (
    pointer-events: none,
  )
);
@each $key, $value in $button-sizes {
  .btn-#{$key} {
    @each $k,$v in $value {
      @if $k == 'padding'{
        @include mix.padding($v);
      } @else if $k == 'font-size' {
        @include mix.font-size($v);
      } @else {
        #{$k}: $v;
      }
    }
  }
} 

.fa-spin {
  animation: fa-spin 1s infinite linear;
}
</style>