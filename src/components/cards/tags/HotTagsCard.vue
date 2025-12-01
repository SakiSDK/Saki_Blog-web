<script lang="ts" setup>
import CardHeader from '@/components/bases/CardHeader.vue';
import useTagStore from '@/stores/tag.store';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import Loading from '@/components/global/Loading.vue';

const tagStore = useTagStore();
const {hotTags, isHotTagsSuccessful, isHotTagsLoading } = storeToRefs(tagStore);
const { fetchHotTags } = tagStore;
onMounted(async () => {
  try {
    await tagStore.fetchHotTags();
  } catch (error) {
    
  }
})
</script>

<template>
  <div class="hot-tags">
    <div class="hot-tags__container">
      <div class="hot-tags__header">
        <CardHeader icon="fire" title="热门标签"/>
      </div>
      <div class="hot-tags__content" v-if="!isHotTagsLoading">
        <div class="hot-tags__tag" v-for=" tag in hotTags">
          <Tag :label="tag.name" :count="tag.postCount.toString()" bordered="true"/>
        </div>
      </div>
      <Loading v-else/>
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