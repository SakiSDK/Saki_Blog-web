<script lang="ts" setup>
import PageHeader from '@/components/bases/PageHeader.vue';
import ArticleCard from '@/components/cards/articles/ArticleCard.vue';
import SocialFooter from '@/components/cards/home/SocialFooter.vue';
import HotTagsCard from '@/components/cards/tags/HotTagsCard.vue';
import TagsCloudCard from '@/components/cards/tags/TagsCloudCard.vue';

const tag: string[] = [
  '前端',
  '后端',
  '算法',
  '数据库',
  '设计',
  '工具',
  '其他',
  '测试',
  '开发',
  '运维',
  '安全',
  '区块链',
  '物联网',
  '人工智能',
  '机器学习',
  '深度学习',
  '图像处理',
  '视频处理',
  '音频处理',
  '游戏开发',
  '游戏引擎',
  '游戏工具',
  '游戏资源',
  '游戏设计',
  '游戏开发',
  '游戏引擎',
  '游戏工具',
]
</script>

<template>
  <TopBar/>
  <div class="article-tags">
    <div class="article-tags__container">
      <div class="article-tags__header">
        <PageHeader :field="{
          title: '文章标签',
          desc: '按主题浏览我们的文章集合，发现您感兴趣的内容'
        }"/>
      </div>
      <div class="article-tags__body container">
        <div class="article-tags__aside">
          <div class="article-tags-hot">
            <HotTagsCard/>
          </div>
        </div>
        <div class="article-tags__main">
          <TagsCloudCard/>
          <div class="article-tags__content">
            <ArticleCard/>
            <ArticleCard/>
            <ArticleCard/>
            <ArticleCard/>
            <ArticleCard/>
            <ArticleCard/>
          </div>
        </div>
      </div>
      <div class="article-tags__footer">
        <SocialFooter/>
        <FooterBar/>
      </div>
    </div>
  </div>
  <RightBar/>
</template>

<style lang="scss" scoped>
.article-tags { 
  &__body {
    min-height: calc(100vh - 293px);
    @include mix.grid-box($c: 20, $g: lg);
    @include mix.margin-d(t, lg);
    @include mix.respond-down(xs){
      display: block;
    }
  }
  &__aside {
    display: none;
    height: 0;
    visibility: hidden;
    @include anim.transition(opacity height visibility);
    @include mix.respond-up(md){
      @include mix.flex-box($d: column, $j: flex-start, $g: lg);
      visibility: visible;
      height: auto;
      grid-column: 1/7;
      opacity: 1;
    }
  }
  &-hot {
    width: 100%;
  }
  &__main {
    width: 100%;
    grid-column: 1/21;
    @include mix.respond-up(md){
      grid-column: 7/21;
    }
  }
  &__content,
  &__footer {
    @include mix.margin-d(t, lg);
  }
  &__content {
    @include mix.grid-box($c: 2, $g: lg);
    @include mix.respond-down(md){
      grid-template-columns: 1fr !important;
    }
  }
  &__search-bar {
    width: 100%;
    @include mix.container-style($b: var(--border-base));
  }
  &__footer {
    @include mix.flex-box($d: column, $g: title);
  }
}
</style>