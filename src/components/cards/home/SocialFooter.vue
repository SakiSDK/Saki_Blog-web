<script lang="ts" setup>
import AvatarImg from '@/assets/imgs/avatar.webp'
import { useDomUtil } from '@/utils/dom.util';
import { useEventListener } from '@vueuse/core';
import { onMounted, ref } from 'vue';


const SocialFooterFields = [
  { type: 'icon', name: 'rss', link: 'https://www.rss.com/' },
  { type: 'icon', name: 'email', link: 'https://www.rss.com/' },
  { type: 'icon', name: 'github', link: 'https://www.rss.com/' },
  { type: 'icon', name: 'bilibili', link: 'https://www.rss.com/' },
  { type: 'avatar', src: AvatarImg },
  { type: 'icon', name: 'QQ', link: 'https://www.rss.com/' },
  { type: 'icon', name: 'twitter', link: 'https://www.rss.com/' },
  { type: 'icon', name: 'douyin', link: 'https://www.rss.com/' },
  { type: 'icon', name: 'copyright', link: 'https://www.rss.com/', ripple: true },
];
const avatarSize = ref<string>('70px')
const { respondDown, respondUp } = useDomUtil();
onMounted(() => { 
  // 初始化头像大小
  respondDown('xxs', () => {
    avatarSize.value = '45px';
  });
  useEventListener(window, 'resize', () => { 
    respondDown('xxs', () => {
      avatarSize.value = '45px';
    });
    respondUp('xxs', () => {
      avatarSize.value = '70px';
    });
  })
})
</script>

<template>
  <div class="social">
    <div class="social__container">
      <template 
        v-for="(item, index) in SocialFooterFields" 
        :key="index"
      >
        <div 
          v-if="item.type === 'icon'" 
          class="social-icon"
          v-ripple
          v-bind:href="item.link"
        >
          <Icon :name="item.name" />
        </div>
        <div v-else-if="item.type === 'avatar'" class="social-avatar">
          <Avatar :src="item.src" :style="{
            size: avatarSize
          }"/>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.social {
  width: 100%;
  &__container {
    position: relative;
    height: fit-content;
    @include mix.flex-box($g: xxl);
    @include mix.margin-d(t, xxl);
    @include mix.respond-down(sm){
      @include mix.gap(sm);
      .social-icon {
        @include mix.size(30px);
        @include mix.padding(xs);
        @include mix.font-size(lg);
      }
    }
    &::before {
      content: '';
      @include mix.size(100%, 2px);
      background-image: repeating-linear-gradient(
        90deg,
        var(--text-subtler) 0 6px, // 虚线长度
        transparent 6px 12px    // 间隙长度
      );
      @include mix.position-style($p: absolute)
    }
  }
  &-avatar,
  &-icon {
    @include mix.z-index(base);
  }
  &-icon {
    @include mix.size(45px);
    @include mix.container-style($r: 50%, $p: 0);
    @extend %flex-center;
    flex-shrink: 0;
    @include mix.font-style($s: xxl, $c: var(--text-subtle));
    @include anim.transition(transform gap padding);
    transform-origin: bottom center;
    @include hov.scale(1.2);
  }
}

</style>