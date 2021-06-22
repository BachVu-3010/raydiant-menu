import React from 'react';
import { ImageData } from '../types';

interface ImageSize {
  width: number,
  height: number,
}

export default (imageUrl?: string): ImageData => {
  const [imageSize, setImageSize] = React.useState<ImageSize>(null);

  React.useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageSize({ width: img.width, height: img.height });
    };
    img.src = imageUrl;
  }, [imageUrl]);

  return React.useMemo(() => (imageUrl ? { url: imageUrl, ...imageSize } : null), [imageUrl, imageSize]);
};
