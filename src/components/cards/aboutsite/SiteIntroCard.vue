<script lang="ts" setup>
import WindowBar from '@/components/bases/WindowBar.vue'
import { ref, nextTick, type CSSProperties } from 'vue'
import { useScrollLock } from '@vueuse/core'

const isVisible = ref(true)
const isMinimized = ref(false)
const isMaximized = ref(false)

const cardRef = ref<HTMLElement | null>(null)
const placeholderRef = ref<HTMLElement | null>(null)
const cardStyles = ref<CSSProperties>({})
const placeholderStyles = ref<CSSProperties>({})

const handleMaximize = async () => {
  if (isMinimized.value) {
    isMinimized.value = false
    return
  }
  
  if (!isMaximized.value) {
    // 禁用滚动
    useScrollLock(document.body, true)

    // 开启最大化
    if (!cardRef.value) return
    
    // 1. 获取当前位置尺寸
    const rect = cardRef.value.getBoundingClientRect()
    
    // 2. 设置占位符尺寸防止布局塌陷
    placeholderStyles.value = {
      width: `${rect.width}px`,
      height: `${rect.height}px`
    }
    
    // 3. 固定当前位置 (锁定起始状态)
    cardStyles.value = {
      position: 'fixed',
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      zIndex: 1000,
      transition: 'none', // 初始位置不动画
      transform: 'none'
    }
    
    isMaximized.value = true
    
    await nextTick()
    
    // 4. 强制重绘
    // eslint-disable-next-line no-unused-expressions
    cardRef.value.offsetHeight
    
    // 5. 动画到目标位置 (屏幕中心)
    requestAnimationFrame(() => {
      cardStyles.value = {
        ...cardStyles.value,
        transition: 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
        top: '50%',
        left: '50%',
        width: '90vw',
        height: '85vh',
        transform: 'translate(-50%, -50%)'
      }
    })
    
  } else {
    // 启用滚动
    useScrollLock(document.body, false)
    // 关闭最大化 (还原)
    if (!placeholderRef.value) {
      isMaximized.value = false
      return
    }
    
    // 1. 获取占位符当前位置
    const rect = placeholderRef.value.getBoundingClientRect()
    
    // 2. 动画回到原位
    cardStyles.value = {
      ...cardStyles.value,
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      transform: 'none' // 清除中心变换
    }
    
    // 3. 动画结束后清理样式
    setTimeout(() => {
      isMaximized.value = false
      // 直接重置样式对象，确保移除 fixed 定位
      cardStyles.value = {}
      placeholderStyles.value = {}
    }, 500) // 对应 transition 时间
  }
}

const codeLines = [
  { id: 1, html: `<span class="comment">// 这是一个用于 <span class="highlight">技术沉淀</span> 的个人博客</span>` },
  { id: 2, html: `<span class="keyword">const</span> <span class="variable">mission</span> = <span class="string">"记录开发中遇到的 Bug 与解决方案"</span>;` },
  { id: 3, html: `<span class="keyword">const</span> <span class="variable">notes</span> = <span class="string">"学习新框架时的笔记和心得"</span>;` },
  { id: 4, html: `<br>` },
  { id: 5, html: `<span class="keyword">if</span> (<span class="prop">experience</span>.isValuable) {` },
  { id: 6, html: `&nbsp;&nbsp;<span class="func">archive</span>(<span class="arg">experience</span>);` },
  { id: 7, html: `}` },
  { id: 8, html: `<br>` },
  { id: 9, html: `<span class="comment">/* 既是为了防止遗忘，也希望能给你提供参考 */</span> <span class="cursor">_</span>` },
]
</script>

<template>
  <div v-if="isMaximized" class="site-intro-backdrop" @click="handleMaximize"></div>
  <!-- 占位符，防止布局塌陷 -->
  <div 
    v-if="isMaximized" 
    ref="placeholderRef" 
    class="site-intro-placeholder" 
    :style="placeholderStyles"
  ></div>
  <div 
    v-if="isVisible"
    class="site-intro" 
    ref="cardRef"
    :style="cardStyles"
    :class="{ 
      'is-minimized': isMinimized,
      'is-maximized': isMaximized 
    }"
  >
    <!-- 顶部窗口栏 -->
    <div class="site-intro__header">
      <WindowBar 
        title="README.md" 
        @close="isVisible = false"
        @minimize="isMinimized = !isMinimized"
        @maximize="handleMaximize"
      />
    </div>
    <div class="site-intro__content" v-show="!isMinimized">
      <!-- 代码区域 -->
      <div class="code-container">
        <div v-for="line in codeLines" :key="line.id" class="code-row">
          <div class="line-number">{{ line.id.toString().padStart(2, '0') }}</div>
          <div class="code-text" v-html="line.html"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.site-intro {
  @extend %full-size;
  // 强制使用 One Dark 主题色，营造代码编辑器氛围
  @include mix.container-style($p: 0, $bg: var(--window-bg-base), $b: #3e4451, $o: hidden);
  @include hov.card($t: true);
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: none;

  &__content {
    flex: 1;
    display: flex;
    position: relative;
    @include mix.container-style($p: 1.5rem, $bg: transparent, $o: hidden, $r: 0);
    // 背景装饰 - 调整为更适合深色背景的样式
    &::before {
      content: '';
      @extend %full-size;
      @include mix.position-style($p: absolute, $t: 0, $l: 0);
      background-image: radial-gradient(#3e4451 1px, transparent 1px);
      background-size: 20px 20px;
      opacity: 0.2;
      pointer-events: none;
    }
  }

  &.is-minimized {
    height: auto !important;
    min-height: auto !important;
    :deep(.window-bar) {
      border-bottom: none;
      border-bottom-left-radius: inherit;
      border-bottom-right-radius: inherit;
    }
  }

  &.is-maximized {
    // 基础样式由 JS 控制，这里保留一些视觉辅助
    z-index: 1000;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    // transition 统一由 JS 控制，避免冲突
    
    // 放大时的内容区域样式调整
    .code-row {
      font-size: 1.2rem; // 放大字体
      line-height: 2;
    }
    
    .line-number {
      width: 3.5rem; // 增加行号宽度
    }
  }

  // 占位符样式
  &-placeholder {
    visibility: hidden; // 不可见但占位
    flex-shrink: 0; // 防止在 flex 容器中被压缩
  }

  .code-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    z-index: 1;
    overflow-y: auto; // 允许垂直滚动
    // 隐藏滚动条但保留功能
    &::-webkit-scrollbar {
      width: 4px;
    }
    &::-webkit-scrollbar-thumb {
      background: #3e4451;
      border-radius: 2px;
    }
  }

  .code-row {
    display: flex;
    @include mix.font-style($l: 1.8, $f: monospace, $s: md);
    &:hover {
      background: rgba(255, 255, 255, 0.03); // 行高亮
    }
  }

  .line-number {
    flex-shrink: 0;
    width: 2.5rem;
    padding-right: 1rem;
    color: #4b5263;
    text-align: right;
    user-select: none;
    border-right: 1px solid #3e4451;
    margin-right: 1rem;
  }

  .code-text {
    color: #abb2bf;
    overflow-wrap: break-word; // 允许长单词换行，比 break-all 更优雅
    white-space: pre-wrap; // 保留空格但允许换行
    flex: 1;
  }
}

.site-intro-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 999;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

// 语法高亮样式 (One Dark Vivid)
// 使用 :deep() 因为内容是通过 v-html 渲染的
:deep(.keyword) { color: #c678dd; font-weight: bold; } // 紫色
:deep(.variable) { color: #e06c75; } // 红色
:deep(.string) { color: #98c379; } // 绿色
:deep(.prop) { color: #d19a66; } // 橙色
:deep(.func) { color: #61afef; } // 蓝色
:deep(.arg) { color: #e5c07b; } // 黄色
:deep(.comment) { color: #5c6370; font-style: italic; } // 灰色注释
:deep(.highlight) { color: #e5c07b; font-weight: bold; } // 使用黄色强调
:deep(.cursor) {
  display: inline-block;
  @include mix.margin-d(l, xs);
  @include mix.font-style($c: var(--primary-base), $w: bold);
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>