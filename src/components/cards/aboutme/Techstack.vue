<script lang="ts" setup>
import htmlSvg from '@/assets/svgs/icon-html.svg'
import cssSvg from '@/assets/svgs/icon-css.svg'
import sassSvg from '@/assets/svgs/icon-sass.svg'
import jsSvg from '@/assets/svgs/icon-js.svg'
import tsSvg from '@/assets/svgs/icon-typescript.svg'
import vueSvg from '@/assets/svgs/icon-vue-js.svg'
import viteSvg from '@/assets/svgs/icon-vite.svg'
import piniaSvg from '@/assets/svgs/icon-pinia.svg'
import gitSvg from '@/assets/svgs/icon-git.svg'
import pnpmSvg from '@/assets/svgs/icon-pnpm.svg'
import nodejsSvg from '@/assets/svgs/icon-nodejs.svg'
import redisSvg from '@/assets/svgs/icon-redis.svg'
import mysqlSvg from '@/assets/svgs/icon-mysql.svg'
import pythonSvg from '@/assets/svgs/icon-python.svg'
import sequlizeSvg from '@/assets/svgs/icon-sequelize.svg'
import dockerSvg from '@/assets/svgs/icon-docker.svg'
import npmSvg from '@/assets/svgs/icon-npm.svg'
import elementPlusSvg from '@/assets/svgs/icon-element-plus.svg'

import Carousel from '@/components/bases/Carousel.vue'
import { useDomUtil } from '@/utils/dom.util'




const { brightColorByHash } = useDomUtil();
const skills: { svg: string, text: string }[] = [
  { svg: htmlSvg, text: 'HTML' },
  { svg: cssSvg, text: 'CSS' },
  { svg: sassSvg, text: 'Sass' },
  { svg: jsSvg, text: 'JavaScript' },
  { svg: tsSvg, text: 'TypeScript' },
  { svg: vueSvg, text: 'Vue' },
  { svg: elementPlusSvg, text: 'Element Plus' },
  { svg: piniaSvg, text: 'Pinia' },
  { svg: viteSvg, text: 'Vite' },
  { svg: pnpmSvg, text: 'Pnpm' },
  { svg: npmSvg, text: 'Npm' },
  { svg: nodejsSvg, text: 'Node.js' },
  { svg: sequlizeSvg, text: 'Sequlize' },
  { svg: redisSvg, text: 'Redis' },
  { svg: mysqlSvg, text: 'MySQL' },
  { svg: dockerSvg, text: 'Docker' },
  { svg: gitSvg, text: 'Git' },
  { svg: pythonSvg, text: 'Python' },
]
</script>

<template>
  <div class="techstack">
    <div class="techstack__container">
      <div class="techstack-tag">技能</div>
      <div class="techstack-title">我的技术栈</div>
      <div class="techstack__content">
        <div class="techstack__wrapper">
          <Carousel />
        </div>
        <div class="techstack__detail">
          <div
            class="techstack-item"
            v-for="skill, index in skills"
            :key="index"
            :style="{
              '--tag-bgcolor': brightColorByHash({
                key: skill.text,
                alpha: 0.2
              }),
              '--tag-color': brightColorByHash({
                key: skill.text,
              })
            }"
            v-ripple
          >
            <div class="techstack-item-icon">
              <img
                :src="skill.svg"
                alt=""
              >
            </div>
            <div class="techstack-item-text">
              {{ skill.text }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.techstack {
  height: 320px;
  &-tag,
  &-content {
    display: inline-block;
  }
  &-tag {
    @extend %aboutme-tag;
    @include mix.font-style($c: var(--text-subtler));
  }
  &-title {
    @extend %aboutme-title;
    @include mix.font-style($c: var(--text-base));
  }
  &__container,
  &__content,
  &__wrapper {
    position: relative;
    height: 100%;
  }
  &__container {
    @include mix.container-style($p: lg, $r: md,
      $b: var(--border-base),
      $bg: var(--surface-base),
      $o: hidden,
    );
    @include hov.card($t: true);
    &:hover {
      .techstack__wrapper {
        opacity: 0;
      }
      .techstack__detail {
        opacity: 1;
        transform: scale(1);
      }
    }
  }
  &__content {
    @include mix.padding-d(l, 50%);
  }
  &__wrapper {
    height: 100%;
    transform: rotate(75deg);
    @include anim.transition;
  }
  &__detail {
    @include mix.position-style($p: absolute, $t: 0, $l: 0);
    @extend %full-size;
    @include mix.padding-d(t, 80px);
    @include mix.flex-box($j: flex-start, $a: flex-start, $w: wrap, $g: sm);
    align-content: flex-start;
    opacity: 0;
    transform: scale(0.3);
    transform-origin: bottom center;
    @include anim.transition(opacity transform);
  }
  &-item {
    @include mix.flex-box($w: nowrap);
    @include mix.container-style($p: xs md, $r: sm, $bg: var(--tag-bgcolor));
    @include mix.font-style($c: var(--tag-color), $w: bold, $s: sm);
    letter-spacing: 1px;
    &-icon {
      @include mix.size(20px);
      @include mix.margin-d(r, xs);
    }
  }
}
</style>