<script lang="ts" setup>
import DefaultImg from '@/assets/imgs/home_bg.webp';

/** ---------- 类型定义 ---------- */
/** props 配置类型 */
interface ArticleCardProps {
  shortId: string;
  cover: string;
  title: string;
  categories: string[];
  tags: string[];
  date: string;
}

const props = withDefaults(defineProps<ArticleCardProps>(), {
  cover: DefaultImg,
  title: '暂无标题',
  categories: () => [],
  tags: () => [],
  date: '暂无发布日期',
})
</script>

<template>
  <router-link class="article-card" :to="{ name: 'ArticleDetail', params: { shortId: props.shortId } }">
    <div class="article-card__container" v-ripple>
      <div class="article-card__header">
        <div 
          class="article-card__header-cover"
          v-lazy="{
            src: props.cover || DefaultImg
          }"
        >
        </div>
      </div>
      <div class="article-card__body">
        <div class="article-card__meta">
          <div class="article-card-date">
            <Icon name="date"/>
            <span>{{ props.date }}</span>
          </div>
          <div class="article-card-categories" v-if="props.categories?.length">
            <div class="article-card-categories-item" v-for="(category, index) in props.categories" :key="index">
              {{ category }}
            </div>
          </div>
        </div>
        
        <div class="article-card-title" :title="props.title">
          {{ props.title }}
        </div>
        
        <div class="article-card-tags">
          <div class="article-card-tags-item" v-for="(tag, index) in props.tags" :key="index">
            {{ tag }}
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>

<style lang="scss" scoped>
.article-card {
  width: 100%;
  display: block;
  text-decoration: none;
  color: inherit;
  &__container {
    height: rem(380);
    @include mix.container-style($b: var(--border-base), $p: 0, $bg: var(--surface-base));
    @include anim.transition($p: border-color transform box-shadow);
    @include mix.flex-box($d: column);
    @include hov.card($t: true);
    overflow: hidden;
    @include mix.respond-down(md) {
      flex-direction: row;
      height: rem(180);
    }
    &:hover {
      .article-card__header-cover {
        transform: scale(1.1);
      }
      .article-card-title {
        color: var(--primary-base);
      }
    }
  }
  &__header {
    position: relative;
    @include mix.size(100%, 55%);
    overflow: hidden;
    @include mix.respond-down(md) {
      width: 40%;
      height: 100%;
    }
    &-cover {
      @extend %full-size;
      background-position: center;
      background-size: cover;
      @include anim.transition($p: transform, $dr: slow);
    }
  }
  &__body {
    flex: 1;
    width: 100%;
    @include mix.container-style($p: md lg, $bg: none, $b: none);
    @include mix.flex-box($d: column, $j: flex-start, $a: flex-start, $g: sm);
    overflow: hidden;
    
    @include mix.respond-down(md){
      @include mix.size(60%, 100%);
      padding: rem(12);
    }
  }
  &__meta {
    width: 100%;
    @include mix.flex-box($j: space-between, $a: center);
    @include mix.font-style($s: xs, $c: var(--text-subtler));
  }
  &-date {
    @extend %flex-center;
    gap: rem(4);
    font-size: rem(12);
    &>span {
      padding-top: rem(2);
    }
  }
  &-categories {
    @include mix.flex-box($g: xs);
    &-item {
      @include mix.font-style($s: xs);
      position: relative;
      &:not(:last-child)::after {
        content: '/';
        margin-left: rem(4);
        opacity: 0.5;
      }
    }
  }
  &-title {
    width: 100%;
    @include mix.font-style($f: title, $s: lg, $w: 600, $c: var(--text-base));
    @include mix.text-overflow(2);
    margin: rem(4) 0;
    line-height: 1.4;
    @include anim.transition($p: color);
    @include mix.respond-down(md) {
      font-size: rem(16);
    }
  }
  &-tags {
    margin-top: auto;
    @include mix.size(100%, rem(24));
    @include mix.flex-box($g: xs, $j: flex-start, $w: wrap);
    overflow: hidden;
    &-item {
      @include mix.font-style($s: xs, $c: var(--text-subtle));
      @include mix.container-style($p: xs sm, $r: sm, $bg: var(--bg-subtle));
      @include hov.bg(var(--primary-subtle));
      @include anim.transition($p: bg);
      &::before {
        content: '#';
        margin-right: 2px;
        opacity: 0.6;
      }
    }
  }
}
</style>