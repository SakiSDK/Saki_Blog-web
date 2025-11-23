<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useThemeStore } from '@/stores/theme.store';
import { storeToRefs } from 'pinia';
import { useLangStore } from '@/stores/lang.store';
import type { RightBarField, RightBarThemeIcon } from '@/types/components/RightBar';

defineOptions({
  name: 'RightBar'
});

/** ---------- 状态管理 ---------- */
const themeStore = useThemeStore();
const { theme } = storeToRefs(themeStore);
const { toggleTheme } = themeStore;
const langStore = useLangStore();
const { toggleLang } = langStore;


/** ---------- 计算属性 ---------- */
const themeIcon = computed<RightBarThemeIcon>(() => {
  return theme.value === 'dark' ? 'moon-star' : 'sun';
});

/** ---------- 页面内容 ---------- */
const rightBarFields = ref<RightBarField[]>([
  {
    iconName: 'translate',
    action: () => {
      toggleLang();
    }
  },
  {
    iconName: themeIcon.value,
    action: () => {
      toggleTheme()
    }
  },
])
</script>

<template>
  <teleport to="body">
    <div class="right-bar">
      <div class="right-bar__container">
        <div class="right-bar__content">
          <div 
            class="right-bar-item" 
            v-for="field,index in rightBarFields" 
            :key="index"
            @click="field.action"
          >
            <span>
              <Icon :name="field.iconName"/>
            </span>
          </div>
        </div>
        <div class="right-bar-item">
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
  @include mix.position-style($p: absolute, $b: 20px, $r: 20px);
  &__content {
    @include mix.flex-box($d: column, $g: xs);
    @include mix.margin-y(xs);
  }
  &-item {
    @extend %flex-center;
    @include mix.size(25px);
    @include mix.container-style($r: sm, $p: 0, $b: var(--border-base));
    @include anim.transition;
    @include hov.bg(var(--primary-base));
    @include hov.move;
    &:hover {
      &>span {
        color: var(--white-base);
      }
    }
    &>span {
      color: var(--text-subtle);
    }
  }
}

</style>