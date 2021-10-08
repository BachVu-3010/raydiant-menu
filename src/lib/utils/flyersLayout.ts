import { LayoutMode, OverScan, QR } from '../types';
import { QR_MIN_SIZE } from './qrSize';

// The maximum text length of the hero image layout.
export const HERO_IMAGE_TEXT_LENGTH = 40;
// Image can take up to 33% of the size of its wrapper.
export const MAX_RELATIVE_IMAGE_SIZE = 0.33;
// Overscan padding compensation.
export const OVERSCAN_LARGE = 100;
export const OVERSCAN_SMALL = 56;
export const OVERSCAN_XSMALL = 32;
export const ASPECT_ERROR = 0.02; // 20px/1080px


interface ContentSize {
  width: number;
  height: number;
}

interface WrapperConfig extends ContentSize {
  isLandscape: boolean;
}

export interface LayoutConfig {
  isStacked: boolean;
  imageSize: ContentSize;
  textWrapperSize: ContentSize;
  overscan: OverScan,
}

const getStandardWrapper = (isLandscape: boolean): WrapperConfig =>
  isLandscape ? { isLandscape, width: 1920, height: 1080 } : { isLandscape, width: 1080, height: 1920 };

const getImageSize = (wrapper: WrapperConfig, image?: ContentSize, qr?: QR): ContentSize => {
  if (!image && !qr) {
    return { width: 0, height: 0 };
  }
  const isLandscapeWrapper = wrapper.isLandscape;

  // Show the QR as an image if there is no image
  const minQRSize = qr ? QR_MIN_SIZE[qr.size] : 0;
  if (!image) {
    return isLandscapeWrapper
      ? { width: minQRSize, height: wrapper.height }
      : { width: wrapper.width, height: minQRSize };
  }

  const forceNotStack = qr && qr.size !== 'small' && isLandscapeWrapper;
  const forceStack = qr && qr.size !== 'small' && !isLandscapeWrapper;

  const imageAspectRatio = image.width / image.height;
  const wrapperAspectRatio = wrapper.width / wrapper.height;
  // If the image is wider than the wrapper, stack the image
  // on the text.
  if ((!forceNotStack && imageAspectRatio >= wrapperAspectRatio - ASPECT_ERROR) || forceStack) {
    return {
      width: wrapper.width,
      height: Math.max(
        Math.min(Math.round(wrapper.width / imageAspectRatio), Math.round(wrapper.height * MAX_RELATIVE_IMAGE_SIZE)),
        minQRSize
      ),
    };
  }
  return {
    width: Math.max(
      Math.min(Math.round(wrapper.height * imageAspectRatio), Math.round(wrapper.width * MAX_RELATIVE_IMAGE_SIZE)),
      minQRSize
    ),
    height: wrapper.height,
  };
};

const getTextWrapperSize = (wrapper: WrapperConfig, imageSize: ContentSize): ContentSize => {
  const width = wrapper.width === imageSize.width ? wrapper.width : wrapper.width - imageSize.width;
  const height = wrapper.height === imageSize.height ? wrapper.height : wrapper.height - imageSize.height;

  return { width, height };
};

export default (isLandscape: boolean, image?: ContentSize, qr?: QR, imageLayout: LayoutMode = 'default'): LayoutConfig => {
  const wrapper = getStandardWrapper(isLandscape);
  // The image size size is the same as the wrapper when using the hero layout.
  // If not using the hero layout, calculate the ideal image size to maintain
  // aspect ratio for up to 65% of the wrapper size.
  const imageWrapperSize = getImageSize(wrapper, image, qr);
  // The text layout is the same as the wrapper when using the hero layout.
  // When not using the hero layout, calculate the remaining space for text
  // after the image size has been computed for it's wrapper.
  const textWrapperSize = getTextWrapperSize(wrapper, imageWrapperSize);
  // Is this an image on top situation or an image on left situation?
  const isStacked = imageWrapperSize.width === wrapper.width;
  // Overscan compensation needs to be swapped when on a portrait screen.
  const horizontalOverscan = isLandscape ? OVERSCAN_LARGE : OVERSCAN_SMALL;
  const verticalOverscan = isLandscape ? OVERSCAN_SMALL : OVERSCAN_LARGE;
  // Convert overscan to actual padding values.
  const overscanPadding = {
    top: verticalOverscan,
    right: horizontalOverscan,
    bottom: verticalOverscan,
    left: horizontalOverscan,
  };

  const flipped = imageLayout === 'flip';
  if (image) {
    // If the image is to the left of the text (or above in portrait)
    // we don't need to compensate for overscan. Minimum will be set to OVERSCAN_XSMALL
    if (flipped) {
      overscanPadding[isStacked ? 'bottom' : 'left'] = OVERSCAN_XSMALL;
    } else {
      overscanPadding[isStacked ? 'top' : 'right'] = OVERSCAN_XSMALL;
    }
  } else if (qr) {
    // If the qr is to the left of the text (or above in portrait)
    // we don't need to compensate for overscan.
    if (flipped) {
      overscanPadding[isStacked ? 'bottom' : 'left'] = 0;
    } else {
      overscanPadding[isStacked ? 'top' : 'right'] = 0;
    }
  }

  return {
    isStacked,
    imageSize: imageWrapperSize,
    textWrapperSize,
    overscan: overscanPadding,
  };
};
