<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useWindowSize } from '@vueuse/core';
import AvatarImg from '@/assets/imgs/avatar.webp'
import { createI18nUtil } from '@/utils/i18n.util';
import type { AboutCardData } from '@/types/components/Home';
import { useDomUtil } from '@/utils/dom.util';

/** ---------- AboutCard text ---------- */
const { t, tObj } = createI18nUtil();
const aboutCardData = tObj<AboutCardData>('home.aboutmeCard')
const aboutBtnOrder: string[] = aboutCardData.btns.order;
const aboutBtns = aboutBtnOrder.map(itemKey => {
  return aboutCardData.btns.items[itemKey];
})

const avatarSize = ref<string>('130px')
const { respondDown, respondUp } = useDomUtil();

const { width } = useWindowSize()
watch(width, () => {
    respondDown('lg', () => {
      avatarSize.value = '55px';
    });
    respondUp('lg', () => {
      avatarSize.value = '130px';
    });
    respondDown('md', () => {
      avatarSize.value = '130px';
    }) 
}, {
  immediate: true
})
</script>

<template>
  <div class="aboutme">
    <div 
      class="aboutme__container"
    >
      <div class="aboutme__left">
        <Avatar 
          :src="AvatarImg" 
          :style="{
            size: avatarSize,
          }"
        />
        <div class="aboutme-info">
          <div class="aboutme-name">
            {{ aboutCardData.name }}
          </div>
          <div class="aboutme-detail">
            {{ aboutCardData.detail }}
          </div>
        </div>

      </div>
      <div class="aboutme__right">
        <div class="aboutme-title">
          {{ aboutCardData.title }}
          <span class="aboutme-clip">{{ aboutCardData.emoji }}</span>
        </div>
        <div class="aboutme-content">
          {{ aboutCardData.content }}
        </div>
        <div class="aboutme-innercontent">
          {{ aboutCardData.innerContent }}
        </div>
        <div class="aboutme-btns">
          <div class="aboutme-btn" v-for="item,index in aboutBtns" :key="index">
            <div 
              class="aboutme-btn__wrapper"
              v-tippy="{
                content: item.tip,
                theme: 'link',
              }"
            >
              <VButton type="secondary" size="small" border>{{ item.name }}</VButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.aboutme {
  height: 330px;
  &__container {
    @extend %card-container-base;
    padding: 0;
    @include mix.flex-box($j: flex-start);
    @include mix.respond-between(md, lg){
      flex-direction: column;
      align-items: flex-start;
      .aboutme__left {
        flex: 1;
        @include mix.size(100%, fit-content);
        flex-direction: row;
        @include mix.padding(sm);
      }
      .aboutme__right {
        flex: 7;
      }
      .aboutme-innercontent {
        top: 130px;
      }
    }
    &:hover {
      .aboutme-clip  {
        transform: rotate(90deg);
      }
      .aboutme-content {
        transform: scale(0);
      }
      .aboutme-innercontent {
        transform: scale(1);
      }
    }
  }
  &__left {
    flex: 2;
    height: 100%;
    background: linear-gradient(0deg, var(--primary-base), var(--secondary-subtle));
    @include mix.flex-box($d: column, $g: lg);
    @include mix.padding(lg);
  }
  &__right {
    flex: 3;
    height: 100%;
    @include mix.flex-box($d: column, $j: space-between, $a: flex-start, $g: lg);
    @include mix.padding(lg);
  }
  &-name {
    @include mix.font-style($s: lg-title, $f: title, $c: var(--white-base));
  }
  &-detail {
    @include mix.font-style($s: sm, $c: var(--white-subtle));
  }
  &-title {
    position: relative;
    @include mix.font-style($s: lg, $f: title, $c: var(--primary-base));
  }
  &-clip {
    display: inline-block;
    @include mix.position-style($p: absolute, $r: xxs);
    @include anim.transition(transform);
  }
  &-btns {
    @include mix.flex-box($g: sm);
  }
  &-content,
  &-innercontent {
    line-height: 2;
    @include mix.font-style($c: var(--text-subtler));
    @include anim.transition(transform);
    transform-origin: center bottom;
  }
  &-innercontent {
    @include mix.padding-d(r, xs);
    @include mix.position-style($p: absolute, $t: 70px);
    transform: scale(0);
  }
}
</style>