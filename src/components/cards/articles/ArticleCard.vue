<script lang="ts" setup>
import testImg from '@/assets/imgs/home_bg.webp';
</script>

<template>
  <div class="article-card">
    <div class="article-card__container" v-ripple>
      <div 
        class="article-card__header"
        v-lazy="{
          src: testImg
        }"
      >
      </div>
      <div class="article-card__body">
        <div class="article-card-categories">
          <div class="article-card-categories-item">
            测试
          </div>
        </div>
        <div class="article-card-title">
          测试标题
        </div>
        <div class="article-card-tags">
          <div class="article-card-tags-item" v-for="_ in 30">
            测试
          </div>
        </div>
        <div class="article-card-date">
          <Icon name="date"/>
          <span>1145-14-19</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.article-card {
  width: 100%;
  &__container {
    height: 300px;
    @include mix.container-style($b: var(--border-base), $p: 0);
    @include anim.transition($p: border-color transform);
    @include mix.flex-box($d: column);
    @include hov.card($t: true);
    @include mix.respond-down(md) {
      flex-direction: row;
      height: 200px;
    }
    &:hover {
      backdrop-filter: blur(15px);
      .article-card__header {
        &>img {
          transform: scale(1.2);
        }
      }
    }
  }
  &__header {
    position: relative;
    flex: 4;
    width: 100%;
    overflow: hidden;
    @include mix.respond-down(md) {
      flex: 2;
      height: 100%;
    }
    &>img {
      @include anim.transition($p: transform, $dr: slower);
    }
  }
  &-date {
    @include mix.position-style($p: absolute, $t: 20px, $r: lg);
    @include mix.flex-box;
    @include mix.font-style($c: var(--text-subtler));
    &>span {
      @include mix.margin-d(l, xs);
      @include mix.font-style($s: xxs);
    }
  }
  &__body {
    position: relative;
    flex: 2;
    width: 100%;
    @include mix.container-style($p: lg);
    @include mix.flex-box($d: column, $j: space-between, $a: flex-start, $g: md);
    @include mix.respond-down(md){
      height: 100%;
      flex: 3;
    }
  }
  &-title {
    width: 100%;
    @include mix.font-style($f: title, $s: md);
  }
  &-categories,
  &-tags {
    width: 100%;
    @include mix.flex-box($g: xs, $j: flex-start, $w: wrap);
    @include mix.font-style($f: base, $c: var(--text-subtler), $s: xs);
  }
  &-tags {
    height: 35px;
    overflow: hidden;
    &-item {
      text-wrap: nowrap;
      &::before {
        content: '#';
        transform: translateX(3px);
      }
    }
  }
}
</style>