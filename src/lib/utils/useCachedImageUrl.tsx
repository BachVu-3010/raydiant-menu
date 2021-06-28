import React from 'react';

const RETRY_DELAY = 200;

const useCachedImageUrl = (imageUrl?: string): string => {
  const [cachedImageUrl, setCachedImageUrl] = React.useState(imageUrl);
  const [retry, setRetry] = React.useState(0);

  React.useEffect(() => {
    if (imageUrl === cachedImageUrl) {
      return;
    }

    if (!imageUrl || imageUrl.startsWith('blob:')) {
      setCachedImageUrl(imageUrl);
      if(retry) setRetry(0);
      return;
    }

    const checkImageUrl = async () => {
      try {
        const res = await fetch(imageUrl, { method: 'HEAD' });
        if (res.ok) {
          setCachedImageUrl(imageUrl);
          if(retry) setRetry(0);
        } else {
          setTimeout(() => setRetry(retry + 1), RETRY_DELAY);
        }
      } catch (e) {
        setTimeout(() => setRetry(retry + 1), RETRY_DELAY);
      }
    };
    checkImageUrl();
  }, [cachedImageUrl, imageUrl, retry]);

  return cachedImageUrl;
};

export default useCachedImageUrl;
