<script lang="ts" setup>
import { shallowRef, ref, computed, watch } from 'vue'
import Pagination from '@/components/bases/Pagination.vue'
import PageHeader from '@/components/bases/PageHeader.vue'

const informContents = shallowRef([
  {
    id: 1,
    type: '更新',
    content: '新增了黑暗模式功能，点击右上角图标可切换主题。',
    date: '2025-05-15',
    icon: 'update'
  },
  {
    id: 2,
    type: '维护',
    content: '博客将在本周六晚 23:00 - 次日凌晨 02:00 进行服务器维护。',
    date: '2025-05-14',
    icon: 'maintain'
  },
  {
    id: 3,
    type: '公告',
    content: '本站支持 PWA 功能，您可以将博客添加到桌面以便快速访问。',
    date: '2025-05-13',
    icon: 'notice'
  },
  {
    id: 4,
    type: '动态',
    content: '新增了“技术分享”分类，欢迎大家查看最新文章。',
    date: '2025-05-12',
    icon: 'dynamic'
  },
  {
    id: 5,
    type: '提醒',
    content: '欢迎订阅我的 RSS 频道，第一时间获取更新内容！',
    date: '2025-05-10',
    icon: 'remind'
  },
  {
    id: 6,
    type: '更新',
    content: '优化了首页加载速度，首屏渲染时间减少 40%。',
    date: '2025-05-08',
    icon: 'update'
  },
  {
    id: 7,
    type: '公告',
    content: '评论区已开启 Markdown 支持，欢迎体验！',
    date: '2025-05-05',
    icon: 'notice'
  },
  {
    id: 8,
    type: '动态',
    content: '发布了新文章《Vue 3 组合式 API 最佳实践》。',
    date: '2025-05-03',
    icon: 'dynamic'
  },
  {
    id: 9,
    type: '维护',
    content: '数据库升级维护完成，服务已恢复正常。',
    date: '2025-05-01',
    icon: 'maintain'
  },
  {
    id: 10,
    type: '提醒',
    content: '友情链接申请通道已开放，欢迎互换友链。',
    date: '2025-04-28',
    icon: 'remind'
  },
  {
    id: 11,
    type: '更新',
    content: '修复了移动端导航栏在部分机型上显示异常的问题。',
    date: '2025-04-25',
    icon: 'update'
  },
  {
    id: 12,
    type: '公告',
    content: '新增站内搜索功能，快捷键 Ctrl+K 唤起。',
    date: '2025-04-20',
    icon: 'notice'
  }
])

// 分页逻辑
const currentPage = ref(1)
const pageSize = ref(7)

const total = computed(() => informContents.value.length)
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

const paginatedContents = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return informContents.value.slice(start, end)
})

watch(currentPage, () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
})

const getTypeColor = (type: string) => {
  switch (type) {
    case '更新': return 'var(--green-base)'
    case '维护': return 'var(--yellow-base)'
    case '公告': return 'var(--blue-base)'
    case '动态': return 'var(--purple-base)'
    case '提醒': return 'var(--red-base)'
    default: return 'var(--text-base)'
  }
}
</script>

<template>
  <TopBar />
  <div class="announcement">
    <div class="announcement__container">
      <header class="announcement__header">
        <PageHeader  
          :field="{
            title: '公告中心',
            desc: '这里发布最新的站点动态、更新日志和维护通知',
          }"
        />
      </header>
      <div class="announcement-page__body container">
        <div class="announcement-list">
          <div 
            v-for="item in paginatedContents" 
            :key="item.id" 
            class="announcement-card"
            v-reveal
          >
            <div class="card-left">
              <div class="type-tag" :style="{ backgroundColor: getTypeColor(item.type) }">
                {{ item.type }}
              </div>
              <div class="date">{{ item.date }}</div>
            </div>
            
            <div class="card-content">
              <p>{{ item.content }}</p>
            </div>
          </div>
        </div>
        <div class="pagination-wrapper">
          <Pagination
            v-model:page="currentPage"
            v-model:pageSize="pageSize"
            :total="total"
            :total-pages="totalPages"
            :show-total="true"
            :show-jumper="false"
          />
        </div>
      </div>
    </div>
    <FooterBar />
  </div>
  <RightBar />
</template>

<style lang="scss" scoped>
.announcement {
  min-height: 100vh;
  background-color: var(--bg-base);
  @include mix.flex-box($d: column);
  &__container {
    flex: 1;
    width: 100%;
    @include mix.margin-d(b, rem(140));
  }
  &__body {
    @include mix.margin-d(t, rem(140));
    min-height: calc(100vh - 230px);
  }
}
.page-header {
  @extend %text-center;
  @include mix.margin-d(b, rem(60));
}
.announcement-list {
  width: 100%;
  min-height: rem(550);
  @include mix.flex-box($d: column, $g: lg);
}
.announcement-card {
  width: 100%;
  @include mix.container-style($p: xl, $r: md, $bg: var(--surface-base), $s: var(--shadow-sm));
  transition: all 0.3s ease;
  border: 1px solid var(--border-base-color);
  @include mix.flex-box($d: column);
  @include mix.respond-up('md') {
    flex-direction: row;
    align-items: center;
    gap: 2rem;
  }
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
  .card-left {
    min-width: 140px;
    @include mix.flex-box($g: lg);
    .type-tag {
      @include mix.inline-flex-box(center, center);
      @include mix.padding(xs sm);
      @include mix.radius(md);
      @include mix.font-style($c: var(--white-base), $s: md, $w: 600, $l: 1.2);
      white-space: nowrap;
    }
    .date {
      @include mix.font-style($c: var(--text-subtle), $s: md, $l: 1.2);
      font-family: var(--font-mono);
    }
  }
  .card-content {
    flex: 1;
    p {
      @include mix.font-style($c: var(--text-base), $l: 1.6, $s: lg);
    }
  }
}
.pagination-wrapper {
  @include mix.margin-d(t, rem(50));
  @include mix.flex-box;
}
</style>