import React from 'react';
import { ImageData } from '../types';
import useCachedImageUrl from './useCachedImageUrl';

interface ImageSize {
  width: number,
  height: number,
}

export default (url?: string): ImageData => {
  const [imageSize, setImageSize] = React.useState<ImageSize>(null);
  const imageUrl = useCachedImageUrl(url);

  React.useEffect(() => {
    if (!imageUrl) {
      setImageSize(null);
      return;
    }

    const img = new Image();
    img.onload = () => {
      setImageSize({ width: img.width, height: img.height });
    };
    img.src = imageUrl;
  }, [imageUrl]);

  return React.useMemo(() => (imageUrl ? { url: imageUrl, ...imageSize } : null), [imageUrl, imageSize]);
};
