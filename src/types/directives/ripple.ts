export interface RippleElement extends HTMLElement {
  _ripple?: {
    enabled: boolean;
    cleanup: () => void;
  };
}

export interface RippleOptions {
  color?: string;
  duration?: number;
  disabled?: boolean;
  center?: boolean;
}
