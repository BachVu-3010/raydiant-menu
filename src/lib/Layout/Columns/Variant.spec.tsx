import React from 'react';
import should from 'should';
import { stub } from 'sinon';
import { mount } from 'enzyme';
import { ThemeProvider } from '@emotion/react';

import Variant from './Variant';
import * as Styles from './Variant.styles';
import createTheme from '../../themes/createTheme';

const createRef = (obj: object) =>
  Object.defineProperty(obj, 'current', {
    get: () => obj,
    set: () => obj,
  });

describe('Variant', () => {
  it('should render enough content', () => {
    const wrapper = mount(
      <ThemeProvider theme={createTheme({}, false)}>
        <Variant name='Mango milkshake' pricing={() => '5'} />
      </ThemeProvider>
    );

    const nameWrapper = wrapper.find(Styles.NameWrapper);
    nameWrapper.text().should.equal('Mango milkshake');
    should(nameWrapper.prop('width')).be.null();

    const priceWrapper = wrapper.find(Styles.PriceWrapper);
    priceWrapper.find(Styles.PriceSeparator).exists().should.be.true();
    priceWrapper.find(Styles.Price).text().should.be.equal('5');
  });

  it('should not render PriceWrapper if there is no price', () => {
    const wrapper = mount(
      <ThemeProvider theme={createTheme({}, false)}>
        <Variant name='Mango milkshake' />
      </ThemeProvider>
    );

    const priceWrapper = wrapper.find(Styles.PriceWrapper);
    priceWrapper.exists().should.be.false();
  });

  it('should set width to NameWrapper based on name span', () => {
    const useRefStub = stub(React, 'useRef').returns(
      createRef({
        offsetWidth: 100,
      })
    );

    const wrapper = mount(
      <ThemeProvider theme={createTheme({}, false)}>
        <Variant name='Mango milkshake' pricing={() => '5'} />
      </ThemeProvider>
    );

    const nameWrapper = wrapper.find(Styles.NameWrapper);
    nameWrapper.prop('width').should.equal(100 + 1);
    useRefStub.restore();
  });

  it('should not set width to NameWrapper if there is no price', () => {
    const useRefStub = stub(React, 'useRef').returns(
      createRef({
        offsetWidth: 100,
      })
    );

    const wrapper = mount(
      <ThemeProvider theme={createTheme({}, false)}>
        <Variant name='Mango milkshake' />
      </ThemeProvider>
    );

    const nameWrapper = wrapper.find(Styles.NameWrapper);
    should(nameWrapper.prop('width')).be.null();

    useRefStub.restore();
  });

  it('should not set width to NameWrapper if there is no name ref', () => {
    const useRefStub = stub(React, 'useRef').returns({ current: null });

    const wrapper = mount(
      <ThemeProvider theme={createTheme({}, false)}>
        <Variant name='Mango milkshake' />
      </ThemeProvider>
    );

    const nameWrapper = wrapper.find(Styles.NameWrapper);
    should(nameWrapper.prop('width')).be.null();

    useRefStub.restore();
  });

  it('should not set width to NameWrapper only when hide is true', () => {
    const useRefStub = stub(React, 'useRef').returns(
      createRef({
        offsetWidth: 100,
      })
    );

    const wrapper = mount(
      <ThemeProvider theme={createTheme({}, false)}>
        <Variant name='Mango milkshake' pricing={() => '5'} hide={true} />
      </ThemeProvider>
    );

    const nameWrapper = wrapper.find(Styles.NameWrapper);
    should(nameWrapper.prop('width')).be.null();

    useRefStub.restore();
  });

  it('should reset width to NameWrapper when price is removed', () => {
    const useRefStub = stub(React, 'useRef').returns(
      createRef({
        offsetWidth: 100,
      })
    );

    const wrapper = mount(
      <ThemeProvider theme={createTheme({}, false)}>
        <Variant name='Mango milkshake' pricing={() => '5'} />
      </ThemeProvider>
    );

    const nameWrapper = wrapper.find(Styles.NameWrapper);
    nameWrapper.prop('width').should.equal(100 + 1);

    wrapper.setProps({ children: <Variant name='Mango milkshake' /> });
    should(wrapper.update().find(Styles.NameWrapper).prop('width')).be.null();

    useRefStub.restore();
  });

  it('should render texts with strikethrough is true', () => {
    const wrapper = mount(
      <ThemeProvider theme={createTheme({}, false)}>
        <Variant name='Mango milkshake' pricing={() => '5'} />
      </ThemeProvider>
    );

    const name = wrapper.find(Styles.Name);
    name.prop('strikethrough').should.be.false();

    wrapper.setProps({ children: <Variant name='Mango milkshake' pricing={() => '5'} strikethrough /> });

    wrapper.update().find(Styles.Name).prop('strikethrough').should.be.true();
  });

  it('should render texts properly when price is 0', () => {
    const wrapper = mount(
      <ThemeProvider theme={createTheme({}, false)}>
        <Variant name='Mango milkshake' pricing={() => 0} />
      </ThemeProvider>
    );

    wrapper.find(Styles.NameWrapper).text().should.equal('Mango milkshake');
    wrapper.find(Styles.PriceWrapper).exists().should.be.false();
  });

  it('should be able to hide price', () => {
    const wrapper = mount(
      <ThemeProvider theme={createTheme({}, false)}>
        <Variant name='Mango milkshake' pricing={() => '5'} hidePrice />
      </ThemeProvider>
    );

    wrapper.find(Styles.NameWrapper).text().should.equal('Mango milkshake');

    wrapper.find(Styles.PriceWrapper).exists().should.be.false();
    wrapper.find(Styles.PriceSeparator).exists().should.be.false();
    wrapper.find(Styles.Price).exists().should.be.false();
  });

  it('should format price', () => {
    const wrapper = mount(
      <ThemeProvider theme={createTheme({}, false)}>
        <Variant
          name='Mango milkshake'
          pricing={(priceFormatter) => priceFormatter(5)}
          priceFormatter={(price) => `formatted ${price}`}
        />
      </ThemeProvider>
    );

    wrapper.find(Styles.Price).text().should.be.equal('formatted 5');
  });
});
