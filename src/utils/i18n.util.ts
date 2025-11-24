import { useI18n } from "vue-i18n";

/** 
 * i18n 工具函数工厂
 * 提供了一系列增强的国际化工具函数，简化 Vue I18n 的使用
 * 
 * @returns {I18nUtil} 返回包含所有工具函数的对象
 * 
 * @example
 * // 在组件中使用
 * const i18n = createI18nUtil();
 * const title = i18n.t('page.title');
 * const list = i18n.tList('categories');
 */
export const createI18nUtil = () => {
  const { t, te, tm, d, n, locale, availableLocales } = useI18n();
  
  /**
   * 基础翻译函数（带参数支持）
   * 
   * @param {string} key - 翻译键名
   * @param {Record<string, any>} params - 翻译参数对象
   * @returns {string} 翻译后的文本
   * 
   * @example
   * // 基本使用
   * tt('welcome.message'); // "欢迎"
   * 
   * // 带参数
   * tt('user.greeting', { name: '张三' }); // "你好，张三！"
   * 
   * // 复数处理
   * tt('message.car', { count: 1 }); // "1 辆车"
   * tt('message.car', { count: 5 }); // "5 辆车"
   */
  const tt = (key: string, params: Record<string, any> = {}): string => {
    return t(key, params);
  }

  /**
   * 获取列表类型的翻译（自动处理数组）
   * 
   * @template T - 列表项类型
   * @param {string} key - 翻译键名
   * @returns {T[]} 翻译后的数组
   * 
   * @example
   * // JSON 结构: { "categories": ["技术", "生活", "旅行"] }
   * tList('categories'); // ["技术", "生活", "旅行"]
   * 
   * // JSON 结构: { "tags": "vue,react,angular" }
   * tList('tags'); // ["vue", "react", "angular"]
   * 
   * // JSON 结构: { "menu": { "home": "首页", "about": "关于" } }
   * tList('menu'); // ["首页", "关于"]
   */
  const tList = <T = any>(key: string): T[] => {
    const value = tm(key) as unknown;
    if (Array.isArray(value)) {
      return value as T[];
    }
    
    // 如果不是数组，尝试按分隔符分割
    if (value && typeof value === 'string') {
      return value.split(',').map(item => item.trim()) as T[];
    }
    
    // 如果是对象，返回对象的values
    if (typeof value === 'object' && value !== null) {
      return Object.values(value) as T[];
    }
    
    console.warn(`Translation key "${key}" is not a list type`);
    return [];
  }

  /**
   * 创建带前缀的翻译函数
   * 
   * @param {string} prefix - 前缀路径
   * @returns {function} 返回一个新的翻译函数，自动添加前缀
   * 
   * @example
   * // JSON 结构: { "topbar": { "nav": { "home": "首页", "about": "关于" } } }
   * const navT = tWithPrefix('topbar.nav');
   * navT('home'); // "首页" - 相当于 t('topbar.nav.home')
   * navT('about'); // "关于" - 相当于 t('topbar.nav.about')
   * 
   * // 带参数
   * navT('welcome', { name: '用户' }); // 相当于 t('topbar.nav.welcome', { name: '用户' })
   */
  const tWithPrefix = (prefix: string) => {
    return (key: string, params: Record<string, any> = {}): string => {
      return t(`${prefix}.${key}`, params)
    }
  }

  /**
   * 获取对象类型的翻译
   * 
   * @template T - 对象类型
   * @param {string} key - 翻译键名
   * @returns {T} 翻译后的对象
   * 
   * @example
   * // JSON 结构: { "user": { "name": "张三", "age": 25 } }
   * tObj('user'); // { name: "张三", age: 25 }
   * 
   * // JSON 结构: { "config": { "theme": "dark", "language": "zh-CN" } }
   * const config = tObj<{ theme: string; language: string }>('config');
   * console.log(config.theme); // "dark"
   */
  const tObj = <T = Record<string, any>>(key: string): T => {
    const value = tm(key);
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return value as T;
    }
    
    console.warn(`Translation key "${key}" is not an object type`);
    return {} as T;
  }

  /**
   * 带默认值的翻译
   * 
   * @param {string} key - 翻译键名
   * @param {string} defaultValue - 默认值
   * @param {Record<string, any>} params - 翻译参数
   * @returns {string} 翻译后的文本或默认值
   * 
   * @example
   * // 当翻译存在时
   * tDefault('welcome.message', '默认欢迎语'); // 返回翻译内容
   * 
   * // 当翻译不存在时
   * tDefault('missing.key', '默认文本'); // "默认文本"
   * 
   * // 带参数
   * tDefault('user.greeting', '你好，{name}', { name: '李四' }); // "你好，李四"
   */
  const tDefault = (key: string, defaultValue: string, params: Record<string, any> = {}): string => {
    if (te(key)) {
      return t(key, params);
    }
    return defaultValue;
  }

  /**
   * 条件翻译
   * 
   * @param {boolean} condition - 条件
   * @param {string} trueKey - 条件为真时的翻译键
   * @param {string} falseKey - 条件为假时的翻译键
   * @param {Record<string, any>} params - 翻译参数
   * @returns {string} 根据条件返回对应的翻译文本
   * 
   * @example
   * const isLoggedIn = true;
   * tConditional(isLoggedIn, 'user.welcome', 'user.login'); 
   * // 如果 isLoggedIn 为 true，返回 t('user.welcome')
   * // 如果 isLoggedIn 为 false，返回 t('user.login')
   * 
   * // 带参数
   * tConditional(true, 'message.unread', 'message.read', { count: 5 });
   */
  const tConditional = (
    condition: boolean,
    trueKey: string,
    falseKey: string,
    params: Record<string, any> = {}
  ): string => {
    return t(condition ? trueKey : falseKey, params);
  }

  /**
   * 复数翻译
   * 
   * @param {string} key - 翻译键名
   * @param {number} count - 数量
   * @param {Record<string, any>} params - 其他参数
   * @returns {string} 根据数量返回正确的复数形式
   * 
   * @example
   * // JSON 结构需要支持复数规则
   * tPlural('message.car', 1); // "1 辆车"
   * tPlural('message.car', 5); // "5 辆车"
   * 
   * // 带其他参数
   * tPlural('notification.count', 3, { type: 'message' }); // "3 条消息"
   */
  const tPlural = (
    key: string,
    count: number,
    params?: Record<string, any>
  ): string => {
    return t(key, { count, ...params });
  }

  /**
   * 范围翻译（用于数字范围）
   * 
   * @param {string} key - 翻译键名
   * @param {number} min - 最小值
   * @param {number} max - 最大值
   * @param {Record<string, any>} params - 其他参数
   * @returns {string} 翻译后的范围文本
   * 
   * @example
   * // JSON 结构: { "price.range": "价格范围: {min} - {max} 元" }
   * tRange('price.range', 100, 500); // "价格范围: 100 - 500 元"
   * 
   * // 带其他参数
   * tRange('score.range', 60, 100, { subject: '数学' }); // "数学分数范围: 60 - 100 分"
   */
  const tRange = (key: string, min: number, max: number, params?: Record<string, any>): string => {
    return t(key, { min, max, ...params });
  }

  /**
   * 链式翻译（用于嵌套结构）
   * 
   * @param {string} baseKey - 基础键名
   * @param {...string[]} paths - 路径片段
   * @returns {string} 组合后的翻译文本
   * 
   * @example
   * // JSON 结构: { "user": { "profile": { "name": "用户名" } } }
   * tChain('user', 'profile', 'name'); // "用户名"
   * // 相当于 t('user.profile.name')
   * 
   * // 动态路径
   * const section = 'profile';
   * const field = 'email';
   * tChain('user', section, field); // 相当于 t('user.profile.email')
   */
  const tChain = (baseKey: string, ...paths: string[]): string => {
    const fullPath = [baseKey, ...paths].join('.');
    return t(fullPath);
  }

  /**
   * 批量翻译
   * 
   * @param {string[]} keys - 翻译键名数组
   * @param {Record<string, any>} params - 共享参数
   * @returns {string[]} 翻译后的文本数组
   * 
   * @example
   * // 批量翻译多个键
   * tBatch(['button.save', 'button.cancel', 'button.delete']);
   * // 返回: ["保存", "取消", "删除"]
   * 
   * // 带共享参数
   * tBatch(['product.name', 'product.price'], { product: '手机' });
   */
  const tBatch = (keys: string[], params: Record<string, any> = {}): string[] => {
    return keys.map(key => t(key, params));
  }

  /**
   * 翻译映射（将对象键名翻译）
   * 
   * @template T - 源对象类型
   * @param {T} obj - 源对象
   * @param {string} keyPrefix - 键名前缀
   * @returns {Record<string, string>} 键名翻译后的新对象
   * 
   * @example
   * const statuses = { pending: 'pending', completed: 'completed' };
   * tMap(statuses, 'order.status');
   * // 返回: { pending: "待处理", completed: "已完成" }
   * // 前提是存在翻译键: order.status.pending 和 order.status.completed
   * 
   * // 无前缀
   * tMap({ yes: 'yes', no: 'no' });
   * // 查找翻译键: yes 和 no
   */
  const tMap = <T extends Record<string, any>>(obj: T, keyPrefix: string = ''): Record<string, string> => {
    const result: Record<string, string> = {};
    
    Object.keys(obj).forEach(key => {
      const translationKey = keyPrefix ? `${keyPrefix}.${key}` : key;
      result[key] = te(translationKey) ? t(translationKey) : key;
    });
    
    return result;
  }

  /**
   * 检查翻译键是否存在
   * 
   * @param {string} key - 翻译键名
   * @returns {boolean} 是否存在该翻译键
   * 
   * @example
   * tExists('welcome.message'); // true
   * tExists('nonexistent.key'); // false
   * 
   * // 用于条件渲染
   * if (tExists('special.feature')) {
   *   showSpecialFeature();
   * }
   */
  const tExists = (key: string): boolean => {
    return te(key);
  }

  /**
   * 获取所有可用的翻译键（用于调试）
   * 
   * @returns {string[]} 所有可用的翻译键数组
   * 
   * @example
   * const allKeys = tKeys();
   * // 返回: ['welcome.message', 'user.name', 'button.save', ...]
   * 
   * // 用于调试或生成文档
   * console.log('可用翻译键:', tKeys());
   */
  const tKeys = (): string[] => {
    const messages = tm('');
    const keys: string[] = [];
    
    const extractKeys = (obj: any, currentPath: string = '') => {
      Object.keys(obj).forEach(key => {
        const newPath = currentPath ? `${currentPath}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          extractKeys(obj[key], newPath);
        } else {
          keys.push(newPath);
        }
      });
    };
    
    if (messages) {
      extractKeys(messages);
    }
    
    return keys;
  }

  /**
   * 格式化数字
   * 
   * @param {number} value - 要格式化的数字
   * @param {Intl.NumberFormatOptions} options - 格式化选项
   * @returns {string} 格式化后的数字字符串
   * 
   * @example
   * tNumber(1234.56); // "1,234.56" (根据当前语言环境)
   * tNumber(1234.56, { minimumFractionDigits: 2 }); // "1,234.56"
   * tNumber(0.45, { style: 'percent' }); // "45%"
   */
  const tNumber = (value: number, options?: Intl.NumberFormatOptions): string => {
    return n(value, options ?? {});
  }

  /**
   * 格式化日期
   * 
   * @param {Date | string | number} date - 要格式化的日期
   * @param {Intl.DateTimeFormatOptions} options - 格式化选项
   * @returns {string} 格式化后的日期字符串
   * 
   * @example
   * tDate(new Date()); // "2023/10/27" (根据当前语言环境)
   * tDate('2023-10-27', { dateStyle: 'full' }); // "2023年10月27日星期五"
   * tDate(1698393600000, { year: 'numeric', month: 'long' }); // "2023年10月"
   */
  const tDate = (date: Date | string | number, options?: Intl.DateTimeFormatOptions): string => {
    return d(date, options ?? {});
  }

  /**
   * 格式化货币
   * 
   * @param {number} value - 金额
   * @param {string} currency - 货币代码 (默认: 'CNY')
   * @param {Intl.NumberFormatOptions} options - 其他格式化选项
   * @returns {string} 格式化后的货币字符串
   * 
   * @example
   * tCurrency(1234.56); // "¥1,234.56" (人民币)
   * tCurrency(99.99, 'USD'); // "$99.99" (美元)
   * tCurrency(1500, 'EUR', { currencyDisplay: 'name' }); // "1,500.00 euros"
   */
  const tCurrency = (value: number, currency: string = 'CNY', options?: Intl.NumberFormatOptions): string => {
    return n(value, {
      style: 'currency',
      currency,
      ...options
    });
  }

  /**
   * 翻译模板（使用模板字符串）
   * 
   * @param {string} template - 模板字符串，使用 {key} 作为占位符
   * @param {Record<string, string>} translations - 翻译映射对象
   * @returns {string} 替换后的字符串
   * 
   * @example
   * tTemplate('欢迎 {user}，今天是 {day}', { 
   *   user: t('current.user'), 
   *   day: t('today') 
   * });
   * // 返回: "欢迎 张三，今天是 星期五"
   * 
   * // 复杂的模板
   * tTemplate('{product} 价格: {price}，库存: {stock}', {
   *   product: t('product.name'),
   *   price: tCurrency(product.price),
   *   stock: tNumber(product.stock)
   * });
   */
  const tTemplate = (template: string, translations: Record<string, string>): string => {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      return translations[key] || t(key) || match;
    });
  }

  /**
   * 动态键翻译（用于动态生成的键）
   * 
   * @param {string} baseKey - 基础键名
   * @param {string} dynamicPart - 动态部分
   * @param {Record<string, any>} params - 翻译参数
   * @returns {string} 翻译后的文本
   * 
   * @example
   * // 动态状态翻译
   * const status = 'pending';
   * tDynamic('order.status', status); // 查找 'order.status.pending'
   * 
   * // 动态错误码翻译
   * const errorCode = '404';
   * tDynamic('error', errorCode); // 查找 'error.404'
   * 
   * // 带参数
   * tDynamic('validation', fieldName, { value: inputValue });
   */
  const tDynamic = (baseKey: string, dynamicPart: string, params?: Record<string, any>): string => {
    const fullKey = `${baseKey}.${dynamicPart}`;
    return te(fullKey) ? t(fullKey, params ?? {}) : tDefault(baseKey, dynamicPart, params);
  }

  /**
   * 嵌套对象翻译（将嵌套对象的所有字符串值翻译）
   * 
   * @template T - 对象类型
   * @param {T} obj - 源对象
   * @param {string} keyPrefix - 键名前缀
   * @returns {T} 翻译后的新对象
   * 
   * @example
   * const config = {
   *   title: 'page.title',
   *   description: 'page.description',
   *   buttons: {
   *     submit: 'button.submit',
   *     cancel: 'button.cancel'
   *   }
   * };
   * 
   * const translatedConfig = tNested(config, 'home');
   * // 返回: {
   * //   title: "首页", (翻译 home.page.title)
   * //   description: "欢迎来到首页", (翻译 home.page.description)
   * //   buttons: {
   * //     submit: "提交", (翻译 home.button.submit)
   * //     cancel: "取消" (翻译 home.button.cancel)
   * //   }
   * // }
   */
  const tNested = <T extends Record<string, any>>(obj: T, keyPrefix: string = ''): T => {
    const result = { ...obj };
    
    const translateNested = (currentObj: any, currentPath: string = '') => {
      Object.keys(currentObj).forEach(key => {
        const fullPath = currentPath ? `${currentPath}.${key}` : key;
        
        if (typeof currentObj[key] === 'string') {
          // 如果是字符串，尝试翻译
          if (te(fullPath)) {
            currentObj[key] = t(fullPath);
          }
        } else if (typeof currentObj[key] === 'object' && currentObj[key] !== null) {
          // 如果是对象，递归处理
          translateNested(currentObj[key], fullPath);
        }
      });
    };
    
    translateNested(result, keyPrefix);
    return result;
  }

  return {
    // 基础翻译
    t: tt,
    
    // 类型化翻译
    tList,
    tWithPrefix,
    tObj,
    
    // 条件翻译
    tDefault,
    tConditional,
    tPlural,
    tRange,
    
    // 高级翻译
    tChain,
    tBatch,
    tMap,
    tTemplate,
    tDynamic,
    tNested,
    
    // 工具函数
    tExists,
    tKeys,
    
    // 格式化
    tNumber,
    tDate,
    tCurrency,
    
    // 原始 i18n 方法（用于特殊情况）
    $t: t,
    $te: te,
    $tm: tm,
    $d: d,
    $n: n,
    
    // 语言信息
    currentLocale: locale,
    availableLocales
  }
}

/**
 * i18n 工具函数返回类型
 */
export type I18nUtil = ReturnType<typeof createI18nUtil>;

/**
 * 全局 i18n 工具单例
 */
let globalI18nUtil: I18nUtil | null = null;

/**
 * 获取全局 i18n 工具实例（单例模式）
 * 
 * @returns {I18nUtil} 全局 i18n 工具实例
 * 
 * @example
 * // 在非组件环境中使用
 * const i18n = getGlobalI18nUtil();
 * const title = i18n.t('page.title');
 */
export const getGlobalI18nUtil = (): I18nUtil => {
  if (!globalI18nUtil) {
    globalI18nUtil = createI18nUtil();
  }
  return globalI18nUtil;
}