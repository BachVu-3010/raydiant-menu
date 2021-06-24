import React from 'react';
import { mount } from 'enzyme';
import { useFakeTimers } from 'sinon';
import { act } from 'react-dom/test-utils';

import useUpdatingPrice from './useUpdatingPrice';
import { PriceFormatter, Pricing } from '../../types';
import { MenuConfigContext } from '../useMenuConfig';

describe('useUpdatingPrice', () => {
  const TestComponent: React.FC<{pricing: Pricing, priceFormatter: PriceFormatter}> = ({ pricing, priceFormatter }) => {
    const price = useUpdatingPrice(pricing, priceFormatter);
    return <div className='test--useUpdatingPrice'>{price}</div>;
  };

  it('should not update price by default', () => {
    const clock = useFakeTimers(new Date());

    let count = 0;
    const pricing = (priceFormatter: PriceFormatter) => priceFormatter(count++);
    const wrapper = mount(
      <TestComponent pricing={pricing} priceFormatter={(p) => p}/>
    );

    wrapper.find('.test--useUpdatingPrice').text().should.equal('0');
    
    act(() => clock.tick(1100) && undefined);
    wrapper.update().find('.test--useUpdatingPrice').text().should.equal('0');
    
    act(() => clock.tick(1000) && undefined);
    wrapper.update().find('.test--useUpdatingPrice').text().should.equal('0');

    clock.restore();
  });

  it('should return price updated by pricingUpdatingInterval', () => {
    const clock = useFakeTimers(new Date());

    let count = 0;
    const pricing = (priceFormatter: PriceFormatter) => priceFormatter(count++);
    const wrapper = mount(
      <MenuConfigContext.Provider value={{ pricingUpdatingInterval: 1000 }}>
        <TestComponent pricing={pricing} priceFormatter={(p) => p}/>
      </MenuConfigContext.Provider>
    );

    wrapper.find('.test--useUpdatingPrice').text().should.equal('0');
    
    act(() => clock.tick(1100) && undefined);
    wrapper.update().find('.test--useUpdatingPrice').text().should.equal('1');
    
    act(() => clock.tick(1000) && undefined);
    wrapper.update().find('.test--useUpdatingPrice').text().should.equal('2');

    clock.restore();
  });
});
