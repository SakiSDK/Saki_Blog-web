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
  success: (title: string, content?: string, duration?: number) => {
    return showMessage({
      type: 'success',
      title,
      content,
      duration
    })
  },
  
  info: (title: string, content?: string, duration?: number) => {
    return showMessage({
      type: 'info',
      title,
      content,
      duration
    })
  },
  
  warning: (title: string, content?: string, duration?: number) => {
    return showMessage({
      type: 'warning',
      title,
      content,
      duration
    })
  },
  
  error: (title: string, content?: string, duration?: number) => {
    return showMessage({
      type: 'error',
      title,
      content,
      duration: duration || 5000 // 错误消息默认显示时间长一些
    })
  },
  
  show: (options: MessageOptions) => {
    return showMessage(options)
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