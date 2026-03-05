<script lang="ts" setup>
import type { Photo } from '@/schemas/album.schema';
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import { onClickOutside, useVModel, onKeyStroke, useThrottleFn, useIntervalFn, useEventListener } from '@vueuse/core';
import { useAlbumStore } from '@/stores/album.store';




const props = defineProps<{
  visible: boolean;
  photo: Photo | null;
  fromRect: DOMRect | null;
}>();
const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
}>();
// 双向数据绑定
const visible = useVModel(props, 'visible', emit);


const style = ref<any>({});
const isAnimating = ref(false);
const containerRef = ref<HTMLElement | null>(null);
const photoRef = ref<HTMLImageElement | null>(null);



// 点击图片容器外关闭预览
onClickOutside(photoRef, () => {
  if (visible.value) {
    close();
  }
});

const close = () => {
  if (scale.value !== 1 || translateX.value !== 0 || translateY.value !== 0) {
    // 1. 先复原图片状态
    isResetting.value = true;
    scale.value = 1;
    translateX.value = 0;
    translateY.value = 0;
    
    // 2. 等待复原动画完成后再关闭容器
    setTimeout(() => {
      visible.value = false;
      isResetting.value = false;
    }, 400);
  } else {
    visible.value = false;
  }
};

// 计算目标样式
const getTargetStyle = (rect: DOMRect) => {
  const viewportW = window.innerWidth;
  const viewportH = window.innerHeight;
  const margin = 40; // 边距
  // 计算原图宽高比
  const ratio = rect.width / rect.height;
  // 计算在最大限制下的目标尺寸
  const maxW = viewportW - margin * 2;
  const maxH = viewportH - margin * 2;
  let targetW = maxW;
  let targetH = targetW / ratio;
  if (targetH > maxH) {
    targetH = maxH;
    targetW = targetH * ratio;
  }
  // 计算居中位置
  const targetTop = (viewportH - targetH) / 2;
  const targetLeft = (viewportW - targetW) / 2;
  return {
    top: `${targetTop}px`,
    left: `${targetLeft}px`,
    width: `${targetW}px`,
    height: `${targetH}px`
  };
};

// 窗口大小改变时更新位置
const updatePosition = () => {
  if (!visible.value || isAnimating.value || !props.fromRect || !containerRef.value) return;
  
  const styles = getTargetStyle(props.fromRect);
  const el = containerRef.value;
  
  // resize 时禁用过渡以保持跟手，或者使用极短过渡
  setStyles(el, {
    transition: 'none',
    ...styles
  });
};

/**
 * 辅助函数：批量设置样式
 */
const setStyles = (el: HTMLElement, styles: Partial<Record<keyof CSSStyleDeclaration, string>>) => {
  Object.assign(el.style, styles);
};

/**
 * 核心动画逻辑：基于绝对定位的 FLIP 模拟
 * 使用 position: fixed 和像素级计算，避免 transform scale 导致的模糊和布局问题
 */
const beforeEnter = (el: Element) => {
  if (!props.fromRect) return;
  isAnimating.value = true;
  
  const element = el as HTMLElement;
  const rect = props.fromRect;
  
  // 1. 初始状态：完全重叠在原图位置
  setStyles(element, {
    position: 'fixed',
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    borderRadius: '12px',
    transition: 'none',
    opacity: '1'
  });
};

const enter = (el: Element, done: () => void) => {
  const element = el as HTMLElement;
  containerRef.value = element; // 确保引用同步
  
  // 2. 计算目标状态
  // 强制重绘
  element.getBoundingClientRect();

  if (!props.fromRect) {
    done();
    return;
  }
  
  const styles = getTargetStyle(props.fromRect);
  
  // 3. 应用过渡到目标状态
  setStyles(element, {
    transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
    borderRadius: '4px',
    ...styles
  });
  
  setTimeout(() => {
    isAnimating.value = false;
    done();
  }, 500);
};

const leave = (el: Element, done: () => void) => {
  if (!props.fromRect) {
    done();
    return;
  }
  isAnimating.value = true;
  const element = el as HTMLElement;
  const rect = props.fromRect;
  
  // 4. 离开时：过渡回初始位置
  setStyles(element, {
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    borderRadius: '12px',
    opacity: '0.5'
  });

  setTimeout(() => {
    isAnimating.value = false;
    done();
  }, 400);
};


/** ---------- 状态管理 ---------- */
/** 相册状态 */
const albumStore = useAlbumStore();


/** ---------- 按键绑定 ---------- */
/** 绑定 Escape 键关闭预览 */
onKeyStroke('Escape', (e) => {
  if (visible.value) {
    e.preventDefault();
    close();
  }
});

// 切换动画方向
const slideDirection = ref<'left' | 'right' | 'none'>('none');

const handlePrev = () => {
  slideDirection.value = 'right';
  albumStore.prevPhoto();
  if (isPlaying.value) {
    pause();
    resume();
  }
};
const handleNext = () => {
  slideDirection.value = 'left';
  albumStore.nextPhoto();
  if (isPlaying.value) {
    pause();
    resume();
  }
};
const throttledNext = useThrottleFn(() => {
  handleNext()
}, 600)
const throttledPrev = useThrottleFn(() => {
  handlePrev()
}, 600)

/** ---------- 幻灯片播放逻辑 ---------- */
const { pause, resume, isActive: isPlaying } = useIntervalFn(() => {
  throttledNext();
}, 3000, { immediate: false });

/** ---------- 缩放逻辑 ---------- */
const scale = ref(1);
const translateX = ref(0);
const translateY = ref(0);

const zoomIn = () => {
  const newScale = Math.min(scale.value + 0.25, 5);
  if (newScale === scale.value) return;
  // 键盘缩放保持基于中心
  const ratio = newScale / scale.value;
  translateX.value *= ratio;
  translateY.value *= ratio;
  scale.value = newScale;
};

const zoomOut = () => {
  const newScale = Math.max(scale.value - 0.25, 0.5);
  if (newScale === scale.value) return;
  const ratio = newScale / scale.value;
  translateX.value *= ratio;
  translateY.value *= ratio;
  scale.value = newScale;
};

const handleWheel = (e: WheelEvent) => {
  e.preventDefault(); // 防止页面滚动
  const delta = e.deltaY < 0 ? 0.25 : -0.25;
  const newScale = Math.min(Math.max(scale.value + delta, 0.5), 5);
  if (newScale === scale.value) return;

  const ratio = newScale / scale.value;
  
  // 计算鼠标相对于屏幕中心的偏移量
  const mouseX = e.clientX - window.innerWidth / 2;
  const mouseY = e.clientY - window.innerHeight / 2;

  // 更新位移，使鼠标下的点保持不动
  translateX.value = mouseX - (mouseX - translateX.value) * ratio;
  translateY.value = mouseY - (mouseY - translateY.value) * ratio;
  
  scale.value = newScale;
};

/** ---------- 拖拽平移逻辑 ---------- */
const isDragging = ref(false);
const isClosing = ref(false);
const isResetting = ref(false);
const startX = ref(0);
const startY = ref(0);
const lastTranslateX = ref(0);
const lastTranslateY = ref(0);

const handleMouseDown = (e: MouseEvent) => {
  if (scale.value <= 1) return; // 只有放大时才允许拖拽
  isDragging.value = true;
  startX.value = e.clientX;
  startY.value = e.clientY;
  lastTranslateX.value = translateX.value;
  lastTranslateY.value = translateY.value;
  e.preventDefault(); // 防止默认拖拽行为
};

const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value) return;
  const deltaX = e.clientX - startX.value;
  const deltaY = e.clientY - startY.value;
  translateX.value = lastTranslateX.value + deltaX;
  translateY.value = lastTranslateY.value + deltaY;
};

const handleMouseUp = () => {
  isDragging.value = false;
};

// 监听图片变化重置缩放和位置
watch(() => props.photo, () => {
  scale.value = 1;
  translateX.value = 0;
  translateY.value = 0;
});

const togglePlay = () => {
  if (isPlaying.value) {
    pause();
  } else {
    // 立即切换一张，然后开始定时
    throttledNext();
    resume();
  }
};

/** 按键说明内容 */
const descriptionFields = computed(() => [
  { key: ['←', '↑', 'W', 'A'], desc: '上一张' },
  { key: ['→', '↓', 'S', 'D'], desc: '下一张' },
  { key: ['+', '-'], desc: '缩放' },
  { key: 'Space', desc: isPlaying.value ? '暂停播放' : '幻灯片' },
  {key: 'Shift', desc: '长按隐藏'},
  { key: 'Esc', desc: '关闭' },
]);

/** 绑定 + 和 - 缩放 */
onKeyStroke(['=', '+'], (e) => {
  if (!visible.value) return;
  e.preventDefault();
  zoomIn();
});
onKeyStroke('-', (e) => {
  if (!visible.value) return;
  e.preventDefault();
  zoomOut();
});
/** 绑定 ↑ 和 W 查看上两张图片 */
onKeyStroke(['ArrowUp', 'w'], (e) => {
  if (!visible.value) return;
  if (e.repeat) return 
  e.preventDefault();
  throttledPrev();
});
/** 绑定 ↓ 和 S 查看下两张图片 */
onKeyStroke(['ArrowDown', 's'], (e) => {
  if (!visible.value) return;
  if (e.repeat) return 
  e.preventDefault();
  throttledNext();
});
/** 绑定 ← 和 A 查看上一张图片 */
onKeyStroke(['ArrowLeft', 'a'], (e) => {
  if (!visible.value) return;
  if (e.repeat) return 
  e.preventDefault();
  throttledPrev();
});
/** 绑定 → 和 D 查看下一张图片 */
onKeyStroke(['ArrowRight', 'd'], (e) => {
  if (!visible.value) return;
  if (e.repeat) return 
  e.preventDefault();
  throttledNext();
});
/** 绑定 Space 播放/暂停 */
onKeyStroke(' ', (e) => {
  if (!visible.value) return;
  e.preventDefault();
  togglePlay();
});
/** 长按 Shift 隐藏按键说明说明 */
const isHolding = ref<boolean>(false);
const isUiHidden = ref<boolean>(false);
let timer: number | null = null;
onKeyStroke('Shift', (e) => {
  if (!visible.value) return;
  if (e.repeat) return 

  isHolding.value = true

  timer = window.setTimeout(() => {
    isUiHidden.value = true;
  }, 600) // 600ms 视为长按
})
useEventListener(window, 'keyup', (e) => {
  if (e.key === 'Shift') {
    isHolding.value = false
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    isUiHidden.value = false;
  }
})

// 监听 visible 变化
watch(visible, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden';
    isClosing.value = false;
  } else {
    document.body.style.overflow = '';
    isClosing.value = true;
    pause(); // 关闭时停止播放
    // 重置缩放和位置
    scale.value = 1;
    translateX.value = 0;
    translateY.value = 0;
  }
});

onMounted(() => {
  window.addEventListener('resize', updatePosition);
});

onUnmounted(() => {
  window.removeEventListener('resize', updatePosition);
  document.body.style.overflow = '';
});
</script>

<template>
  <Teleport to="body">
    <!-- 背景遮罩 -->
    <Transition name="fade">
      <div 
        v-if="visible" 
        class="photo-preview-mask"
      ></div>
    </Transition>

    <!-- 图片容器 -->
    <Transition
      @before-enter="beforeEnter"
      @enter="enter"
      @leave="leave"
      :css="false"
    >
      <div
        v-if="visible && photo"
        ref="containerRef"
        class="photo-preview-container"
        :style="style"
      >
        <Transition 
          :name="slideDirection === 'left' ? 'slide-left' : (slideDirection === 'right' ? 'slide-right' : 'fade')" 
          mode="out-in"
        >
          <div 
            class="photo-preview-image-wrapper"
            :key="photo.originalUrl"
          >
            <img
              ref="photoRef"
              :src="photo.originalUrl || photo.thumbnailUrl || ''"
              class="photo-preview-image"
              draggable="false"
              :style="{ 
                transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`, 
                cursor: scale > 1 ? 'grab' : 'zoom-in',
                transition: (isClosing || isResetting) ? 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)' : 'transform 0.1s ease-out'
              }"
              @wheel.prevent="handleWheel"
              @mousedown="handleMouseDown"
              @mousemove="handleMouseMove"
              @mouseup="handleMouseUp"
              @mouseleave="handleMouseUp"
            >
          </div>
        </Transition>
        <slot></slot>
        <div class="photo-preview-keyboard-description" :class="{ 'is-hidden': isUiHidden }">
          <div class="key-group" v-for="group, index in descriptionFields" :key="index">
            <template v-if="Array.isArray(group.key)">
              <span class="key" v-for="k in group.key" :key="index"> {{ k }} </span>
            </template>
            <span class="key" v-else>{{ group.key }}</span>
            <span class="desc">{{ group.desc }}</span>
          </div>
        </div>
      </div>
    </Transition>
    <div class="photo-preview-prev">

    </div>
    <div class="photo-preview-next">

    </div>
    <div class="photo-preview-nav">

    </div>
    <!-- 图片位置进度条 -->
    <div v-if="visible" class="photo-preview-progress" :class="{ 'is-hidden': isUiHidden }">
      <div 
        class="bar" 
        :style="{ width: `${((albumStore.currentPhotoIndex + 1) / albumStore.photoList.length) * 100}%` }"
      ></div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.photo-preview {
  &-image {
    display: block;
    @extend %full-size;
    object-fit: contain;
    user-select: none;
    // transition: transform 0.1s ease-out; // 移除静态 transition，改由 style 动态控制
    
    // 拖拽时取消过渡，避免延迟感
    &:active {
      transition: none !important;
      cursor: grabbing !important;
    }
  }
  &-image-wrapper {
    @extend %full-size;
    @include mix.flex-box($a: center, $j: center);
    // overflow: hidden; // 移除此行允许图片溢出
  }
  &-container {
    @include mix.position-style($p: relative, $z: modal);
    // 位置属性由JS控制
  }
  &-mask {
    @extend %full-screen;
    @include mix.position-style($p: fixed, $t: 0, $l: 0, $z: modal-backdrop);
    background-color: var(--bg-subtle);
    backdrop-filter: blur(rem(10));
    cursor: zoom-out;
  }
  &-keyboard-description {
    @include mix.position-style($p: fixed, $t: 20px, $l: 20px, $z: modal-backdrop);
    @include mix.flex-box($d: column, $a: flex-start, $j: center, $g: sm);
    @include mix.container-style($p: md, $bg: var(--bg-subtle), $r: lg);
    @include mix.font-style($c: var(--text-base));
    backdrop-filter: blur(rem(8));
    pointer-events: none;
    opacity: 0;
    transform: scale(0.9);
    @include anim.transition($p: transform opacity, $dr: slow);
    &.is-hidden {
      opacity: 0 !important;
      transform: scale(0.9);
    }
    // 当容器可见时显示
    .photo-preview-container:hover & {
      opacity: 1;
      transform: scale(1);
    }
    .key-group {
      width: 100%;
      @include mix.flex-box($a: center, $g: xs);
      .key {
        @include mix.inline-flex-box($a: center, $j: center);
        min-width: rem(24);
        height: rem(24);
        @include mix.container-style(
          $p: 0 xs, 
          $r: sm,
          $bg: var(--white-ghost),
          $b: 1px solid var(--border-base-color),
          $s: 0 2px 0 var(--black-transparent)
        );
        @include mix.font-style($s: sm, $f: inherit, $l: 1);
        &:last-child {
          @include mix.margin-d(r, sm);
        }
      }
      .desc {
        @include mix.font-style($s: sm);
        opacity: 0.9;
        margin-left: auto; // 将文字推到右侧 
      }
    }
  }
  &-progress {
    @include mix.position-style($p: fixed, $b: 0, $l: 0, $r: 0, $z: modal-backdrop);
    height: rem(4);
    transition: opacity 0.3s ease;
    &.is-hidden {
      opacity: 0;
    }
    .bar {
      height: 100%;
      background: var(--primary-base);
      transition: width 0.3s ease;
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// 切换动画
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>