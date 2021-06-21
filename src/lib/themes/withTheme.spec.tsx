import React from 'react';
import { ThemeProvider, Global } from '@emotion/react';
import * as sinon from 'sinon';
import WebFont from 'webfontloader';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';

import withTheme, { WrappedComponentBaseProps } from './withTheme';

describe('withTheme', () => {
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
  
  interface TestComponentProps extends WrappedComponentBaseProps {
    anotherProp?: string;
  }
  const TestComponent: React.FC<TestComponentProps> = 
    ({anotherProp}) => <div className='test--component'>{anotherProp}</div>;
  const ComponentWithTheme = withTheme(TestComponent);

  it('should wrap AppComponent element into a ThemeProvider', () => {
    const onError = sinon.spy();
    const wrapper = mount(
      <ComponentWithTheme
        presentation={{
          theme: {
            headingFont: 'http://lvh.me/heading-font.woff',
            heading2Font: 'http://lvh.me/heading2-font.woff',
            bodyFont: 'http://lvh.me/body-font.woff',
          },
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
      },
      onError,
      fontsLoaded: true,
      anotherProp: 'some other prop should be passed into AppComponent',
    });
  });

  it('should inject font-face into global styles', () => {
    const wrapper = mount(
      <ComponentWithTheme
        presentation={{
          theme: {
            headingFont: 'http://lvh.me/heading-font.woff',
            heading2Font: 'http://lvh.me/heading2-font.woff',
            bodyFont: 'http://lvh.me/body-font.woff',
          },
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

  it('should load fonts and render AppComponent with fontsLoaded prop', () => {
    const wrapper = mount(
      <ComponentWithTheme
        presentation={{
          theme: {
            headingFont: 'http://lvh.me/heading-font.woff',
            heading2Font: 'http://lvh.me/heading2-font.woff',
            bodyFont: 'http://lvh.me/body-font.woff',
          },
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

    wrapper.find(TestComponent).prop('fontsLoaded').should.be.true();
  });

  it('should fire error if failed to load fonts', () => {
    const onError = sinon.spy();
    mount(
      <ComponentWithTheme
        presentation={{
          theme: {
            headingFont: 'http://lvh.me/heading-font.woff',
            heading2Font: 'http://lvh.me/heading2-font.woff',
            bodyFont: 'http://lvh.me/body-font.woff',
          },
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
      <ComponentWithTheme
        presentation={{
          theme: {
            headingFont: 'http://lvh.me/heading-font.woff',
            heading2Font: 'http://lvh.me/heading2-font.woff',
            bodyFont: 'http://lvh.me/body-font.woff',
          },
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
      <ComponentWithTheme
        presentation={{
          theme: {
            headingFont: 'http://lvh.me/heading-font.woff',
            heading2Font: 'http://lvh.me/heading2-font.woff',
            bodyFont: 'http://lvh.me/body-font.woff',
          },
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
      },
    });

    // assert theme was not updated and no rerender
    wrapper.update().find(ThemeProvider).prop('theme').should.equal(oldTheme);
    WebFontLoadStub.should.be.calledOnce();
  });
});
