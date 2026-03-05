<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useThemeStore } from '@/stores/theme.store';
import { storeToRefs } from 'pinia';
import { useLangStore } from '@/stores/lang.store';
import type { RightBarThemeIcon } from '@/types/components/Base'

export interface RightBarField {
  id: string
  iconName: string
  action: (e?: MouseEvent) => void
}
import { message } from '@/plugins/message';
import { useNavigator } from '@/utils/navigator.util';

defineOptions({
  name: 'RightBar'
});

/** ---------- 状态管理 ---------- */
const themeStore = useThemeStore();
const { theme } = storeToRefs(themeStore);
const { toggleTheme } = themeStore;
const langStore = useLangStore();
const { toggleLang } = langStore;

const navigator = useNavigator();

const isExpanded = ref(false);
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};


/** ---------- 计算属性 ---------- */
const themeIcon = computed<RightBarThemeIcon>(() => {
  return theme.value === 'dark' ? 'moon-star' : 'sun';
});

/** ---------- 页面内容 ---------- */
const rightBarFields = computed<RightBarField[]>(() => [
  {
    id: 'home',
    iconName: 'home',
    action: () => {
      navigator.go('/')
    }
  },
  {
    id: 'lang',
    iconName: 'translate',
    action: () => {
      toggleLang();
    }
  },
  {
    id: 'theme',
    iconName: themeIcon.value,
    action: (e?: MouseEvent) => {
      // 触发旋转动画
      if (e) {
        const target = e.currentTarget as HTMLElement;
        const icon = target.querySelector('span');
        if (icon) {
          icon.classList.add('rotate-anim');
          setTimeout(() => {
            icon.classList.remove('rotate-anim');
          }, 500); // 对应 CSS 动画时长
        }
      }

      toggleTheme()
      message.show({
        type: 'info',
        title: '主题已切换',
        duration: 3000
      });
    }
  },
])
</script>

<template>
  <teleport to="body">
    <div class="right-bar">
      <div class="right-bar__container">
        <TransitionGroup 
          name="staggered-fade" 
          tag="div" 
          class="right-bar__content"
        >
          <div 
            v-if="isExpanded"
            class="right-bar-item" 
            v-for="(field, index) in rightBarFields" 
            :key="field.id"
            @click="field.action"
            :style="{ transitionDelay: `${index * 50}ms` }"
          >
            <span>
              <Icon :name="field.iconName"/>
            </span>
          </div>
        </TransitionGroup>
        
        <div 
          class="right-bar-item main-trigger" 
          :class="{ active: isExpanded }"
          @click="toggleExpand"
        >
          <span class="spin">
            <Icon name="setting"/>
          </span>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style lang="scss" scoped>
.spin {
  @include anim.spin();
}
.right-bar {
  @include mix.position-style($p: fixed, $b: xxl, $r: xxl, $z: 100);
  &__content {
    @include mix.position-style($p: absolute, $b: 100%, $l: 0);
    @include mix.flex-box($d: column-reverse, $g: xs);
    @include mix.margin-d(b, xs);
    width: 100%;
  }
  &__container {
    position: relative;
    @include mix.flex-box($d: column, $a: center);
  }
  &-item {
    @extend %flex-center;
    @include mix.container-style($r: 50%, $p: xs, $b: var(--border-base), $bg: var(--surface-base));
    @include anim.transition(bg transform border-color opacity);
    @include mix.size(rem(48), rem(48));
    cursor: pointer;
    @include hov.bg(var(--primary-base));
    @include hov.move;
    @include hov.border;
    &:hover {
      &>span {
        color: var(--white-base);
      }
    }
    &>span {
      @extend %full-size;
      @include mix.font-style($s: rem(24), $c: var(--text-subtle));
      @include mix.flex-box($j: center, $a: center);
      // 图标动画支持
      &.rotate-anim {
        animation: icon-rotate 0.5s cubic-bezier(0.2, 0.9, 0.3, 1.3);
      }
    }
    &.main-trigger {
      z-index: 2;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      &.active {
        transform: rotate(45deg);
        background: var(--surface-base);
        border-color: var(--primary-base);
        &>span {
          color: var(--primary-base);
        }
      }
    }
  }
}
@keyframes icon-rotate {
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.2); }
  100% { transform: rotate(360deg) scale(1); }
}

// 阶梯式动画效果
.staggered-fade-enter-active,
.staggered-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.staggered-fade-enter-from,
.staggered-fade-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.5);
}
.staggered-fade-leave-to {
  // 离开时不需要延迟，快速消失
  transition-delay: 0s !important;
}
</style>