<script lang="ts" setup>
import avatar from '@/assets/imgs/avatar.webp'
import type { InfoCardContent } from '@/types/components/Aboutme';
import { createI18nUtil } from '@/utils/i18n.util';


/** ---------- infoCard text ---------- */
const { tWithPrefix } = createI18nUtil();
const infoT = tWithPrefix('aboutme.infoCard');
const infoCardContent: InfoCardContent = {
  welcome: infoT('welcome'),
  title: infoT('title'),
  emoji: infoT('emoji'),
  description: infoT('description'),
}
</script>

<template>
  <div class="info">
    <div class="info__container">
      <div class="info-avatar">
        <Avatar
          :src="avatar"
          :style="{
            size: '130px'
          }"      
          :size="'130px'"
        />
      </div>
      <div class="info__content">
        <div class="info-welcome">
          {{ infoCardContent.welcome }}
          <span>{{ infoCardContent.emoji }}</span>
        </div>
        <div class="info-title">{{ infoCardContent.title }}</div>
        <div class="info-desc">
          {{ infoCardContent.description }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.info {
  height: 200px;
  &__container {
    @extend %aboutme-container;
    background-color: var(--primary-base);
    @include mix.flex-box($j: flex-start, $g: lg);
    &:hover {
      .info-welcome {
        &>span {
          transform: rotate(90deg);
        }
      }
    }
  }
  &__content {
    flex: 1;
  }
  &-welcome,
  &-desc {
    @include mix.font-style($c: var(--white-subtle), $s: sm)
  }
  &-welcome,
  &-title {
    @include mix.margin-d(b, sm);
  }
  &-welcome {
    @include mix.font-style($c: var(--white-subtle), $s: sm);
    &>span {
      display: inline-block;
      @include anim.transition(transform, $dr: slow);
    }
  }
  &-title {
    @include mix.font-style($c: var(--white-base), $s: title, $f: 'title');
    letter-spacing: 3px;
  }
}
</style>