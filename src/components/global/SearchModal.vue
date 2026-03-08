<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { onClickOutside, onKeyStroke, useDebounceFn } from '@vueuse/core'
import { ArticleAPI } from '@/apis/article.api'
import type { HomeArticle } from '@/schemas/article.schema'
import { createI18nUtil } from '@/utils/i18n.util'
import SmartLink from '@/components/bases/SmartLink.vue'

const { t } = createI18nUtil();
const searchContent = ref<string>('')
const searchResults = ref<HomeArticle[]>([])
const loading = ref(false)
const hasSearched = ref(false)

const emits = defineEmits(['close'])

/** ---------- 搜索逻辑 ---------- */
const performSearch = async () => {
  if (!searchContent.value.trim()) {
    searchResults.value = [];
    hasSearched.value = false;
    return;
  }
  
  loading.value = true;
  try {
    const res = await ArticleAPI.getHomeArticleList({ 
      keyword: searchContent.value,
      pageSize: 10,
      page: 1
    });
    if (res.success && res.data) {
      searchResults.value = res.data.list;
    } else {
      searchResults.value = [];
    }
    hasSearched.value = true;
  } catch (error) {
    console.error('Search error:', error);
    searchResults.value = [];
  } finally {
    loading.value = false;
  }
};

const debouncedSearch = useDebounceFn(performSearch, 500);

watch(searchContent, () => {
  if (!searchContent.value) {
    searchResults.value = [];
    hasSearched.value = false;
    return;
  }
  debouncedSearch();
});

const searchPosts = async () => {
  performSearch();
}

/** ---------- 元素绑定 ---------- */
const containerRef = ref<HTMLDivElement | null>(null)


/** ---------- 按键绑定 ---------- */
onKeyStroke('Escape', () => {
  emits('close')
})
onKeyStroke('Enter', async () => {
  await searchPosts()
})

/** ---------- 关闭逻辑 ---------- */
const handleClose = () => {
  emits('close')
}

onMounted(async () => {
  onClickOutside(containerRef, () => {
    emits('close')
  })
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div class="search">
        <div class="search-mask" @click="handleClose"></div>
        <div class="search__container" ref="containerRef">
          <div class="search__header">
            <h2 class="search-title">{{ t('common.search') }}</h2>
            <div class="search-bar">
              <Icon name="search" class="search-icon" />
              <input 
                type="text" 
                :placeholder="t('common.search') + '...'" 
                v-model="searchContent"
                class="search-input"
                autofocus
              >
              <Icon name="close" class="close-icon" v-if="searchContent" @click="searchContent = ''" />
            </div>
          </div>
          <div class="search__body">
            <div class="search__result">
              <div class="search-loading" v-if="loading">
                <div class="loading-spinner"></div>
                <span>{{ t('common.loading') }}</span>
              </div>
              
              <div class="search-list" v-else-if="searchResults.length > 0">
                <SmartLink 
                  v-for="article in searchResults" 
                  :key="article.shortId"
                  :to="`/article/${article.shortId}`"
                  class="search__result-item"
                  @click="handleClose"
                >
                  <div class="search-item-content">
                    <div class="search-item-title">{{ article.title }}</div>
                    <div class="search-item-meta">
                      <span class="search-date">{{ new Date(article.createdAt).toLocaleDateString() }}</span>
                      <span v-if="article.tags && article.tags.length" class="search-tags">
                        <span v-for="tag in article.tags.slice(0, 3)" :key="tag.id" class="search-tag">#{{ tag.name }}</span>
                      </span>
                    </div>
                  </div>
                  <Icon name="arrow-right" class="search-item-arrow" />
                </SmartLink>
              </div>
              
              <div class="search-result-empty" v-else-if="hasSearched">
                {{ t('common.noResult') || '未找到相关文章' }}
              </div>
            </div>
          </div>
          <div class="search__footer">
            <div class="search-description">
              <span class="key-hint"><span>↑</span><span>↓</span> {{ t('common.select') || '选择' }}</span>
              <span class="key-hint"><span>Enter</span> {{ t('common.confirm') || '确定' }}</span>
              <span class="key-hint"><span>Esc</span> {{ t('common.close') || '关闭' }}</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.search {
  @extend %full-screen;
  @include mix.position-style($p: fixed, $t: 0, $l: 0, $z: modal-backdrop);
  @include mix.flex-box($d: column, $j: flex-start, $a: center);
  padding-top: 15vh;
  
  &-mask {
    @extend %full-screen;
    @include mix.position-style($p: absolute, $t: 0, $l: 0, $z: -1);
    overscroll-behavior: contain;
    background-color: rgba(0, 0, 0, 0.4);
    @extend %glass-effect;
    cursor: pointer;
  }

  &__container {
    @include mix.max-size(rem(800), 70vh);
    position: relative;
    width: 65vw;
    @include mix.container-style($p: lg, $bg: var(--surface-base), $r: lg);
    @include mix.z-index(modal);
    box-shadow: var(--shadow-lg);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  
  &__header {
    flex-shrink: 0;
  }
  
  &__body {
    flex: 1;
    overflow-y: auto;
    margin: rem(16) 0;
    min-height: rem(100);
    // Custom Scrollbar
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: var(--border-base);
      border-radius: 3px;
    }
  }
  
  &__footer {
    flex-shrink: 0;
    border-top: 1px solid var(--border-subtle);
    padding-top: rem(12);
  }

  &-title {
    @include mix.margin-d(b, md);
    @include mix.font-style($f: title, $s: rem(24), $w: 600);
  }
  
  &-bar {
    @include mix.container-style($p: md, $bg: var(--bg-base));
    @include mix.flex-box($a: center, $g: sm);
    border: 1px solid var(--border-base);
    border-radius: rem(8);
    transition: border-color 0.3s;
    
    &:focus-within {
      border-color: var(--primary-base);
    }
    
    .search-input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      @include mix.font-style($s: lg, $c: var(--text-base));
      
      &::placeholder {
        color: var(--text-weak);
      }
    }
    
    .search-icon {
      color: var(--text-subtle);
      font-size: rem(20);
    }
    
    .close-icon {
      cursor: pointer;
      color: var(--text-subtle);
      &:hover {
        color: var(--text-base);
      }
    }
  }
  
  &-description {
    @include mix.flex-box($a: center, $g: lg);
    @include mix.font-style($f: description, $s: rem(14), $c: var(--text-subtle));
    
    .key-hint {
      @include mix.flex-box($a: center, $g: xs);
      
      span {
        background: var(--bg-base-2);
        padding: rem(2) rem(6);
        border-radius: rem(4);
        border: 1px solid var(--border-base);
        font-family: monospace;
        font-size: rem(12);
        min-width: rem(20);
        @extend %text-center;
      }
    }
  }
  
  // Search Results Styles
  .search-loading {
    @include mix.flex-box($j: center, $a: center, $g: sm);
    padding: rem(24);
    color: var(--text-subtle);
    
    .loading-spinner {
      @include mix.size(rem(20));
      border: 2px solid var(--border-base);
      border-top-color: var(--primary-base);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
  }
  
  .search-list {
    @include mix.flex-box($d: column, $g: xs);
  }
  
  &__result-item {
    @include mix.flex-box($j: space-between, $a: center);
    padding: rem(12) rem(16);
    border-radius: rem(8);
    background-color: transparent;
    text-decoration: none;
    @include anim.transition($p: background-color transform);
    cursor: pointer;
    
    &:hover {
      background-color: var(--bg-base-2);
      transform: translateX(4px);
      
      .search-item-arrow {
        opacity: 1;
        transform: translateX(0);
      }
    }
    
    .search-item-content {
      flex: 1;
      min-width: 0;
    }
    
    .search-item-title {
      @include mix.font-style($s: md, $w: 500, $c: var(--text-base));
      margin-bottom: rem(4);
      @include mix.text-overflow;
    }
    
    .search-item-meta {
      @include mix.flex-box($a: center, $g: sm);
      @include mix.font-style($s: sm, $c: var(--text-subtle));
    }
    
    .search-tags {
      @include mix.flex-box($a: center, $g: xs);
    }
    
    .search-tag {
      @include mix.container-style($p: rem(2) rem(6), $bg: var(--bg-base), $r: rem(4));
      @include mix.font-style($s: rem(12));
      border: 1px solid var(--border-subtle);
    }
    
    .search-item-arrow {
      opacity: 0;
      transform: translateX(-10px);
      @include mix.font-style($c: var(--text-subtle));
      @include anim.transition($p: opacity transform);
    }
  }
  
  .search-result-empty {
    @extend %text-center;
    padding: rem(24);
    @include mix.font-style($c: var(--text-subtle));
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

// Transitions
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
  
  .search__container {
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
  }
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  
  .search__container {
    opacity: 0;
    transform: translateY(-20px) scale(0.98);
  }
}
</style>