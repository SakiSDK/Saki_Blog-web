<script lang="ts" setup>
import AvatarImg from '@/assets/imgs/avatar.webp'
import { animate, createSpring, createDraggable, stagger, splitText } from 'animejs';
import { onMounted, ref } from 'vue';
import { useThemeStore } from '@/stores/theme.store';


/** ---------- Props ---------- */
// defineProps<{
//   isShow: boolean
// }>()


/** ---------- 主题状态 ---------- */
useThemeStore();


/** ---------- 绑定HTML元素 ---------- */
const loadingRef = ref<HTMLElement>();
const textRef = ref<HTMLElement>();
const startAnimeation = () => {
  if (!loadingRef.value) return;

  // LOGO动画
  if (!loadingRef.value) return;
  animate(loadingRef.value, {
    scale: [
      { to: 1.4, ease: 'inOut(3)', duration: 100 },
      { to: 1, ease: createSpring({ stiffness: 300 }) }
    ],
    loop: true,
  })
  createDraggable(loadingRef.value, {
    container: [0, 0, 0, 0],
    releaseEase: createSpring({ stiffness: 200 })
  });
  // 文字动画
  if (!textRef.value) return;
  const { chars } = splitText(textRef.value, { words: false, chars: true })
  animate(chars, {
    y: [
      { to: '-2.75rem', ease: 'outExpo', duration: 600 },
      { to: 0, ease: 'outBounce', duration: 800, delay: 100 }
    ],
    rotate: {
      from: '-1turn',
      delay: 0
    },
    delay: stagger(50),
    ease: 'inOutCirc',
    loopDelay: 1000,
    loop: true
  })
}
onMounted(() => {
  // 开始动画
  startAnimeation();
})
</script>

<template>
  <div class="global-loading">
    <div class="global-loading__container">
      <div class="global-loading-logo" ref="loadingRef">
        <div v-lazy="{
          src: AvatarImg
        }"></div>
      </div>
      <div class="global-loading-text" ref="textRef">LOADING...</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.global-loading {
  @include mix.position-style($p: fixed, $t: 0, $l: 0, $z: loading);
  @extend %full-screen;
  background-color: var(--bg-base);
  backdrop-filter: blur(15px);
  &__container {
    @extend %full-size;
    @include mix.flex-box;
  }
  &-logo {
    @include mix.size(100px);
    @include mix.radius(50%);
    overflow: hidden;
    border: 5px solid var(--white-ghost);
    @include mix.margin-d(r, xl);
    &>div {
      @extend %full-size;
    }
  }
  &-text {
    @include mix.font-style($s: title, $f: 'pixel');
    letter-spacing: 2px;
    // 真实镜像倒影核心样式（下方倒影，带渐变透明）
    -webkit-box-reflect: below 4px linear-gradient(transparent, var(--gray-weak));
  }
}
</style>