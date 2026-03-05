<script lang="ts" setup>
import { computed } from 'vue';
import type { CardHeaderProps } from '@/types/components/Base';


const props = withDefaults(defineProps<CardHeaderProps>(), {
  align: 'left',
  fontSize: 'xl',
  bordered: true,
  padding: '20px 20px',
  background: 'none',
  icon: '',
});
const headerClass = computed(() => ({
  'is-center': props.align === 'center',
  'is-right': props.align === 'right',
  'is-left': props.align === 'left',
  'with-border': props.bordered
}))
</script>

<template>
  <div class="card-header" :style="{ '--font-size': fontSize }">
    <div 
      class="card-header__container"
      :class="headerClass"
      :style="{
        '--card-header-padding': padding,
        '--card-header-background': background
      }"
    >
      <div class="card-header-icon">
        <slot name="icon">
          <Icon v-if="icon" :name="icon" />
        </slot>
      </div>
      <!-- 左侧：标题 + 副标题 -->
      <div class="card-header-title" :class="`is-size-${fontSize}`">
        <!-- 如果用户没有传 slot，则显示 title props -->
        <slot name="title">
          <h3 v-if="title">{{ title }}</h3>
          <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
        </slot>
      </div>
      <!-- 右侧操作区（按钮等） -->
      <div class="card-header-actions">
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@/styles/variables.scss" as var;

.with-border.card-header__container {
  border-bottom: var(--border-base);
}
.is-center.card-header__container {
  justify-content: center;
}
.is-right.card-header__container {
  justify-content: flex-end;
}
.is-left.card-header__container {
  justify-content: flex-start;
}
.card-header {
  width: 100%;
  &__container {
    position: relative;
    @include mix.container-style(
      $r: 0, 
      $p: var(--card-header-padding), 
      $bg: var(--card-header-background)
    );
    @include mix.flex-box($j: flex-start, $g: lg);
  }
  &-title {
    // $title-size: var(--font-size);
    @include mix.flex-box($d: column, $a: flex-start, $g: xs);
    @include mix.font-style($f: title);
    // 生成预定义大小类
    @each $key, $value in var.$font-size {
      &.is-size-#{$key} h3 {
        font-size: $value;
      }
    }
    .subtitle {
      @include mix.font-style($s: sm, $c: var(--text-subtler));
      margin: 0;
    }
  }
  &-actions {
    @include mix.flex-box($a: center, $j: flex-start, $g: sm);
  }
  &-icon {
    @include mix.size(rem(40));
    align-self: stretch; // 让图标区域在交叉轴上撑满，与右侧等高
    @include mix.flex-box($s: 0);
    @include mix.container-style($p: 0, $bg: var(--primary-base), $r: sm);
    @include mix.font-style($s: xxl, $c: var(--white-base));
  }
}
</style>