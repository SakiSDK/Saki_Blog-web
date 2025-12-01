<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import type { PaginationEmits, PaginationProps } from '@/types/components/Base';
import { useVModel } from '@vueuse/core';



const props = withDefaults(defineProps<PaginationProps>(), {
  pageBtnCount: 5,
  disabled: false,
  showTotal: true,
  showJumper: true,
  showSizeChanger: true,
  pageSizeOptions: () => [10, 20, 30, 50],
  totalText: '共 {total} 页',
  jumperText: '前往 {current}/{pages} 页',
})
const emit = defineEmits<PaginationEmits>()
// 双向数据绑定
const page = useVModel(props, 'page', emit);
const pageSize = useVModel(props, 'pageSize', emit);
const inputPage = ref<string>(page.value.toString());

watch(
  () => page,
  (val) => {
    inputPage.value = val.toString();
  },
  { immediate: true }
)

// 生成页码列表
const pageList = computed(() => { 
  const pages = props.totalPages;
  const current = page.value;
  const btnCount = props.pageBtnCount;

  if (pages <= btnCount) {
    return Array.from({ length: pages }, (_, i) => i + 1)
  }

  const half = Math.floor(btnCount / 2);
  let start = current - half;
  let end = current + half;
  // 边界处理
  if (start < 1) {
    start = 1;
    end = btnCount;
  }
  if (end > pages) {
    end = pages;
    start = pages - btnCount + 1;
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})
console.log(pageList.value)

/** 切换页码 */
const handlePageChange = (pageNum: number) => {
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

/** 切换每页条数 */
const handleSizeChange = (size: number) => {
  if (props.disabled || size === props.pageSize) return;
  page.value = size;
  pageSize.value = size;
  // 切换每页条数时，重置到第一页
  page.value = 1;
};

/** 处理跳转页码输入 */
const handleJumperChange = () => {
  if (props.disabled) return;

  // 校验输入：必须是数字，且在有效范围
  const pageInput = parseInt(inputPage.value.trim(), 10);
  if (isNaN(pageInput) || pageInput < 1 || pageInput > props.totalPages) {
    inputPage.value = pageInput.toString(); // 输入无效，重置为当前页
    return;
  }

  handlePageChange(pageInput);
};

/** 处理输入框回车事件 */
const handleInputEnter = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    handleJumperChange();
  }
};

/** 上一页 */
const prevPage = () => handlePageChange(page.value - 1);

/** 下一页 */
const nextPage = () => handlePageChange(page.value + 1);

/** 第一页 */
const firstPage = () => handlePageChange(1);

/** 最后一页 */
const lastPage = () => handlePageChange(props.totalPages);
</script>

<template>
  <div class="pagination" :class="{ 'pagination--disabled': disabled }">
    <div class="pagination__container">
      <div class="pagination__list">
        <button class="pagination__prev" v-ripple>
          <span><Icon name="chevron-left" /></span>
        </button>
        <button 
          v-for="pageNum in pageList"
          :key="pageNum"
          :class="{ 'pagination__btn--active': pageNum === page }"
          class="pagination__btn"
          @click="handlePageChange(pageNum)"
          :disabled="disabled"
          v-ripple
        >
          {{ pageNum }}
        </button>
        <button class="pagination__next" v-ripple>
          <span><Icon name="chevron-right"/></span>
        </button>
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
    @include mix.container-style($p: sm);
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
    @include mix.size(35px);
    @include mix.container-style($p: sm, $r: md, $bg: var(--interactive-base), $b: var(--border-base));
    @extend %flex-center;
    @include mix.respond-down(xxs){
      @include mix.size(30px);
      @include mix.font-size(sm, true);
    }
  }
  &__next,
  &__prev { 
    @include mix.font-style($s: lg);
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
}
</style>