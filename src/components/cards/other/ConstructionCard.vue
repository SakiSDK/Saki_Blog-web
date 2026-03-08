<script lang="ts" setup>
import { ref, onMounted, nextTick, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const terminalContent = ref<string>('');
const showCursor = ref(true);
const terminalRef = ref<HTMLElement | null>(null);

// ASCII Arts 库
const asciiArts = {
  // XL: 宽度 > 200 ch
  xl: `
         CCCCCCCCCCCCC                                                             tttt                                                                            tttt            iiii                                     
      CCC::::::::::::C                                                          ttt:::t                                                                         ttt:::t           i::::i                                    
    CC:::::::::::::::C                                                          t:::::t                                                                         t:::::t            iiii                                     
   C:::::CCCCCCCC::::C                                                          t:::::t                                                                         t:::::t                                                     
  C:::::C       CCCCCC   ooooooooooo   nnnn  nnnnnnnn        ssssssssss   ttttttt:::::ttttttt   rrrrr   rrrrrrrrr   uuuuuu    uuuuuu      ccccccccccccccccttttttt:::::ttttttt    iiiiiii    ooooooooooo   nnnn  nnnnnnnn    
 C:::::C               oo:::::::::::oo n:::nn::::::::nn    ss::::::::::s  t:::::::::::::::::t   r::::rrr:::::::::r  u::::u    u::::u    cc:::::::::::::::ct:::::::::::::::::t    i:::::i  oo:::::::::::oo n:::nn::::::::nn  
 C:::::C              o:::::::::::::::on::::::::::::::nn ss:::::::::::::s t:::::::::::::::::t   r:::::::::::::::::r u::::u    u::::u   c:::::::::::::::::ct:::::::::::::::::t     i::::i o:::::::::::::::on::::::::::::::nn 
 C:::::C              o:::::ooooo:::::onn:::::::::::::::ns::::::ssss:::::stttttt:::::::tttttt   rr::::::rrrrr::::::ru::::u    u::::u  c:::::::cccccc:::::ctttttt:::::::tttttt     i::::i o:::::ooooo:::::onn:::::::::::::::n 
 C:::::C              o::::o     o::::o  n:::::nnnn:::::n s:::::s  ssssss       t:::::t          r:::::r     r:::::ru::::u    u::::u  c::::::c     ccccccc      t:::::t           i::::i o::::o     o::::o  n:::::nnnn:::::n 
 C:::::C              o::::o     o::::o  n::::n    n::::n   s::::::s            t:::::t          r:::::r     rrrrrrru::::u    u::::u  c:::::c                   t:::::t           i::::i o::::o     o::::o  n::::n    n::::n 
 C:::::C              o::::o     o::::o  n::::n    n::::n      s::::::s         t:::::t          r:::::r            u::::u    u::::u  c:::::c                   t:::::t           i::::i o::::o     o::::o  n::::n    n::::n 
  C:::::C       CCCCCCo::::o     o::::o  n::::n    n::::nssssss   s:::::s       t:::::t    ttttttr:::::r            u:::::uuuu:::::u  c::::::c     ccccccc      t:::::t    tttttt i::::i o::::o     o::::o  n::::n    n::::n 
   C:::::CCCCCCCC::::Co:::::ooooo:::::o  n::::n    n::::ns:::::ssss::::::s      t::::::tttt:::::tr:::::r            u:::::::::::::::uuc:::::::cccccc:::::c      t::::::tttt:::::ti::::::io:::::ooooo:::::o  n::::n    n::::n 
    CC:::::::::::::::Co:::::::::::::::o  n::::n    n::::ns::::::::::::::s       tt::::::::::::::tr:::::r             u:::::::::::::::u c:::::::::::::::::c      tt::::::::::::::ti::::::io:::::::::::::::o  n::::n    n::::n 
      CCC::::::::::::C oo:::::::::::oo   n::::n    n::::n s:::::::::::ss          tt:::::::::::ttr:::::r              uu::::::::uu:::u  cc:::::::::::::::c        tt:::::::::::tti::::::i oo:::::::::::oo   n::::n    n::::n 
         CCCCCCCCCCCCC   ooooooooooo     nnnnnn    nnnnnn  sssssssssss              ttttttttttt  rrrrrrr                uuuuuuuu  uuuu    cccccccccccccccc          ttttttttttt  iiiiiiii   ooooooooooo     nnnnnn    nnnnnn 
`,
  // L: 宽度 ~ 112 ch
  l: `
 $$$$$$\\                                  $$\\                                     $$\\     $$\\                     
$$  __$$\\                                 $$ |                                    $$ |    \\__|                    
$$ /  \\__| $$$$$$\\  $$$$$$$\\   $$$$$$$\\ $$$$$$\\    $$$$$$\\  $$\\   $$\\  $$$$$$$\\ $$$$$$\\   $$\\  $$$$$$\\  $$$$$$$\\  
$$ |      $$  __$$\\ $$  __$$\\ $$  _____|\\_$$  _|  $$  __$$\\ $$ |  $$ |$$  _____|\\_$$  _|  $$ |$$  __$$\\ $$  __$$\\ 
$$ |      $$ /  $$ |$$ |  $$ |\\$$$$$$\\    $$ |    $$ |  \\__|$$ |  $$ |$$ /        $$ |    $$ |$$ /  $$ |$$ |  $$ |
$$ |  $$\\ $$ |  $$ |$$ |  $$ | \\____$$\\   $$ |$$\\ $$ |      $$ |  $$ |$$ |        $$ |$$\\ $$ |$$ |  $$ |$$ |  $$ |
\\$$$$$$  |\\$$$$$$  |$$ |  $$ |$$$$$$$  |  \\$$$$  |$$ |      \\$$$$$$  |\\$$$$$$$\\   \\$$$$  |$$ |\\$$$$$$  |$$ |  $$ |
 \\______/  \\______/ \\__|  \\__|\\_______/    \\____/ \\__|       \\______/  \\_______|   \\____/ \\__| \\______/ \\__|  \\__|
`,
  // M: 宽度 ~ 62 ch
  m: `
   _____                _                   _   _             
  / ____|              | |                 | | (_)            
 | |     ___  _ __  ___| |_ _ __ _   _  ___| |_ _  ___  _ __  
 | |    / _ \\| '_ \\/ __| __| '__| | | |/ __| __| |/ _ \\| '_ \\ 
 | |___| (_) | | | \\__ \\ |_| |  | |_| | (__| |_| | (_) | | | |
  \\_____\\___/|_| |_|___/\\__|_|   \\__,_|\\___|\\__|_|\\___/|_| |_|
`,
  // S: 宽度 ~ 34 ch
  s: `
╔═╗┌─┐┌┐┌┌─┐┌┬┐┬─┐┬ ┬┌─┐┌┬┐┬┌─┐┌┐┌
║  │ ││││└─┐ │ ├┬┘│ ││   │ ││ ││││
╚═╝└─┘┘└┘└─┘ ┴ ┴└─└─┘└─┘ ┴ ┴└─┘┘└┘
`
};

const currentAsciiArt = ref(asciiArts.m);
const showAscii = ref(false);

// 响应式更新 ASCII Art
const updateAsciiArt = () => {
  const width = terminalRef.value?.clientWidth || window.innerWidth;
  
  if (width > 1600) {
    currentAsciiArt.value = asciiArts.xl;
  } else if (width > 1000) {
    currentAsciiArt.value = asciiArts.l;
  } else if (width > 600) {
    currentAsciiArt.value = asciiArts.m;
  } else {
    currentAsciiArt.value = asciiArts.s;
  }
};

// 模拟终端日志
const logs = [
  '<span class="text-gray">&gt;</span> 正在初始化构建环境...',
  '<span class="text-gray">&gt;</span> 正在加载核心模块...',
  '<span class="text-gray">&gt;</span> 正在编译系统资源...',
  '<span class="text-gray">&gt;</span> <span class="text-yellow">警告：</span>检测到页面正在施工中...',
  '<span class="text-gray">&gt;</span> <span class="text-blue">状态：</span>工程师正在努力搬砖 (Ing...)',
  '<span class="text-gray">&gt;</span> <span class="text-purple">提示：</span>请稍后再来探索吧！',
  '',
  '<span class="text-gray">&gt;</span> <span class="text-green">系统就绪。</span>',
];

const prompt = '<span class="text-green">visitor</span><span class="text-gray">@</span><span class="text-blue">sakisdk-blog</span><span class="text-gray">:</span><span class="text-blue">~</span><span class="text-gray">$</span> ';
const command = 'cd /home';

const typeText = async (text: string, delay = 10) => {
  for (const char of text) {
    terminalContent.value += char;
    await new Promise(r => setTimeout(r, delay));
    scrollToBottom();
  }
};

const scrollToBottom = () => {
  if (terminalRef.value) {
    terminalRef.value.scrollTop = terminalRef.value.scrollHeight;
  }
};

const runTerminal = async () => {
  // 1. 显示 ASCII Art
  // 确保初始加载时选择正确的尺寸
  updateAsciiArt();
  showAscii.value = true;
  await new Promise(r => setTimeout(r, 500));

  // 2. 逐行显示日志
  for (const log of logs) {
    terminalContent.value += `${log}\n`;
    await new Promise(r => setTimeout(r, 200));
    scrollToBottom();
  }
  
  await new Promise(r => setTimeout(r, 500));
  
  // 3. 显示 Prompt
  terminalContent.value += `\n${prompt}`;
  await new Promise(r => setTimeout(r, 500));
  
  // 4. 打字输入命令
  await typeText(command, 100);
  
  // 5. 等待用户确认 (这里模拟一下，直接显示提示)
  await new Promise(r => setTimeout(r, 500));
};

const handleBackHome = () => {
  router.push('/');
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && terminalContent.value.includes(command)) {
    handleBackHome();
  }
};

onMounted(() => {
  runTerminal();
  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('resize', updateAsciiArt);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('resize', updateAsciiArt);
});
</script>

<template>
  <div class="construction-container">
    <div class="ide-window">
      <!-- Terminal Header -->
      <div class="ide-header">
        <div class="traffic-lights">
          <span class="light red"></span>
          <span class="light yellow"></span>
          <span class="light green"></span>
        </div>
        <div class="terminal-title">
          <i class="iconfont icon-terminal"></i> zsh — 80x24
        </div>
      </div>

      <!-- Terminal Body -->
      <div class="ide-content" ref="terminalRef">
        <pre class="terminal-output"><div v-if="showAscii" class="text-cyan ascii-art">{{ currentAsciiArt }}</div><span v-html="terminalContent"></span><span v-if="showCursor" class="cursor">█</span></pre>
        
        <!-- 交互区域 -->
        <div v-if="terminalContent.includes(command)" class="interactive-area" @click="handleBackHome">
          <span class="link-hint">[ 按回车键或点击此处返回首页 ]</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.construction-container {
  @include mix.flex-box($j: center, $a: center);
  width: 100%;
  height: 100%; 
  max-width: none; 
  box-sizing: border-box; 
}

.ide-window {
  width: 100%;
  height: 100%; 
  display: flex; 
  flex-direction: column;
  background-color: var(--ide-bg);
  overflow: hidden;
  box-shadow: 0 20px 68px rgba(0, 0, 0, 0.55);
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  border: 1px solid var(--ide-border);
  transition: all 0.3s ease;
  
  // 终端风格变量
  --ide-bg: #1e1e1e; // 更深的黑色背景
  --ide-header-bg: #2d2d2d;
  --ide-border: #333;
  --terminal-text: #cccccc;
  --terminal-green: #4af626;
  --terminal-blue: #4b8af7;
  
  :global([data-theme='light']) & {
     // 亮色终端 (macOS Terminal Light)
     --ide-bg: #ffffff;
     --ide-header-bg: #f0f0f0;
     --ide-border: #d0d0d0;
     --terminal-text: #333333;
     --terminal-green: #28a745;
     --terminal-blue: #0366d6;
  }
}

.ide-header {
  height: 36px;
  background-color: var(--ide-header-bg);
  @include mix.flex-box($a: center, $j: flex-start);
  padding: 0 16px;
  border-bottom: 1px solid var(--ide-border);
  position: relative;
  flex-shrink: 0;

  .traffic-lights {
    @include mix.flex-box($a: center);
    gap: 8px;
    
    .light {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      
      &.red { background-color: #ff5f56; }
      &.yellow { background-color: #ffbd2e; }
      &.green { background-color: #27c93f; }
    }
  }

  .terminal-title {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    color: var(--terminal-text);
    font-size: 13px;
    opacity: 0.7;
    @include mix.flex-box($a: center);
    gap: 6px;
    
    i {
      font-size: 14px;
    }
  }
}

.ide-content {
  flex: 1; 
  padding: 24px;
  overflow-y: auto; 
  position: relative;
  background: var(--ide-bg);
  color: var(--terminal-text);
  @include mix.font-style($s: md, $l: 1.5);
  
  // 隐藏滚动条
  scrollbar-width: none; 
  &::-webkit-scrollbar {
    display: none; 
  }
}

.terminal-output {
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
  font-family: inherit;
  color: var(--terminal-text);
}

.cursor {
  display: inline-block;
  width: 10px;
  height: 1.2em;
  background-color: var(--terminal-text);
  vertical-align: text-bottom;
  animation: blink 1s step-end infinite;
  margin-left: 2px;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.interactive-area {
  margin-top: 16px;
  cursor: pointer;
  
  .link-hint {
    color: var(--terminal-blue);
    font-weight: bold;
    text-decoration: underline;
    
    &:hover {
      color: var(--terminal-green);
    }
    
    &::before {
      content: '➜ ';
      color: var(--terminal-green);
      text-decoration: none;
    }
  }
}

// 颜色工具类 (使用 :deep 以支持 v-html)
:deep(.text-green) { color: var(--terminal-green); }
:deep(.text-blue) { color: var(--terminal-blue); }
:deep(.text-yellow) { color: #ffbd2e; }
:deep(.text-red) { color: #ff5f56; }
:deep(.text-cyan) { color: #5de4c7; }
:deep(.text-purple) { color: #d55fde; }
:deep(.text-gray) { color: #888888; }

.ascii-art {
  white-space: pre;
  overflow-x: auto;
  margin-bottom: 1em;
  font-weight: bold;
}
</style>
