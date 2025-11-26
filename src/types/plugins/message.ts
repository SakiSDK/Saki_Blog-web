import type { AddMessage, MessageType } from "../components/Base"

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