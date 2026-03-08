<script lang="ts" setup>
import { ref, onMounted, shallowRef, onUnmounted } from 'vue'
import { useIntervalFn, useTimeoutFn } from '@vueuse/core'
import { useRouter } from 'vue-router'

const router = useRouter()
const informContents = shallowRef([
  {
    id: 1,
    type: '更新',
    content: '新增了黑暗模式功能，点击右上角图标可切换主题。',
    date: '2025-05-15',
  },
  {
    id: 2,
    type: '维护',
    content: '博客将在本周六晚 23:00 - 次日凌晨 02:00 进行服务器维护。',
    date: '2025-05-14',
  },
  {
    id: 3,
    type: '公告',
    content: '本站支持 PWA 功能，您可以将博客添加到桌面以便快速访问。',
    date: '2025-05-13',
  },
  {
    id: 4,
    type: '动态',
    content: '新增了“技术分享”分类，欢迎大家查看最新文章。',
    date: '2025-05-12',
  },
  {
    id: 5,
    type: '提醒',
    content: '欢迎订阅我的 RSS 频道，第一时间获取更新内容！',
    date: '2025-05-10',
  }
])
const currentIndex = ref(0)
const itemHeight = ref(24) // 每条 li 高度，和样式一致
const announceContentRef = ref<HTMLElement | null>(null)

const updateHeight = () => {
  if (announceContentRef.value) {
    // 获取容器高度作为单行高度
    itemHeight.value = announceContentRef.value.clientHeight
  }
}

const isTransitioning = ref(true)
onMounted(() => {
  updateHeight()
  window.addEventListener('resize', updateHeight)

  useIntervalFn(() => {
    currentIndex.value++
    if (currentIndex.value === informContents.value.length) {
      isTransitioning.value = true// 等动画执行完再瞬移
      useTimeoutFn(() => {
        isTransitioning.value = false
        currentIndex.value = 0
      }, 500)
    } else {
      isTransitioning.value = true
    }
  }, 3000)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateHeight)
})
</script>

<template>
  <div class="announce" @click="router.push({ name: 'Announcement' })" style="cursor: pointer;">
    <a
      href="javascript:void(0)"
      class="announce__container"
    >
      <span class="announce-icon">
        <Icon name="notice"/>
      </span>
      <div class="announce-content" ref="announceContentRef">
        <ul
          class="announce-content__wrapper"
          :style="{
            transform: `translateY(-${currentIndex * itemHeight}px)`,
            transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none'
          }"
        >
          <li
            v-for="item, index in informContents"
            :key="index"
            class="announce-content__item"
            :title="item.content"
          >
            {{ item.content }}
          </li>
          <li
            v-for="item, index in informContents"
            :key="item.id"
            class="announce-content__item"
            :title="item.content"
          >
            {{ item.content }}
          </li>
        </ul>
      </div>
      <span class="announce-icon">
        <Icon name="notice"/>
      </span>
    </a>
  </div>
</template>



<style lang="scss" scoped>
.announce {
  padding: 0;
  @include anim.transition(border-color);
  @include hov.border(var(--primary-base));
  @include mix.respond-up('xl') {
    grid-column: 1/19;
  }
  &__container {
    @extend %card-container-base;
    @include mix.padding(sm);
    @include mix.flex-box($j: space-between);
  }
  &-icon {
    @extend %flex-center;
    @include mix.font-style($s: xl);
    &:nth-last-child(1) {
      transform: rotateY(180deg);
    }
  }
  &-content {
    height: rem(24);
    overflow: hidden;
    @extend %text-center;
    font-family: 'base';
    flex: 1;
    min-width: 0;
    margin: 0 rem(8);

    &__wrapper {
      @include anim.transition(all, 0.5s, ease-in-out);
    }
    &__item {
      height: rem(24);
      line-height: rem(24);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
    }
  }
}
</style>