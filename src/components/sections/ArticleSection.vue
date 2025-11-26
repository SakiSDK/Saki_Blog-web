<script lang="ts" setup>
import ArticleTagCard from '@/components/cards/articles/ArticleTagCard.vue';
import RecentArticlesCard from '../cards/articles/recentArticlesCard.vue';
import ArticleCategoryBar from '../cards/articles/ArticleCategoryBar.vue';
import ArticleCard from '../cards/articles/ArticleCard.vue';

</script>

<template>
  <div class="article-section">
    <div class="article-section__container">
      <div class="article-section__aside">
        <div class="article-section-recent">
          <RecentArticlesCard/>
        </div>
        <div class="article-section-tag">
          <ArticleTagCard/>
        </div>
      </div>
      <div class="article-section__main">
        <div class="article-section-category-bar">
          <ArticleCategoryBar/>
        </div>
        <div class="article-section__content">
          <div class="article-section__wrapper">
            <ArticleCard/>
            <ArticleCard/>
            <ArticleCard/>
            <ArticleCard/>
            <ArticleCard/>
            <ArticleCard/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.article-section {
  width: 100%;
  height: fit-content;
  &__container {
    min-height: 700px;
    @include mix.margin-d(t, lg);
    @include mix.grid-box($c: 20, $g: lg);
    @include mix.respond-down(md) {
      display: block;
      grid-template-columns: 1fr !important;
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
  &__main {
    width: 100%;
    grid-column: 1/21;
    @include mix.respond-up(md){
      grid-column: 7/21;
    }
  }
  &__content {
    width: 100%;
    min-height: 700px;
  }
  &__wrapper {
    width: 100%;
    @include mix.margin-d(t, lg);
    @include mix.grid-box($c: 2, $g: lg);
    @include mix.respond-down(md) {
      grid-template-columns: 1fr !important;
    }
  }
  &-recent,
  &-tag {
    width: 100%;
  }
  &__item {
    height: fit-content;
  }

}
</style>