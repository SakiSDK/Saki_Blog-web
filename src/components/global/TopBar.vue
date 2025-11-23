<script lang="ts" setup>
defineOptions({
  name: 'TopBar',
});
</script>

<template>
  <div class="topbar">
    <div class="topbar__container">
      <div class="topbar__header">
        <div class="topbar-name">
          SakiSDK
        </div>
      </div>
      <div class="topbar__nav"></div>
      <div class="topbar__right"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.topbar {
  @include mix.position-style($p: fixed, $t:0, $r:0, $z: fixed);
  @include mix.size(100%, 60px);
  &__container {
    @include mix.flex-box($jc: flex-start, $ai: stretch, $w: nowrap);
    @extend %full-size;
  }
  &__header {
    @extend %full-size;
    @include mix.flex-box($jc: flex-start);
  }
  &-name {
    height: 40px;
    @include mix.margin-d(l, xl);
    @extend %flex-center;
    @include mix.container-style($p: sm lg, $r: sm);
    @include mix.font-style($s: xxl, $f: 'title');
  }
}
</style>