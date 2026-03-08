<script lang="ts" setup>
import type { Album } from '@/schemas/album.schema';


const props = defineProps<{
  album: Album
}>()


</script>

<template>
  <div class="album-card">
    <div class="album-card__container" v-ripple>
      <div 
        class="album-card__cover"
        v-lazy="{
          src: album.cover,
        }"
      >
      </div>
      <div class="album-card__wrapper">
        <div class="album-card__header">
          <div class="album-card-name">{{ album.name }}</div>
          <div class="album-card-title">{{ album.title }}</div>
        </div>
        <div class="album-card-description">
          {{ album.description }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.album-card {
  height: rem(600);
  &__container {
    position: relative;
    height: 100%;
    @include mix.container-style($p: 0, $b: var(--border-base), $o: hidden);
    @include anim.transition($dr: 1s);
    @include hov.card;
    &:hover {
      .album-card__cover {
        transform: scale(1.1);
      }
      .album-card-description {
        visibility: visible;
        opacity: 1;
        transform: translateY(0);
      }
    }
  }
  &__cover {
    @include mix.position-style($p: absolute);
    @extend %full-size;
    @include mix.padding(lg);
    @include anim.transition($p: transform, $dr: 1s);
    background-position: center;
    /* 渐变蒙版层 */
    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 100%; /* 控制渐变覆盖的高度，可调整 */
      /* 黑白渐变（从透明到黑色半透明，也可根据需要改为白到黑） */
      background: linear-gradient(-135deg, transparent, rgba(0, 0, 0, 0.3));
      pointer-events: none; /* 不影响点击交互 */
    }
  }
  &__wrapper {
    @include mix.z-index(base);
    @include mix.padding(lg);
    @include mix.flex-box($d: column, $j: space-between, $a: flex-start);
    @extend %full-size;
  }
  &-name {
    position: relative;
    @include mix.font-style($c: var(--white-subtle));
    @include mix.margin-d(b, sm);
  }
  &-title {
    position: relative;
    @include mix.font-style($f: pixel, $s: title, $c: var(--white-base));
  }
  &-description {
    @include mix.font-style($s: md, $f: base, $c: var(--white-subtle), $l: 1.5);
    visibility: hidden;
    opacity: 0;
    transform: translateY(20px);
    @include anim.transition($p: visibility opacity transform, $dr: 1s);
  }
}
</style>