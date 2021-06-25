import React from 'react';
import { mount } from 'enzyme';

import useMenuConfig, { MenuConfigContext, DEFAULT_CONFIG } from './useMenuConfig';

describe('useMenuConfig', () => {
  const TestComponent: React.FC<{}> = () => {
    const config = useMenuConfig();
    return <div className='test--useMenuConfig'>{JSON.stringify(config)}</div>;
  };

  it('should return default config if no config provided', () => {
    const wrapper = mount(<TestComponent />);

    wrapper.find('.test--useMenuConfig').text().should.equal(JSON.stringify(DEFAULT_CONFIG));
  });

  it('should return customized config', () => {
    const wrapper = mount(
      <MenuConfigContext.Provider value={{ pricingUpdatingInterval: 1000 }}>
        <TestComponent />
      </MenuConfigContext.Provider>
    );

    wrapper.find('.test--useMenuConfig').text().should.equal(JSON.stringify({
      pricingUpdatingInterval: 1000,
    }));
  });
});
