import React from 'react';

import QRCard from './QRCard';
import { getQRMaxWidth } from '../../utils/qrSize';
import * as Styles from './ImageLayout.styles';
import { ImageData, QR } from '../../types';

const styles = {
  bottom: {
    bottom: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  top: {
    top: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  leftBottom: {
    left: 0,
    bottom: 0,
  },
  rightBottom: {
    right: 0,
    bottom: 0,
  },
  rightTop: {
    right: 0,
    top: 0,
  },
};

interface ImageLayoutProps {
  width: number;
  height: number;
  image?: ImageData;
  qr?: QR;
  animate?: boolean;
  enableAnimation?: boolean;
  isPortrait?: boolean;
  isFlip?: boolean;
  isStacked?: boolean;
}


const ImageLayout: React.FC<ImageLayoutProps> = ({ width, height, image, qr, animate, enableAnimation, isPortrait, isFlip, isStacked }) => {
  const qrContainerStyles = React.useMemo(() => {
    if (isPortrait) {
      if (isStacked) {
        return isFlip ? styles.top : styles.bottom;
      }
      return isFlip ? styles.leftBottom : styles.rightBottom;
    }

    if (isStacked) {
      return isFlip ? styles.rightTop : styles.rightBottom;
    }
    return isFlip ? styles.leftBottom : styles.rightBottom;
  }, [isPortrait, isFlip, isStacked]);

  const textPosition = React.useMemo(() => {
    if (!qr) {
      return null;
    }
    // Only render text with right position if width has enough space
    // For QR's width and horizontal margins
    if (width > height && width >= getQRMaxWidth(qr.size)) {
      return 'right';
    }

    return 'bottom';
  }, [qr, width, height]);

  const animation = React.useMemo(() => {
    if (!enableAnimation || !image) {
      return;
    }

    const sourceImageAR = image.width / image.height;
    const imageAR = width / height;
    const ratioDiff = sourceImageAR - imageAR;
    if (ratioDiff < -0.1) {
      return 'vertical';
    } else if (ratioDiff > 0.1) {
      return 'horizontal';
    } else {
      return 'zoom';
    }
  }, [image, width, height, enableAnimation]);

  if (!image && !qr) {
    return null;
  }

  return (
    <Styles.ImageLayout height={height} width={width}>
      {image && (
        <Styles.Image
          src={image.url}
          animation={animation}
          animate={animate}
        />
      )}
      {qr && <QRCard qr={qr} textPosition={textPosition} styles={{ container: qrContainerStyles }} />}
    </Styles.ImageLayout>
  );
};

export default ImageLayout;
