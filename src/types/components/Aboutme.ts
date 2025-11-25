export interface GameCardField {
  name: string;
  webSite: string;
  image: string;
}
export interface AnimeCardField {
  name: string;
  key: string;
  webSite: string;
  image: string;
}

export interface InfoCardContent {
  welcome: string;
  title: string;
  description: string;
  emoji: string;
}

export interface SmallJoyCardContent {
  title: string;
  tag: string;
  prefixed: string;
  default: string;
}

export interface CardBaseInfo {
  tag: string;
  title: string;
}