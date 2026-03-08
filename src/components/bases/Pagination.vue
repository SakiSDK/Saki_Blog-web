<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { useVModel } from '@vueuse/core';



/** 分页参数类型定义 */
export interface PaginationProps {
  /** 当前页码（v-model 绑定） */
  page: number;
  /** 总条数 */
  total: number;
  /** 每页条数 */
  pageSize: number;
  /** 总页数 */
  totalPages: number;
  /** 页码按钮数量（奇数，默认5） */
  pageBtnCount?: number;
  /** 是否禁用分页 */
  disabled?: boolean;
  /** 是否显示总数 */
  showTotal?: boolean;
  /** 是否显示跳转输入框 */
  showJumper?: boolean;
  /** 是否显示每页条数切换 */
  showSizeChanger?: boolean;
  /** 每页条数选项（默认：[10,20,30,50]） */
  pageSizeOptions?: number[];
  /** 总数文本模板（{total} 占位符） */
  totalText?: string;
  /** 跳转文本模板（{current}  currentPage占位符, {pages} 总页数占位符） */
  jumperText?: string;
}
/** 分页事件类型定义 */
export interface PaginationEmits {
  /** 页码/每页条数变化时触发 */
  (e: 'update:page', value: number): void;
  (e: 'update:pageSize', value: number): void;
}

const props = withDefaults(defineProps<PaginationProps>(), {
  pageBtnCount: 5,
  disabled: false,
  showTotal: true,
  showJumper: true,
  showSizeChanger: true,
  pageSizeOptions: () => [10, 20, 30, 50],
  totalText: '共 {total} 页',
  jumperText: '前往 {currentPage}/{totalPages} 页',
})
const emit = defineEmits<PaginationEmits>()
// 双向数据绑定
const page = useVModel(props, 'page', emit);
const pageSize = useVModel(props, 'pageSize', emit);
const inputPage = ref<number>(page.value);

watch(
  () => page,
  (val) => {
    if (typeof val === 'string') return;
    inputPage.value = val.value;
  },
  { immediate: true }
)

// 生成页码列表
const pageList = computed(() => { 
  const totalPages = props.totalPages;
  const currentPage = page.value;
  const pageBtnCount = props.pageBtnCount;

  if (totalPages <= pageBtnCount) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  // 总页数 > 显示按钮数：添加省略号逻辑
  const half = Math.floor(pageBtnCount / 2);
  let start = currentPage - half;
  let end = currentPage + half;

  // 边界处理
  if (start < 1) {
    start = 1;
    end = pageBtnCount;
  }
  if (end > totalPages) {
    end = totalPages;
    start = totalPages - pageBtnCount + 1;
  }

  // 构建页码数组(包含省略号占位符)
  const result: (number | string)[] = [];

  // 开头省略: start > 1 时，添加[1 + ...]
  if (start > 1) {
    result.push(1);
    if (start > 2) {
      result.push('...');
    }
  }

  // 中间连续页面
  for (let i = start; i <= end; i++){
    result.push(i);
  }

  // 结尾省略：end < totalPages 时，添加「... + totalPages」
  if (end < totalPages) {
    // 避免「end」和「totalPages」相邻时重复显示省略号（如 end=totalPages-1 时，不显示...）
    if (end < totalPages - 1) {
      result.push('...');
    }
    result.push(totalPages);
  }

  return result;
})

/** 切换页码 */
const handlePageChange = (pageNum: number | string) => {
  if (typeof pageNum === 'string') return;
  if (
    props.disabled ||
    pageNum < 1 ||
    pageNum > props.totalPages ||
    pageNum === page.value
  ) {
    return;
  }
  page.value = pageNum;
};

/** 上一页 */
const prevPage = () => {
  if (props.disabled || page.value === 1) return;
  page.value -= 1;
};

/** 下一页 */
const nextPage = () => {
  if (props.disabled || page.value === props.totalPages) return;
  page.value += 1;
};
</script>

<template>
  <div class="pagination" :class="{ 'pagination--disabled': disabled }">
    <div class="pagination__container">
      <div class="pagination__list">
        <button 
          class="pagination__prev" 
          :class="{
            'pagination__action': page > 1,
            'pagination__btn--disabled': page === 1
          }"
          @click="prevPage()"
          :disabled="disabled || page===1"
          v-ripple
        >
          <span><Icon name="chevron-left" /></span>
        </button>
        <button 
          v-for="pageNum in pageList"
          :key="pageNum"
          :class="{
            'pagination__btn--active': pageNum === page && pageNum.toString() !== '...',
            'pagination__btn--disabled': pageNum === '...'
          }"
          class="pagination__btn"
          @click="handlePageChange(pageNum)"
          :disabled="disabled || pageNum === '...'"
          v-ripple
        >
          {{ pageNum }}
        </button>
        <button 
          class="pagination__next"
          :class="{
            'pagination__action': page < totalPages,
            'pagination__btn--disabled': page === totalPages
          }"
          @click="nextPage()"
          :disabled="disabled || page===totalPages"
          v-ripple
        >
          <span><Icon name="chevron-right"/></span>
        </button>
      </div>
      <div class="pagination__jump" v-if="showJumper">
        <span>前往</span>
        <input
          type="number"
          v-model="inputPage"
          class="pagination__input"
          :disabled="disabled"
          min="1"
          :max="totalPages"
          maxlength="5"
        />
        <span>页</span>
        <VButton type="outline" size="small" @click="handlePageChange(inputPage)">确定</VButton>
      </div>
      <div class="pagination-totalpages">
        <span v-if="showTotal">
          {{  totalText.replace('{total}', totalPages.toString()) }}
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pagination {
  &__container {
    @include mix.container-style($p: sm, $bg: transparent);
    @extend %flex-column-center;
    @include mix.gap(sm);
  }
  &-totalpages {
    @include mix.font-style($s: sm, $c: var(--text-subtler));
  }
  &__list {
    @extend %flex-center;
    @include mix.gap(sm);
  }
  &__btn,
  &__next,
  &__prev {
    @include mix.size(rem(35));
    @include mix.container-style($p: sm, $r: md, $bg: var(--interactive-base), $b: var(--border-base));
    @extend %flex-center;
    @include mix.respond-down(xxs){
      @include mix.size(rem(30));
      @include mix.font-size(sm, true);
    }
  }
  &__next,
  &__prev { 
    @include mix.font-style($s: lg);
  }
  &__action {
    @include anim.transition($p: transform bg color);
    @include hov.move-y;
    @include hov.bg(var(--primary-base));
    @include hov.color(var(--white-base))
  }
  &__btn {
    @include anim.transition($p: transform color bg);
    @include hov.move-y;
    @include hov.color(var(--primary-base));
  }
  &__btn--active  {
    background: var(--primary-base);
    color: var(--white-base);
    @include hov.color(var(--white-base))
  }
  &__btn--disabled {
    background: var(--interactive-disabled);
    color: var(--text-disabled);
    cursor: not-allowed;
    @include hov.color(var(--text-disabled));
  }
  &__input {
    display: inline-block;
    width: rem(55);
    @include mix.flex-box;
    @include mix.container-style($p: sm, $r: md, $bg: var(--interactive-base), $b: var(--border-base));
  }
  &__jump {
    @extend %flex-center;
    @include mix.gap(sm);
    &>span {
      text-wrap: nowrap;
      @include mix.font-style($s: sm, $c: var(--text-subtler));
    }
  }
}
</style>