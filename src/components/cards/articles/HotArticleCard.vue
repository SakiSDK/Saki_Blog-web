<script lang="ts" setup>
import CardHeader from '@/components/bases/CardHeader.vue';


</script>

<template>
  <div class="hot-article">
    <div class="hot-article__container">
      <div class="hot-article__header">
        <CardHeader title="热门文章" icon="fire"/>
      </div>
      <div class="hot-article__body">

      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hot-article {
  &__container {
    @include mix.container-style($p: 0, $b: var(--border-base));
    @include hov.card($t: true);
  }
}
</style>