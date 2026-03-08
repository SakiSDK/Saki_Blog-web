<script lang="ts" setup>
import vueSvg from '@/assets/svgs/icon-vue-js.svg'
import tsSvg from '@/assets/svgs/icon-typescript.svg'
import viteSvg from '@/assets/svgs/icon-vite.svg'
import piniaSvg from '@/assets/svgs/icon-pinia.svg'
import sassSvg from '@/assets/svgs/icon-sass.svg'
import zodSvg from '@/assets/svgs/icon-zod.svg'
import axiosSvg from '@/assets/svgs/icon-axios.svg'
import vueuseSvg from '@/assets/svgs/icon-vueuse.svg'
import htmlSvg from '@/assets/svgs/icon-html.svg'
import cssSvg from '@/assets/svgs/icon-css.svg'
import pnpmSvg from '@/assets/svgs/icon-pnpm.svg'
import gitSvg from '@/assets/svgs/icon-git.svg'
import CardHeader from '@/components/bases/CardHeader.vue'

/** ---------- 类型定义 ---------- */
/** 技能模块类型 */
interface TechItem {
  name: string
  icon: string
  desc: string
}



const techStack: TechItem[] = [
  { name: 'Vue 3', icon: vueSvg, desc: '核心框架' },
  { name: 'TypeScript', icon: tsSvg, desc: '类型安全' },
  { name: 'Vite', icon: viteSvg, desc: '极速构建' },
  { name: 'Pinia', icon: piniaSvg, desc: '状态管理' },
  { name: 'Sass', icon: sassSvg, desc: '样式预处理' },
  { name: 'Zod', icon: zodSvg, desc: '模式校验' },
  { name: 'Axios', icon: axiosSvg, desc: 'HTTP 请求' },
  { name: 'VueUse', icon: vueuseSvg, desc: '组合式工具集' },
  { name: 'HTML5', icon: htmlSvg, desc: '网页结构' },
  { name: 'CSS3', icon: cssSvg, desc: '网页样式' },
  { name: 'pnpm', icon: pnpmSvg, desc: '包管理器' },
  { name: 'Git', icon: gitSvg, desc: '版本控制' },
]
</script>

<template>
  <div class="site-tech">
    <div class="site-tech__header">
      <CardHeader
        title="本站技术栈"
        subtitle="Architecture & Technologies"
        icon="skill"
      />
    </div>
    
    <div class="site-tech__grid">
      <div 
        v-for="(item, index) in techStack" 
        :key="item.name"
        class="tech-item"
        :style="{ '--delay': `${index * 0.05}s` }"
        v-ripple
      >
        <div class="tech-item__icon">
          <img :src="item.icon" :alt="item.name">
        </div>
        <div class="tech-item__info">
          <div class="tech-item__name">{{ item.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.site-tech {
  width: 100%;
  @extend %card-container-base;
  @include mix.padding(sm);
  height: auto;
  &__header {
    border-bottom: 1px dashed var(--border-color);
    @include mix.margin-d(b, md);
    @include mix.padding-d(b, sm);
  }
  &__grid {
    width: 100%;
    display: grid;
    // 使用更小的列宽以容纳更多列
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: space-value(md);
  }
}

.tech-item {
  @include mix.flex-box($d: column, $g: sm); // 垂直排列
  @include mix.padding(md);
  @include mix.radius(md);
  background: var(--surface-variant);
  @extend %trans-base;
  cursor: pointer;
  opacity: 0;
  animation: slideInFromBottom 0.5s ease-out forwards;
  animation-delay: var(--delay);
  &:hover {
    background: var(--surface-hover);
    transform: translateY(-5px);
    box-shadow: var(--shadow-md);
    .tech-item__icon {
      // 触发 Jelly 动画
      animation: jelly 0.8s both;
      img {
        // 添加发光效果
        filter: drop-shadow(0 0 5px rgba(var(--primary-rgb), 0.5));
      }
    }
    .tech-item__name {
      color: var(--primary-color);
    }
  }
  &__icon {
    @include mix.size(rem(40)); // 稍微加大图标区域
    @extend %flex-center;
    @extend %trans-base;
    img {
      @include mix.size(rem(40));
      object-fit: contain;
      @extend %trans-base;
    }
  }
  &__info {
    @include mix.flex-box($d: column, $g: xs);
    text-align: center;
  }
  &__name {
    @include mix.font-style($s: sm, $w: bold);
    @extend %trans-base;
  }
}

@keyframes slideInFromBottom {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 果冻特效 Q弹动画
@keyframes jelly {
  0% { transform: scale(1, 1); }
  30% { transform: scale(1.25, 0.75); }
  40% { transform: scale(0.75, 1.25); }
  50% { transform: scale(1.15, 0.85); }
  65% { transform: scale(0.95, 1.05); }
  75% { transform: scale(1.05, 0.95); }
  100% { transform: scale(1, 1); }
}
</style>