<script lang="ts" setup>
import CardHeader from '@/components/bases/CardHeader.vue';
import useTagStore from '@/stores/tag.store';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import Pagination from '@/components/bases/Pagination.vue';

// 分页状态
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(128); // 总条数（从接口获取）

const tagStore = useTagStore();
const { tagList, getTagTotal, pagination } = storeToRefs(tagStore);
onMounted(async () => {
  try {
    await tagStore.fetchTagList();
  } catch (error) {
    
  }
})
</script>

<template>
  <div class="tags-aside">
    <div class="tags-aside__container">
      <CardHeader padding="10px 20px" icon="tag" title="标签" :subtitle="`共 ${getTagTotal} 个标签`"/>
      <div class="tags-aside__content">
        <Tag label="全部" size="lg" :bordered="true" padding="5px 10px"/>
        <div 
          class="tags-aside-item" 
          v-for="tag, index in tagList" 
          :key="index"
        >
          <Tag :label="tag.name" size="lg" :bordered="true" :count="Number(tag.postCount)" padding="5px 20px 5px 10px"/>
        </div>
      </div>
      <!-- 分页组件 -->
      <Pagination
        v-model:page="currentPage"
        :total="pagination.total ?? 0"
        v-model:pageSize="pageSize"
        :total-pages="pagination.totalPages ?? 0"
        :page-btn-count="7"
        :show-total="true"
        :show-jumper="false"
        :show-size-changer="false"
        :page-size-options="[10, 20, 50, 100]"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tags-aside {
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