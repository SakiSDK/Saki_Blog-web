import type { App, ComponentPublicInstance } from 'vue'
import { createApp } from 'vue'
import GlobalMessage from '@/components/global/GlobalMessage.vue'
import type { MessageOptions, MessageInstance } from '@/types/plugins/message'


// 全局消息组件实例
let messageInstance: ComponentPublicInstance | null = null
let messageApp: App<Element> | null = null

// 创建消息组件实例
const createMessageInstance = (): ComponentPublicInstance => {
  const div = document.createElement('div')
  document.body.appendChild(div)
  
  messageApp = createApp(GlobalMessage)
  const instance = messageApp.mount(div) as ComponentPublicInstance
  
  return instance
}

// 获取消息实例
const getMessageInstance = (): ComponentPublicInstance => {
  if (!messageInstance) {
    messageInstance = createMessageInstance()
  }
  return messageInstance
}

// 显示消息
const showMessage = (options: MessageOptions): string => {
  const instance = getMessageInstance()
  return (instance as any).addMessage(options)
}

// 消息函数
const message: MessageInstance = {
  success: (title: string, content?: string, duration?: number, closable?: boolean) => {
    return showMessage({
      type: 'success',
      title,
      content,
      duration: duration || 3000, // 成功消息默认 3s 消失
      closable: closable ?? true,
    })
  },
  
  info: (title: string, content?: string, duration?: number, closable?: boolean) => {
    return showMessage({
      type: 'info',
      title,
      content,
      duration: duration || 3000, // 提示消息默认 3s 消失
      closable: closable ?? true,
    })
  },
  
  warning: (title: string, content?: string, duration?: number, closable?: boolean) => {
    return showMessage({
      type: 'warning',
      title,
      content,
      duration: duration || 4500, // 警告消息时间稍长
      closable: closable ?? true,
    })
  },
  
  error: (title: string, content?: string, duration?: number, closable?: boolean) => {
    return showMessage({
      type: 'error',
      title,
      content,
      duration: duration || 6000, // 错误消息默认显示 6s，确保用户看到
      closable: closable ?? true,
    })
  },
  
  show: (options: MessageOptions) => {
    return showMessage({
      ...options,
      duration: options.duration || 3000 // 通用显示也设置默认 3s
    })
  },
  
  remove: (id: string) => {
    if (messageInstance) {
      (messageInstance as any).removeMessage(id)
    }
  },
  
  clearAll: () => {
    if (messageInstance) {
      (messageInstance as any).clearAll()
    }
  }
}

// Vue 插件安装
export default {
  install(app: App) {
    // 挂载到全局属性
    app.config.globalProperties.$message = message
    
    // 提供 inject 支持
    app.provide('$message', message)
  }
}

// 导出消息实例
export { message }