import { CSSObject, GlobalProps } from '@emotion/react';
import lineHighByFontSize from './lineHighByFontSize';

export const vw1920 = (value: number) => `${(value * 100) / 1920}vw`;
export const vw1080 = (value: number) => `${(value * 100) / 1080}vw`;

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

export interface TextStyles {
  fontFamily?: string;
  color: string;
  fontSize?: string;
  lineHeight?: string;
}

export type TextStylesByFontSize = (fontSize?: number) => TextStyles;
// interface FontFaceStyle {
//   '@font-face': {
//     fontFamily: string;
//     src: string;
//   }
// }

export interface Theme {
  isPortrait: boolean;
  vw: (value: number) => string;
  globalStyles: CSSObject[];
  toLoadFonts: string[];
  qrCtaFont: string,
  background: string;
  backgroundImage: string;
  backgroundImagePortrait: string;
  headingText: TextStylesByFontSize;
  subHeadingText: TextStylesByFontSize;
  itemText: TextStylesByFontSize;
  itemPriceText: TextStylesByFontSize;
  variantText: TextStylesByFontSize
  variantPriceText: TextStylesByFontSize;
  bodyText: TextStylesByFontSize;
  separator: {
    background?: string;
  };
}

export default function createTheme(vars: ThemeVars = {}, isPortrait: boolean): Theme {
  let globalStyles: CSSObject[] = [];

  const createFontFace = (url: string) => {
    if (!url) {
      return null;
    }

    const fontId = url.replace(/[^\w]/gi, '_');
    globalStyles = [
      ...globalStyles,
      {
        '@font-face': {
          fontFamily: fontId,
          src: `url(${url}) format('woff')`,
        },
      },
    ];
    return fontId;
  };

  const headingFont = createFontFace(vars.headingFont);
  const heading2Font = createFontFace(vars.heading2Font || vars.headingFont);
  const bodyFont = createFontFace(vars.bodyFont);
  const qrCtaFont = createFontFace('https://fonts.raydiant.com/Roboto-Regular.woff');

  return {
    isPortrait,
    vw: isPortrait ? vw1080 : vw1920,
    globalStyles,
    toLoadFonts: [headingFont, heading2Font, bodyFont, qrCtaFont].filter((font) => font),
    qrCtaFont,
    background: vars.backgroundColor,
    backgroundImage: vars.backgroundImage,
    backgroundImagePortrait: vars.backgroundImagePortrait,
    headingText: (fontSize: number) => ({
      fontFamily: headingFont,
      color: vars.headingTextColor,
      fontSize: '2.3em',
      lineHeight: lineHighByFontSize(fontSize * 2.3),
    }),
    subHeadingText: (fontSize: number) => ({
      fontFamily: heading2Font,
      color: vars.heading2TextColor,
      fontSize: '1.4em',
      lineHeight: lineHighByFontSize(fontSize * 1.4),
    }),
    itemText: (fontSize: number) => ({
      fontFamily: heading2Font,
      color: vars.heading2TextColor || vars.headingTextColor,
      fontSize: '1em',
      lineHeight: lineHighByFontSize(fontSize),
    }),
    itemPriceText: (fontSize: number) => ({
      fontFamily: bodyFont,
      color: vars.bodyTextColor,
      fontSize: '1em',
      lineHeight: lineHighByFontSize(fontSize),
    }),
    variantText: (fontSize: number) => ({
      fontFamily: bodyFont,
      color: vars.bodyTextColor,
      fontSize: '0.77em',
      lineHeight: lineHighByFontSize(fontSize * 0.77),
    }),
    variantPriceText: () => ({ color: vars.bodyTextColor }),
    bodyText: (fontSize: number) => ({
      fontFamily: bodyFont,
      color: vars.bodyTextColor,
      lineHeight: lineHighByFontSize(fontSize),
    }),
    separator: {
      background: vars.borderColor || vars.bodyTextColor,
    },
  };
}
