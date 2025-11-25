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