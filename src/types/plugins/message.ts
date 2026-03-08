
export type MessageType = 'info' | 'success' | 'warning' | 'error'

export interface Message {
  id: string
  type: MessageType
  title: string
  content?: string
  duration?: number
  closable?: boolean
}

export type AddMessage = Omit<Message, 'id'>


export type MessageOptions = AddMessage & {
  type?: MessageType
}

export interface MessageInstance {
  success: (title: string, content?: string, duration?: number) => string
  info: (title: string, content?: string, duration?: number) => string
  warning: (title: string, content?: string, duration?: number) => string
  error: (title: string, content?: string, duration?: number) => string
  show: (options: MessageOptions) => string
  remove: (id: string) => void
  clearAll: () => void
}