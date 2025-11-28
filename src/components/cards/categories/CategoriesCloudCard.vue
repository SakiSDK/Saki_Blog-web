<script lang="ts" setup>
import CardHeader from '@/components/bases/CardHeader.vue';


</script>

<template>
  <div class="categories-aside">
    <div class="categories-aside__container">
      <CardHeader padding="10px 20px" icon="tag" title="标签"/>
      <div class="categories-aside__content">
        <Tag label="全部" size="lg" bordered="true" count="33" padding="5px 20px 5px 10px"/>
        <div class="categories-aside-item" v-for="_ in 15">
          <Tag label="测试" size="lg" bordered count="0" padding="5px 20px 5px 10px"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.categories-aside {
  &__container {
    @include mix.container-style($p: 0, $b: var(--border-base));
    @include hov.card($t: true);
  }
  &__content {
    @include mix.flex-box($j: flex-start, $g: sm, $w: wrap);
    @include mix.padding(lg);
    @include mix.respond-down(xs){
      @include mix.gap(xs);
    }
  }
}
</style>