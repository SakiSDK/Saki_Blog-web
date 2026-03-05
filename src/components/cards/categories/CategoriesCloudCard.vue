<script lang="ts" setup>
import CardHeader from '@/components/bases/CardHeader.vue';
import useCategoryStore from '@/stores/category.store';
import { useDomUtil } from '@/utils/dom.util';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

/** ---------- 状态管理 ---------- */
const categoryStore = useCategoryStore();
const { categoryList } = storeToRefs(categoryStore);
const { brightColorByHash } = useDomUtil();

onMounted(async () => {
  try {
    await categoryStore.fetchCategoryList();
  } catch (error) {
    
  }
})
</script>

<template>
  <div class="categories-aside">
    <div class="categories-aside__container">
      <CardHeader padding="10px 20px" icon="tag" title="分类"/>
      <div class="categories-aside__content">
        <Tag label="全部" size="lg" :bordered="true" clickable type="primary"/>
        <Tag 
          v-for="category in categoryList" 
          :key="category.id"
          :label="category.name" 
          size="lg" 
          :bordered="true" 
          :count="String(category.postCount ?? 0)" 
          padding="5px 20px 5px 10px"
          clickable
          :style="{
            '--tag-bg': brightColorByHash({ key: category.name, alpha: 0.1 }),
            '--tag-font-color': brightColorByHash({ key: category.name }),
            '--tag-border-color': brightColorByHash({ key: category.name, alpha: 0.3 }),
          }"
        />
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