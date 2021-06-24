import React from 'react';
import { mount } from 'enzyme';

import { PRICE_FORMATS } from '../constants';
import usePriceFormatter from './usePriceFormatter';

describe('usePriceFormatter', () => {
  interface TestComponentProps {
    price: string | number;
    priceFormatConfig: {
      shouldFormatPrice?: boolean,
      currency?: string,
      priceFormat?: string
    };
  }

  const TestComponent: React.FC<TestComponentProps> = ({ price, priceFormatConfig }) => {
    const {shouldFormatPrice, currency, priceFormat} = priceFormatConfig;
    const priceFormatter = usePriceFormatter(shouldFormatPrice, currency, priceFormat);
    return <div className='test--usePriceFormatter'>{priceFormatter(price)}</div>;
  };

  it('should return a formatter which is simple formatter by default', () => {
    const priceFormatConfig = {
      shouldFormatPrice: true,
      currency: '$',
    };
    const wrapper = mount(<TestComponent price={1.5} priceFormatConfig={priceFormatConfig} />);

    wrapper.find('.test--usePriceFormatter').text().should.equal('$1.5');
  });

  it('should return a formatter which do nothing if shouldFormatPrice is false', () => {
    const priceFormatConfig = {
      shouldFormatPrice: false,
      currency: '$',
    };
    const wrapper = mount(<TestComponent price={1.5} priceFormatConfig={priceFormatConfig} />);

    wrapper.find('.test--usePriceFormatter').text().should.equal('1.5');
  });

  it('may return a formatter which is 0 formatter', () => {
    const priceFormatConfig = {
      shouldFormatPrice: true,
      currency: '$',
      priceFormat: PRICE_FORMATS.INT.value,
    };
    const wrapper = mount(<TestComponent price={1.4} priceFormatConfig={priceFormatConfig} />);

    wrapper.find('.test--usePriceFormatter').text().should.equal('$1');
  });

  it('may return a formatter which is 0.0 formatter', () => {
    const priceFormatConfig = {
      shouldFormatPrice: true,
      currency: '$',
      priceFormat: PRICE_FORMATS.FLOAT_1.value,
    };
    const wrapper = mount(<TestComponent price={1.46} priceFormatConfig={priceFormatConfig} />);

    wrapper.find('.test--usePriceFormatter').text().should.equal('$1.5');
  });

  it('may return a formatter which is 0.00 formatter', () => {
    const priceFormatConfig = {
      shouldFormatPrice: true,
      currency: '$',
      priceFormat: PRICE_FORMATS.FLOAT_2.value,
    };
    const wrapper = mount(<TestComponent price={1.456} priceFormatConfig={priceFormatConfig} />);

    wrapper.find('.test--usePriceFormatter').text().should.equal('$1.46');
  });

  it('should return a formatter which keep MP price', () => {
    const priceFormatConfig = {
      shouldFormatPrice: true,
      currency: '$',
      priceFormat: PRICE_FORMATS.FLOAT_2.value,
    };
    const wrapper = mount(<TestComponent price='MP' priceFormatConfig={priceFormatConfig} />);

    wrapper.find('.test--usePriceFormatter').text().should.equal('MP');
  });
});
