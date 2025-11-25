

/**
 * DOM 操作工具类
 * @description 提供一系列常用的 DOM 操作工具函数
 */
// 类型定义
export class DomUtil {
  static scrollToNextView = () => {
    const target = window.innerHeight; // = 100vh
    window.scrollTo({
      top: target,
      behavior: 'smooth'
    });
  }
  static scrollToTop = () => [
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  ]
}