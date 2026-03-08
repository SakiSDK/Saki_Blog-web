<script lang="ts" setup>
const props = withDefaults(defineProps<{
  title: string
}>(), {
  title: ''
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'minimize'): void
  (e: 'maximize'): void
}>()
</script>

<template>
  <div class="window-bar">
    <div class="window-dots">
      <span class="dot red" @click="emit('close')">x</span>
      <span class="dot yellow" @click="emit('minimize')">-</span>
      <span class="dot green" @click="emit('maximize')">+</span>
    </div>
    <div class="window-title">{{ props.title }}</div>
  </div>
</template>

<style lang="scss" scoped>
.window {
  &-bar {
    position: relative;
    height: rem(36);
    @include mix.flex-box($j: flex-start);
    flex-shrink: 0;
    @include mix.container-style($p: 0 1rem, $bg: var(--window-bar-base));
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom: var(--window-border-base);
  }
  &-dots {
    display: flex;
    align-items: center;
    @include mix.gap(sm);
    &:hover .dot {
      color: var(--black-subtle);
    }
    .dot {  
      @include mix.size(12px);
      @extend %flex-center;
      // 使用更小的字体并强制行高为1以确保垂直居中
      @include mix.font-style($c: transparent, $s: sm, $w: 900);
      border-radius: 50%;
      cursor: pointer;
      transition: color 0.2s ease, transform 0.1s ease;
      &.red { 
        background: var(--red-base); 
        padding-bottom: 1.4px;
      }
      &.yellow { 
        background: var(--yellow-base); 
        padding-top: 0;
      }
      &.green { 
        background: var(--green-base); 
        padding-bottom: 1.4px;
      }
    }
  }
  &-title {
    @include mix.position-style($p: absolute, $l: 50%);
    transform: translateX(-50%);
    @include mix.font-style($s: xs, $c: var(--text-subtle), $f: monospace);
  }
}
</style>