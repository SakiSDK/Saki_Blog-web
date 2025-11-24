<script lang="ts" setup>
// import { useAppRouter } from '@/utils/useAppRouter';


/** ---------- 状态管理 ---------- */
// const { goTo } = useAppRouter();


/** ---------- 页面文案内容 ---------- */
const imgPaths: Record<string, string> = {
  white: new URL('../../../assets/imgs/album_bird-white.webp', import.meta.url).href,
  blue: new URL('../../../assets/imgs/album_bird-blue.webp', import.meta.url).href,
  red: new URL('../../../assets/imgs/album_bird-red.webp', import.meta.url).href,
}
</script>

<template>
  <div class="picture">
    <div class="picture__container">
      <div class="picture__wrapper">
        <img
          v-for="path, index in imgPaths"
          :key="index"
          :src="path"
          alt="picture"
        />
      </div>
      <div class="picture-detail">more picture</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.picture {
  height: 330px;
  &__container,
  &__wrapper {
    @extend %full-size;
  }
  &__container {
    @include mix.flex-box(column, flex-end, center, 'sm');
    transform: translateZ(0);
    @include mix.container-style($p: lg, $o: hidden, $b: var(--border-base));
    @include hov.card($it: true);
    cursor: pointer;
    &:hover {
      $images: (
        (1, 20deg, 10px),
        (3, -20deg, -10px)
      );
      @each $i, $rotate, $move in $images {
        img:nth-child(#{$i}) {
          transform: rotate($rotate) translate($move);
        }
      }
      .picture-detail {
        border-color: var(--primary-base);
        transform: translateY(-2px);
      }
    }
  }
  &__wrapper {
    position: relative;
  }
  img {
    @include mix.position-style(absolute, $t: 30px, $z: base);
    @include mix.size(40%, 68%);
    object-fit: cover;
    @include mix.radius(lg);
    @include anim.transition(transform);
    $image-config: (
      (1, right, 10deg),
      (3, left, -10deg)
    );
  @each $i, $side, $rotate in $image-config {
    &:nth-child(#{$i}) {
      z-index: 1;
      #{$side}: 50px;
      transform: rotate($rotate);
    }
  }
    &:nth-of-type(2) {
      left: 50%;
      transform: translateX(-50%);
    }
  }
  &-detail {
    width: fit-content;
    border-bottom: var(--border-base);
    @include anim.transition;
  }
}
</style>