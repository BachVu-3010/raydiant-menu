import React from 'react';
import { ThemeProvider, Global } from '@emotion/react';
import * as sinon from 'sinon';
import WebFont from 'webfontloader';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';

import withMenu from './withMenu';
import { AppProps, QRPoperties } from './types';

describe('withMenu', () => {
  let WebFontLoadStub: sinon.SinonStub;

  beforeAll(() => {
    WebFontLoadStub = sinon.stub(WebFont, 'load');
  })

  afterAll(() => {
    WebFontLoadStub.restore();
  });

  afterEach(() => {
    WebFontLoadStub.reset();
  });
  
  interface TestComponentProps extends AppProps {
    anotherProp?: string;
  }
  const TestComponent: React.FC<TestComponentProps> = 
    ({anotherProp}) => <div className='test--component'>{anotherProp}</div>;
  const ComponentWithMenu = withMenu(TestComponent);

  it('should wrap AppComponent element into a ThemeProvider', () => {
    const onError = sinon.spy();
    const wrapper = mount(
      <ComponentWithMenu
        presentation={{
          theme: {
            headingFont: 'http://lvh.me/heading-font.woff',
            heading2Font: 'http://lvh.me/heading2-font.woff',
            bodyFont: 'http://lvh.me/body-font.woff',
          },
          values: { qrActive: false },
        }}
        onError={onError}
        anotherProp='some other prop should be passed into AppComponent'
      />
    );

    WebFontLoadStub.should.be.calledOnce();

    act(() => WebFontLoadStub.getCalls()[0].args[0].active());
    wrapper.update();

    const themeProvider = wrapper.find(ThemeProvider);
    const content = themeProvider.find(TestComponent);
    content.props().should.eql({
      presentation: {
        theme: {
          headingFont: 'http://lvh.me/heading-font.woff',
          heading2Font: 'http://lvh.me/heading2-font.woff',
          bodyFont: 'http://lvh.me/body-font.woff',
        },
        values: { qrActive: false },
      },
      qr: null,
      onError,
      fontsLoaded: true,
      anotherProp: 'some other prop should be passed into AppComponent',
    });
  });

  it('should inject font-face into global styles', () => {
    const wrapper = mount(
      <ComponentWithMenu
        presentation={{
          theme: {
            headingFont: 'http://lvh.me/heading-font.woff',
            heading2Font: 'http://lvh.me/heading2-font.woff',
            bodyFont: 'http://lvh.me/body-font.woff',
          },
          values: { qrActive: false },
        }}
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

  it('should load fonts and render AppComponent with fontsLoaded and qr prop', () => {
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
    const wrapper = mount(
      <ComponentWithMenu
        presentation={{
          theme: presentationTheme,
          values: qrProperties,
        }}
      />
    );

    WebFontLoadStub.should.be.calledOnce();

    wrapper.find(TestComponent).prop('fontsLoaded').should.be.false();

    const fontLoadingConfig = WebFontLoadStub.getCalls()[0].args[0];
    fontLoadingConfig.custom.should.eql({
      families: [
        'http___lvh_me_heading_font_woff',
        'http___lvh_me_heading2_font_woff',
        'http___lvh_me_body_font_woff',
        'https___fonts_raydiant_com_Roboto_Regular_woff',
      ],
    });

    act(() => fontLoadingConfig.active());
    wrapper.update();

    const testComponent = wrapper.find(TestComponent);
    testComponent.prop('fontsLoaded').should.be.true();
    testComponent.prop('qr').should.eql({
      url: 'http://lvh.me/test-qr-image-url',
      size: 'small',
      callToAction: 'Call To Action'
    });
  });

  it('should fire error if failed to load fonts', () => {
    const onError = sinon.spy();
    mount(
      <ComponentWithMenu
        presentation={{
          theme: {
            headingFont: 'http://lvh.me/heading-font.woff',
            heading2Font: 'http://lvh.me/heading2-font.woff',
            bodyFont: 'http://lvh.me/body-font.woff',
          },
          values: { qrActive: false },
        }}
        onError={onError}
      />
    );

    WebFontLoadStub.should.be.calledOnce();
    onError.should.not.be.called();

    WebFontLoadStub.getCalls()[0].args[0].inactive(new Error());

    onError.should.be.calledOnce();
    onError.getCalls()[0].args[0].message.should.equal('Failed to load fonts.');
  });

  it('should update theme and reload fonts when theme data is changed', () => {
    const wrapper = mount(
      <ComponentWithMenu
        presentation={{
          theme: {
            headingFont: 'http://lvh.me/heading-font.woff',
            heading2Font: 'http://lvh.me/heading2-font.woff',
            bodyFont: 'http://lvh.me/body-font.woff',
          },
          values: { qrActive: false },
        }}
        onError={sinon.spy()}
        anotherProp='some other prop should be passed into AppComponent'
      />
    );

    WebFontLoadStub.should.be.calledOnce();
    act(() => WebFontLoadStub.getCalls()[0].args[0].active());

    wrapper.update().find(TestComponent).prop('presentation').theme.should.eql({
      headingFont: 'http://lvh.me/heading-font.woff',
      heading2Font: 'http://lvh.me/heading2-font.woff',
      bodyFont: 'http://lvh.me/body-font.woff',
    });

    wrapper.setProps({
      presentation: {
        theme: {
          headingFont: 'http://lvh.me/new-heading-font.woff',
          heading2Font: 'http://lvh.me/new-heading2-font.woff',
          bodyFont: 'http://lvh.me/new-body-font.woff',
        },
        values: { qrActive: false },
      },
    });

    WebFontLoadStub.should.be.calledTwice();
    act(() => WebFontLoadStub.getCalls()[1].args[0].active());

    wrapper.update().find(TestComponent).prop('presentation').theme.should.eql({
      headingFont: 'http://lvh.me/new-heading-font.woff',
      heading2Font: 'http://lvh.me/new-heading2-font.woff',
      bodyFont: 'http://lvh.me/new-body-font.woff',
    });
  });

  it('should not reload theme if theme vars are not deeply changed', () => {
    const wrapper = mount(
      <ComponentWithMenu
        presentation={{
          theme: {
            headingFont: 'http://lvh.me/heading-font.woff',
            heading2Font: 'http://lvh.me/heading2-font.woff',
            bodyFont: 'http://lvh.me/body-font.woff',
          },
          values: { qrActive: false },
        }}
        onError={sinon.spy()}
        anotherProp='some other prop should be passed into AppComponent'
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
        values: { qrActive: false },
      },
    });

    // assert theme was not updated and no rerender
    wrapper.update().find(ThemeProvider).prop('theme').should.equal(oldTheme);
    WebFontLoadStub.should.be.calledOnce();
  });
});
