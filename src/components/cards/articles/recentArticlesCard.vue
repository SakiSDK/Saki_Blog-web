<script lang="ts" setup>
import CardHeader from '@/components/bases/CardHeader.vue';
import AvatarImg from '@/assets/imgs/avatar.webp'

</script>

<template>
  <div class="recent-article">
    <div class="recent-article__container">
      <CardHeader title="最近文章" subtitle="点击可跳转到详情文章" icon="calendar"/>
      <div class="recent-article__body">
        <div 
          class="recent-article-card" 
          v-for="_ in 5"
          v-ripple
        >
          <div
            class="recent-article-card-cover"
            v-lazy="{
              src: AvatarImg
            }" 
            alt=""
          >
          </div>
          <div class="recent-article-card-content">
            <div class="recent-article-card-title">
              文章标题
            </div>
            <div class="recent-article-card-date">
              <Icon name="recent"/>
              2019-09-09
            </div>
          </div>
        </div>
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
    @include hov.card($s: -2px);
    @include hov.bg(var(--primary-base));
    @include hov.color(var(--white-base));
    &:hover {
      .recent-article-card-date {
        color: var(--white-subtle);
      }
    }
    &-cover {
      @include mix.size(50px);
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