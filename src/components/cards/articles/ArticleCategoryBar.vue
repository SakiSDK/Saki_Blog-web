<script lang="ts" setup>
import useCategoryStore from '@/stores/category.store';
import { storeToRefs } from 'pinia';
import VLoading from '@/components/global/VLoading.vue';
import { onMounted } from 'vue';

/** ---------- 状态管理 ---------- */
const categoryStore = useCategoryStore();
const { isLoading, categoryList } = storeToRefs(categoryStore);

onMounted(async () => {
  try {
    await categoryStore.fetchCategoryList();
  } catch (error) {
    
  }
})
</script>

<template>
  <div class="category-bar">
    <div class="category-bar__container">
      <div class="category-bar__content" v-if="!isLoading">
        <div class="category-bar__item">
          全部
        </div>
        <div 
          class="category-bar__item" 
          v-for="category in categoryList"
          :key="category.id"
          v-ripple
        >
          {{ category.name}}
        </div>
      </div>
      <VLoading v-else/>
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
    // @include mix.flex-box($g: xs, $j: flex-start);
  }
  &__item {
    @include mix.inline-flex-box($a: center);
    text-wrap: nowrap;
    @include mix.container-style($p: xs sm, $r: sm);
    @include mix.font-style($w: bold, $f: base, $s: sm);
    @include anim.transition($p: transform bg color, $dr: slow);
    @include hov.move-y(rem(-2));
    @include hov.bg(var(--primary-base));
    @include hov.color(var(--white-base));
    cursor: pointer;
  }
}
</style>