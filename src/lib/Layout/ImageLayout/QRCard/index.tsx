import React from 'react';

import { QR } from '../../../types';
import useCachedImageUrl from '../../../utils/useCachedImageUrl';
import * as Styles from './QRCard.styles';
import TextFit from './TextFit';


export type TextPosition = 'bottom' | 'right';
interface QRCardProp {
  qr: QR;
  textPosition: TextPosition;
  styles?: {
    container?: object;
    qrImage?: object;
    callToAction?: object;
  };
}

const QRCard: React.FC<QRCardProp> = ({ qr, textPosition, styles }) => {
  const [overflow, setOverFlow] = React.useState({
    overflowVertical: false,
    overflowHorizontal: false,
  });

  const qrUrl = useCachedImageUrl(qr && qr.url);

  if (!qr) {
    return null;
  }
  const { overflowVertical, overflowHorizontal } = overflow;
  const { size, callToAction } = qr;

  return (
    <Styles.Container size={size} textPosition={textPosition} hasCTA={!!callToAction} styles={styles.container}>
      <Styles.QRCode size={size} src={qrUrl} styles={styles.qrImage} />
      {callToAction && (
        <Styles.CallToAction
          size={size}
          textPosition={textPosition}
          overflowVertical={overflowVertical}
          overflowHorizontal={overflowHorizontal}
          styles={styles.callToAction}
        >
          <TextFit
            key={`${size}-${callToAction}-${textPosition}`}
            maxFontSize={42}
            minFontSize={23}
            onCalculated={setOverFlow}
          >
            {callToAction}
          </TextFit>
        </Styles.CallToAction>
      )}
    </Styles.Container>
  );
};

QRCard.defaultProps = {
  styles: {},
};

export default QRCard;
