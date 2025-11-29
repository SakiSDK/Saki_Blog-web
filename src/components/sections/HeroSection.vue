<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { animate, spring, createDraggable } from 'animejs';
import { createI18nUtil } from '@/utils/i18n.util';
import AvatarImg from '@/assets/imgs/avatar.webp'
import type { HeroField } from '@/types/components/Hero';
import Wave from '../bases/Wave.vue';


/** ---------- 静态数据 ---------- */
const contentActive = ref<string>('')
const { t } = createI18nUtil();
const field: HeroField = {
  title: t('hero.title'),
  description: t('hero.description'),
}


onMounted(() => {
  /** ---------- 页面动画 ---------- */
  field.description.split('').forEach((item, index) => {
    setTimeout(() => {
      contentActive.value += item
    }, index * 150);
  })
  animate(['.hero-avatar','.logo-svg'], {
    scale: [
      { to: 1.25, ease: 'inOut(3)', duration: 200 },
      { to: 1, ease: spring({ stiffness: 300 }) }
    ],
    loop: true,
    loopDelay: 250,
  });
  createDraggable(['.hero-avatar','.logo-svg'], {
    container: [0, 0, 0, 0],
    releaseEase: spring({ stiffness: 200 })
  });
})
</script>

<template>
  <section class="hero">
    <div class="hero__container">
      <img
        :src="AvatarImg"
        class="hero-avatar"
      >
      <div class="hero__wrapper">
        <h2 class="hero-title">{{ field.title }}</h2>
        <p class="hero-description">{{ contentActive }}</p>
      </div>
    </div>
    <Wave :height="'100px'"/>
  </section>
</template>

<style lang="scss" scoped>
.hero {
  @extend %full-screen;
  @extend %flex-center;
  @include mix.position-style($p: relative);
  @include mix.font-style($c: var(--white-base));
  overflow: hidden;
  background: url('../../assets/imgs/home_bg.webp') no-repeat center/cover;
  filter: brightness(var(--img-brightness));
  @include anim.transition($dr: 0.4s);
  &__container {
    @include mix.flex-box($g: lg, $a: flex-start);
    caret-color: transparent;
  }
  &-avatar {
    @include mix.size(170px);
    border: 3px solid var(--white-subtle);
    border-radius: 50%;
    caret-color: transparent;
  }
  &__wrapper {
    height: 100%;
    @include mix.flex-box($d: column, $g: sm, $j: flex-start);
  }
  &-title {
    text-align: flex-start;
    @include mix.font-style(title, 70px, var(--white-base))
  }
  &-description { 
    width: 250px;
    text-wrap: wrap;
    &::after {
      content: '';
      @include mix.position-style($p: relative, $t: 2px);
      border-right: 3px solid transparent;
    }
  }
}
</style>