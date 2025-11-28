<script lang="ts" setup>
import { createI18nUtil } from '@/utils/i18n.util';
import { onBeforeUnmount, ref } from 'vue';
import AvatarImg from '@/assets/imgs/avatar.webp'

interface NavItemBase {
  title: string;
  link: string;
}
interface NavItemWithDropdown extends NavItemBase {
  dropdowns?: Array<{
    name: string;
    icon: string;
    link: string;
  }>;
}
type NavField = NavItemWithDropdown;

defineOptions({
  name: 'TopBar',
});


/** ---------- 页面文案数据 ---------- */
const { t, tObj } = createI18nUtil();
const navigationData = tObj<{
  order: string[],
  items: Record<string, any>,
}>('topbar.navigation');

// 修改 navFields 的声明如下：
const navFields = navigationData.order.map(itemKey => {
  const item = navigationData.items[itemKey];
  const baseItem: NavItemBase = {
    title: item.title,
    link: item.link || '',
  };

  if (item.dropdown) {
    const dropdownItems = item.dropdown.order.map((dropdownKey: string | number) => {
      const dropdownItem = item.dropdown.items[dropdownKey];
      return {
        name: dropdownItem.name,
        icon: dropdownItem.icon,
        link: dropdownItem.link
      };
    });
    return {
      ...baseItem,
      dropdowns: dropdownItems,
    } as NavItemWithDropdown;
  }

  return baseItem;
}) as NavField[];

const optionData = tObj<{
  order: string[],
  items: Record<string, any>
}>('topbar.option');
const optionFields = optionData.order.map(itemKey => {
  const item = optionData.items[itemKey];
  return {
    tip: item.tip,
    icon: item.icon,
    link: item.link
  };
}) as Array<{
  tip: string;
  icon: string;
  link: string;
}>;

// --- 下拉框逻辑修改为 Hover ---

// 用于存储定时器 ID，方便清除
let hoverTimer: number | null = null;
const currentIndex = ref(-1);

/**
 * 鼠标移入时处理
 * @param index navFields 中的索引
 */
const handleMouseEnter = (index: number) => {
  if(hoverTimer) {
    clearTimeout(hoverTimer);
  }
  if (currentIndex.value !== index) {
    currentIndex.value = index;
  }
};

/**
 * 鼠标移出时处理
 * @param index navFields 中的索引
 */
const handleMouseLeave = () => {
  if(hoverTimer) {
    clearTimeout(hoverTimer);
  }
  hoverTimer = setTimeout(() => {
    currentIndex.value = -1;
  }, 150);
};

// 组件销毁前，清理定时器，防止内存泄漏
onBeforeUnmount(() => {
  if (hoverTimer) {
    clearTimeout(hoverTimer);
  }
});

</script>

<template>
  <div class="topbar">
    <div class="topbar__container">
      <!-- <div class="mask"></div> -->
      <div class="topbar__header">
        <div
          class="topbar-name"
          to="/"
        >
          <span>
            {{ t('topbar.siteName') }}
          </span>
          <div class="home-icon">
            <Icon name="home" />
          </div>
        </div>
      </div>
      <div class="nav">
        <div class="nav-wrapper">
          <div 
            class="nav-item" 
            v-for="(field, index) in navFields"
            :key="index"
            @mouseenter="handleMouseEnter(index)"
            @mouseleave="handleMouseLeave()"
          >

            <div class="nav-item__wrapper">
              {{field.title }}
            </div>
            <Transition 
              name="zoom-in"
              :duration="300"
            >
              <div class="dropdown" 
                v-if="field.dropdowns && index === currentIndex"
              >
                <div class="dropdown__wrapper">
                  <div 
                    class="dropdown-item"
                    v-for="item in field.dropdowns"
                    :key="item.name"
                    :to="item.link"
                    @mouseenter="handleMouseEnter(index)"
                    @mouseleave="handleMouseLeave()"
                  >
                    <span class="dropdown-item-icon">
                      <Icon :name="item.icon" />
                    </span>
                    <span class="dropdown-item-text">
                      {{item.name}}
                    </span>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
      <div class="options">
        <div 
          class="options-item" 
          v-for="field,index in optionFields"
          :key="index"
          :to="field.link"
          v-tippy="{
              content: field.tip,
              theme: 'link',
          }"  
        >
          <Icon :name="field.icon" />
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
}
.home-icon {
  @include mix.position-style($p: absolute);
  opacity: 0;
  transform: scale(0.4);
  @include anim.transition($p: opacity transform);
  color: var(--white-base);
}
.nav {
  @extend %full-size;
  @include mix.position-style($p: absolute);
  @include mix.flex-box($w: nowrap);
  transform: translateZ(0);
  &-wrapper {
    height: 100%;
    @include mix.flex-box($w: nowrap, $g: sm);
    @include anim.transition;
    @include mix.respond-down(xs){
      /* 最终状态：不可见且不占空间 */
      opacity: 0;
      visibility: hidden;
      width: 0;
      margin-top: 0; /* 移除外边距，防止影响布局 */
      transform: scale(0.2);
    }
  }
  &-item {
    position: relative;
    &__wrapper {
      overflow: hidden;
      @extend %hover-box;
      text-wrap: nowrap;
    }
  }
}
.mask {
  @extend %full-size;
  @include mix.position-style($p: absolute, $t: 0, $l: 0);
  border-bottom: var(--border-base);
}
.dropdown {
  @include mix.flex-box;
  @include mix.position-style($p: absolute, $t: 55px, $l: 50%, $z: base);
  transform-origin: left top; 
  &__wrapper {
    @include mix.flex-box($g: md);
    @include mix.container-style($p: sm lg, $r: xxxl, $b: var(--border-base));
    border-color: var(--primary-base);
    transform: translateX(-50%);
  }
  &-item {
    text-wrap: nowrap;
    @extend %hover-box;
    @include mix.flex-box;
    &-icon {
      @include mix.margin-d(r, xs);
      @include mix.font-size(xl);
    }
  }
}
.options {
  @include mix.position-style($p: relative, $z: base);
  width: fit-content;
  height: 100%;
  @include mix.flex-box($w: nowrap, $g: sm);
  @include mix.margin-d(r, xl);
  &-item {
    @extend %hover-box;
    @include mix.flex-box;
    @include mix.font-size(xl);
  }
}
.topbar {
  @include mix.position-style($p: fixed, $t:0, $r:0, $z: fixed);
  @include mix.size(100%, 60px);
  &__container {
    position: relative;
    @include mix.flex-box($j: space-between, $a: stretch, $w: nowrap);
    @extend %full-size;
    // background: var(--bg-base);
  }
  &__header {
    height: 100%;
    @include mix.flex-box($j: flex-start);
  }
  &-name {
    @include mix.position-style($p: relative, $z: base);
    height: 40px;
    @include mix.margin-d(l, xl);
    @extend %flex-center;
    @include mix.font-style($s: xxl, $f: 'title');
    cursor: pointer;
    @extend %hover-box;
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
}
</style>