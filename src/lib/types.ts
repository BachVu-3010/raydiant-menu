export type PriceFormatter = (price: number | string) => any;

export type Pricing = (priceFormatter?: PriceFormatter) => any;

export interface Variant {
  name?: string;
  description?: string;
  pricing?: Pricing;
  strikethrough?: boolean;
  hideName?: boolean;
  hideDescription?: boolean;
  hidePrice?: boolean;
}

export interface Item {
  name?: string;
  description?: string;
  pricing?: Pricing;
  variants?: Variant[];
  strikethrough?: boolean;
  hideName?: boolean;
  hideDescription?: boolean;
  hidePrice?: boolean;
}

export interface Category {
  name?: string;
  description?: string;
  items?: Item[];
  strikethrough?: boolean;
  hideName?: boolean;
  hideDescription?: boolean;
  subgroups?: Category[];
};

export interface ImageData {
  url: string;
  width: number;
  height: number;
}

export type Size = 'small' | 'medium' | 'large';
export type LayoutMode = 'default' | 'flip';

export interface QR {
  url: string;
  size?: Size;
  callToAction?: string;
}

export interface OverScan {
  top: number;
  right: number
  bottom: number;
  left: number
} 
