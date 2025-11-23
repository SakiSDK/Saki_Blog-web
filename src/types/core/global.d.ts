// 全局类型拓展
declare global {
  // vue 相关
  interface ComponentCustomProps {
    class?: any
    style?: any
  }

  // 工具类型
  type Nullable<T> = T | null
  type Optional<T> = T | undefined
  type ValueOf<T> = T[keyof T]
  type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
  }

  // 通用键值对
  interface StringDictionary {
    [key: string]: string
  }

  interface NumberDictionary {
    [key: string]: number
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $message: MessageInstance
  }
}
export {}