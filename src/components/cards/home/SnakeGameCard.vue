<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useIntervalFn, useElementSize } from '@vueuse/core';

// 游戏配置
const GRID_SIZE = 15;
const INITIAL_SPEED = 150;

// 游戏状态
const canvasRef = ref<HTMLCanvasElement | null>(null);
const gameWrapperRef = ref<HTMLElement | null>(null);
const { width: containerWidth, height: containerHeight } = useElementSize(gameWrapperRef);

// 计算画布大小和网格数
const tileCountX = computed(() => Math.max(10, Math.floor(containerWidth.value / GRID_SIZE)));
const tileCountY = computed(() => Math.max(10, Math.floor(containerHeight.value / GRID_SIZE)));
const canvasWidth = computed(() => tileCountX.value * GRID_SIZE);
const canvasHeight = computed(() => tileCountY.value * GRID_SIZE);

const score = ref(0);
const isPlaying = ref(false);
const isGameOver = ref(false);
const gameSpeed = ref(INITIAL_SPEED);

// 蛇和食物
type Point = { x: number; y: number };
let snake: Point[] = [{ x: 10, y: 10 }];
let food: Point = { x: 5, y: 5 };
let velocity: Point = { x: 0, y: 0 };
let nextVelocity: Point = { x: 0, y: 0 }; // 防止单帧多次按键导致反向

// 绘图上下文
let ctx: CanvasRenderingContext2D | null = null;

// 监听容器大小变化，重置游戏
watch([containerWidth, containerHeight], () => {
  resetGame();
  startGame();
});

// 初始化
onMounted(() => {
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d');
    // 等待一下让容器有尺寸
    setTimeout(() => {
      resetGame();
      startGame();
    }, 100);
  }
});

// 游戏循环
const { pause, resume } = useIntervalFn(() => {
  update();
  draw();
}, gameSpeed, { immediate: false });

// 开始游戏
const startGame = () => {
  resetGame();
  // 必须重新创建定时器以应用新速度（useIntervalFn 的 gameSpeed 即使是 ref 也可能不会动态重置内部 timer）
  // 或者确保 pause() 后 resume() 能正确读取 gameSpeed.value
  // useIntervalFn 会响应 gameSpeed ref 的变化，所以只需重置 value
  
  isPlaying.value = true;
  isGameOver.value = false;
  // AI 会接管 velocity
  resume();
};

// 重置游戏
const resetGame = () => {
  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ];
  score.value = 0;
  // 重置速度
  gameSpeed.value = INITIAL_SPEED;
  pause(); // 先暂停当前循环
  spawnFood();
  draw();
  // 注意：这里不自动 resume，等待 startGame 调用
};

// 生成食物
const spawnFood = () => {
  food = {
    x: Math.floor(Math.random() * tileCountX.value),
    y: Math.floor(Math.random() * tileCountY.value)
  };
  // 确保食物不生成在蛇身上
  if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
    spawnFood();
  }
};

// 更新逻辑
const update = () => {
  // 始终执行 AI 移动
  performAIMove();
  
  velocity = nextVelocity;
  if (snake.length === 0) return;
  const head = { x: snake[0]!.x + velocity.x, y: snake[0]!.y + velocity.y };

  // 撞墙检测
  if (head.x < 0 || head.x >= tileCountX.value || head.y < 0 || head.y >= tileCountY.value) {
    gameOver();
    return;
  }

  // 撞自己检测
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    gameOver();
    return;
  }

  snake.unshift(head);

  // 吃食物
  if (head.x === food.x && head.y === food.y) {
    score.value += 10;
    spawnFood();
    // 稍微加速
    if (gameSpeed.value > 50) {
      gameSpeed.value = Math.max(50, INITIAL_SPEED - Math.floor(score.value / 50) * 10);
      pause();
      resume();
    }
  } else {
    snake.pop();
  }
};

// AI 移动逻辑
const performAIMove = () => {
  const head = snake[0];
  if (!head) return;
  
  const moves = [
    { x: 0, y: -1 }, // Up
    { x: 0, y: 1 },  // Down
    { x: -1, y: 0 }, // Left
    { x: 1, y: 0 }   // Right
  ];
  
  // 过滤有效移动
  const validMoves = moves.filter(m => {
    // 防止反向
    if (m.x === -velocity.x && m.y === -velocity.y && snake.length > 1) return false;
    
    const nextX = head.x + m.x;
    const nextY = head.y + m.y;
    
    // 撞墙
    if (nextX < 0 || nextX >= tileCountX.value || nextY < 0 || nextY >= tileCountY.value) return false;
    
    // 撞自己
    if (snake.some(s => s.x === nextX && s.y === nextY)) return false;
    
    return true;
  });
  
  if (validMoves.length > 0) {
    // 按距离食物排序
    validMoves.sort((a, b) => {
      const distA = Math.abs((head.x + a.x) - food.x) + Math.abs((head.y + a.y) - food.y);
      const distB = Math.abs((head.x + b.x) - food.x) + Math.abs((head.y + b.y) - food.y);
      return distA - distB;
    });
    
    // 简单的贪婪算法：选择最近的移动
    // 如果最近的移动会导致死路（这里没做深度检测），可能会死，但重启机制会处理
    nextVelocity = validMoves[0]!;
  } else {
    // 无路可走，保持原样（等待撞死）
  }
};

// 绘图逻辑
const draw = () => {
  if (!ctx) return;

  // 获取样式变量
  const style = getComputedStyle(document.body);
  // 使用 surface-base 作为背景，与卡片一致
  const bgColor = style.getPropertyValue('--surface-base').trim() || '#ffffff';
  const snakeColor = style.getPropertyValue('--primary-base').trim() || '#4ade80';
  const foodColor = style.getPropertyValue('--secondary-base').trim() || '#f87171';
  // 使用 primary-strong 作为蛇头颜色
  const snakeHeadColor = style.getPropertyValue('--primary-strong').trim() || '#22c55e';
  // 使用 neutral-ghost (极淡的中性色) 作为网格线，避免过于突兀
  const gridColor = style.getPropertyValue('--neutral-ghost').trim() || 'rgba(0, 0, 0, 0.05)';

  // 清空画布
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvasWidth.value, canvasHeight.value);

  // 画网格
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  // 垂直线
  for (let i = 0; i <= tileCountX.value; i++) {
    ctx.moveTo(i * GRID_SIZE, 0);
    ctx.lineTo(i * GRID_SIZE, canvasHeight.value);
  }
  // 水平线
  for (let i = 0; i <= tileCountY.value; i++) {
    ctx.moveTo(0, i * GRID_SIZE);
    ctx.lineTo(canvasWidth.value, i * GRID_SIZE);
  }
  ctx.stroke();

  // 画蛇
  snake.forEach((segment, index) => {
    ctx!.fillStyle = index === 0 ? snakeHeadColor : snakeColor;
    // 稍微缩小一点以显示网格间隙
    const padding = 1;
    ctx!.fillRect(
      segment.x * GRID_SIZE + padding, 
      segment.y * GRID_SIZE + padding, 
      GRID_SIZE - padding * 2, 
      GRID_SIZE - padding * 2
    );
  });

  // 画食物 (方块)
  ctx.fillStyle = foodColor;
  const foodPadding = 2;
  ctx.fillRect(
    food.x * GRID_SIZE + foodPadding,
    food.y * GRID_SIZE + foodPadding,
    GRID_SIZE - foodPadding * 2,
    GRID_SIZE - foodPadding * 2
  );
};

// 游戏结束
const gameOver = () => {
  // 立即重启
  startGame();
};

</script>

<template>
  <div class="snake-card">
    <div class="snake-card__container" ref="gameWrapperRef">      
      <div class="game-wrapper">
        <canvas 
          ref="canvasRef" 
          :width="canvasWidth" 
          :height="canvasHeight"
          class="game-canvas"
        ></canvas>
        
        <div class="score-display">
          <span>Score: {{ score }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.snake-card {
  height: 350px;
  &__container {
    height: 100%;
    @include mix.flex-box($d: column);
    position: relative;
    overflow: hidden;
  }
}
.game-wrapper {
  position: relative;
  width: 100%;
  @extend %flex-center;
  flex: 1;
}
.game-canvas {
  display: block;
  @include mix.radius(lg);
  background-color: var(--bg-base);
}
.score-display {
  @include mix.position-style($p: absolute, $t: 10px, $r: 10px);
  @include mix.padding(xs sm);
  @include mix.radius(sm);
  background: var(--black-weak);
  @include mix.font-style($s: sm, $w: bold, $c: var(--white-base));
  pointer-events: none;
}
</style>
