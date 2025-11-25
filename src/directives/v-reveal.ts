import type { DirectiveBinding } from "vue";

/** ---------- 类型定义 ---------- */
interface RevealOptions {
    // 动画参数
    delay?: number;         // 延迟时间
    duration?: number;      // 动画持续时间
    distance?: string;      // 初始偏移距离（如 '30px'）
    // IntersectionObserver配置
    rootMargin?: string;             // 根元素外边距
    threshold?: number | number[];   // 触发加载的阈值
    root?: HTMLElement | null;        // 根元素
}

declare global {
    interface HTMLElement {
        _stopReveal?: () => void;
    }
}

export const reveal = (el: HTMLElement, options: RevealOptions = {}) => {
    // 默认配置
    const defaultOptions: Required<RevealOptions> = {
        delay: 0,
        duration: 1000,
        distance: "30px",
        rootMargin: '0px',
        threshold: 0.1,
        root: null,
        ...options
    }

    // 设置出事样式（透明偏移）
    el.classList.add('reveal-hidden');
    el.classList.add('reveal-transition');

    // 创建IntersectionObserver实例
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 获取元素
                    const target = entry.target as HTMLElement
                    target.classList.remove('reveal-hidden')
                    target.classList.add('reveal-visible')
                    

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
    el._stopReveal = () => observer.disconnect()

    return {
        stop: () => observer.disconnect()
    }
}

export default {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
        // 获取指令参数
        const options = binding.value as RevealOptions
        // 开始监听
        const stop = reveal(el, options)
        // 添加停止监听方法
        el._stopReveal = () => stop.stop()
    },
    beforeUnmount(el: HTMLElement) {
        // 卸载时停止监听
        if (el._stopReveal) {
            el._stopReveal();
            delete el._stopReveal;
        }
    }
}

