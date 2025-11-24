<!-- <script lang="ts" setup>
import htmlSvg from '@/assets/svgs/greet/icon-html.svg'
import cssSvg from '@/assets/svgs/greet/icon-css3.svg'
import sassSvg from '@/assets/svgs/greet/icon-sass.svg'
import jsSvg from '@/assets/svgs/greet/icon-js.svg'
import tsSvg from '@/assets/svgs/greet/icon-ts.svg'
import vueSvg from '@/assets/svgs/greet/icon-vue-js.svg'
import viteSvg from '@/assets/svgs/greet/icon-vite.svg'
import piniaSvg from '@/assets/svgs/greet/icon-pinia.svg'
import gitSvg from '@/assets/svgs/greet/icon-git.svg'
import pnpmSvg from '@/assets/svgs/greet/icon-pnpm.svg'
import nodejsSvg from '@/assets/svgs/greet/icon-nodejs.svg'
import redisSvg from '@/assets/svgs/greet/icon-redis.svg'
import mysqlSvg from '@/assets/svgs/greet/icon-mysql.svg'
import pythonSvg from '@/assets/svgs/greet/icon-python.svg'
import sequlizeSvg from '@/assets/svgs/greet/icon-sequelize.svg'
import dockerSvg from '@/assets/svgs/greet/icon-docker.svg'
import npmSvg from '@/assets/svgs/greet/icon-npm.svg'
import elementPlusSvg from '@/assets/svgs/greet/icon-element-plus.svg'




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
          <SvgCarousel />
        </div>
        <div class="techstack__detail">
          <div
            class="techstack-item"
            v-for="skill, index in skills"
            :key="index"
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
    @include mix.position-style($p: absolute, $t: 10px, $l: 20px, $z: base);
    @include mix.font-style($c: var(--text-subtle), $s: sm);
  }

  &-title {
    @include mix.position-style($p: absolute, $t: 40px, $l: 20px, $z: base);
    @include mix.font-style($f: 'accent', $s: title, $c: var(--primary-base));
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
    @include anim.card-hover;

    &:hover {
      .techstack__wrapper {
        opacity: 0;
      }

      .techstack__detail {
        opacity: 1;
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
    @include mix.flex-box($a: flex-start, $w: wrap $ac: flex-start);
    opacity: 1;
    @include anim.transition;
  }

  &-item {
    display: inline-block;
    width: fit-content;
    @include mix.flex-box;

    &-icon {
      @include mix.size(20px);
    }
  }
}
</style> -->