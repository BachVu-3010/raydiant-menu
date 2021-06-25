import React from 'react';
import { mount } from 'enzyme';
import { SinonStub, spy, stub } from 'sinon';

import useQRCode from './useQRCode';
import { QRPoperties } from './types';

describe('withQRCode', () => {
  interface TestComponentProps {
    qrProperties: QRPoperties
    onError: (e: Error) => void;
  }
  const TestComponent: React.FC<TestComponentProps> = ({ qrProperties, onError }) => {
    const qr = useQRCode(qrProperties, onError);
    return <div className='test-component'>{JSON.stringify(qr)}</div>;
  };

  beforeAll(() => {
    // NodeJS doesn't have URL.createObjectURL
    URL.createObjectURL = stub().callsFake(() => 'https://lvh.me/new-qr-code-url');
  });

  afterEach(() => {
    (URL.createObjectURL as SinonStub).resetHistory();
  });

  afterAll(() => {
    delete URL.createObjectURL;
  });

  it('should pass qr and original props to the component', async (done) => {
    const onError = spy();
    const qrProperties: QRPoperties = {
      qrActive: true,
      qrSource: 'needQRCode',
      qrUrlContent: 'http://lvh.me/test-qr-url',
      qrImage: { url: 'http://lvh.me/test-qr-image-url' },
      qrSize: 'small',
      qrCallToAction: 'Call To Action',
    };
    const wrapper = mount(<TestComponent qrProperties={qrProperties} onError={onError}/>);

    setImmediate(() => {
      const component = wrapper.update().find('div');
      component.text().should.equal(JSON.stringify({
        url: 'https://lvh.me/new-qr-code-url',
        size: 'small',
        callToAction: 'Call To Action',
      }));

      done();
    });
  });

  it('should pass qr as null if qrSource is haveQRCode but there is no qrImage', () => {
    const qrProperties: QRPoperties = {
      qrActive: true,
      qrSource: 'haveQRCode',
      qrUrlContent: 'http://lvh.me/test-qr-url',
      qrImage: undefined,
      qrSize: 'small',
        qrCallToAction: 'Call To Action',
    };
    const wrapper = mount(<TestComponent qrProperties={qrProperties} onError={spy()}/>);
    wrapper.find('div').text().should.equal('null');
  });

  it('should pass qr as null if it is inactive', () => {
    const qrProperties: QRPoperties = {
      qrActive: false,
      qrSource: 'haveQRCode',
      qrUrlContent: 'http://lvh.me/test-qr-url',
      qrImage: { url: 'http://lvh.me/test-qr-image-url' },
      qrSize: 'small',
      qrCallToAction: 'Call To Action',
    };
    const wrapper = mount(<TestComponent qrProperties={qrProperties} onError={spy()}/>);
    wrapper.find('div').text().should.equal('null');
  });

  it('should create new qr code blob if qrSource is needQRCode', (done) => {
    const qrProperties: QRPoperties = {
      qrActive: true,
      qrSource: 'needQRCode',
      qrUrlContent: 'http://lvh.me/test-qr-url',
      qrImage: { url: 'http://lvh.me/test-qr-image-url' },
      qrSize: 'large',
      qrCallToAction: 'Call To Action',
    };
    const wrapper = mount(<TestComponent qrProperties={qrProperties} onError={spy()}/>);

    setImmediate(() => {
      const component = wrapper.find('TestComponent');
      wrapper.find('div').text().should.equal(JSON.stringify({
        url: 'https://lvh.me/new-qr-code-url',
        size: 'large',
        callToAction: 'Call To Action',
      }));

      done();
    });
  });

  it('should fire onError if qrSource is needQRCode and qrUrlContent is not a valid URL', () => {
    const onError = spy();
    const qrProperties: QRPoperties = {
      qrActive: true,
      qrSource: 'needQRCode',
      qrUrlContent: '@#invalid~url',
      qrImage: { url: 'http://lvh.me/test-qr-image-url' },
      qrSize: 'small',
      qrCallToAction: 'Call To Action',
    };
    mount(<TestComponent qrProperties={qrProperties} onError={onError}/>);

    onError.should.be.calledOnce();
    onError.getCall(0).args[0].message.should.equal('Please enter a valid website URL');
  });

  it('should not fire onError if qrActive is false', () => {
    const onError = spy();
    const qrProperties: QRPoperties = {
      qrActive: false,
      qrSource: 'needQRCode',
      qrUrlContent: '@#invalid~url',
      qrImage: { url: 'http://lvh.me/test-qr-image-url' },
      qrSize: 'small',
      qrCallToAction: 'Call To Action',
    };
    mount(<TestComponent qrProperties={qrProperties} onError={onError}/>);

    onError.should.be.not.be.called();
  });
});
