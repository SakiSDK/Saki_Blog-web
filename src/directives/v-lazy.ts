import { useIntersectionObserver } from "@vueuse/core";
import type { Directive } from "vue";
import DEFAULT_LOADING_IMG from '@/assets/imgs/loading.gif'


export interface ObservePhotoOptions {
    delay?: number;         // 延迟加载时间
    threshold?: number;     // 触发加载的阈值
    rootMargin?: string;    // 根元素外边距
    retryCount: number;     // 重试次数
    retryInterval: number;  // 重试间隔
    placeholder?: string;   // 自定义占位图（新增：支持背景图占位）
}

interface LazyImgBindingValue {
    src: string;
    options?: ObservePhotoOptions;
    onLoad?: () => void; // 加载成功回调
}

declare global {
    interface HTMLImageElement {
        _stopLazyLoad?: () => void;
        _lazyLoadType?: 'img' | 'background';
    }
}

export const useLazyLoad = () => {
    const observePhoto = (
        el: HTMLImageElement,
        realSrc: string,
        options?: ObservePhotoOptions,
        onLoad?: () => void,
    ) => {

        const {
            delay = 400,
            threshold = 0.1,
            rootMargin = '0px 0px',
            retryCount = 2,
            retryInterval = 1000,
            placeholder = DEFAULT_LOADING_IMG,
        } = options || {};

        if (!el || !realSrc) return;

        // 标记元素类型（img或background）
        const loadType: 'img' | 'background' = el.tagName === 'IMG' ? 'img' : 'background';
        el._lazyLoadType = loadType;

        // 设置加载占位符
        if (loadType === 'img') {
            (el as HTMLImageElement).src = placeholder;
        } else {
            el.style.backgroundImage = `url("${placeholder}")`;
            // 可选：设置背景图默认样式（避免拉伸/重复，用户可覆盖）
            el.style.backgroundSize = el.style.backgroundSize || 'cover';
            el.style.backgroundRepeat = el.style.backgroundRepeat || 'no-repeat';
        }

        let currentRetry = 0; // 当前重试次数
        let stopObserver: () => void; // 存储监听停止函数

        /**
         * 核心加载逻辑（通过Image对象预加载，兼容两种类型）
         */
        const loadImage = () => {
            const img = new Image(); // 创建隐藏的 Image 对象监听加载状态
            img.src = realSrc;

            // 加载成功
            img.onload = () => {
                if (loadType === 'img') {
                    (el as HTMLImageElement).src = realSrc;
                } else {
                    el.style.backgroundImage = `url("${realSrc}")`;
                }
                // 触发组件传递的回调（通知Avatar组件加载完成）
                if (onLoad && typeof onLoad === 'function') {
                    onLoad();
                }
                stopObserver(); // 停止监听
            };

            // 加载失败（重试逻辑）
            img.onerror = () => {
                currentRetry++;
                if (currentRetry < retryCount) {
                    setTimeout(loadImage, retryInterval);
                } else {
                    // 重试失败：保持占位图或设置失败占位（可自定义）
                    if (loadType === 'img') {
                        (el as HTMLImageElement).src = placeholder;
                    } else {
                        el.style.backgroundImage = `url("${placeholder}")`;
                    }
                    stopObserver();
                }
            };
        }
        const { stop } = useIntersectionObserver(
            el,
            (entries) => {
                const entry = entries[0];
                if (!entry) return;
                const { isIntersecting } = entry;

                if (isIntersecting) {
                    const timer = setTimeout(() => {
                        loadImage(); // 调用封装的加载逻辑（支持重试）
                        clearTimeout(timer);
                    }, delay);
                }
            },
            { threshold, rootMargin }
        );
        // 存储 stop 方法，供指令卸载时使用
        el._stopLazyLoad = stop;
        stopObserver = stop;

        return stop;
    }

    return { observePhoto }
}

/** ---------- 导出一个指令对象 ---------- */
export const vLazyImg: Directive<HTMLImageElement, string | LazyImgBindingValue> = {
    mounted(el, binding) {
        const { observePhoto } = useLazyLoad();

        // 解析绑定值（支持字符串和对象格式）
        let realSrc = '';
        let options: ObservePhotoOptions | undefined;
        let onLoad: (() => void) | undefined; // 提取回调

        if (typeof binding.value === 'string') {
            realSrc = binding.value;
        } else if (typeof binding.value === 'object' && binding.value.src) {
            realSrc = binding.value.src;
            options = binding.value.options; 
            onLoad = binding.value.onLoad;
        } else {
            console.warn('v-lazy-img 指令：绑定值格式错误，需传入图片地址或 { src: 地址, options: {} }');
            return;
        }

        observePhoto(el, realSrc, options);
    },
    beforeUnmount(el: any) {
        // 卸载时停止监听
        if (el._stopLazyLoad) {
            el._stopLazyLoad();
            delete el._stopLazyLoad;
            delete el._lazyLoadType;
        }
    },
    // 支持动态更新图片地址（如绑定值变化时重新加载）
    updated(el, binding) {
        // 先停止之前的监听
        if (el._stopLazyLoad) {
            el._stopLazyLoad();
        }

        // 重新解析新的绑定值并加载
        const { observePhoto } = useLazyLoad();
        let realSrc = '';
        let options: ObservePhotoOptions | undefined;
        let onLoad: (() => void) | undefined; // 显式指定类型

        
        if (typeof binding.value === 'string') {
            realSrc = binding.value;
        } else if (typeof binding.value === 'object' && binding.value.src) {
            realSrc = binding.value.src;
            options = binding.value.options;
            onLoad = binding.value.onLoad;
        } else {
            return;
        }

        observePhoto(el, realSrc, options);
    }
}