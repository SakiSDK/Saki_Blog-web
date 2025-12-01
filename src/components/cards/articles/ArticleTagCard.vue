<script lang="ts" setup>
import { computed, onMounted } from 'vue';
import CardHeader from '../../bases/CardHeader.vue';
import { useDomUtil } from '@/utils/dom.util';
import useTagStore from '@/stores/tag.store';
import { storeToRefs } from 'pinia';
import { message } from '@/plugins/message';
import Loading from '@/components/global/Loading.vue';
import { useNavigator } from '@/utils/navigator.util';


const { brightColorByHash } = useDomUtil();
const { go } = useNavigator();

/** ---------- 页面跳转 ---------- */
const goToAllTags = () => {
  go('/article/tag');
}

/** ---------- 状态管理 ---------- */
const tagStore = useTagStore();
const { tagList, isLoading, isSuccessful } = storeToRefs(tagStore);

/** ---------- 页面数据 ---------- */
const tagCount = computed(() => `共 ${tagStore.getTagTotal} 个标签`); 

onMounted(async () => {
  try {
    await tagStore.fetchTagList();
  } catch (error: any) {
    if (error.code === 404) {
      message.show({
        type: 'error',
        title: '标签列表获取失败，请稍后再试',
      });
    } else {
      message.show({
        type: 'error',
        title: error.message,
      });
    }
  }
})
</script>

<template>
  <div class="article-tag">
    <div class="article-tag__container">
      <CardHeader title="标签" :subtitle="tagCount" :bordered="true" icon="tag" padding="10px 20px"/>
      <div class="article-tag__body">
        <Loading v-if="isLoading"/>
        <div class="article-tag__content" v-if-else="!isLoading && isSuccessful">
          <span 
            class="article-tag-item" 
            v-for="tag, index in tagList" 
            :key="index" 
            :style="{
              '--tag-bgcolor': brightColorByHash({
                key: tag.name,
                alpha: 0.2
              }),
              '--tag-color': brightColorByHash({
                key: tag.name,
              })
            }"
            v-ripple
          >
            {{ tag.name }}
          </span>
        </div>
        <div class="article-tag-all" @click="goToAllTags()">
          <span>全部标签</span>
          <span>→</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.article-tag {
  &__container {
    @extend %card-container-base;
    padding: 0;
  }
  &__body {
    position: relative;
    min-height: 280px;
    @extend %flex-column-center;
    @include mix.margin-d(b, xxl);
    @include mix.container-style($p: lg, $bg: none);
  }
  &__content {
    @include mix.flex-box($s: 0, $w: wrap, $a: flex-start, $j: flex-start, $g: sm);
  }
  &-item {
    display: inline-block;
    @include mix.container-style($p: xs md, $r: sm, $bg: var(--tag-bgcolor));
    @include mix.font-style($c: var(--tag-color), $w: bold, $s: sm);
    letter-spacing: 1px;
    &::before {
      content: '#';
      @include mix.margin-d(r, xxs);
    }
  }
  &-all {
    width: 100px;
    @extend %flex-center;
    @include mix.position-style($p: absolute, $b: -15px, $r: lg);
    @include mix.font-style($c: var(--primary-base), $w: bold);
    @include anim.transition(color gap);
    @include hov.color(var(--primary-strong));
    @include hov.margin(sm);
    cursor: pointer;
    &>span {
      display: inline-block;
      position: relative;
      @include anim.transition(margin);
    }
    &:hover {
      span:last-child {
        @include mix.margin-d(l, sm);
      }
    }
  }
}
</style>