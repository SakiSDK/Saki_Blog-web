<script lang="ts" setup>
import { computed } from 'vue';
import Wave from './Wave.vue';
import type { BriefTag } from '@/schemas/tag.schema';
import type { BriefCategory } from '@/schemas/category.schema';
import Icon from '@/components/global/Icon.vue';


/** ---------- PageHeader文案类型 ---------- */
export interface PageHeaderField {
  title: string,
  desc: string,
  infos?: {
    title: string,
    value: string,
    icon?: string,
  }[],
}

const props = withDefaults(defineProps<{
  field: PageHeaderField
  tags?: BriefTag[]
  categories?: BriefCategory[]
  wave?: {
    height: string,
  }
}>(), {
  wave: () => ({
    height: '50px',
  })
})

const hasMeta = computed(() => {
  return (props.field.infos && props.field.infos.length > 0)
    || (props.categories && props.categories.length > 0)
    || (props.tags && props.tags.length > 0);
});

</script>

<template>
  <div class="page-header">
    <h2 class="page-title">{{ field.title }}</h2>
    <p class="page-desc">{{ field.desc }}</p>
    
    <div class="page-meta" v-if="hasMeta">
      <!-- 基础信息（如发布时间） -->
      <div class="page-meta-group" v-if="field.infos && field.infos.length > 0">
        <div class="page-meta-item" v-for="info in field.infos" :key="info.title">
          <Icon v-if="info.icon" :name="info.icon" />
          <span v-else class="page-meta-label">{{ info.title }}</span>
          <span class="page-meta-value">{{ info.value }}</span>
        </div>
      </div>

      <!-- 分类 -->
      <div class="page-meta-group" v-if="categories && categories.length > 0">
        <div class="page-meta-item">
          <Icon name="category" />
          <div class="page-meta-list">
            <span class="page-meta-value" v-for="category in categories" :key="category.id">
              {{ category.name }}
            </span>
          </div>
        </div>
      </div>

      <!-- 标签 -->
      <div class="page-meta-group" v-if="tags && tags.length > 0">
        <div class="page-meta-item">
          <Icon name="tag" />
          <div class="page-meta-list">
            <span class="page-meta-tag" v-for="tag in tags" :key="tag.id">
              {{ tag.name }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <Wave :height="wave.height"/>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:map';

.page {
  &-header {
    position: relative;
    @include mix.container-style($p: rem(90) rem(50) rem(70) rem(50), $r: 0, $bg: var(--primary-base), $o: hidden);
    @include mix.font-style($c: var(--white-base));
  }
  &-title,
  &-desc {
    @include mix.z-index(base)
  }
  &-title {
    @include mix.margin-d(b, sm);
    @include mix.font-style($s: xl-title, $c: inherit, $f: title);
  }
  &-desc {
    @include mix.font-style($s: md, $c: inherit);
    opacity: .7;
  }
  // 新的元数据样式
  &-meta {
    @include mix.margin(md 0);
    @extend %flex-start;
    @include mix.gap(lg);
    flex-wrap: wrap;
    @include mix.z-index(base);
    &-group {
      @extend %flex-start;
      @include mix.gap(md);
    }
    &-item {
      @include mix.flex-box($a: center, $g: xs);
      @include mix.font-style($c: var(--white-subtle), $s: md);
    }
    &-list {
      @include mix.flex-box($a: center, $g: sm);
    }
    &-label {
      @include mix.margin-d(r, xs);
    }
    &-tag {
      @include mix.container-style($p: rem(2) rem(8), $r: md, $bg: var(--white-ghost));
      @include mix.font-style($s: sm, $c: var(--white-base));
      transition: all .3s;
      &:hover {
        background: var(--white-base);
        color: var(--primary-base);
      }
    }
  }
}
</style>