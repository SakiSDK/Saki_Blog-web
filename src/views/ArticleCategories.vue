<script lang="ts" setup>
import HotArticleCard from '@/components/cards/articles/HotArticleCard.vue';
import PageHeader from '@/components/bases/PageHeader.vue';
import RecentArticleCard from '@/components/cards/home/RecentArticleCard.vue';
import CategoriesCloudCard from '@/components/cards/categories/CategoriesCloudCard.vue';
import ArticleCard from '@/components/cards/articles/ArticleCard.vue';
import SocialFooter from '@/components/cards/home/SocialFooter.vue';

</script>

<template>
  <TopBar/>
  <div class="article-categories">
    <div class="article-categories__container">
      <div class="article-categories__header">
        <PageHeader :field="{
          title: '文章标签',
          desc: '按主题浏览我们的文章集合，发现您感兴趣的内容'
        }"/>
      </div>
      <div class="article-categories__body container">
        <div class="article-categories__aside">
          <div class="article-categories-hot">
            <!-- <RecentArticleCard/> -->
            <HotArticleCard/>
          </div>
        </div>
        <div class="article-categories__main">
          <CategoriesCloudCard/>
          <div class="article-categories__content">
            <ArticleCard/>
            <ArticleCard/>
            <ArticleCard/>
            <ArticleCard/>
            <ArticleCard/>
            <ArticleCard/>
          </div>
        </div>
      </div>
      <div class="article-categories__footer">
        <SocialFooter/>
        <FooterBar/>
      </div>
    </div>
  </div>
  <RightBar/>
</template>

<style lang="scss" scoped>
.article-categories { 
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
  &__content {
    @include mix.margin-d(t, lg);
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
    @include mix.margin-d(t, lg);
    @include mix.flex-box($d: column, $g: title);
  }
}
</style>