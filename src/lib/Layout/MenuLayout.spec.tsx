import React from 'react';
import should from 'should'
import { mount } from 'enzyme';
import { spy } from 'sinon';
import { ThemeProvider } from '@emotion/react';
import { act } from 'react-dom/test-utils';

import { createTestCategory, createTestItem, createTestVariant } from './Columns/useMenuGroups.spec';
import createTheme from '../themes/createTheme';
import MenuLayout from './MenuLayout';
import Layout from './Layout';
import { QR } from '../types';

describe('MenuLayout', () => {
  it('should render Layout with calculated image', (done) => {
    const fakeImage = new Image();
    fakeImage.width = 1920;
    fakeImage.height = 1080;
    const RealImage = Image;
    window.Image = jest.fn().mockImplementation(() => fakeImage);

    const imageUrl = 'https://lvh.me/image.png';
    const qr: QR = { url: '', size: 'large' };
    const categories = [
      createTestCategory(1, [
        createTestItem(1, [createTestVariant(1), createTestVariant(2), createTestVariant(3)]),
      ]),
    ];
    const onReady = spy();
    const wrapper = mount(
      <ThemeProvider theme={createTheme({}, false)}>
        <MenuLayout
          fontsLoaded={true}
          imageUrl={imageUrl}
          qr={qr}
          layoutMode='default'
          categories={categories}
          onReady={onReady}
        />
      </ThemeProvider>
    );

    wrapper.update().find(Layout).exists().should.be.false();

    act(() => {
      fakeImage.onload(null);
    });

    setImmediate(() => {
      const layout = wrapper.update().find(Layout);
      layout.prop('image').should.eql({
        url: 'https://lvh.me/image.png',
        width: 1920,
        height: 1080,
      });
      layout.prop('categories').should.equal(categories);
      layout.prop('qr').should.equal(qr);

      window.Image = RealImage;
      done();
    });
  });

  it('should render nothing if fontsLoaded is false', (done) => {
    const qr: QR = { url: '', size: 'large' };
    const categories = [
      createTestCategory(1, [
        createTestItem(1, [createTestVariant(1), createTestVariant(2), createTestVariant(3)]),
      ]),
    ];
    const onReady = spy();
    const wrapper = mount(
      <ThemeProvider theme={createTheme({}, false)}>
        <MenuLayout
          fontsLoaded={true}
          layoutMode='default'
          categories={categories}
          onReady={onReady}
        />
      </ThemeProvider>
    );

    const layoutWithoutImage = wrapper.update().find(Layout);
    should(layoutWithoutImage.prop('image')).be.null();
    layoutWithoutImage.prop('categories').should.equal(categories);

    act(() => {
      wrapper.setProps({ children: (
        <MenuLayout
          fontsLoaded={false}
          layoutMode='default'
          categories={categories}
          onReady={onReady}
        />
      )});
      wrapper.update();
    })

    setImmediate(() => {
      wrapper.find(Layout).exists().should.be.false();
      done();
    });
  });
});
