import { z } from 'zod';
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

/** ---------- Tag组件 Props类型 ---------- */
export interface TagProps {
  label?: string;
  count?: null | number;
  type?: 'primary' | 'secondary' | 'default' | 'outline' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  padding?: string;
  icon?: string;
  color?: string;
  radius?: string;
  rippled?: boolean;
  wrapped?: boolean;
  bordered?: boolean;
  borderColor?: 'theme' | 'follow';
  closable?: boolean;
  disabled?: boolean;
  clickable?: boolean;
  modelValue?: boolean;
}

/** ---------- VForm类型 ---------- */
// 表单类型定义
export type FormType = 'login' | 'register' | 'profile' | 'contact' | 'custom';

// 表单布局类型
export type FormLayout = 'vertical' | 'horizontal' | 'inline'

// 表单项类型
export type FormFieldType =
  'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 
  'textarea' | 'select' | 'checkbox' | 'radio' | 'switch' | 
  'date' | 'time' | 'datetime' | 'file' | 'color' | 'range' | 'custom'

// 表单项配置接口
export interface FormItemConfig {
  name: string  // 字段名
  label: string  // 字段标签
  type: FormFieldType  // 字段类型
  placeholder?: string  // 占位符
  required?: boolean  // 是否必填
  hidden?: boolean   // 是否隐藏
  disabled?: boolean  // 是否禁用
  readonly?: boolean  // 是否只读
  defaultValue?: any  // 默认值
  options?: Array<{ label: string; value: any; disabled?: boolean }>  // 选项
  validation?: z.ZodTypeAny  // 表单验证规则
  attrs?: Record<string, any>  // 自定义属性
  colSpan?: number  // 列宽
  helpText?: string  // 帮助文本
  prefixIcon?: string // 前置图标
  suffixIcon?: string // 后置图标
  customComponent?: any // 自定义组件
  dependencies?: string[] // 依赖字段，用于联动验证
}

// 表单配置接口
export interface FormConfig {
  layout?: FormLayout // 表单布局
  labelWidth?: string // 标签宽度
  labelAlign?: 'left' | 'right' | 'center'  // 标签对齐方式
  colon?: boolean // 是否显示冒号
  submitText?: string // 提交按钮文本
  resetText?: string  // 重置按钮文本
  showSubmit?: boolean  // 是否显示提交按钮
  showReset?: boolean // 是否显示重置按钮
  inline?: boolean  // 是否行内表单
  gap?: string  // 间距
  gridColumns?: number  // 栅格列数
  size?: 'small' | 'medium' | 'large'  // 表单尺寸
  validateOnChange?: boolean  // 是否在表单值改变时验证
  validateOnBlur?: boolean  // 是否在表单值失去焦点时验证
  validateOnInput?: boolean  // 是否在表单值输入时验证
}

// Props定义
export interface FormProps {
  formType: FormType  // 表单类型
  config?: FormConfig // 表单配置
  items?: FormItemConfig[]  // 表单项配置
  initialValues?: Record<string, any> // 初始值
  loading?: boolean // 是否加载中
  disabled?: boolean  // 是否禁用
  onSubmit: (values: any, helpers: any) => void | Promise<void> // 提交回调
  onReset?: (values: any) => void // 重置回调
  onChange?: (field: string, value: any, values: any) => void // 值改变回调
  onValidate?: (errors: Record<string, string>) => void // 验证回调
}