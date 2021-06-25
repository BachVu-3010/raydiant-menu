import React from 'react';
import * as QRCode from 'qrcode';

import { QR, QRPoperties } from './types';

const createQRCodeUrl = async (content?: string) => {
  if (!content) {
    return '';
  }
  const svgString = await QRCode.toString(content, {
    type: 'svg',
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
    margin: 0,
  });
  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  return URL.createObjectURL(blob);
};


const validateUrl = (url: string, onError: (error: Error) => void): string => {
  const trimmedUrl = url ? url.trim() : '';
  if (!trimmedUrl) {
    return '';
  }

  let urlObject: URL = null;
  try {
    urlObject = new URL(trimmedUrl);
  } catch (e) {
    try {
      urlObject = new URL(`https://${trimmedUrl}`);
    } catch (e) {
      onError(new Error('Please enter a valid website URL'));
      return '';
    }
  }
  return urlObject.href;
};

const useQRCode = ({
  qrActive,
  qrSource,
  qrUrlContent,
  qrSize,
  qrImage,
  qrCallToAction,
}: QRPoperties, onError: (error: Error) => void): QR => {
  const [url, setUrl] = React.useState('');
  const qRImageUrl = qrImage && qrImage.url;

  React.useEffect(() => {
    const updateUrl = async () => {
      if (!qrActive) {
        return;
      }

      const newUrl =
        qrSource === 'haveQRCode'
          ? qrImage
            ? qrImage.url
            : ''
          : await createQRCodeUrl(validateUrl(qrUrlContent, onError));
      
      setUrl(newUrl);
    };
    updateUrl();
  }, [qrActive, qrSource, qrUrlContent, qRImageUrl, qrSize, setUrl, onError])

  return qrActive && url
    ? {
        url,
        size: qrSize,
        callToAction: qrCallToAction,
      }
    : null;
}

export default useQRCode;
