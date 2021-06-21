import React from 'react';

import * as Styles from './Item.styles';
import isValidPrice from '../../utils/isValidPrice';
import { PriceFormatter, Pricing } from '../../types';

const propTypes = {
};

interface ItemProps {
  name?: string;
  description?: string;
  pricing?: Pricing;
  strikethrough?: boolean;
  fontSize: number;
  hideName?: boolean;
  hideDescription?: boolean;
  hidePrice?: boolean;
  priceFormatter?: PriceFormatter;
}

const defaultProps = {
  description: '',
  pricing: () => '',
  strikethrough: false,
  hideName: false,
  hideDescription: false,
  hidePrice: false,
  priceFormatter: (price: string | number) => price,
};

const Item: React.FC<ItemProps> = ({
  name,
  description,
  pricing,
  strikethrough,
  fontSize,
  hideName,
  hideDescription,
  hidePrice,
  priceFormatter,
}) => {
  const price = pricing(priceFormatter);
  const hasPrice = !hidePrice && isValidPrice(price);
  return (
    <>
      <Styles.Name strikethrough={strikethrough} fontSize={fontSize}>
        {hideName || name}
        {hasPrice && <Styles.PriceSeparator />}
        {hasPrice && <Styles.Price fontSize={fontSize}>{price}</Styles.Price>}
      </Styles.Name>
      {hideDescription || (
        <Styles.Description strikethrough={strikethrough} fontSize={fontSize}>
          {description}
        </Styles.Description>
      )}
    </>
  );
};

Item.propTypes = propTypes;
Item.defaultProps = defaultProps;

export default Item;
