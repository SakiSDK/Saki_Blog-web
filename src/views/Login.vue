<script lang="ts" setup>
import CatSVG from '@/assets/imgs/login_cat.svg'
import VForm from '@/components/bases/VForm.vue'
import { ref } from 'vue'

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
          <span>登录</span>
        </div>
        <div class="login-subtitle">请登录您的账户继续访问</div>
        <!-- 登录表单 -->
        <div class="login__form">
          <VForm
            form-type="login"
            :on-submit="handleLogin"
          />
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
  &__container {
    // height: 700px;
    @extend %flex-center;
    @include mix.container-style($p: 0, $b: var(--border-base), $o: hidden);
    @include mix.respond-down(md) {
      @include mix.flex-box($d: column);
      height: fit-content;
    }
  }
  &__header,
  &__body {
    height: 100%;
    @include mix.container-style($r: 0, $p: 70px);
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
      @include mix.padding(xxl);
    }
  }
  &__body {
    width: 500px;
    @include mix.flex-box($d: column, $a: flex-start);
    @include mix.padding(70px);
  }
  &-logo {
    @include mix.flex-box($g: lg);
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
    @include mix.size(250px, 350px);
    color: var(--white-base);
    &>img {
      @include mix.size(150px);
    }
    @include mix.respond-down(md) {
      display: none;
    }
  }
  &-copyright {
    @include mix.font-style($c: var(--text-subtler));
  }
  &__form {
    width: 100%;
    @include mix.flex-box($d: column);
  }
  &-title {
    width: 100%;
    text-align: start;
    @include mix.font-style($s: title);
    @include mix.margin-d(b, xxl);
    @extend %flex-center;
    &-icon {
      @include mix.inline-flex-box($a: center, $j: center);
      @include mix.margin-d(r, lg);
      color: var(--primary-base);
    }
  }
  &-subtitle {
    width: 100%;
    @include mix.margin-d(b, xl);
    @include mix.font-style($s: lg, $c: var(--text-subtler));
  }
}
</style>