<script lang="ts" setup>
import ArticleTagCard from '@/components/cards/articles/ArticleTagCard.vue';
import RecentArticlesCard from '../cards/articles/LatestArticlesCard.vue';
import ArticleCategoryBar from '../cards/articles/ArticleCategoryBar.vue';
import ArticleCard from '../cards/articles/ArticleCard.vue';
import Pagination from '../bases/Pagination.vue';
import { computed, onMounted } from 'vue';
import { useArticleStore } from '@/stores/article.store';
import { message } from '@/plugins/message';


/** ---------- 状态管理 ---------- */
const articleStore = useArticleStore();
const {
  useArticleListComputed, 
  usePaginationComputed,
  useErrorComputed,
  setPagination,
  getHomeArticleList
} = articleStore;

// 获取响应式数据
const { articleList } = useArticleListComputed('home');
const { pagination } = usePaginationComputed('home');
const { errorMsg } = useErrorComputed('home');


/** ---------- 计算属性（双向绑定） ---------- */
const currentPage = computed({
  get: () => pagination.value.page || 1,
  set: (val) => {
    setPagination('home', { page: val });
    // 页码改变时重新请求数据
    getHomeArticleList({ page: val, pageSize: pageSize.value });
  }
});

const pageSize = computed({
  get: () => pagination.value.pageSize || 10,
  set: (val) => {
    // 切换页大小时，重置为第一页
    setPagination('home', { pageSize: val, page: 1 });
    getHomeArticleList({ page: 1, pageSize: val });
  }
});


/** ---------- 钩子函数 ---------- */
onMounted(async () => {
  try {
    await getHomeArticleList({ page: currentPage.value, pageSize: pageSize.value }, true);
  } catch (error) {
    message.show({
      type: 'error',
      title: errorMsg.value || '获取文章列表失败',
      duration: 3000
    });
  }
});
</script>

<template>
  <div class="article-section">
    <div class="article-section__container">
      <div class="article-section__aside">
        <div class="article-section-recent" v-reveal>
          <RecentArticlesCard/>
        </div>
        <div class="article-section-tag" v-reveal>
          <ArticleTagCard/>
        </div>
      </div>
      <div class="article-section__main">
        <div class="article-section-category-bar" v-reveal>
          <ArticleCategoryBar/>
        </div>
        <div class="article-section__content">
          <div class="article-section__sheet">
            <div class="article-section__wrapper">
              <div class="article-section__item" v-reveal v-for=" article in articleList" :key="article.shortId">
                <ArticleCard
                  :short-id="article.shortId"
                  :cover="article.cover"
                  :title="article.title"
                  :categories="article.categories.map(item => item.name)"
                  :tags="article.tags.map(item => item.name)"
                  :date="article.createdAt.toLocaleDateString()"
                />
              </div>
            </div>
          </div>
          <div class="article-section__pagination" v-reveal>
            <Pagination
              v-model:page="currentPage"
              v-model:pageSize="pageSize"
              :total="pagination.total || 0"
              :total-pages="pagination.totalPages || 0"
              :page-btn-count="5"
              :show-total="true"
              :show-jumper="false"
              :show-size-changer="true"
              :page-size-options="[10, 20, 50, 100]"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.article-section {
  @include mix.size(100%, fit-content);
  &__container {
    min-height: 700px;
    @include mix.grid-box($c: 20, $g: lg);
    @include mix.respond-down(md) {
      display: block;
      grid-template-columns: 1fr !important;
    }
  }
  &__aside {
    display: none;
    height: 0;
    visibility: hidden;
    @include anim.transition(opacity height visibility);
    @include mix.respond-up(md){
      @include mix.flex-box($d: column, $j: flex-start, $g: lg);
      visibility: visible;
      height: auto;
      grid-column: 1/7;
      opacity: 1;
    }
  }
  &__main,
  &__content,
  &__wrapper,
  &-recent,
  &-tag {
    width: 100%;
  }
  &__main {
    grid-column: 1/21;
    @include mix.respond-up(md){
      grid-column: 7/21;
    }
  }
  &__container,
  &__wrapper,
  &__pagination {
    @include mix.margin-d(t, lg);
  }
  &__sheet {
    min-height: rem(760);
  }
  &__wrapper {
    @include mix.grid-box($c: 2, $g: lg);
    @include mix.respond-down(md) {
      grid-template-columns: 1fr !important;
    }
  }
  &__item {
    height: fit-content;
  }
}
</style>