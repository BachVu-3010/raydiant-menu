import React from 'react';

import * as Styles from './Variant.styles';
import isValidPrice from '../../utils/isValidPrice';
import { PriceFormatter, Pricing } from '../../types';
import useUpdatingPrice from './useUpdatingPrice';

interface VariantProps {
  name?: string;
  pricing?: Pricing;
  hide?: boolean;
  strikethrough?: boolean;
  fontSize?: number;
  hideName?: boolean;
  hidePrice?: boolean;
  priceFormatter?: PriceFormatter;
}

const defaultProps = {
  pricing: () => '',
  strikethrough: false,
  priceFormatter: (price: string | number) => price,
};

const Variant: React.FC<VariantProps> = ({ name, pricing, hide, strikethrough, fontSize, hidePrice, priceFormatter }) => {
  const [nameWidth, setNameWidth] = React.useState(null);
  const nameEl = React.useRef(null);
  const width = nameEl.current ? nameEl.current.offsetWidth : 0;
  const price = useUpdatingPrice(pricing, priceFormatter);
  React.useEffect(() => {
    // Only setNameWidth after finishing calculating text, to avoid changing layout during calculation
    // Without PriceSeparator and Price, setNameWidth will make the NameWrapper overflow
    if (!hide && price && width) {
      // the offsetWidth is always rounded down, plus 1 to make sure we don't reduce NameWrapper's width
      setNameWidth(width + 1);
    } else {
      setNameWidth(null);
    }
  }, [hide, price, width]);

  return (
    <Styles.Name strikethrough={strikethrough} fontSize={fontSize}>
      <Styles.NameWrapper width={nameWidth}>
        <span ref={nameEl}>{name}</span>
      </Styles.NameWrapper>
      {!hidePrice && isValidPrice(price) && (
        <Styles.PriceWrapper>
          <Styles.PriceSeparator />
          <Styles.Price>{price}</Styles.Price>
        </Styles.PriceWrapper>
      )}
    </Styles.Name>
  );
};

Variant.defaultProps = defaultProps;

export default Variant;
