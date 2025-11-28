<script lang="ts" setup>
import TestImg from '@/assets/imgs/anime_mushokutensei.webp'
// import TestImg from '@/assets/imgs/column-img.jpeg'

</script>

<template>
  <div class="album-card">
    <div class="album-card__container" v-ripple>
      <div 
        class="album-card__cover"
        v-lazy="{
          src: TestImg
        }"
      >
      </div>
      <div class="album-card__wrapper">
        <div class="album-card-name">测试</div>
        <div class="album-card-title">测试的标题</div>
        <div class="album-card-description">
          测试的描述测试的描述测试的描述测试的描述测试
          的描述测试的描述测试的描述测试的描述测试的描
          述测试的描述测试的描述测试的描述测试的描述测
          试的描述测试的描述
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.album-card {
  height: 600px;
  &__container {
    position: relative;
    height: 100%;
    @include mix.container-style($p: 0, $b: var(--border-base), $o: hidden);
    @include anim.transition($dr: 1s);
    @include hov.card;
    &:hover {
      .album-card__cover {
        transform: scale(1.2);
      }
      .album-card-description {
        transform: scale(1);
        visibility: visible;
        opacity: 1;
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
  }
  &-name {
    position: relative;
    @include mix.font-style($c: var(--white-subtle));
    @include mix.margin-d(b, lg);
  }
  &-title {
    position: relative;
    @include mix.font-style($f: pixel, $s: title, $c: var(--white-base));
  }
  &-description {
    @include mix.padding(lg);
    @include mix.position-style($p: absolute, $b: 20px, $l: 0);
    @include mix.font-style($s: xl, $f: base, $c: var(--white-subtle));
    line-height: 1.5;
    visibility: hidden;
    opacity: 0;
    transform-origin: bottom center;
    transform: scale(0.1);
    @include anim.transition($p: visibility opacity transform, $dr: 1s);
  }
}
</style>