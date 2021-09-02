import React from 'react';
import should from 'should';
import { ThemeProvider, Global } from '@emotion/react';
import { spy, stub } from 'sinon';
import WebFont from 'webfontloader';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';

import MenuLayout from './MenuLayout';
import Layout from './Layout';
import { Presentation, QR, QRPoperties } from './types';

describe('MenuLayout', () => {
  let WebFontLoadStub: sinon.SinonStub;
  const RealImage = Image;
  const fakeImage = new Image();
  fakeImage.width = 1920;
  fakeImage.height = 1080;

  beforeAll(() => {
    window.Image = jest.fn().mockImplementation(() => fakeImage);
    WebFontLoadStub = stub(WebFont, 'load');
  })

  afterAll(() => {
    window.Image = RealImage;
    WebFontLoadStub.restore();
  });

  afterEach(() => {
    WebFontLoadStub.reset();
  });
  
  it('should render Layout inside a ThemeProvider', () => {
    const categories = [
      {
        name: 'category1',
        items: [{ name: 'category 1 item', pricing: () => 1 }]
      },
      { name: 'category 2', items: [] },
    ];
    const onError = spy();
    const onReady = spy();
    const presentation: Presentation = {
      theme: {
        headingFont: 'http://lvh.me/heading-font.woff',
        heading2Font: 'http://lvh.me/heading2-font.woff',
        bodyFont: 'http://lvh.me/body-font.woff',
      },
      values: {
        shouldFormatPrice: true,
        priceFormat: 'integer-format',
        currency: undefined,
        image: { url: 'https://lvh.me/image-url' },
        layout: 'flip',
        enableAnimation: true,
        footnote: 'Custom Footnote',
        footnoteSize: 'large',
        qrActive: true,
        qrSource: 'haveQRCode',
        qrUrlContent: 'http://lvh.me/test-qr-url',
        qrImage: { url: 'http://lvh.me/test-qr-image-url' },
        qrSize: 'small',
        qrCallToAction: 'Call To Action',
      },
    };
    const wrapper = mount(
      <MenuLayout
        categories={categories}
        presentation={presentation}
        onError={onError}
        onReady={onReady}
        isPlaying={true}
        isThumbnail={false}
      />
    );

    WebFontLoadStub.should.be.calledOnce();

    act(() => WebFontLoadStub.getCalls()[0].args[0].active());
    act(() => fakeImage.onload(null));
    wrapper.update();

    const themeProvider = wrapper.find(ThemeProvider);
    const layout = themeProvider.find(Layout);
    layout.prop('categories').should.equal(categories);
    layout.prop('onReady').should.equal(onReady);
    layout.prop('image').should.eql({
      url: 'https://lvh.me/image-url',
      width: 1920,
      height: 1080,
    });
    layout.prop('qr').should.eql({
      url: 'http://lvh.me/test-qr-image-url',
      size: 'small',
      callToAction: 'Call To Action',
    });
    layout.prop('layoutMode').should.equal('flip');
    layout.prop('footnote').should.equal('Custom Footnote');
    layout.prop('footnoteSize').should.equal('large');
    layout.prop('isPlaying').should.be.true();
    layout.prop('isThumbnail').should.be.false();
    layout.prop('enableAnimation').should.be.true();
    layout.prop('shouldFormatPrice').should.be.true();
    layout.prop('currency').should.equal('$');
    layout.prop('priceFormat').should.equal('integer-format');
  });

  it('should inject font-face into global styles', () => {
    const wrapper = mount(
      <MenuLayout
        presentation={{
          theme: {
            headingFont: 'http://lvh.me/heading-font.woff',
            heading2Font: 'http://lvh.me/heading2-font.woff',
            bodyFont: 'http://lvh.me/body-font.woff',
          },
          values: { qrActive: false },
        }}
        categories={[]}
        isPlaying
        onError={spy()}
        onReady={spy()}
      />
    );

    const globalStyles = wrapper.find(Global);
    globalStyles
      .at(0)
      .prop('styles')
      .should.eql({
        '@font-face': {
          fontFamily: 'http___lvh_me_heading_font_woff',
          src: `url(http://lvh.me/heading-font.woff) format('woff')`,
        },
      });
    globalStyles
      .at(1)
      .prop('styles')
      .should.eql({
        '@font-face': {
          fontFamily: 'http___lvh_me_heading2_font_woff',
          src: `url(http://lvh.me/heading2-font.woff) format('woff')`,
        },
      });
    globalStyles
      .at(2)
      .prop('styles')
      .should.eql({
        '@font-face': {
          fontFamily: 'http___lvh_me_body_font_woff',
          src: `url(http://lvh.me/body-font.woff) format('woff')`,
        },
      });
  });

  it('should load fonts', () => {
    const presentationTheme = {
      headingFont: 'http://lvh.me/heading-font.woff',
      heading2Font: 'http://lvh.me/heading2-font.woff',
      bodyFont: 'http://lvh.me/body-font.woff',
    };
    const qrProperties: QRPoperties = {
      qrActive: true,
      qrSource: 'haveQRCode',
      qrUrlContent: 'http://lvh.me/test-qr-url',
      qrImage: { url: 'http://lvh.me/test-qr-image-url' },
      qrSize: 'small',
      qrCallToAction: 'Call To Action',
    };
    mount(
      <MenuLayout
        presentation={{
          theme: presentationTheme,
          values: qrProperties,
        }}
        categories={[]}
        isPlaying
        onError={spy()}
        onReady={spy()}
      />
    );

    WebFontLoadStub.should.be.calledOnce();

    const fontLoadingConfig = WebFontLoadStub.getCalls()[0].args[0];
    fontLoadingConfig.custom.should.eql({
      families: [
        'http___lvh_me_heading_font_woff',
        'http___lvh_me_heading2_font_woff',
        'http___lvh_me_body_font_woff',
        'https___fonts_raydiant_com_Roboto_Regular_woff',
      ],
    });
  });

  it('should fire error if failed to load fonts', () => {
    const onError = spy();
    mount(
      <MenuLayout
        presentation={{
          theme: {
            headingFont: 'http://lvh.me/heading-font.woff',
            heading2Font: 'http://lvh.me/heading2-font.woff',
            bodyFont: 'http://lvh.me/body-font.woff',
          },
          values: { qrActive: false },
        }}
        categories={[]}
        isPlaying
        onError={onError}
        onReady={spy()}
      />
    );

    WebFontLoadStub.should.be.calledOnce();
    onError.should.not.be.called();

    WebFontLoadStub.getCalls()[0].args[0].inactive(new Error());

    onError.should.be.calledOnce();
    onError.getCalls()[0].args[0].message.should.equal('Failed to load fonts.');
  });

  it('should not fire load font error if the component has already unmounted', () => {
    const onError = spy();
    const wrapper = mount(
      <MenuLayout
        presentation={{
          theme: {
            headingFont: 'http://lvh.me/heading-font.woff',
            heading2Font: 'http://lvh.me/heading2-font.woff',
            bodyFont: 'http://lvh.me/body-font.woff',
          },
          values: { qrActive: false },
        }}
        categories={[]}
        isPlaying
        onError={onError}
        onReady={spy()}
      />
    );

    WebFontLoadStub.should.be.calledOnce();
    onError.should.not.be.called();

    wrapper.unmount();
    WebFontLoadStub.getCalls()[0].args[0].inactive(new Error());

    onError.should.not.be.called();
  });

  it('should update theme and reload fonts when theme data is changed', () => {
    const wrapper = mount(
      <MenuLayout
        presentation={{
          theme: {
            headingFont: 'http://lvh.me/heading-font.woff',
            heading2Font: 'http://lvh.me/heading2-font.woff',
            bodyFont: 'http://lvh.me/body-font.woff',
          },
          values: { qrActive: false },
        }}
        categories={[]}
        isPlaying
        onError={spy()}
        onReady={spy()}
      />
    );

    WebFontLoadStub.should.be.calledOnce();
    WebFontLoadStub.getCalls()[0].args[0].custom.should.eql({
      families: [
        'http___lvh_me_heading_font_woff',
        'http___lvh_me_heading2_font_woff',
        'http___lvh_me_body_font_woff',
        'https___fonts_raydiant_com_Roboto_Regular_woff'
      ],
    });
    
    wrapper.setProps({
      presentation: {
        theme: {
          headingFont: 'http://lvh.me/new-heading-font.woff',
          heading2Font: 'http://lvh.me/new-heading2-font.woff',
          bodyFont: 'http://lvh.me/new-body-font.woff',
        },
        values: { qrActive: false, layout: 'flip' },
      },
    });

    WebFontLoadStub.should.be.calledTwice();
    WebFontLoadStub.getCalls()[1].args[0].custom.should.eql({
      families: [
        'http___lvh_me_new_heading_font_woff',
        'http___lvh_me_new_heading2_font_woff',
        'http___lvh_me_new_body_font_woff',
        'https___fonts_raydiant_com_Roboto_Regular_woff'
      ]
    });
  });

  it('should not reload theme if theme vars are not deeply changed', () => {
    const wrapper = mount(
      <MenuLayout
        presentation={{
          theme: {
            headingFont: 'http://lvh.me/heading-font.woff',
            heading2Font: 'http://lvh.me/heading2-font.woff',
            bodyFont: 'http://lvh.me/body-font.woff',
          },
          values: { qrActive: false },
        }}
        categories={[]}
        isPlaying
        onError={spy()}
        onReady={spy()}
      />
    );

    WebFontLoadStub.should.be.calledOnce();
    act(() => WebFontLoadStub.getCalls()[0].args[0].active());
    const oldTheme = wrapper.update().find(ThemeProvider).prop('theme');

    wrapper.setProps({
      presentation: {
        theme: {
          headingFont: 'http://lvh.me/heading-font.woff',
          heading2Font: 'http://lvh.me/heading2-font.woff',
          bodyFont: 'http://lvh.me/body-font.woff',
        },
        values: { qrActive: true },
      },
    });

    // assert theme was not updated and no rerender
    wrapper.update().find(ThemeProvider).prop('theme').should.equal(oldTheme);
    WebFontLoadStub.should.be.calledOnce();
  });

  it('should render Layout after fonts loaded and image size calculated ', () => {
    const categories = [
      {
        name: 'category1',
        items: [{ name: 'category 1 item', pricing: () => 1 }]
      },
      { name: 'category 2', items: [] },
    ];
    const presentation: Presentation = {
      theme: {
        headingFont: 'http://lvh.me/heading-font.woff',
        heading2Font: 'http://lvh.me/heading2-font.woff',
        bodyFont: 'http://lvh.me/body-font.woff',
      },
      values: {
        shouldFormatPrice: true,
        priceFormat: 'integer-format',
        currency: '$',
        image: { url: 'https://lvh.me/image-url' },
        layout: 'flip',
        enableAnimation: true,
        footnote: 'Custom Footnote',
        footnoteSize: 'large',
        qrActive: false,
      },
    };
    const wrapper = mount(
      <MenuLayout
        categories={categories}
        presentation={presentation}
        isPlaying
        onError={spy()}
        onReady={spy()}
      />
    );

    WebFontLoadStub.should.be.calledOnce();
    wrapper.update().find(ThemeProvider).exists().should.be.true();
    wrapper.find(Layout).exists().should.be.false();
    
    act(() => WebFontLoadStub.getCalls()[0].args[0].active());
    wrapper.update().find(Layout).exists().should.be.false();

    act(() => fakeImage.onload(null));
    wrapper.update().find(Layout).exists().should.be.true();
  });
});
