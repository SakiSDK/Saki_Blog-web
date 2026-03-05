<script lang="ts" setup>
import CardHeader from '@/components/bases/CardHeader.vue';
import useTagStore from '@/stores/tag.store';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import Loading from '@/components/global/VLoading.vue';

const tagStore = useTagStore();
const {hotTags, isHotTagsSuccessful, isHotTagsLoading } = storeToRefs(tagStore);
const { fetchHotTags } = tagStore;
onMounted(async () => {
  try {
    await fetchHotTags();
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
      <div class="hot-tags__wrapper">
        <div class="hot-tags__content" v-if="!isHotTagsLoading">
          <div class="hot-tags__tag" v-for=" tag in hotTags">
            <Tag :label="tag.name" :count="Number(tag.postCount)" :bordered="true"/>
          </div>
        </div>
        <Loading v-else/>
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
  &__wrapper {
    min-height: 250px;
    @extend %flex-column-center;
  }
  &__content {
    @include mix.padding(lg);
    @include mix.flex-box($j: flex-start, $a: flex-start, $w: wrap, $g: sm);
  }
}
</style>