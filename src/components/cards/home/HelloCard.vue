<script lang="ts" setup>
import Carousel from '@/components/bases/Carousel.vue'

//页面文案内容
const greetContent = {
  title: 'Ciallo '
}
</script>

<template>
  <div class="greet">
    <div class="greet__container">
      <div class="greet__left">
        <h2 class="greet__left-title">{{ greetContent.title }}</h2>
      </div>
      <div class="greet__right">
        <div class="greet__right__content">
          <Carousel />
        </div>
      </div>
    </div>
  </div>
</template>


<style lang="scss" scoped>
.greet {
  @include mix.size(100%, 280px);
  &__container,
  &__left,
  &__right {
    height: 100%
  }
  &__container {
    @extend %full-size;
    @include mix.flex-box(row, flex-start);
    @include mix.container-style($o: hidden, $b: var(--border-base));
    @include hov.card($t: true);
  }
  &__left,
  &__right {
    flex: 1;
  }
  &__left {
    @include mix.flex-box($d: column, $j: space-between, $a: flex-start);
    &-title {
      @include mix.z-index(base);
      @include mix.padding-d(t, lg);
      @include mix.font-style($s: xl-title, $c: var(--primary-base), $f: title, $w: bold);
    }
  }
  &__right {
    position: relative;
    &__content {
      @extend %full-size;
      @include mix.position-style(absolute, 0, 0);
      rotate: 60deg;
    }
  }
}
</style>