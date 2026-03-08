<script lang="ts" setup>
import PageHeader from '@/components/bases/PageHeader.vue';
import MarkdownRenderer from '@/components/cards/markdown/MarkdownRenderer.vue';
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import ArticleTocCard from '@/components/cards/articles/ArticleTocCard.vue';
import { storeToRefs } from 'pinia';
import { useArticleStore } from '@/stores/article.store';
import { useRoute } from 'vue-router';



/** ---------- 状态管理 ---------- */
const articleStore = useArticleStore();
const { articleDetail } = storeToRefs(articleStore);
const route = useRoute();


// Markdown 渲染器引用
const rendererRef = ref();

// 获取目录数据
const toc = computed(() => rendererRef.value?.toc || []);

// 页面头部信息
const headerField = computed(() => {
  // 确保数据存在
  if (!articleDetail.value) {
    return {
      title: '加载中...',
      desc: '',
      infos: []
    }
  }

  // 格式化日期
  const formatDate = (date: Date) => {
    if (!date) return '';
    // 如果是字符串，尝试转换
    const dObj = typeof date === 'string' ? new Date(date) : date;
    const y = dObj.getFullYear();
    const m = String(dObj.getMonth() + 1).padStart(2, '0');
    const d = String(dObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // 基础信息
  const infos: any[] = [
    { title: '发布时间', value: formatDate(articleDetail.value.createdAt), icon: 'date' },
  ];
  // 如果有作者，追加作者信息
  if (articleDetail.value.author) {
    infos.push({ title: '作者', value: articleDetail.value.author.nickname, icon: 'user' });
  }

  return {
    title: articleDetail.value.title,
    desc: articleDetail.value.description,
    infos,
  };
});

// 当前激活的锚点
const activeAnchor = ref('');

// 监听滚动更新激活锚点
const updateActiveAnchor = () => {
  if (toc.value.length === 0) return;

  const headerHeight = 100; // 头部偏移量
  let active = '';

  for (const item of toc.value) {
    const element = document.getElementById(item.slug);
    if (element) {
      const rect = element.getBoundingClientRect();
      // 找到最后一个在视口上方或视口顶部的标题
      if (rect.top <= headerHeight + 50) {
        active = item.slug;
      } else {
        break;
      }
    }
  }
  if (active) {
    activeAnchor.value = active;
  } else if (toc.value.length > 0 && window.scrollY < 80) {
    activeAnchor.value = toc.value[0].slug;
  }
};

// 节流滚动监听
let isScrolling = false;
const onScroll = () => {
  if (!isScrolling) {
    requestAnimationFrame(() => {
      updateActiveAnchor();
      isScrolling = false;
    });
    isScrolling = true;
  }
};

let updateAnchorTimer: ReturnType<typeof setTimeout> | null = null;

onMounted(() => {
  window.addEventListener('scroll', onScroll);
  // 初始检查
  updateAnchorTimer = setTimeout(updateActiveAnchor, 500);
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
  if (updateAnchorTimer) clearTimeout(updateAnchorTimer);
});

// 监听 TOC 变化（内容渲染完成后）
watch(toc, () => {
  // 稍作延迟等待 DOM 渲染
  if (updateAnchorTimer) clearTimeout(updateAnchorTimer);
  updateAnchorTimer = setTimeout(updateActiveAnchor, 200);
});

onMounted(async () => {
  const shortId = route.params.shortId;
  if (shortId && typeof shortId === 'string') {
    await articleStore.getArticleDetail(shortId);
  }
});

watch(
  () => route.params.shortId,
  async (newShortId) => {
    if (newShortId && typeof newShortId === 'string') {
      await articleStore.getArticleDetail(newShortId);
    }
  }
);
</script>

<template>
  <TopBar/>
  <RightBar/>
  <div class="article-detail">
    <!-- 页面头部 -->
    <div class="article-detail__header">
      <PageHeader 
        :field="headerField"
        :categories="articleDetail?.categories || []" 
        :tags="articleDetail?.tags || []"
      />
    </div>
    <div class="article-detail__container">
      <div class="article-detail__layout">
        <!-- 左侧：侧边栏（目录） -->
        <aside class="article-detail__aside">
          <ArticleTocCard :toc="toc" :active-slug="activeAnchor"/>
        </aside>
        <!-- 右侧：文章内容 -->
        <main class="article-detail__main">
          <div class="article-card" v-if="articleDetail">
            <!-- 文章封面 -->
            <div class="article-cover" v-if="articleDetail.cover">
              <img :src="articleDetail.cover" alt="cover" loading="lazy">
            </div>
            <!-- Markdown 内容 -->
            <div class="article-content">
              <MarkdownRenderer 
                ref="rendererRef" 
                :markdown="articleDetail.content" 
              />
            </div>
          </div>
          <!-- 加载中或空状态 -->
          <div v-else class="article-loading">
            加载中...
          </div>
        </main>
      </div>
    </div>
    <div class="article-detail__footer">
      <FooterBar/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.article-detail {
  width: 100%;
  min-height: 100vh;
  background-color: var(--bg-base);
  &__container {
    max-width: rem(1200);
    margin: 0 auto;
    @include mix.padding(xxl title);
    min-height: calc(100vh - rem(160));
  }
  &__layout {
    @include mix.grid-box($tc: rem(300) minmax(0, 1fr), $g: lg);
    @include mix.respond-down(md) {
      grid-template-columns: 1fr;
    }
  }
  &__main,
  &__aside {
    width: 100%;
  }
  &__main {
    @include mix.container-style($p: 0, $r: lg, $bg: var(--surface-base), $b: var(--border-base), $o: hidden);
  }
  &__footer {
    @extend %flex-column-center;
    @include mix.gap(title);
  }
}
.article-card {
  @include mix.container-style($p: 0, $r: md, $o: hidden, $s: var(--shadow-sm));
  .article-cover {
    @include mix.size(100%, rem(400));
    overflow: hidden;
    @include mix.respond-down(md) {
      height: rem(250);
    }
    img {
      @extend %img-cover;
      @include hov.scale(1.05, true);
    }
  }
  .article-content {
    @include mix.padding(rem(40));
    @include mix.respond-down(md) {
      @include mix.padding(lg);
    }
  }
}
</style>
