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
  height: 350px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.scroll-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px; // Increased gap between rows for better separation
  padding: 10px 0;
  mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
  overflow: hidden; // Ensure no vertical overflow
}

.scroll-track-container {
  width: 100%;
  overflow: hidden;
  display: flex;
  padding: 4px 0; // Add some vertical padding for hover effects
  
  &:hover {
    .scroll-track {
      animation-play-state: paused;
    }
  }
}

.scroll-track {
  display: flex;
  gap: 16px;
  width: max-content;
  
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
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding: 6px 14px; // Slightly reduced padding
  border-radius: 50px;
  background-color: var(--bg-base);
  border: 1px solid var(--border-base);
  transition: all 0.3s ease;
  white-space: nowrap;
  user-select: none;
  flex-shrink: 0;
  height: 36px; // Fixed height for consistency

  &:hover {
    transform: translateY(-2px);
    background-color: var(--bg-strong);
    box-shadow: var(--shadow-sm);
    border-color: var(--primary-base);
    
    .tech-icon {
      transform: scale(1.1);
    }
  }
}

.tech-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px; // Fixed width container
  height: 20px; // Fixed height container
}

.tech-icon {
  width: 100%;
  height: 100%;
  object-fit: contain; // Ensure icon fits within the box
  transition: transform 0.3s ease;
}

.tech-name {
  font-size: 0.85rem; // Slightly smaller font
  font-weight: 500;
  color: var(--text-base);
  line-height: 1;
}
</style>
