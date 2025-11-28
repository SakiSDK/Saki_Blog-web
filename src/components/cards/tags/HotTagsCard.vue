<script lang="ts" setup>
import CardHeader from '@/components/bases/CardHeader.vue';


</script>

<template>
  <div class="hot-tags">
    <div class="hot-tags__container">
      <div class="hot-tags__header">
        <CardHeader icon="fire" title="热门标签"/>
      </div>
      <div class="hot-tags__content">
        <div class="hot-tags__tag" v-for=" _ in 10">
          <Tag label="xx" bordered="true"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hot-tags {
  &__container {
    @include mix.container-style($b: var(--border-base), $p: 0);
    @include hov.card($t: true);
  }
  &__content {
    @include mix.padding(lg);
    @include mix.flex-box($j: flex-start, $a: flex-start, $w: wrap, $g: sm);
  }
}
</style>