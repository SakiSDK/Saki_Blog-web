<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue';
import { useWindowSize, onClickOutside } from '@vueuse/core';
import { useRouter } from 'vue-router';
import { createI18nUtil } from '@/utils/i18n.util';
import { message } from '@/plugins/message';
import { useThemeStore } from '@/stores/theme.store';


interface MenuItem {
  type?: 'divider';
  label?: string;
  icon?: string;
  action?: () => void;
  active?: boolean | (() => boolean);
}

/** ---------- 状态管理 ---------- */
// 国际化
const { t } = createI18nUtil();
const visible = ref(false);
const x = ref(0);
const y = ref(0);
const menuRef = ref<HTMLElement | null>(null);
const { width: windowWidth, height: windowHeight } = useWindowSize();
const router = useRouter();
/** 主题状态 */
const themeStore = useThemeStore();


/** ---------- 页面内容 ---------- */
/** header内容 */
const headerItems = computed<MenuItem[]>(() => [
  /** 页面返回 */
  { 
    icon: 'chevron-left', 
    active: window.history.length > 1,
    action: handlePageBack, 
  },
  /** 页面前进 */
  { 
    icon: 'chevron-right', 
    active: window.history.length > 1,
    action: handlePageForward, 
  },
  /** 页面刷新 */
  { 
    icon: 'refresh', 
    active: true,
    action: handlePageRefresh, 
  },
  /** 回到顶部 */
  { 
    icon: 'chevron-up', 
    action: handleScrollToTop, 
    active: window.scrollY > 100 
  },
])
/** body内容 */
const bodyItems = computed<MenuItem[]>(() => [
  /** 文章分类 */
  { 
    label: t('common.category') || '分类', 
    icon: 'category', 
    action: () => router.push('/article/category'), 
    active: true 
  },
  /** 文章标签 */
  { 
    label: t('common.tag') || '标签', 
    icon: 'tag', 
    action: () => router.push('/article/tag'), 
    active: true 
  },
  /** 博客相册 */
  { 
    label: t('common.column') || '相册', 
    icon: 'image', 
    action: () => router.push('/column'), 
    active: true 
  },
])
/** footer内容 */
const footerItems = computed<MenuItem[]>(() => [
  /** 复制地址 */
  {
    label: t('common.copyLink') || '复制链接', 
    icon: 'link', 
    action: handleCopyLink,
    active: true
  },
  /** 主题切换 */
  { 
    label: t('common.theme') || '主题', 
    icon: 'theme', 
    action: handleThemeChange,
    active: true
  },
])


/** ---------- 页面逻辑 ---------- */
/** 页面返回逻辑 */
function handlePageBack() {
  if (window.history.length > 1) {
    router.back();
  }
}

/** 页面前进逻辑 */
function handlePageForward() {
  if (window.history.length > 1) {
    router.forward();
  }
}

/** 页面刷新逻辑 */
function handlePageRefresh() {
  window.location.reload();
}

/** 回到顶部逻辑 */
function handleScrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/** 主题切换逻辑 */
function handleThemeChange() {
  // 切换主题逻辑
  themeStore.toggleTheme();
}

/** 复制链接逻辑 */
async function handleCopyLink() {
  try {
    await navigator.clipboard.writeText(window.location.href);
    message.success(t('common.copyLinkSuccess') || '复制链接成功');
  } catch (error) {
    console.error('Failed to copy link:', error);
    message.error(t('common.copyLinkFailed') || '复制链接失败');
  }
}



/** 
 * 处理右键菜单
 * @param e 事件对象
 */
async function handleContextMenu(e: MouseEvent) {
  // Check if target is inside an input or textarea, if so, use default menu
  const target = e.target as HTMLElement;
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
    return;
  }
  e.preventDefault();
  // First set to mouse position to avoid jump
  x.value = e.clientX;
  y.value = e.clientY;
  visible.value = true;
  await nextTick();
  if (menuRef.value) {
    let left = e.clientX;
    let top = e.clientY;
    const { offsetWidth, offsetHeight } = menuRef.value;
    // Adjust horizontal position
    if (left + offsetWidth > windowWidth.value) {
      left -= offsetWidth;
    }
    // Adjust vertical position
    if (top + offsetHeight > windowHeight.value) {
      top -= offsetHeight;
    }
    x.value = left;
    y.value = top;
  }
};

/** 关闭菜单逻辑 */
const closeMenu = () => {
  visible.value = false;
};

/** 触发逻辑 */
const handleAction = (item: MenuItem) => {
  if (item.action) {
    item.action();
  }
  closeMenu();
};


onClickOutside(menuRef, closeMenu);
onMounted(() => {
  window.addEventListener('contextmenu', handleContextMenu);
  window.addEventListener('scroll', closeMenu);
  window.addEventListener('resize', closeMenu);
  window.addEventListener('click', closeMenu);
});

onUnmounted(() => {
  window.removeEventListener('contextmenu', handleContextMenu);
  window.removeEventListener('scroll', closeMenu);
  window.removeEventListener('resize', closeMenu);
  window.removeEventListener('click', closeMenu);
});

const style = computed(() => ({
  left: `${x.value}px`,
  top: `${y.value}px`
}));
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div 
        v-if="visible" 
        ref="menuRef" 
        class="context-menu" 
        :style="style"
      >
        <div class="context-menu__container">
          <div class="context-menu__header">
            <span 
              v-for="item, index in headerItems" 
              :key="index"
            >
              <span 
                class="item-icon" 
                :class="{'inactive': !item.active}"
                @click="item.action"
              >
                <Icon :name="item.icon"/>
              </span>
            </span>
          </div>
          <div class="context-menu__body">
            <span 
              class="item" 
              v-for="item, index in bodyItems" 
              :key="index" 
              :class="{'inactive': !item.active}"
              @click="item.action"
            >
              <div class="item-box">
                <Icon :name="item.icon"/>
                <span class="item-text">{{ item.label }}</span>
              </div>
            </span>
          </div>
          <div class="context-menu__footer">
            <span 
              class="item" 
              v-for="item, index in footerItems" 
              :key="index"
              :class="{'inactive': !item.active}"
              @click="item.action"
            >
              <div class="item-box">
                <Icon :name="item.icon"/>
                <span class="item-text">{{ item.label }}</span>
              </div>
            </span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.inactive {
  // 禁用状态：降低透明度并禁用鼠标事件
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}
.item {
  width: 100%;
  @include mix.padding(sm);
  @include mix.radius(md);
  @include mix.inline-flex-box(flex-start, center);
  @include hov.bg(var(--primary-subtle));
  @include anim.transition($p: bg);
  cursor: pointer;
  &:hover {
    .item-box {
      transform: translateX(4px);
    }
  }
  &-box {
    @include anim.transition($p: transform);
  }
  &-text {
    @include mix.margin-d(l, sm);
  }
  &-icon {
    display: inline-block;
    cursor: pointer;
    @include mix.padding(sm);
    @include mix.radius(md);
    @include hov.bg(var(--primary-subtle));
    @include anim.transition($p: bg);
  }
}

.context-menu {
  @include mix.position-style($p: fixed, $z: 9999);
  @include mix.container-style($p: xs, $bg: var(--surface-subtle), $b: 1px solid var(--border-base-color), $o: hidden);
  backdrop-filter: blur(10px);
  &__container {
  }
  &__header,
  &__body,
  &__footer {
    @include mix.padding(sm xs);
    @include mix.font-style($c: var(--text-subtle));
    border-bottom: 1px dashed var(--border-base-color);
  }
  &__header {
    @include mix.padding(xs xs);
    @include mix.flex-box($g: xxs);
    @include mix.font-style($s: xl);
  }
  &__body,
  &__footer {
    @include mix.flex-box($d: column, $a: flex-start, $g: sm);
    @include mix.font-style($s: md);
  }
  &__footer {
    border: none;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.2, 0, 0.2, 1);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-5px);
}
</style>