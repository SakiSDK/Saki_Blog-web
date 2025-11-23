<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
defineOptions({
  name: 'TopBar',
});

const { t } = useI18n();

const navFeilds = [
  {
    name: t('topbar.nav.home'),
    link: '/',
  },
  {
    name: t('topbar.nav.article.title'),
    link: '/blog',
    dropdown: t('topbar.nav.article.dropdown')
  },
  {
    name: t('topbar.nav.about'),
    link: '/about',
  },
];
const optionFields = [
  {
    iconName: 'search',
    action: () => {
      console.log('search');
    }
  },
  {
    iconName: 'user',
    action: () => {
      console.log('bell');
    }
  },
  {
    iconName: 'grid',
    action: () => {

    }
  },
]
</script>

<template>
  <div class="topbar">
    <div class="topbar__container">
      <div class="topbar__header">
        <div class="topbar-name">
          <span>
            {{ t('topbar.name') }}
          </span>
          <div class="home-icon">
            <Icon name="home" />
          </div>
        </div>
      </div>
      <div class="topbar__nav">
        <div class="topbar__nav-wrapper">
          <div class="topbar__nav-item" v-for="field, index in navFeilds">
            {{field.name }}
            <div class="topbar__dropdown">
              <div 
                class="topbar__dropdown-item"
                v-for="item, index in field.dropdown"
              >
              {{ field.dropdown }}
                {{item}}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="topbar__options">
        <div 
          class="topbar__options-item" 
          v-for="field,index in optionFields"
          @click="field.action()"
          :key="index"
        >
          <Icon :name="field.iconName" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
%hover-box {
  @include mix.container-style($p: sm, $bg: none, $r: md);
  @include anim.transition($p: bg color transform);
  @include hov.bg(var(--primary-base));
  @include hov.color(var(--white-base));
  @include hov.move;
}
.home-icon {
  @include mix.position-style($p: absolute);
  opacity: 0;
  transform: scale(0.4);
  @include anim.transition($p: opacity transform);
  color: var(--white-base);
}
.topbar {
  @include mix.position-style($p: fixed, $t:0, $r:0, $z: fixed);
  @include mix.size(100%, 60px);
  &__container {
    position: relative;
    @include mix.flex-box($jc: space-between, $ai: stretch, $w: nowrap);
    @extend %full-size;
    background: var(--bg-base);
  }
  &__header {
    height: 100%;
    @include mix.flex-box($jc: flex-start);
  }
  &-name {
    @include mix.position-style($p: relative, $z: base);
    height: 40px;
    @include mix.margin-d(l, xl);
    @extend %flex-center;
    @include mix.container-style($p: sm lg, $r: md, $bg: none);
    @include mix.font-style($s: xxl, $f: 'title');
    cursor: pointer;
    @include anim.transition($p: bg);
    @include hov.bg(var(--primary-base));
    &:hover {
      &>span {
        opacity: 0;
      }
      .home-icon {
        opacity: 1;
        transform: scale(1);
      }
    }
    &>span {
      display: inline-flex;
      overflow: hidden;
      @include anim.transition($p: opacity);
    }
  }
  &__nav {
    @extend %full-size;
    @include mix.position-style($p: absolute);
    @include mix.flex-box($w: nowrap);
    transform: translateZ(0);
    &-wrapper {
      height: 100%;
      @include mix.flex-box($w: nowrap, $g: sm);
      @include anim.transition;
      @include mix.response-down(sm){
        /* 最终状态：不可见且不占空间 */
        opacity: 0;
        visibility: hidden;
        width: 0;
        margin-top: 0; /* 移除外边距，防止影响布局 */
        transform: scale(0.2);
      }
    }
    &-item {
      @extend %hover-box;
      text-wrap: nowrap;
    }
  }
  &__dropdown {
    width: fit-content;
    @include mix.position-style($p: absolute, $z: base);
  }
  &__options {
    @include mix.position-style($p: relative, $z: base);
    width: fit-content;
    height: 100%;
    @include mix.flex-box($w: nowrap, $g: sm);
    @include mix.margin-d(r, xl);
    &-item {
      @extend %hover-box;
    }
  }
}
</style>