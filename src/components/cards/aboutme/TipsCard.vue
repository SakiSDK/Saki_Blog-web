<script lang="ts" setup>
import { useIntervalFn, useTimeoutFn } from '@vueuse/core';
import { onMounted, ref } from 'vue';

const words: string[] = ["温暖", "明亮", "踏实", "有趣", "丰盈", "轻盈", "安心", "自在"]
const currentIndex = ref<number>(0)
const isTransitioning = ref(true)

onMounted(() => {
  useIntervalFn(() => {
    currentIndex.value++
    if (currentIndex.value === words.length) {
      isTransitioning.value = true// 等动画执行完再瞬移
      useTimeoutFn(() => {
        isTransitioning.value = false
        currentIndex.value = 0
      }, 500)
    } else {
      isTransitioning.value = true
    }
  }, 3000)
})
</script>

<template>
  <div class="tips">
    <div class="tips-tag">小确幸</div>
    <div class="tips-title">
      生活小确幸
    </div>
    <div class="tips-prefix">
      加油，生活会变得更加
    </div>
    <div class="tips-word">
      美好
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tips {
  position: relative;
  min-height: 200px;
  @include mix.container-style($p: lg, $r: md,
    $b: var(--border-base),
    $bg: var(--surface-base),
  );
  @include mix.flex-box($d: column, $a: flex-start);
  // @include anim.card-hover;

  &:hover {
    .tips-title {
      &::after {
        width: 100%;
      }
    }
  }

  &-tag {
    @include mix.position-style(absolute, $r: 10px, $t: 10px);
    @include mix.font-style($s: xs, $c: var(--text-weak))
  }

  &-title,
  &-prefix {
    @include mix.margin-d(b, md);
  }

  &-title {
    @include mix.font-style($s: title, $f: 'accent', $c: var(--primary-base));
    @include mix.underline-style($bg: var(--primary-base));
  }

  &-prefix {
    @include mix.font-style($s: xxl, $f: 'accent');
  }

  &-word {
    @include mix.font-style($s: title, $f: 'accent');
  }
}
</style>