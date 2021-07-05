import React from 'react';
import { shallow, mount } from 'enzyme';
import { spy, useFakeTimers } from 'sinon';
import { ThemeProvider } from '@emotion/react';
import { act } from 'react-dom/test-utils';
import fetchMock from 'fetch-mock';

import QRCard from './';
import * as Styles from './QRCard.styles';
import TextFit from './TextFit';
import createTheme from '../../../themes/createTheme';
import { QR } from '../../../types';

describe('QRCard', () => {
  it('should render enough content', () => {
    const qr: QR = {
      url: 'lvh.me/qr-code-image',
      size: 'small',
      callToAction: 'Call To Action',
    };
    const customStyles = {
      container: { a: spy() },
      qrImage: { b: spy() },
      callToAction: { c: spy() },
    };
    const wrapper = mount(
      <ThemeProvider theme={createTheme({}, false)}>
        <QRCard qr={qr} textPosition='right' styles={customStyles} />
      </ThemeProvider>
    );

    const container = wrapper.find(Styles.Container);
    container.prop('textPosition').should.equal('right');
    container.prop('size').should.be.equal('small');
    container.prop('hasCTA').should.be.true();
    container.prop('styles').should.eql(customStyles.container);

    const qrCode = container.find(Styles.QRCode);
    qrCode.prop('src').should.equal('lvh.me/qr-code-image');
    qrCode.prop('size').should.equal('small');
    qrCode.prop('styles').should.eql(customStyles.qrImage);

    const callToAction = container.find(Styles.CallToAction);
    callToAction.text().should.equal('Call To Action');
    callToAction.prop('size').should.equal('small');
    callToAction.prop('textPosition').should.equal('right');
    callToAction.prop('styles').should.eql(customStyles.callToAction);

    const textFit = container.find(TextFit);
    textFit.prop('maxFontSize').should.equal(42);
    textFit.prop('minFontSize').should.equal(23);
  });

  it('should not render call-to-action if it is empty', () => {
    const qr: QR = {
      url: 'lvh.me/qr-code-image',
      size: 'large',
      callToAction: '',
    };
    const wrapper = shallow(<QRCard qr={qr} textPosition='right' />);

    const container = wrapper.find(Styles.Container);
    container.prop('size').should.equal('large');
    container.prop('textPosition').should.equal('right');

    const qrCode = container.find(Styles.QRCode);
    qrCode.prop('size').should.equal('large');

    container.find(Styles.CallToAction).exists().should.be.false();
  });

  it('should render with bottom textPosition', () => {
    const qr: QR = {
      url: 'lvh.me/qr-code-image',
      size: 'medium',
      callToAction: 'CTA',
    };
    const wrapper = shallow(<QRCard qr={qr} textPosition='bottom' />);

    const container = wrapper.find(Styles.Container);
    container.prop('size').should.equal('medium');
    container.prop('textPosition').should.equal('bottom');

    const qrCode = wrapper.find(Styles.QRCode);
    qrCode.prop('size').should.equal('medium');

    const callToAction = container.find(Styles.CallToAction);
    callToAction.prop('size').should.equal('medium');
    callToAction.prop('textPosition').should.equal('bottom');
  });

  it('should pass the overflow state to CallToAction', () => {
    const qr: QR = {
      url: 'lvh.me/qr-code-image',
      size: 'medium',
      callToAction: 'CTA',
    };
    const wrapper = shallow(<QRCard qr={qr} textPosition='bottom' />);
    const container = wrapper.find(Styles.Container);
    const callToAction = container.find(Styles.CallToAction);
    callToAction.prop('overflowVertical').should.equal(false);
    callToAction.prop('overflowHorizontal').should.equal(false);

    const textFit = container.find(TextFit);
    textFit.prop('onCalculated')({
      overflowVertical: true,
      overflowHorizontal: true,
    });

    const updatedCallToAction = wrapper.update().find(Styles.CallToAction);
    updatedCallToAction.prop('overflowVertical').should.equal(true);
    updatedCallToAction.prop('overflowHorizontal').should.equal(true);
  });

  it('should render blob qr image url while uploading the image', (done) => {
    fetchMock.mock('https://lvh.me/uploading-image.png', 403);
    const realSetImmediate = setImmediate;
    const clock = useFakeTimers(new Date());

    const wrapper = mount(
      <ThemeProvider theme={createTheme({}, false)}>
        <QRCard qr={{ url: 'blob:https://lvh.me/qr-code-image', size: 'small' }} textPosition='right' />
      </ThemeProvider>
    );

    wrapper.find(Styles.QRCode).prop('src').should.equal('blob:https://lvh.me/qr-code-image');

    act(() => {
      wrapper.setProps({
        children: <QRCard qr={{ url: 'https://lvh.me/uploading-image.png', size: 'small' }} textPosition='right' />,
      });
    });

    realSetImmediate(async () => {
      wrapper.update().find(Styles.QRCode).prop('src').should.equal('blob:https://lvh.me/qr-code-image');

      fetchMock.mock('https://lvh.me/uploading-image.png', 200, { overwriteRoutes: true });
      act(() => clock.tick(300) && undefined);

      realSetImmediate(() => {
        wrapper.update().find(Styles.QRCode).prop('src').should.equal('https://lvh.me/uploading-image.png');

        fetchMock.restore();
        clock.restore();
        done();
      });
    });
  });
});
