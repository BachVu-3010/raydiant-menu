import React from 'react';
import { PriceFormatter, Pricing } from '../../types';
import useMenuConfig from '../useMenuConfig';

const useUpdatingPrice = (pricing: Pricing, priceFormatter: PriceFormatter) => {
  const [price, setPrice] = React.useState('');
  const { pricingUpdatingInterval } = useMenuConfig();

  React.useEffect(() => setPrice(pricing(priceFormatter)), [pricing, priceFormatter]);

  React.useEffect(() => {
    if (pricingUpdatingInterval) {
      const updatingInterval = setInterval(
        () => setPrice(pricing(priceFormatter)),
        pricingUpdatingInterval
      );
      return () => clearInterval(updatingInterval);
    }
  }, [pricing, priceFormatter, pricingUpdatingInterval]);

  return price;
}

export default useUpdatingPrice;
