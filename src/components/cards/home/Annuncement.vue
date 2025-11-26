<script setup>
import { ref, onMounted, shallowRef } from 'vue'
import { useIntervalFn, useTimeoutFn } from '@vueuse/core'

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
const itemHeight = 20 // 每条 li 高度，和样式一致


const isTransitioning = ref(true)
onMounted(() => {
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
</script>

<template>
  <div class="announce">
    <a
      href="javascrpt:void(0)"
      class="announce__container"
    >
      <span class="announce-icon">
        <Icon name="notice"/>
      </span>
      <p class="announce-content">
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
          >
            {{ item.content }}
          </li>
          <li
            v-for="item, index in informContents"
            :key="item.id"
            class="announce-content__item"
          >
            {{ item.content }}
          </li>
        </ul>
      </p>
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
    height: 20px;
    overflow: hidden;
    text-align: center;
    font-family: 'base';
    &__wrapper {
      @include anim.transition(all, 0.5s, ease-in-out);
    }
    &__item {
      height: 20px;
    }
  }
}
</style>