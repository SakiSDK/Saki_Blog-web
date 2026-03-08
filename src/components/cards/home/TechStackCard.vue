<script lang="ts" setup>
import CardHeader from '@/components/bases/CardHeader.vue';
import { computed } from 'vue';

// Import SVGs
import htmlIcon from '@/assets/svgs/icon-html.svg';
import cssIcon from '@/assets/svgs/icon-css.svg';
import sassIcon from '@/assets/svgs/icon-sass.svg';
import jsIcon from '@/assets/svgs/icon-js.svg';
import tsIcon from '@/assets/svgs/icon-typescript.svg';
import vueIcon from '@/assets/svgs/icon-vue-js.svg';
import viteIcon from '@/assets/svgs/icon-vite.svg';
import piniaIcon from '@/assets/svgs/icon-pinia.svg';
import gitIcon from '@/assets/svgs/icon-git.svg';
import pnpmIcon from '@/assets/svgs/icon-pnpm.svg';
import nodeIcon from '@/assets/svgs/icon-nodejs.svg';
import redisIcon from '@/assets/svgs/icon-redis.svg';
import mysqlIcon from '@/assets/svgs/icon-mysql.svg';
import pythonIcon from '@/assets/svgs/icon-python.svg';
import sequelizeIcon from '@/assets/svgs/icon-sequelize.svg';
import dockerIcon from '@/assets/svgs/icon-docker.svg';
import npmIcon from '@/assets/svgs/icon-npm.svg';
import elementIcon from '@/assets/svgs/icon-element-plus.svg';
import axiosIcon from '@/assets/svgs/icon-axios.svg';
import zodIcon from '@/assets/svgs/icon-zod.svg';
import vueuseIcon from '@/assets/svgs/icon-vueuse.svg';

// Categorize tech stack into distinct groups
const frontendStack = [
  { name: 'Vue.js', icon: vueIcon },
  { name: 'Vite', icon: viteIcon },
  { name: 'Pinia', icon: piniaIcon },
  { name: 'VueUse', icon: vueuseIcon },
  { name: 'Element Plus', icon: elementIcon },
  { name: 'HTML5', icon: htmlIcon },
  { name: 'CSS3', icon: cssIcon },
  { name: 'Sass', icon: sassIcon },
];

const langAndToolsStack = [
  { name: 'TypeScript', icon: tsIcon },
  { name: 'JavaScript', icon: jsIcon },
  { name: 'Node.js', icon: nodeIcon },
  { name: 'Python', icon: pythonIcon },
  { name: 'Axios', icon: axiosIcon },
  { name: 'Zod', icon: zodIcon },
  { name: 'Sequelize', icon: sequelizeIcon },
];

const devOpsAndDbStack = [
  { name: 'Git', icon: gitIcon },
  { name: 'Docker', icon: dockerIcon },
  { name: 'MySQL', icon: mysqlIcon },
  { name: 'Redis', icon: redisIcon },
  { name: 'pnpm', icon: pnpmIcon },
  { name: 'npm', icon: npmIcon },
];

// Create seamless loops by duplicating the arrays
// Quadrupling arrays to ensure they are long enough for the marquee effect and consistent animation
const row1 = computed(() => [...frontendStack, ...frontendStack, ...frontendStack, ...frontendStack]);
const row2 = computed(() => [...langAndToolsStack, ...langAndToolsStack, ...langAndToolsStack, ...langAndToolsStack]);
const row3 = computed(() => [...devOpsAndDbStack, ...devOpsAndDbStack, ...devOpsAndDbStack, ...devOpsAndDbStack]);

</script>

<template>
  <div class="tech-stack-card">
    <CardHeader title="技术栈" subtitle="Tech Stack" icon="rocket" />
    <div class="scroll-wrapper">
      <!-- Row 1: Frontend (Left Scroll) -->
      <div class="scroll-track-container">
        <div class="scroll-track scroll-left">
          <div 
            v-for="(tech, index) in row1" 
            :key="`r1-${index}`" 
            class="tech-item"
          >
            <div class="tech-icon-wrapper">
              <img :src="tech.icon" :alt="tech.name" class="tech-icon" />
            </div>
            <span class="tech-name">{{ tech.name }}</span>
          </div>
        </div>
      </div>
      <!-- Row 2: Languages & Tools (Right Scroll) -->
      <div class="scroll-track-container">
        <div class="scroll-track scroll-right">
          <div 
            v-for="(tech, index) in row2" 
            :key="`r2-${index}`" 
            class="tech-item"
          >
            <div class="tech-icon-wrapper">
              <img :src="tech.icon" :alt="tech.name" class="tech-icon" />
            </div>
            <span class="tech-name">{{ tech.name }}</span>
          </div>
        </div>
      </div>
      <!-- Row 3: DevOps & DB (Left Scroll Slow) -->
      <div class="scroll-track-container">
        <div class="scroll-track scroll-left-slow">
          <div 
            v-for="(tech, index) in row3" 
            :key="`r3-${index}`" 
            class="tech-item"
          >
            <div class="tech-icon-wrapper">
              <img :src="tech.icon" :alt="tech.name" class="tech-icon" />
            </div>
            <span class="tech-name">{{ tech.name }}</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style lang="scss" scoped>
.tech-stack-card {
  @extend %card-container-base;
  @include mix.padding(0);
  @include mix.flex-box($d: column);
  overflow: hidden;
  height: 350px;
}
.scroll-wrapper {
  flex: 1;
  @include mix.flex-box($d: column, $g: lg);
  @include mix.padding(sm 0);
  mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
  overflow: hidden; // Ensure no vertical overflow
}
.scroll-track-container {
  width: 100%;
  overflow: hidden;
  display: flex;
  @include mix.padding(xs 0);
  &:hover {
    .scroll-track {
      animation-play-state: paused;
    }
  }
}
.scroll-track {
  display: flex;
  width: max-content;
  @include mix.gap(md);
  &.scroll-left {
    animation: scrollLeft 40s linear infinite;
  }
  &.scroll-right {
    animation: scrollRight 45s linear infinite;
  }
  &.scroll-left-slow {
    animation: scrollLeft 50s linear infinite;
  }
}
@keyframes scrollLeft {
  0% { transform: translateX(0); }
  100% { transform: translateX(-25%); }
}
@keyframes scrollRight {
  0% { transform: translateX(-25%); }
  100% { transform: translateX(0); }
}
.tech-item {
  height: 36px; // Fixed height for consistency
  @include mix.flex-box($g: sm);
  @include mix.container-style($p: xs md, $r: 50px, $bg: var(--bg-base));
  @include hov.move-y;
  @include hov.border;
  @include hov.bg;
  white-space: nowrap;
  user-select: none;
  flex-shrink: 0;
  transition: all 0.3s ease;
  &:hover {
    box-shadow: var(--shadow-sm);
    .tech-icon {
      transform: scale(1.1);
    }
  }
}
.tech-icon-wrapper {
  @extend %flex-center;
  @include mix.size(20px);
}
.tech-icon {
  @extend %full-size;
  @include anim.transition($p: transform, $dr: 0.3s, $tf: ease);
  object-fit: contain; // Ensure icon fits within the box
}
.tech-name {
  @include mix.font-style($s: md, $w: 500, $c: var(--text-base), $l: 1, $f: title);
}
</style>
