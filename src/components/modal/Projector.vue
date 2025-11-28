<script lang="ts" setup>
import { ref, reactive, onMounted, watch, computed, nextTick } from 'vue';
import {
  onClickOutside, useToggle, useVModel, useEventListener,
  useElementBounding, whenever, useScroll, onKeyStroke,
  useMediaQuery, useFullscreen, useIntervalFn, usePointer,

} from '@vueuse/core'
import { usePhotoStore } from '@/stores/usePhotoStore';


/** ---------- 类型定义 ---------- */
interface Photo {
  id: number | string
  imagePath: string
  title?: string
  description?: string
}

interface ProjectorProps {
  type: 'album' | 'post'
  isShowProjector: boolean
  photos?: Photo[]
  imgUrls?: string[]
  currentPhoto?: Photo
  currentIndex?: number
}

interface NavButtonField {
  type: string
  iconName: string | ReturnType<typeof computed> | any
  tipContent: string
  action: () => void
}

interface AsideButtonField {
  iconName: string
  tipContent: string
  action: () => void
}

/** ---------- 状态管理 ---------- */
const { prevPhoto, nextPhoto } = usePhotoStore();


/** ---------- Props & Emits ---------- */
const props = defineProps<ProjectorProps>()
const emits = defineEmits<{
  (e: 'update:isShowProjector', value: boolean): void
  (e: 'update:currentPhoto', value: Photo): void
  (e: 'update:currentIndex', value: boolean): void
}>()


/** ---------- 使用 useVModel实现双向数据绑定 ---------- */
const isShowProjector = useVModel(props, 'isShowProjector', emits)
const currentPhoto = useVModel(props, 'currentPhoto', emits)
const currentIndex = useVModel(props, 'currentIndex', emits)


/** ---------- transition动画逻辑 ---------- */
const transitionAnimeName = ref<string>('fade-slide-left')


/** ---------- HTML元素绑定 ---------- */
const photoRef = ref<HTMLImageElement | null>(null)
const photoContainerRef = ref<HTMLDivElement | null>(null)
const navRef = ref<HTMLDivElement | null>(null)
const photoRefs = ref<HTMLImageElement[]>([])
const asideRef = ref<HTMLDivElement | null>(null)
const selectRef = ref<HTMLDivElement | null>(null)


/** ---------- 使用useToggle方法，创建变量和对应方法 ---------- */
const [isShowGrid, toggleGrid] = useToggle(false);
const [isClickOutsidePhoto, toggleClickOutsidePhoto] = useToggle(false);
const [isClickOutsideNav, toggleClickOutsideNav] = useToggle(false);
const [isClickOutList, toggleClickOutsideList] = useToggle(false);
const [cursor, toggleCursor] = useToggle('zoom-in', {
  truthyValue: 'zoom-in',
  falsyValue: 'grab',
})
// 切换自动放映图标
const [playIcon, togglePlayIcon] = useToggle('play', {
  truthyValue: 'play',
  falsyValue: 'pause',
});
//媒体查询判断是不是移动端
const isMobile = useMediaQuery('(max-width: 768px)');

/** ---------- computed相关 ---------- */
// 根据isShowGrid,isClickOutSidePhoto,isClickOutSideNav,isClickOutSideList变量，改变isShowProjector变量
const isVisible = computed(
  () => isClickOutsidePhoto.value && isClickOutsideNav.value && (isClickOutList.value || !isShowGrid.value)
)
// 根据 currentPhoto 计算当前索引
const currentPhotoIndex = computed(() => {
  if (props.photos && props.photos.length > 0) {
    return props.photos.findIndex(p => p.id === currentPhoto.value?.id)
  }
  return currentIndex.value;
})
// 获取图片数量
const photoCount = computed(() => {
  if (props.photos && props.photos.length > 0) {
    return props.photos.length;
  }
  return props.imgUrls.length;
});
// 当前图片页码
const currentPhotoPage = computed(() => currentPhotoIndex.value + 1);


/** ---------- watch监听 ---------- */
whenever(isVisible, () => {
  isShowProjector.value = false;
})
whenever(isShowGrid, () => {
  setPhotoSelectPosition()
})
watch(() => currentPhotoIndex.value, () => {
  setPhotoSelectPosition()
})
watch(() => isVisible.value, (val) => {
  console.log(val)
})
const { pause: pauseProject, resume: resumeProject } = useIntervalFn(() => {
  nextPhoto()
}, 3000, {
  immediate: false
})
watch(playIcon, (val) => {
  if (val === 'pause') {
    resumeProject()
  } else {
    pauseProject()
  }
})


/** ---------- 底部动画导航栏逻辑 ---------- */
const handlePrevPhoto = () => {
  transitionAnimeName.value = 'fade-slide-right'
  if (props.type === 'album') {
    prevPhoto()
  } else {
    if (currentIndex.value === -1) {
      return
    }
    //如果是第一张循环到最后一张
    const prevIndex = (currentIndex.value - 1 + props.imgUrls.length) % props.imgUrls.length;
    currentIndex.value = prevIndex;
  }
}
const handleNextPhoto = () => {
  transitionAnimeName.value = 'fade-slide-left'
  if (props.type === 'album') {
    nextPhoto()
  } else {
    if (currentIndex.value === -1) {
      return
    }
    //如果是最后一张循环到第一张
    const nextIndex = (currentIndex.value + 1) % props.imgUrls.length;
    currentIndex.value = nextIndex;
  }
}
// 图片全屏方法
const { toggle: toggleFullImg } = useFullscreen(photoRef)
const navButtonFields = reactive<NavButtonField[]>([
  {
    type: 'previous',
    iconName: 'chevron-left',
    tipContent: '上一张',
    action: handlePrevPhoto,
  },
  {
    type: 'play',
    iconName: computed(() => playIcon.value),
    tipContent: '开始放映',
    action: () => {
      transitionAnimeName.value = 'fade-slide-left'
      togglePlayIcon()
    }
  },
  {
    type: 'next',
    iconName: 'chevron-right',
    tipContent: '下一张',
    action: handleNextPhoto
  }
])
const asideButtonFields = ref<AsideButtonField[]>([
  {
    iconName: 'fullscreen',
    tipContent: '全屏',
    action: () => {
      toggleFullImg()
    },
  },
  {
    iconName: 'grid',
    tipContent: '图片列表',
    action: toggleGrid,
  },
  {
    iconName: 'close1',
    tipContent: '关闭',
    action: () => {
      isShowProjector.value = false;
    },
  }
])


/** ---------- 侧边列表逻辑 ---------- */
const photoListClick = (photo: Photo) => {
  currentPhoto.value = photo;
};
const imgListClick = (index: number) => {
  currentIndex.value = index;
}
const bindClickHandlers = (elRef, toogleFun: (state: boolean) => void) => {
  useEventListener(elRef, 'click', () => {
    toggleClickOutsidePhoto(false);
    toggleClickOutsideNav(false);
    toggleClickOutsideList(false);
    toogleFun(false); // 重置当前元素的点击外部状态为 false
  });
  onClickOutside(elRef, () => {
    toogleFun(true);
  });
}
// 设置图片选择框
const setPhotoSelectPosition = async () => {
  await nextTick()
  const currentPhotoDom = photoRefs.value[currentPhotoIndex.value]
  const selectDom = selectRef.value
  if (!currentPhotoDom || !selectDom || !asideRef.value) return
  const { top: imgTop, left: imgLeft } = useElementBounding(currentPhotoDom)
  const { top: listTop, left: listLeft } = useElementBounding(asideRef)
  const { y: scrollTop } = useScroll(asideRef)
  const top = imgTop.value - listTop.value + scrollTop.value//获取img距离container顶部的距离
  const left = imgLeft.value - listLeft.value//获取img距离container右边的距离
  selectDom.style.top = `${top}px`
  selectDom.style.left = `${left}px`
}




/** ---------- 图片缩放+拖拽状态 ---------- */
// 常量配置（便于后续调整）
const SCALE_CONFIG = {
  min: 1,    // 最小缩放比例
  max: 3,    // 最大缩放比例
  step: 0.1, // 滚轮微调步长
  clickStep: 1.5 // 点击缩放步长（点击一次放大到1.5倍，再点到3倍）
};

// 1. 基础缩放状态
// 缩放比例（默认1=原尺寸，>1放大，<1缩小，建议限制范围）
const scale = ref<number>(1)
// 变换原点（默认中心）
const transformOrigin = ref('50% 50%');

// 2. 鼠标位置+容器尺寸+滚动偏移
// 点击位置的相对偏移（用于确保缩放时点击点不移动）
const { x: pointerX, y: pointerY } = usePointer()
// 父容器滚动偏移
const { x: containerScrollX, y: containerScrollY } = useScroll(photoContainerRef);

/**
 * 修正鼠标实际位置（抵消父容器滚动偏移）
 * @returns 相对于父容器的鼠标X/Y坐标
 */
const getCorrectedPointerPos = () => {
  if (!photoContainerRef.value) return { x: 0, y: 0 };
  // 鼠标全局位置 - 容器滚动偏移 = 容器内实际位置
  return {
    x: pointerX.value - containerScrollX.value,
    y: pointerY.value - containerScrollY.value
  };
};

/**
 * 点击图片缩放（以点击位置为中心）
 */
const handlePhotoClick = async () => {
  console.log(photoContainerRef, photoRef)
  if (!photoRef.value || !photoContainerRef.value) return;
  // 1. 获取图片尺寸和位置（关键：取useElementBounding的.value）
  const { top: imgTop, left: imgLeft, width: imgWidth, height: imgHeight } = useElementBounding(photoRef);
  // 2. 修正鼠标位置（抵消容器滚动）
  const { x: correctedX, y: correctedY } = getCorrectedPointerPos();
  // 3. 计算相对于图片的百分比原点（核心逻辑保留，修正取值）
  const offsetX = correctedX - imgLeft.value;
  const offsetY = correctedY - imgTop.value;
  const originX = (offsetX / imgWidth.value) * 100; // 转为0%-100%的原点
  const originY = (offsetY / imgHeight.value) * 100;

  // 4. 缩放逻辑（支持多级缩放，而非仅1/3倍）
  if (scale.value >= SCALE_CONFIG.max) {
    // 已达最大缩放：恢复原尺寸+重置状态
    scale.value = SCALE_CONFIG.min;
    transformOrigin.value = '50% 50%';
    toggleCursor('zoom-in');
  } else {
    // 未达最大缩放：按步长放大，更新原点
    scale.value = Math.min(scale.value + SCALE_CONFIG.clickStep, SCALE_CONFIG.max);
    transformOrigin.value = `${originX}% ${originY}%`;
    toggleCursor('grab');
  }
};

/**
 * 滚轮微调缩放（缩放后保持原原点，更细腻）
 */
const handlePhotoWheel = (e: WheelEvent) => {
  if (!photoRef.value) return;
  e.preventDefault(); // 阻止页面滚动

  // 当前图片边界和鼠标位置
  const { top: imgTop, left: imgLeft, width: imgWidth, height: imgHeight } = useElementBounding(photoRef);
  const { x: correctedX, y: correctedY } = getCorrectedPointerPos();
  const offsetX = correctedX - imgLeft.value;
  const offsetY = correctedY - imgTop.value;
  const originX = (offsetX / imgWidth.value) * 100;
  const originY = (offsetY / imgHeight.value) * 100;

  // ✅ 根据滚轮方向调整缩放比例（平滑微调）
  const newScale = e.deltaY < 0
    ? Math.min(scale.value + SCALE_CONFIG.step, SCALE_CONFIG.max)
    : Math.max(scale.value - SCALE_CONFIG.step, SCALE_CONFIG.min);

  // ✅ 更新缩放比例
  scale.value = newScale;

  // ✅ 缩放时以鼠标为中心
  transformOrigin.value = `${originX}% ${originY}%`;

  // ✅ 更新光标状态
  toggleCursor(scale.value > SCALE_CONFIG.min ? 'grab' : 'zoom-in');
};

/** ---------- 按键事件监听 ---------- */
onKeyStroke(['ArrowUp', 'w'], () => {
  if (!isMobile.value) {
    handlePrevPhoto()
  }
  handlePrevPhoto()
})
onKeyStroke(['ArrowDown', 's'], () => {
  if (!isMobile.value) {
    handleNextPhoto()
  }
  handleNextPhoto()
})
onKeyStroke(['ArrowLeft', 'a'], () => {
  handlePrevPhoto()
})
onKeyStroke(['ArrowRight', 'd'], () => {
  handleNextPhoto()
})
onKeyStroke(['Escape'], () => {
  isShowProjector.value = false;
})
onKeyStroke('f', () => {
  toggleFullImg()
})


onMounted(async () => {
  await nextTick();
  bindClickHandlers(photoRef, toggleClickOutsidePhoto)
  bindClickHandlers(navRef, toggleClickOutsideNav)
  bindClickHandlers(asideRef, toggleClickOutsideList)
  setPhotoSelectPosition()
})
</script>

<template>
  <div class="projector">
    <div class="projector__container">
      <div
        class="projector__wrapper"
        ref="photoContainerRef"
      >
        <transition
          :name="transitionAnimeName"
          mode="out-in"
        >
          <img
            v-if="type === 'album'"
            :key="currentPhoto.id || currentPhoto.imagePath"
            class="projector-photo"
            ref="photoRef"
            :src="currentPhoto.imagePath"
            :alt="currentPhoto.description || '默认'"
            draggable="true"
            @click="handlePhotoClick"
            @wheel="handlePhotoWheel"
            :style="{
              transform: `scale(${scale})`,
              userSelect: 'none',
              transformOrigin: transformOrigin,
              cursor: cursor,
            }"
          >
          <img
            v-else
            :src="imgUrls[currentIndex]"
            alt=""
            class="projector__nav-item"
            ref="photoRef"
            draggable="true"
            @click="handlePhotoClick"
            @wheel="handlePhotoWheel"
            :style="{
              transform: `scale(${scale})`,
              userSelect: 'none',
              transformOrigin: transformOrigin,
              cursor: cursor,
            }"
          />
        </transition>
        <div
          class="projector__nav"
          ref="navRef"
        >
          <div class="projector__nav-page">
            <span>{{ currentPhotoPage }}</span>
            /
            <span>{{ photoCount }}</span>
          </div>
          <div
            v-for="(buttonGroup, groupIndex) in [navButtonFields, asideButtonFields]"
            :key="groupIndex"
            class="projector__nav__wrapper"
          >
            <button
              v-for="item, index in buttonGroup"
              :key="index"
              v-tippy="{
                content: item.tipContent,
                theme: 'nav',
                appendTo: 'parent',
              }"
              class="projector-bt"
              @click="item?.action()"
            >
              <Icon
                :name="item.iconName"
                class="button-icon"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
    <transition name="width-slide">
      <div
        class="projector__aside"
        v-if="isShowGrid"
        ref="asideRef"
      >
        <div class="projector__grid">
          <div
            class="projector__grid-photo"
            v-for="photo, index in photos"
            :key="index"
            ref="photoRefs"
            v-if="type === 'album'"
          >
            <img
              :src="photo.imagePath"
              :alt="photo.description"
              :title="photo.title"
              @click="photoListClick(photo)"
            >
          </div>
          <div
            class="projector__grid-photo"
            v-for="url, index in imgUrls"
            :key="url"
            v-else
          >
            <img
              :src="url"
              alt=""
              @click="imgListClick(index)"
            >
          </div>
        </div>
        <div
          class="img-selected"
          ref="selectRef"
        >
          <div
            class="img-selected-border"
            v-for="i in 4"
            :key="i"
          ></div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.button-icon {
  @include anim.transition(font-color);
  font-size: fun.font-size(xl);

  @include util.respond-down(md) {
    font-size: fun.font-size(md);
  }
}

.img-selected {
  @include mix.position($type: absolute, $t: 5px, $l: 5px);
  box-sizing: border-box;
  @include mix.size(100px, 75px);
  @include anim.transition;

  &-border {
    @include mix.size(15px);

    &:nth-of-type(1) {
      @include mix.position($type: absolute, $t: 0, $l: 0);
      @include mix.border(3px solid var(--color-primary-base), none, none, 3px solid var(--color-primary-base));
    }

    &:nth-of-type(2) {
      @include mix.position($type: absolute, $t: 0, $r: 0);
      @include mix.border(3px solid var(--color-primary-base), 3px solid var(--color-primary-base), none, none);
    }

    &:nth-of-type(3) {
      @include mix.position($type: absolute, $b: 0, $r: 0);
      @include mix.border(none, 3px solid var(--color-primary-base), 3px solid var(--color-primary-base), none);
    }

    &:nth-of-type(4) {
      @include mix.position($type: absolute, $b: 0, $l: 0);
      @include mix.border(none, none, 3px solid var(--color-primary-base), 3px solid var(--color-primary-base));
    }
  }
}

.projector {
  @include mix.position($type: fixed, $t: 0, $l: 0, $z: toast);
  @include mix.size(100vw, 100vh);
  @include mix.flex-box;

  &__wrapper,
  &__container,
  &__aside {
    position: relative;
    @include mix.size(100%);
  }

  &__container {
    flex: 9;
    padding: 20px 20px 85px;
    @include mix.flex-box(column);
  }

  &__wrapper {
    @include mix.flex-box;
  }

  &-photo {
    display: block;
    position: relative;
    @include mix.max-size(100%);
    @include mix.size(auto);
    @include mix.object(center, contain);
    margin: 0 auto;
    border-radius: fun.radius(md);
    caret-color: transparent;
    cursor: zoom-in;
    @include anim.transition;
  }

  &__nav {
    @include mix.size(100%, 50px);
    max-width: 1920px;
    @include mix.position($type: absolute, $b: -70px, $l: 50%);
    transform: translateX(-50%);
    @include mix.flex-box($j: space-between, $g: sm);
    @include mix.box-style($p: 0 20px, $r: md, $bg: var(--interactive-bg));
    font-size: fun.font-size(lg);

    @include util.respond-down(md) {
      width: 90%;
    }

    &-page,
    &__wrapper {
      flex: 1;
    }

    &__wrapper {
      @include mix.flex-box($g: sm);

      &:nth-child(3) {
        justify-content: flex-end;
      }
    }

    &-button {
      @include mix.flex-box;
      @include mix.box-style($p: 6px, $r: sm, $bg: var(--interactive-base));
      @include anim.transition;
      @include anim.bgcolor(var(--interactive-strong))
    }
  }

  &__aside {
    width: 215px;
    overflow-y: auto;

    @include util.respond-down(md) {
      width: 110px;
    }
  }

  &__grid {
    @include mix.grid-box($columns: 2, $gap: xs, $align: start);
    width: 215px;
    padding: fun.space(xs);
    @include anim.transition;

    @include util.respond-down(md) {
      grid-template-columns: 1fr;
      width: 110px;
    }

    @include util.respond-down(md) {
      @include anim.transition;
    }

    &-photo {
      @include mix.size(100px, 75px);

      &>img {
        @include mix.size(100%);
        @include mix.object(center, cover);
      }
    }
  }
}
</style>