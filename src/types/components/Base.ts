/** ---------- PageHeader文案类型 ---------- */
export interface PageHeaderField {
  title: string,
  desc: string,
  infos?: {
    title: string,
    value: string,
  }[],
}


/** ---------- Icon组件Props类型 ---------- */
export interface IconProps {
  // 图标名称 (对应 symbol 的 id: #icon-xxx)
  name: string;
  // 图标颜色 (默认继承父元素颜色)
  color?: string;
  // 图标大小 (默认 1em)
  size?: string | number;
  // 额外类名
  className?: string;
  // 图标标题 (无障碍访问)
  title?: string;
}

/** ---------- Message组件Props类型 ---------- */
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



/** ---------- RightBar 右侧按钮类型 ---------- */
export type RightBarThemeIcon = 'moon-star' | 'sun';

export interface RightBarField {
  iconName: string
  action: () => void
}

/** ---------- 按钮类型 ---------- */
export interface ButtonProps {
  type?: 'primary' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger'
  size?: 'small' | 'default' | 'large'
  icon?: string
  loading?: boolean
  disabled?: boolean
  block?: boolean
  ripple?: boolean
  noWrap?: boolean
  border?: boolean
}

export interface ButtonEmits {
  (e: 'click', event: MouseEvent): void
}


/** ---------- 通用组件CardHeader Props类型 ---------- */
export interface CardHeaderProps {
  title?: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right'; // 标题对齐
  bordered?: boolean; // 是否展示底部分割线
  padding?: string; // 自定义 padding
  background?: string;
  icon?: string;
}