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

export type QRSource = 'needQRCode' | 'haveQRCode';
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

export interface QRPoperties {
  qrActive?: boolean;
  qrSource?: QRSource;
  qrUrlContent?: string;
  qrImage?: {
    url: string;
  };
  qrSize?: Size;
  qrCallToAction?: string;
}

export interface ThemeVars {
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundImagePortrait?: string;
  headingFont?: string;
  headingTextColor?: string;
  heading2Font?: string;
  heading2TextColor?: string;
  bodyFont?: string;
  borderColor?: string;
  bodyTextColor?: string;
}

interface ValuesProps extends QRPoperties {
  shouldFormatPrice?: boolean;
  currency?: string;
  priceFormat?: string;
  image?: { url?: string; };
  layout?: LayoutMode;
  enableAnimation?: boolean;
  footnote?: string;
  footnoteSize?: Size;
}

export interface Presentation {
  theme: ThemeVars;
  values: ValuesProps;
}

export interface AppProps {
  presentation: Presentation;
  onError?: (error: Error) => void;
  onReady?: () => void;
  isPlaying?: boolean,
}
