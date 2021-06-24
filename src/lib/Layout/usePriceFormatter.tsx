import React from 'react';
import { PRICE_FORMATS } from '../constants';

const createPriceFormatter = (shouldFormatPrice?: boolean, currency?: string, priceFormat?: string) => (priceString: string | number) => {
  if (!shouldFormatPrice) {
    return priceString;
  }

  const price = parseFloat(String(priceString));

  if (!price) {
    return priceString;
  }

  switch (priceFormat) {
    case PRICE_FORMATS.SIMPLE.value:
      return `${currency}${price}`;
    case PRICE_FORMATS.INT.value:
      return `${currency}${price.toFixed(0)}`;
    case PRICE_FORMATS.FLOAT_1.value:
      return `${currency}${price.toFixed(1)}`;
    case PRICE_FORMATS.FLOAT_2.value:
      return `${currency}${price.toFixed(2)}`;
    default:
      return `${currency}${price}`;
  }
};

export default (shouldFormatPrice?: boolean, currency?: string, priceFormat?: string ) => {
  return React.useMemo(() => createPriceFormatter(shouldFormatPrice, currency, priceFormat), [
    shouldFormatPrice,
    currency,
    priceFormat,
  ]);
};
