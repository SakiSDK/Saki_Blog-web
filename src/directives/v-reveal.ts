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

  // 设置初始样式（透明 + 偏移）
  el.style.opacity = '0.5';
  el.style.transform = `translateY(${defaultOptions.distance})`;
  el.style.transition = `
    opacity ${defaultOptions.duration}ms ${defaultOptions.easing} ${defaultOptions.delay}ms,
    transform ${defaultOptions.duration}ms ${defaultOptions.easing} ${defaultOptions.delay}ms
  `;
  // 避免闪烁，强制重绘
  // el.offsetHeight; 

  // 创建IntersectionObserver实例
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // 获取元素
          const target = entry.target as HTMLElement
          
          // 触发动画：恢复原位 + 不透明
          target.style.opacity = '1';
          target.style.transform = 'translateY(0)';
          
          // 动画完成后清除内联样式（可选，避免影响后续交互，但要小心 transitions）
          // 这里保留 transition 样式以支持可能的 hover 效果或其他变换
          // 但通常 reveal 是一次性的，完成后可以清理 transform
          setTimeout(() => {
            target.style.transform = '';
            target.style.transition = ''; 
            // 注意：清除 transition 可能会导致 hover 效果失去过渡，视情况而定
            // 如果组件本身有 hover 效果，最好只清除 transform
          }, defaultOptions.duration + defaultOptions.delay);

          // 停止监听
          observer.unobserve(target)
        }
      })
    },
    {
      root: defaultOptions.root,
      rootMargin: defaultOptions.rootMargin,
      threshold: defaultOptions.threshold
    }
  )

  // 开始监听目标元素
  observer.observe(el)
  
  // 添加停止监听方法
  el._stopReveal = () => {
    observer.disconnect();
    // 恢复样式（可选）
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
    // 获取指令参数
    const options = binding.value as RevealOptions || {}
    // 开始监听
    reveal(el, options)
  },
  beforeUnmount(el: HTMLElement) {
    // 卸载时停止监听
    if (el._stopReveal) {
      el._stopReveal();
      delete el._stopReveal;
    }
  }
}
