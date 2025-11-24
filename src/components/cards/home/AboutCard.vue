<script lang="ts" setup>
import { ref } from 'vue'
import { useMutationObserver } from '@vueuse/core';
import AvatarImg from '@/assets/imgs/avatar.webp'

const bgImgPath: string = new URL('../../assets/images/bgImg.webp', import.meta.url).href

const currentTheme = ref<string>(document.documentElement.dataset.theme || 'light')//获得当前主题
useMutationObserver(document.documentElement, () => {//监听html属性
  currentTheme.value = document.documentElement.dataset.theme || 'light'
}, {
  attributes: true, //监听属性变化
  attributeFilter: ['data-theme'], //只监听data-theme属性
})

//用于创建按钮
const linkField = ref<{
  href: string,
  tipContent: string,
  iconName: string,
}[]>([
  { href: '', tipContent: '114514@gmail.com', iconName: 'mail' },
  { href: '', tipContent: '1145141919810', iconName: 'qq' },
  { href: '', tipContent: 'GitHub', iconName: 'github' }
])

// 页面文案内容
const aboutContent: Record<string, string> = {
  name: 'SakiSDK',
  surfaceWord: 'In programming, one must truly demonstrate their skills.',
  nonsence: '一名大三在读老登的数字避难所，用来逃避现实、记录 bug 和假装很懂的地方，计划是学 Vue，结果写成了人生。',
  btInfo: 'about me',
}
const tippyConfigs: Record<string, {
  content: string,
  theme: string,
  appendTo: string,
}> = {
  about: {
    content: '关于我',
    theme: 'link',
    appendTo: 'parent',
  }
}
</script>

<template>
  <div
    class="about"
    :style="{
      backgroundImage: bgImgPath
    }"
  >
    <div class="about__container">
      <div class="about__intro">
        <div class="about__surface">
          <Avatar
            :src="AvatarImg"
            :style="{
              size: '120px'
            }"
          />
          <h2 class="about__surface-name">{{ aboutContent.name }}</h2>
          <p class="about__surface-words">{{ aboutContent.surfaceWord }}</p>
        </div>
        <div class="about__hidden">
          <span>{{ aboutContent.nonsence }}</span>
        </div>
      </div>
      <div class="about__links">
        <a
          href="./aboutme"
          class="about__links-about"
          v-tippy="tippyConfigs.about"
        >
          <a href="/about">{{ aboutContent.btInfo }}</a>
        </a>
        <span class="about__links-content">
          <a
            v-for="item, index in linkField"
            :key="index"
            :href="item.href"
            v-tippy="{ content: item.tipContent, theme: 'link', appendTo: 'parent', }"
          >
            <Icon
              :name="item.iconName"
              className="content__icon"
            />
          </a>
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.about {
  @include mix.size(100%, 330px);
  &__container,
  &__intro,
  &__links {
    position: relative;
  }

  &__container {
    @extend %full-size;
    @include mix.container-style($p: lg,
      $b: var(--border-base),
      $r: lg,
      $bg: var(--surface-base),
      $o: hidden,
    );
    @include mix.flex-box($d: column, $g: sm);
    background: url('../../../assets/imgs/home_bg.webp') no-repeat center/cover;
    @include hov.card($it: true);
  }

  &__intro {
    @include mix.size(100%, fit-content);

    &:hover {
      .about__surface {
        transform: scale(0);
        opacity: 0.2;
      }

      .about__hidden {
        display: block;
        opacity: 1;
        color: var(--white-base);
      }
    }
  }

  &__surface {
    @include mix.size(100%, fit-content);
    @include anim.transition;
    transform-origin: bottom center;
    @include mix.flex-box($d: column, $g: sm);

    &-word {
      @include mix.size(100%, fit-content);
      // @extend %word-init;

      @include mix.respond-down('xl') {
        text-align: center;
      }

      @include mix.respond-down('sm') {
        text-align: justify;
      }
    }
  }

  &__hidden {
    display: none;
    opacity: 0;
    @include mix.position-style(absolute, $t: 50%, $l: 0);
    text-align: justify;
  }

  &__links {
    width: 100%;
    @include mix.margin-d(b, sm);
    @include mix.padding(lg);
    @include mix.flex-box($j: space-between);

    &-about {
      @include mix.container-style($p: sm lg, $r: sm, $bg: var(--interactive-weak));
      text-align: center;
      @include mix.font-style($s: md, $w: 600);
      @include anim.transition;
      @include hov.bg(var(--primary-base));
      @include hov.color(var(--white-base));
      @include hov.move;
    }

    &-content {
      @include mix.flex-box($j: space-betwee, $g: sm);

      a {
        @include mix.container-style($p: sm, $r: 50%, $bg: var(--interactive-weak));
        @include anim.transition;
        @include hov.bg(var(--primary-base));
        @include hov.color(var(--white-base));
        @include hov.move;

        .content__icon {
          @include mix.font-style($s: md, $w: 600);
        }
      }
    }
  }
}
</style>