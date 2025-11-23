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

