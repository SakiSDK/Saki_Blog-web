import type { Directive, DirectiveBinding, Ref } from "vue";
import { useEventListener, useRafFn, useTimeoutFn } from "@vueuse/core";
import { computed, watchEffect, unref } from 'vue';
import type { RippleElement, RippleOptions } from "@/types/directives/ripple";
import { storeToRefs } from "pinia";



const defaultOptions: Required<RippleOptions> = {
  color: 'rgba(255, 255, 255, 0.3)',
  duration: 800,
  disabled: false,
  center: false
}

// 创建涟漪效果
const createRippleEffect = (
  event: MouseEvent,
  el: HTMLElement,
  options: Required<RippleOptions>
) => {
  if (options.disabled) return;

  const rect = el.getBoundingClientRect();
  let x: number;
  let y: number;

  if (options.center) {
    // 中心位置
    x = rect.width / 2
    y = rect.height / 2
  } else {
    // 鼠标点击位置（相对于元素）
    x = event.clientX - rect.left;
    y = event.clientY - rect.top;
  }

  const diameter = Math.max(el.clientWidth, el.clientHeight);
  const radius = diameter / 2;

  const circle = document.createElement("span");

  // 设置样式
  Object.assign(circle.style, {
      width: `${diameter}px`,
      height: `${diameter}px`,
      left: `${x - radius}px`,
      top: `${y - radius}px`,
      position: "absolute",
      borderRadius: "50%",
      backgroundColor: options.color,
      transform: "scale(0)",
      pointerEvents: "none",
      zIndex: "9999",
      animation: `ripple ${options.duration}ms linear`
  })

  // 添加动画关键帧
  if (!document.getElementById('ripple-animation-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-animation-style';
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(4);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  el.appendChild(circle);

  // 使用 VueUse 的 timeout 函数
  const { start } = useTimeoutFn(() => {
    if (circle.parentNode === el) {
      el.removeChild(circle);
    }
  }, options.duration);

  start();
}

// 优化的 Ripple 指令
export const rippleDirective: Directive<RippleElement, boolean | RippleOptions> = {
  mounted(el: RippleElement, binding: DirectiveBinding<boolean | RippleOptions>) {
    // 解析配置
    const options = computed(() => {
      const value = binding.value;
      if (typeof value === "boolean") {
        return { ...defaultOptions, disabled: !value };
      }
      return { ...defaultOptions, ...value };
    });

    // 确保元素有正确的样式
    const ensureRippleStyles = () => {
      if (el.style.position === "" || el.style.position === "static") {
        el.style.position = "relative";
      }
      el.style.overflow = "hidden";
    };

    ensureRippleStyles();

    // 使用 VueUse 的事件监听器（自动清理）
    const stop = useEventListener(el, "click", (event: MouseEvent) => {
      if (options.value.disabled) return;
      createRippleEffect(event, el, options.value);
    });

    // 存储清理函数
    el._ripple = {
      enabled: !options.value.disabled,
      cleanup: stop
    };

    // 监听窗口大小变化，重新确保样式
    const pauseResizeListener = useEventListener(window, "resize", ensureRippleStyles);
    
    // 使用 RAF 优化性能
    const { pause: pauseRaf } = useRafFn(() => {
      // 这里可以添加任何需要每帧更新的逻辑
    }, { immediate: false });

    // 存储额外的清理函数
    el._ripple.cleanup = () => {
      stop();
      pauseResizeListener();
      pauseRaf();
    };
  },

  updated(el: RippleElement, binding: DirectiveBinding<boolean | RippleOptions>) {
    // 解析新配置
    const options = computed(() => {
      const value = binding.value;
      if (typeof value === "boolean") {
        return { ...defaultOptions, disabled: !value };
      }
      return { ...defaultOptions, ...value };
    });

    // 更新启用状态
    if (el._ripple) {
      el._ripple.enabled = !options.value.disabled;
    }

    // 确保样式正确
    if (!options.value.disabled) {
      if (el.style.position === "" || el.style.position === "static") {
        el.style.position = "relative";
      }
      el.style.overflow = "hidden";
    } else {
      el.style.position = "";
      el.style.overflow = "";
    }
  },

  unmounted(el: RippleElement) {
    // 清理所有事件监听器和资源
    if (el._ripple?.cleanup) {
      el._ripple.cleanup();
      delete el._ripple;
    }
  }
};

// 组合式函数版本（可选）
export function useRipple(elementRef: Ref<HTMLElement | null>, options: Ref<RippleOptions> | RippleOptions = {}) {
  const themeStorage = localStorage.getItem('theme');
  const parsedTheme = themeStorage ? JSON.parse(themeStorage) : null;
  const resolvedOptions = computed(() => ({
    ...defaultOptions,
    color: parsedTheme?.theme==='light' ? 'red' : 'red',
    ...(unref(options) || {})
  }));

  const stop = useEventListener(elementRef, "click", (event: MouseEvent) => {
    const el = unref(elementRef);
    if (!el || resolvedOptions.value.disabled) return;
    
    createRippleEffect(event, el, resolvedOptions.value);
  });

  // 设置元素样式
  watchEffect(() => {
    const el = unref(elementRef);
    if (!el) return;

    if (!resolvedOptions.value.disabled) {
      if (el.style.position === "" || el.style.position === "static") {
        el.style.position = "relative";
      }
      el.style.overflow = "hidden";
    } else {
      el.style.position = "";
      el.style.overflow = "";
    }
  });

  return {
    stop
  };
}

export default rippleDirective;