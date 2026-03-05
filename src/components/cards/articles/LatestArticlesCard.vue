<script lang="ts" setup>
import CardHeader from '@/components/bases/CardHeader.vue';
import AvatarImg from '@/assets/imgs/avatar.webp'
import { onMounted } from 'vue';
import { useArticleStore } from '@/stores/article.store';
import { message } from '@/plugins/message';
import DateUtil from '@/utils/date.util'


/** ---------- 状态管理 ---------- */
/** 文章状态 */
const articlestore = useArticleStore()
const { getLatestArticles, useArticleListComputed, useErrorComputed } = articlestore
const { articleList } = useArticleListComputed('latest');
const error = useErrorComputed('latest')




onMounted(async () => {
  await getLatestArticles()
  if (error&&error.errorMsg.value) {
    message.error(error.errorMsg.value)
  }
})
</script>

<template>
  <div class="recent-article">
    <div class="recent-article__container">
      <CardHeader title="最近文章" subtitle="点击可跳转到详情文章" icon="calendar"/>
      <div class="recent-article__body">
        <router-link 
          class="recent-article-card" 
          v-for="article in articleList"
          :key="article.shortId"
          v-ripple
          :to="{
            name: 'ArticleDetail',
            params: { shortId: article.shortId }
          }"
        >
          <div
            class="recent-article-card-cover"
            v-lazy="{
              src: article.thumbCover || AvatarImg
            }" 
            alt=""
          >
          </div>
          <div class="recent-article-card-content">
            <div class="recent-article-card-title">
              {{ article.title || '无标题' }}
            </div>
            <div class="recent-article-card-date">
              <Icon name="recent"/>
              {{ DateUtil.format(article!.createdAt) || '无时间' }}
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.recent-article { 
  &__container {
    @extend %card-container-base;
    padding: 0;
  }
  &__body {
    @include mix.container-style($bg: none);
    @include mix.flex-box($d: column, $a: flex-start, $g: sm);
  }
  &-card {
    width: 100%;
    @include mix.container-style($p: sm);
    @include mix.flex-box($j: flex-start, $g: lg);
    @include anim.transition(box-shadow transform background-color);
    @include hov.card($s: -rem(2));
    @include hov.bg(var(--primary-base));
    @include hov.color(var(--white-base));
    &:hover {
      .recent-article-card-date {
        color: var(--white-subtle);
      }
    }
    &-cover {
      @include mix.size(rem(50));
      @include mix.radius(md);
    }
    &-content {
      flex: 1;
      height: 100%;
      @include mix.flex-box($d: column, $j: space-between, $a: flex-start, $g: sm);
    }
    &-title {
      @include mix.font-style($s: lg, $f: 'title');
    }
    &-date {
      @include mix.font-style($s: sm, $c: var(--text-subtler));
    }
  }
}
</style>