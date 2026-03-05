<script lang="ts" setup>
import CatSVG from '@/assets/imgs/login_cat.svg'
import GoogleSVG from '@/assets/imgs/auth_google.svg'
import GithubSVG from '@/assets/imgs/auth_github.svg'
import WeChatSVG from '@/assets/imgs/auth_wechat.svg'
import QQSVG from '@/assets/imgs/auth_qq.svg'
import VForm from '@/components/bases/VForm.vue'



/** ---------- 页面文案 ---------- */
const thirdLoginField = [
  {
    icon: GoogleSVG,
    label: 'Google',
    acticon: () => {
      console.log('google')
    }
  },
  {
    icon : GithubSVG,
    label: 'Github',
    acticon: () => {
      console.log('google')
    }
  },
  {
    icon : WeChatSVG,
    label: 'WeChat',
    acticon: () => {
      console.log('google')
    }
  },
  {
    icon : QQSVG,
    label: 'QQ',
    acticon: () => {
      console.log('google')
    }
  }
]

const computeThirdLoginClass = (label: string) => {
  if (label) return [`login__third-${label}`, 'login__third-item']
  return ['login__third-item']
}
// 登录表单使用
const handleLogin = async (values: any, { setErrors }: any) => {
  console.log('登录数据:', values)
  // 这里调用登录API
  try {
    // await loginAPI(values)
  } catch (error) {
    setErrors({
      username: '用户名或密码错误',
      password: '用户名或密码错误'
    })
  }
}
</script>

<template>
  <div class="login container">
    <div class="login__container">
      <div class="login__header">
        <div class="login-logo">
          <div class="login-logo-icon">
            <Icon name="pen"/>
          </div>
          <span class="login-logo-text">SAKISDK</span>
        </div>
        <div class="login-detail">
          不断学习，不断进步
        </div>
        <div class="login-svg">
          <img :src="CatSVG" alt="">
        </div>
        <div class="login-copyright">
          © 2025 SakiSDK 个人博客
        </div>
      </div>
      <div class="login__body">
        <div class="login-title">
          <span class="login-title-icon">
            <Icon name="login"/>
          </span>
          <span>登录账号</span>
        </div>
        <div class="login-subtitle">请登录您的账户继续访问</div>
        <!-- 登录表单 -->
        <div class="login__form">
          <VForm
            form-type="login"
            :on-submit="handleLogin"
          />
        </div>
        <div class="login-register">
          还没有账号？<router-link class="login-register-box" to="/register">去注册</router-link>
        </div>
        <div class="login__third">
          <div class="login__third-title">
            <span>第三方登录</span>
          </div>
          <div class="login__third-content">
            <div 
              v-ripple
              v-for="item, index in thirdLoginField" 
              @click.prevent="item.acticon()" 
              :class="computeThirdLoginClass(item.label)"
              :key="index"
            >
              <img :src="item.icon" :alt="item.label"/>
              <span>{{ item.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <RightBar/>
</template>

<style lang="scss" scoped>
.login {
  @extend %full-screen;  
  @extend %flex-column-center;
  &-register {
    width: 100%;
    @include mix.margin-d(t, lg);
    text-align: center;
    &-box {
      @include mix.font-style($c: var(--primary-base));
      @include hov.underline-style($bg: var(--primary-base));
      cursor: pointer;
    }
  }
  &__container {
    min-height: rem(700);
    @extend %flex-center;
    @include mix.container-style($p: 0, $b: var(--border-base), $o: auto);
    @include mix.respond-down(md) {
      @include mix.flex-box($d: column);
      height: fit-content;
    }
  }
  &__header,
  &__body {
    height: 100%;
  }
  &__header,
  &__body {
    @include mix.container-style($r: 0, $p: rem(60));
    @include mix.respond-down(md) {
      height: auto;
      width: 100%;
    }
    @include anim.transition($p: padding);
  }
  &__header {
    @extend %flex-column-center;
    background: linear-gradient(125deg, var(--primary-base), var(--secondary-subtle));
    @include mix.font-style($c: var(--white-base));
    @include mix.respond-down(md) {
      height: fit-content !important;
      @include mix.padding(xxl);
    }
  }
  &-home {
    @include mix.position-style($p: fixed, $t: rem(20), $l: rem(20), $z: 9999);
    @include mix.font-style($s: lg, $c: var(--text-base));
    @include mix.flex-box($j: flex-start);
    @include mix.gap(sm);
    cursor: pointer;
    @include hov.underline-style($bg: var(--text-base));
  }
  &__body {
    min-width: rem(500);
    @include mix.flex-box($d: column, $a: flex-start);
    flex-shrink: 0;
    @include mix.padding(rem(70));
    @include mix.respond-down(md) {
      min-width: rem(380);
      @include mix.padding(rem(30));
    }
  }
  &-logo {
    @extend %flex-center;
    @include mix.gap(lg);
    flex-shrink: 0;
    @include mix.margin-d(b, xxl);
    &-icon {
      @include mix.container-style($p: md, $bg: var(--white-weak));
      @include mix.font-style($s: title, $c: var(--white-base));
    }
    &-text {
      @include mix.font-style($s: xl-title, $c: var(--white-base), $f: pixel);
    }
  }
  &-detail {
    @include mix.margin-d(b, xxl);
  }
  &-svg {
    @extend %flex-center;
    @include mix.size(rem(250), rem(350));
    color: var(--white-base);
    &>img {
      @include mix.size(rem(150));
    }
    @include mix.respond-down(md) {
      display: none;
    }
  }
  &-copyright {
    @include mix.font-style($c: var(--white-weak));
  }
  &__form,
  &-title,
  &-subtitle,
  &__third,
  &__third-title,
  &__third-content,
  &__third-item {
    width: 100%;
  }
  &__form {
    @extend %flex-column-center;
  }
  &-title {
    @include mix.font-style($s: title);
    @include mix.margin-d(b, lg);
    @include mix.flex-box($j: flex-start);
    &-icon {
      @include mix.inline-flex-box($a: center, $j: center);
      @include mix.margin-d(r, lg);
      color: var(--primary-base);
    }
  }
  &-subtitle {
    @include mix.margin-d(b, rem(50));
    @include mix.font-style($s: lg, $c: var(--text-subtler));
  }
  &__third {
    @include mix.margin-d(t, lg);
    &-title {
      @extend %flex-center;
      @include mix.gap(sm);
      @include mix.font-style($s: sm, $c: var(--text-subtler));
      @include mix.margin-d(b, sm);
      text-wrap: nowrap;
      &::before,
      &::after {
        content: '';
        height: rem(1);
        width: 100%;
        background: var(--text-weak);
      }
    }
    &-content {
      @include mix.grid-box($c: 4, $g: xs);
      @include mix.respond-down(lg) {
        @include mix.grid-box($c: 3);
      }
      @include mix.respond-down(sm) {
        @include mix.grid-box($c: 2);
      }
    }
    &-item {
      @include mix.flex-box($j: flex-start);
      @include mix.container-style($p: sm, $b: var(--border-base));
      @include anim.transition($p: transform box-shadow bg);
      @include hov.move-y(rem(-2));
      &>img {
        @include mix.size(rem(30));
        @include mix.margin-d(r, sm);
      }
    }
    &-QQ,
    &-WeChat,
    &-Github { 
      color: var(--white-base);
    }
    &-QQ {
      background: var(--blue-base);
      :active {
        background: var(--blue-strong);
      }
    }
    &-WeChat {
      background: var(--green-base);
      :active {
        background: var(--green-strong);
      }
    }
    &-Github {
      background: var(--black-base);
      :active {
        background: var(--black-strong);
      }
    }
    &-Google {
      background: var(--white-base);
      color: var(--black-base);
      :active {
        background: var(--white-strong);
      }
    }
  }
}
</style>