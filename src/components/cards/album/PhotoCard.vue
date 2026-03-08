<script lang="ts" setup>
import type { Photo } from '@/schemas/album.schema';
import { computed } from 'vue';

const props = defineProps<{
  photo: Photo
}>()

// 计算占位高度比例 (padding-bottom technique)
// 防止图片加载前的布局抖动
const aspectRatio = computed(() => {
  if (props.photo.width && props.photo.height) {
    return (props.photo.height / props.photo.width) * 100 + '%';
  }
  return '75%'; // 默认 4:3
});
</script>

<template>
  <div class="photo-card">
    <div 
      class="photo-card__container"
      v-ripple
      :style="{
        paddingBottom: aspectRatio
      }"
    >
      <img 
        class="photo-card__image"
        v-lazy=" photo.originalUrl ||photo.thumbnailUrl "
        :alt="photo.originalUrl"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.photo-card {
  width: 100%;
  cursor: pointer;
  overflow: visible !important;
  &__container {
    position: relative;
    @include mix.size(100%, 0);
    @include mix.container-style(
      $p: 0, 
      $b: var(--border-base), 
      $r: lg, 
      $o: hidden
    );
    @include hov.card($t: true);
    &:hover {
      .photo-card__image {
        transform: scale(1.05);
      }
      .photo-card__mask {
        opacity: 1;
      }
    }
  }

  &__image {
    display: block;
    @extend %img-cover;
    @include mix.position-style($p: absolute, $t: 0, $l: 0);
    @include anim.transition($p: transform, $dr: 0.6s);
  }

  &__actions {
    transform: translateY(20px);
    @include anim.transition($p: transform, $dr: 0.6s);
  }

  &__btn {
    @include mix.size(rem(40));
    border-radius: 50%;
    background: var(--white-base);
    @include mix.flex-box;
    @include mix.font-style($c: var(--black-base), $s: lg);
    box-shadow: var(--shadow-lg);
  }
}
</style>
