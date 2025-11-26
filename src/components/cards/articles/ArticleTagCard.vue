<script lang="ts" setup>
import CardHeader from '../../bases/CardHeader.vue';
import { useDomUtil } from '@/utils/dom.util';

const testTags = [
  '前端', '后端', 'Node.js', 'JavaScript', 'TypeScript', 'Vue3', 'Mysql', '日常',
]

const { brightColorByHash } = useDomUtil();
</script>

<template>
  <div class="article-tag">
    <div class="article-tag__container">
      <CardHeader title="标签" subtitle="共 128 个标签" :bordered="true" icon="tag" padding="10px 20px"/>
      <div class="article-tag__body">
        <span 
          class="article-tag-item" 
          v-for="tag, index in testTags" 
          :key="index" 
          :style="{
            '--tag-bgcolor': brightColorByHash({
              key: tag,
              alpha: 0.2
            }),
            '--tag-color': brightColorByHash({
              key: tag,
            })
          }"
          v-ripple
        >
          {{ tag }}
        </span>
        <div class="article-tag-all">
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
    @include mix.container-style($p: lg, $bg: none);
    @include mix.flex-box($s: 0, $w: wrap, $a: flex-start, $j: flex-start, $g: sm);
    align-content: flex-start;
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
    @include mix.position-style($p: absolute, $b: lg, $r: lg);
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