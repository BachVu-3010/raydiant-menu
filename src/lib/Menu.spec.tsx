import * as React from 'react';
import { mount } from 'enzyme';

import Menu from './Menu';

describe('', () => {
  it('should render a message', () => {
    const wrapper = mount(
      <Menu message='test message' />
    );
  
    wrapper.find('div').text().should.equal('test message');
  })
})