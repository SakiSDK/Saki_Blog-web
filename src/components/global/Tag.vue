<script lang="ts" setup>
import type { TagProps } from '@/types/components/Base';
import { ref, computed, watch } from 'vue';
import { useVModel } from '@vueuse/core';

defineOptions({
  name: 'Tag',
})

const props = withDefaults(defineProps<TagProps>(), {
  label: '',
  count: null,
  type: 'default',
  padding: '',
  size: 'md',
  radius: '',
  color: '',
  icon: '',
  bordered: false,
  borderColor: 'theme',
  closable: false,
  rippled: true,
  wrapped: false,
  modelValue: undefined,
  disabled: false,
  clickable: true,
});

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
  (e: 'update:modelValue', value: boolean): void;
  (e: 'close', event: MouseEvent): void;
  (e: 'hover', event: MouseEvent): void;
  (e: 'leave', event: MouseEvent): void;
  (e: 'remove', event: MouseEvent): void;
}>()

/** 双向数据绑定 */
const innerChecked = useVModel(props, 'modelValue', emit);

/** 点击事件处理 */
const onClick = (e: MouseEvent) => {
  if (props.clickable) return;
  // 切换选中状态
  if (props.modelValue != undefined) {
    innerChecked.value = !innerChecked.value;
  }
  emit('click', e);
}

/** 关闭事件处理 */
const onClose = (e: MouseEvent) => {
  e.stopPropagation();
  if (props.disabled) return;
  
  emit('close', e);
  emit('remove', e);
}

/** 鼠标悬停事件 */
const onMouseOver = (e: MouseEvent) => {
  emit('hover', e);
}

/** 鼠标离开事件 */
const onMouseLeave = (e: MouseEvent) => {
  emit('leave', e);
}

/** 计算标签类名 */
const tagClass = computed(() => {
  const classes = [
    `tag-${props.type}`,
    `tag-${props.size}`,
    {
      'tag-bordered': props.bordered,
      'tag-bordered-follow': props.borderColor === 'follow',
      'tag-wrapped': props.wrapped,
      'tag-disabled': props.disabled,
      'tag-clickable': props.clickable && !props.disabled,
      'tag-checked': innerChecked.value,
      'tag-padding': props.padding,
    }
  ];
  // 如果有自定义圆角，使用内联样式
  if (props.radius) {
    classes.push('tag-custom-radius');
  }
  return classes;
});

/** 计算标签样式 */
const tagStyle = computed(() => {
  const styles: Record<string, string> = {};
  
  // 自定义颜色
  if (props.color) {
    if (props.type === 'outline') {
      styles['--tag-border-color'] = props.color;
      styles['--tag-font-color'] = props.color;
    }
  }
  
  // 自定义圆角
  if (props.radius) {
    styles['border-radius'] = props.radius;
  }

  // 自定义padding
  if (props.padding) {
    styles['--tag-padding'] = props.padding;
  }
  
  return styles;
});
</script>

<template>
  <span
    class="tag"
    :class="tagClass"
    :style="tagStyle"
    @click="onClick"
    @mouseover="onMouseOver"
    @mouseleave="onMouseLeave"
    :tabindex="clickable && !disabled ? 0 : -1"
    v-ripple="{
      disabled: !props.rippled,
    }"
  >
    <!-- 图标插槽 -->
    <span v-if="$slots.icon || icon" class="tag-icon">
      <slot name="icon">
        <Icon :name="icon" />
      </slot>
    </span>
    
    <!-- 标签内容 -->
    <span class="tag-content">
      <slot>
        {{ label }}
      </slot>
    </span>

    <span class="tag-count" v-if="count">
      <slot>
        {{ count }}
      </slot>
    </span>
    
    <!-- 关闭按钮 -->
    <span 
      v-if="closable" 
      class="tag-close" 
      @click="onClose"
      :aria-label="`移除标签 ${label}`"
    >
      <slot name="close">
        <Icon name="close"/>
      </slot>
    </span>
  </span>
</template>

<style lang="scss" scoped>
.tag {
  --tag-bg: var(--bg-base);
  --tag-font-color: var(--text-subtle);
  --tag-border-color: var(--border-base);
  --tag-border-base: none;
  --tag-padding: 0;

  @include mix.inline-flex-box($a: center, $g: sm);
  @include mix.container-style($p: sm sm, $r: sm, $bg: var(--tag-bg), $b: var(--tag-border-base));
  @include mix.font-style($s: md, $c: var(--tag-font-color));

  line-height: 1;
  user-select: none;
  cursor: default;
  @include anim.transition;
  &-content {
    position: relative;
    &::before {
      content: '#';
      @include mix.position-style($p: relative, $l: -2px);
    }
  }
  &-count {
    @include mix.position-style($p: absolute, $r: xxs, $t: xs);
    @include mix.font-style($s: xs, $c: var(--tag-font-color))
  }
  // 可点击状态
  &.tag-clickable {
    cursor: pointer;
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    &:active {
      transform: translateY(0);
    }
    
    &:focus {
      outline: none;
    }
  }
  // 禁用状态
  &.tag-disabled {
    opacity: 0.6;
    pointer-events: none;
  }
  
  // 选中状态
  &.tag-checked {
    --tag-bg: var(--primary-base);
    --tag-font-color: white;
  }
  
  // 边框样式
  &.tag-bordered {
    --tag-border-base: var(--border-base);
  }
  &.tag-bordered-follow {
    --tag-border-base: 1px solid var(--tag-font-color);
  }
  
  // 换行样式
  &.tag-wrapped {
    white-space: normal;
    word-break: break-word;
  }
  
  &.tag-padding {
    padding: var(--tag-padding) !important;
  }

  // 图标样式
  .tag-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  // 内容样式
  .tag-content {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  // 关闭按钮样式
  .tag-close {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 50%;
    padding: 2px;
    @include anim.transition;
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
  // 标签尺寸
  $tag-sizes: (
    xs: (padding: xxs xs, font-size: xs, min-height: 20px),
    sm: (padding: xs sm, font-size: sm, min-height: 24px),
    md: (padding: xs md, font-size: md, min-height: 28px),
    lg: (padding: xs lg, font-size: lg, min-height: 32px),
    xl: (padding: md xl, font-size: xl, min-height: 36px),
    xxl: (padding: md xxl, font-size: xxl, min-height: 40px),
  );
  
  @each $key, $value in $tag-sizes { 
    &.tag-#{$key} {
      @each $k, $v in $value {
        @if $k == 'padding' {
          @include mix.padding($v);
        } @else if $k == 'min-height' {
          min-height: #{$v};
        } @else if $k == 'font-size' {
          @include mix.font-size($v);
        } @else {
          #{$k}: $v;
        }
      }
    }
  }

  // 标签类型
  $tag-types: (
    primary: (
      color: var(--primary-base), 
      background: var(--primary-weak)
    ),
    secondary: (
      color: var(--secondary-base), 
      background: var(--secondary-weak)
    ),
    default: (
      color: var(--text-subtle), 
      background: var(--bg-base)
    ),
    outline: (
      color: var(--primary-base), 
      border: 1px solid var(--primary-base),
      background: transparent
    ),
    ghost: (
      color: var(--text-subtle), 
      background: transparent
    ),
  );
  
  @each $key, $value in $tag-types { 
    &.tag-#{$key} {
      @each $k, $v in $value {
        @if $k == 'background' {
          --tag-bg: #{$v};
        } @else if $k == 'color' {
          --tag-font-color: #{$v};
        } @else if $k == 'border' {
          --tag-border-base: #{$v};
          --tag-border-color: #{nth($v, 3)};
        }
      }
    }
  }
}
</style>