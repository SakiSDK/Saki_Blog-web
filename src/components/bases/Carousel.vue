<script lang="ts" setup>
import { useDomUtil } from '@/utils/dom.util';
import { computed } from 'vue';

// 自动导入所有 svg 文件
const svgModules: Record<string, any> = import.meta.glob(
  '../../assets/svgs/*.svg',
  { eager: true }
)
const svgPaths: string[] = Object.values(svgModules).map((mod: any) => {
  return mod.default
})

const { brightColorByHash } = useDomUtil();

// 1. 将图标分为左右两组
const groupCount = 2;
const groupSize = Math.ceil(svgPaths.length / groupCount);
const leftGroupRaw = svgPaths.slice(0, groupSize);
const rightGroupRaw = svgPaths.slice(groupSize);

// 2. 构建无缝滚动列表的核心逻辑
// 核心原理：[内容 A] + [内容 A]
// 动画从 translateY(0) 移动到 translateY(-50%)
// 当移动到 -50% 时，显示的正是第二份 [内容 A] 的开头，此时瞬间重置回 0，实现无缝
const createSeamlessList = (arr: string[]) => {
  // 为了防止图标太少填不满屏幕，先将基础列表重复几次，确保基础长度足够长（例如至少20个图标）
  const minLength = 20;
  const repeatTimes = Math.ceil(minLength / Math.max(arr.length, 1));
  const baseList = Array.from({ length: repeatTimes }).flatMap(() => arr);
  
  // 复制一份，构成 [Base, Base] 结构
  return [...baseList, ...baseList];
}

// 确保两个列表长度一致，避免速度差异导致的错位消失
const leftList = computed(() => {
  const list = createSeamlessList(leftGroupRaw);
  return list;
});
const rightList = computed(() => {
  // 强制右侧列表长度与左侧一致（截取或填充），确保高度完全相等
  const leftLen = leftList.value.length;
  let list = createSeamlessList(rightGroupRaw);
  
  // 如果长度不一致，进行补齐或截断，保证每一份的长度完全一样
  // 但由于内容不同，简单的长度对齐可能不够（因为图片高度可能一样，但数量不一样会导致总高度不同）
  // 最稳妥的方式是：让左右两边生成的 BaseList 长度（数量）完全一致
  
  return list;
});

const targetLength = 20; // 设定一个固定的 BaseList 长度
const buildFixedLengthList = (source: string[]) => {
  if (source.length === 0) return [];
  const result: string[] = [];
  for (let i = 0; i < targetLength; i++) {
    const item = source[i % source.length];
    if (item) {
      result.push(item);
    }
  }
  // [Base, Base]
  return [...result, ...result];
}

const finalLeftList = computed(() => buildFixedLengthList(leftGroupRaw));
const finalRightList = computed(() => buildFixedLengthList(rightGroupRaw));

</script>

<template>
  <div class="carousel">
    <!-- 左侧列 -->
    <div class="carousel-column col-left">
      <div 
        v-for="(src, index) in finalLeftList" 
        :key="`l-${index}`"
        class="img-svg"
        :style="{
          '--svg-bgcolor': brightColorByHash({ key: src }),
        }"
      >
        <img :src="src" />
      </div>
    </div>

    <!-- 右侧列 -->
    <div class="carousel-column col-right">
      <div 
        v-for="(src, index) in finalRightList" 
        :key="`r-${index}`"
        class="img-svg"
        :style="{
          '--svg-bgcolor': brightColorByHash({ key: src }),
        }"
      >
        <img :src="src" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.carousel {
  @extend %flex-center;
  @include mix.position-style($p: absolute, $t: 0, $r: 0);
  // 容器不需要 flex gap，由内部元素控制
  display: flex;
  flex-direction: row;
  gap: rem(10); // 列之间的间距
}

.carousel-column {
  display: flex;
  flex-direction: column;
  // 移除 gap，使用 margin-bottom 避免动画计算误差
  
  // 关键动画：向上移动 50%（即移动完第一份列表的高度）
  animation: scroll-vertical 20s linear infinite;
  @extend %hover-pause;

  // 内部元素样式
  .img-svg {
    @include mix.size(rem(100));
    margin-bottom: rem(10); // 替代 gap，确保高度计算包含间距
    @include mix.container-style($p: xs,
      $r: rem(13),
      $bg: var(--white-base),
      $s: var(--shadow-base));
    
    // 强制不缩小，防止布局挤压
    flex-shrink: 0;

    &>img {
      @extend %full-size;
    }
  }
}

// 右侧列的特殊处理
.col-right {
  // 错位效果
  // 可以给右侧不同的速度，或者保持一致。
  // 注意：如果是百分比动画，且左右列表高度不一致，速度自然会不同（高度越高跑得越快）
  // 这里因为我们都扩充到了相似的长度，速度差异不会太大
  animation-delay: -0.45s; // 右侧延迟 50% 速度，实现错位效果
}

// 定义局部动画，确保不依赖外部
@keyframes scroll-vertical {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-50%);
  }
}
</style>
