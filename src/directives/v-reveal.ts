import type { DirectiveBinding } from "vue";

/** ---------- 类型定义 ---------- */
interface RevealOptions {
  // 动画参数
  delay?: number;     // 延迟时间 (ms)
  duration?: number;    // 动画持续时间 (ms)
  distance?: string;    // 初始偏移距离（如 '30px'）
  easing?: string;      // 缓动函数
  origin?: string;      // 变换原点
  // IntersectionObserver配置
  rootMargin?: string;       // 根元素外边距
  threshold?: number | number[];   // 触发加载的阈值
  root?: HTMLElement | null;    // 根元素
}

declare global {
  interface HTMLElement {
    _stopReveal?: () => void;
  }
}

export const reveal = (el: HTMLElement, options: RevealOptions = {}) => {
  // 默认配置
  const defaultOptions: Required<Omit<RevealOptions, 'root'>> & { root: HTMLElement | null } = {
    delay: 0,
    duration: 1000,
    distance: "50px",
    easing: "cubic-bezier(0.5, 0, 0, 1)", // 更自然的缓动效果
    origin: "bottom",
    rootMargin: '0px',
    threshold: 0.1,
    root: null,
    ...options
  }

  // 1. 立即设置初始样式（透明 + 偏移），防止闪烁
  // 注意：此时不设置 transition，等到触发动画时再动态设置，以便控制 delay
  el.style.opacity = '0'; 
  el.style.transform = `translateY(${defaultOptions.distance})`;
  
  // 标记是否是初始检查
  // 如果是初始检查且在视口内 -> 应用配置的 delay
  // 如果是后续检查（即滚动进入视口） -> delay 设为 0
  let isInitialCheck = true;

  // 创建IntersectionObserver实例
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement
          
          // 核心逻辑：判断是否需要应用延迟
          // 如果是初始检查（isInitialCheck为true），说明元素一开始就在视口内，保留 delay
          // 如果不是初始检查（isInitialCheck为false），说明元素是后来滚动进来的，移除 delay
          const appliedDelay = isInitialCheck ? defaultOptions.delay : 0;
          
          // 动态设置过渡效果
          target.style.transition = `
            opacity ${defaultOptions.duration}ms ${defaultOptions.easing} ${appliedDelay}ms,
            transform ${defaultOptions.duration}ms ${defaultOptions.easing} ${appliedDelay}ms
          `;
          
          // 强制重绘，确保 transition 设置生效后再改变属性 (通常浏览器会处理，但为了保险)
          // void target.offsetHeight; 

          // 触发动画：恢复原位 + 不透明
          target.style.opacity = '1';
          target.style.transform = 'translateY(0)';
          
          // 动画完成后清除内联样式
          setTimeout(() => {
            target.style.transform = '';
            target.style.transition = ''; 
          }, defaultOptions.duration + appliedDelay);

          observer.unobserve(target)
        }
        
        // 处理完当前这一批 entries 后，初始检查阶段结束
        // 之后的任何触发都视为“滚动进入”
        isInitialCheck = false;
      })
    },
    {
      root: defaultOptions.root,
      rootMargin: defaultOptions.rootMargin,
      threshold: defaultOptions.threshold
    }
  )

  // 开始监听
  observer.observe(el);
  
  // 添加停止监听方法
  el._stopReveal = () => {
    observer.disconnect();
    el.style.opacity = '';
    el.style.transform = '';
    el.style.transition = '';
  }

  return {
    stop: el._stopReveal
  }
}

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const options = binding.value as RevealOptions || {}
    reveal(el, options)
  },
  beforeUnmount(el: HTMLElement) {
    if (el._stopReveal) {
      el._stopReveal();
      delete el._stopReveal;
    }
  }
}
