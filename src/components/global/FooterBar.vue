<script lang="ts" setup>
import SmartLink from '@/components/bases/SmartLink.vue';

defineOptions({
  name: 'FooterBar'
})


/** ---------- 页面文案内容 ---------- */
const guessField = {
  title: '猜你想看',
  items: [
    {
      title: '关于我',
      link: '/aboutme'
    },
    {
      title: '关于本站',
      link: '/aboutsite'
    },
    {
      title: '友链',
      link: '/friend'
    },
    {
      title: '相册',
      link: '/album'
    },
    {
      title: '文章时间线',
      link: '/article'
    },
    {
      title: '文章标签',
      link: '/article/tag'
    },
    {
      title: '文章分类',
      link: '/article/category'
    }
  ]
}
const frendlinkField = {
  title: '友情链接',
  items: [
    {
      title: 'SakiSDKBlog',
      link: 'https://sakisdk.com'
    },
    {
      title: 'SakiSDKBlog',
      link: 'https://sakisdk.com'
    },
    {
      title: 'SakiSDKBlog',
      link: 'https://sakisdk.com'
    },
    {
      title: 'SakiSDKBlog',
    }
  ]
}
const mottoField = {
  title: '格言',
  content: `
    愿我们都能在复杂的世界里保持纯粹，在奔波的岁月中坚守初心，用善意化解隔阂，用坚持浇灌梦想，让每一次相遇都成为照亮彼此的光，让每一段征程都绽放独属于自己的精彩。
  `
}
</script>

<template>
  <div class="footer-bar">
    <div class="footer-bar__container">
      <div class="footer-bar__body">
        <div class="footer-bar__wrapper">
          <div class="footer-bar-item">
            <div class="footer-bar-title">
              {{ guessField.title }}
            </div>
            <div class="footer-bar-item-content">
              <div class="footer-bar-item-link" v-for="item, index in guessField.items" :key="index">
                <SmartLink v-if="item.link" :to="item.link">{{ item.title }}</SmartLink>
              </div>
            </div>
          </div>
          <div class="footer-bar-item">
            <div class="footer-bar-title">
              {{ frendlinkField.title }}
            </div>
            <div class="footer-bar-item-content">

            </div>
          </div>
          <div class="footer-bar-item">
            <div class="footer-bar-title">
              {{ mottoField.title }}
            </div>
            <div class="footer-bar-item-motto">
              {{ mottoField.content }}
            </div>
          </div>
        </div>
      </div>
      <div class="footer-bar__footer">
        <div class="footer-bar-copyright">© 2025 SakiSDKBlog. 保留所有权利。</div>
        <div class="footer-bar-link">沪ICP备12345678号</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.footer-bar {
  width: 100%;
  &__container {
    @include mix.container-style($p: 0, $o: hidden);
    border-top: var(--border-base);
    @include mix.radius-d(br, 0);
    @include mix.radius-d(bl, 0);
  }
  &__body {
    @include mix.container-style($r: 0, $p: xxl);
    @extend %flex-center;
  }
  &__wrapper {
    width: 80%;
    @include mix.grid-box($c: 3, $g: lg);
    @include mix.respond-down(xs) {
      @include mix.grid-box($c: 1, $g: lg);
    }
  }
  &-item{
    &-content {
      @include mix.grid-box($c: 2, $g: sm);
      @include mix.respond-down(xs) {
        @include mix.grid-box($c: 3, $g: sm);
      }
    }
    &-link {
      @include mix.font-style($c: var(--text-subtler), $s: xs);
      @include anim.transition($p: color);
      cursor: pointer;
      @include hov.color(var(--primary-base));
      @include hov.underline-style($bg: var(--primary-base));
      &>span {
        text-wrap: nowrap;
      }
    }
    &-motto {
      @include mix.font-style($c: var(--text-subtler), $s: xs, $l: 1.7);
    }
  }
  &-title {
    @include mix.font-style($w: bold, $s: sm);
    @include mix.margin-d(b, lg);
  }
  &__footer {
    @include mix.container-style($r: 0, $p: lg);
    border-top: var(--border-base);
  }
  &-copyright,
  &-link {
    @extend %text-center;
    @include mix.font-style($c: var(--text-subtler), $s: xs);
  }
  &-link {
    @include mix.margin-d(t, sm);
    @include mix.font-style($c: var(--primary-subtle))
  }
}
</style>