import React from 'react';
import { mount } from 'enzyme';
import { stub, spy, SinonStub } from 'sinon';
import { ThemeProvider } from '@emotion/react';

import TextFit from './TextFit';
import * as Styles from './TextFit.styles';
import { vw1920 } from '../../../themes/createTheme';

const createRef = (obj: object) =>
  Object.defineProperty(obj, 'current', {
    get: () => obj,
    set: () => obj,
  });

describe('TextFit', () => {
  let useRefStub: SinonStub;
  afterEach(() => {
    if (useRefStub) {
      useRefStub.restore();
    }
  });

  it('should stop fitting at the smallest size', (done) => {
    useRefStub = stub(React, 'useRef').returns(
      createRef({
        scrollWidth: 100,
        scrollHeight: 100,
        clientWidth: 50,
        clientHeight: 50,
      })
    );

    const onCalculated = spy();
    const wrapper = mount(
      <ThemeProvider theme={{ vw: vw1920 }}>
        <TextFit maxFontSize={42} minFontSize={10} onCalculated={onCalculated}>
          This is a test sentence
        </TextFit>
      </ThemeProvider>
    );

    setTimeout(() => {
      onCalculated.should.be.calledOnce();
      const text = wrapper.update().find(Styles.TextContent);
      text.prop('elFontSize').should.equal(10);
      done();
    }, 10);
  });

  it('should might fit at the biggest size', (done) => {
    const theme = { vw: vw1920 };
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <TextFit maxFontSize={42} minFontSize={10}>
          This is a test sentence
        </TextFit>
      </ThemeProvider>
    );

    setTimeout(() => {
      const text = wrapper.update().find(Styles.TextContent);
      text.prop('elFontSize').should.equal(42);
      done();
    }, 10);
  });

  it('should pick a greatest fit size', (done) => {
    const resizeCount = 7;

    let count = 0;
    useRefStub = stub(React, 'useRef').callsFake(() => {
      count = count + 1;
      if (count <= resizeCount + 1) {
        return createRef({
          scrollWidth: 100,
          scrollHeight: 50,
          clientWidth: 50,
          clientHeight: 50,
        });
      } else {
        return createRef({
          scrollWidth: 50,
          scrollHeight: 50,
          clientWidth: 50,
          clientHeight: 50,
        });
      }
    });

    const onCalculated = spy();
    const theme = { vw: vw1920 };
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <TextFit maxFontSize={42} minFontSize={10} onCalculated={onCalculated}>
          This is a test sentence
        </TextFit>
      </ThemeProvider>
    );

    setTimeout(() => {
      onCalculated.should.be.calledOnce();
      const text = wrapper.update().find(Styles.TextContent);
      text.prop('elFontSize').should.equal(42 - resizeCount);

      done();
    }, 10);
  });
});
