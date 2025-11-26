<script lang="ts" setup>

</script>

<template>
  <div class="category-bar">
    <div class="category-bar__container">
      <div class="category-bar__content">
        <div class="category-bar__item" v-ripple>
          全部
        </div>
        <div class="category-bar__item" v-ripple>
          前端
        </div>
        <div class="category-bar__item" v-ripple>
          前端
        </div>
        <div class="category-bar__item" v-ripple>
          前端
        </div>
        <div class="category-bar__item" v-ripple>
          前端
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.category-bar { 
  &__container {
    @include mix.container-style($b: var(--border-base), $r: md, $p: xs sm);
    @include hov.card($t: true);
  }
  &__content {
    @include mix.flex-box($g: xs, $j: flex-start);
  }
  &__item {
    @include mix.inline-flex-box($a: center);
    @include mix.container-style($p: xs sm, $r: sm);
    @include mix.font-style($w: bold, $f: title);
    @include anim.transition($p: transform bg color, $dr: slow);
    @include hov.move-y(-2px);
    @include hov.bg(var(--primary-base));
    @include hov.color(var(--white-base));
    cursor: pointer;
  }
}
</style>