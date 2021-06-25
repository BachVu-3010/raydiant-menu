import styled, { StyledComponent, StyledOptions } from '@emotion/styled';
import { Size } from '../../../types';
import { TextPosition } from './';

import { QR_IMAGE_SIZE_MAP, CTA_HORIZONTAL_WIDTH_MAP, getPaddingSize, getQRMaxWidth } from '../../../utils/qrSize';

export const Container: StyledComponent<{
  size: Size;
  textPosition: TextPosition;
  hasCTA: boolean;
  styles: object;
}> = styled('div')(({ theme, size, textPosition, hasCTA, styles }) => {
  const paddingSize = getPaddingSize(size);
  const qrSize = QR_IMAGE_SIZE_MAP[size];

  const sizeWithPaddings = qrSize + 2 * paddingSize;
  const sizeStyles =
    textPosition === 'right'
      ? {
          width: theme.vw(hasCTA ? getQRMaxWidth(size) : sizeWithPaddings),
          height: theme.vw(sizeWithPaddings),
        }
      : {
          width: theme.vw(sizeWithPaddings),
          maxHeight: `calc(100% - ${theme.vw(2 * paddingSize)})`,
        };

  return {
    display: 'flex',
    flexDirection: textPosition === 'right' ? 'row' : 'column',
    position: 'absolute',
    margin: theme.vw(paddingSize),
    padding: theme.vw(paddingSize),
    boxSizing: 'border-box',
    boxShadow: `${theme.vw(8)} ${theme.vw(8)} ${theme.vw(16)} 0 rgba(0, 0, 0, 0.5)`,
    borderRadius: theme.vw(8),
    backgroundColor: '#FFFFFF',
    ...sizeStyles,
    ...styles,
  };
});

export const QRCode: StyledComponent<{ src: string, size: Size, styles?: {}}> = styled('img')(({ theme, size, styles }) => ({
  flexShrink: 0,
  objectFit: 'contain',
  width: theme.vw(QR_IMAGE_SIZE_MAP[size]),
  height: theme.vw(QR_IMAGE_SIZE_MAP[size]),
  ...styles,
}));

export const CallToAction: StyledComponent<{
  size: Size,
  textPosition: TextPosition,
  overflowVertical: boolean,
  overflowHorizontal: boolean,
  styles: object,
}> = styled('div')(
  ({ theme, size, textPosition, overflowVertical, overflowHorizontal, styles }) => {
    const ctaStyles: object =
      textPosition === 'right'
        ? {
            alignItems: overflowVertical ? 'flex-start' : 'center',
            justifyContent: 'flex-start',
            marginLeft: theme.vw(getPaddingSize(size)),
            width: theme.vw(CTA_HORIZONTAL_WIDTH_MAP[size]),
          }
        : {
            alignItems: 'flex-start',
            justifyContent: overflowHorizontal ? 'flex-start' : 'center',
            textAlign: 'center',
            marginTop: theme.vw(getPaddingSize(size)),
            width: theme.vw(QR_IMAGE_SIZE_MAP[size]),
          };

    return {
      display: 'flex',
      whiteSpace: 'pre-wrap',
      fontFamily: theme.qrCtaFont,
      letterSpacing: theme.vw(0.46),
      color: '#000000',
      ...ctaStyles,
      ...styles,
    };
  }
);
