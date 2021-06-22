import { QRPoperties } from '../types';

import getQRCodeProperties from './getQRCodeProperties';

const toPlainObject = (obj: object) => JSON.parse(JSON.stringify(obj));

describe('getQRCodeProperties', () => {
  it('should return enough controls', () => {
    const properties = toPlainObject(getQRCodeProperties({ values: { qrActive: false }, theme: {} }));

    Object.keys(properties).should.eql(['qrActive', 'qrSource', 'qrUrlContent', 'qrImage', 'qrSize', 'qrCallToAction']);
  });

  it('should return qr components', () => {
    const values: QRPoperties = { qrActive: true, qrSource: 'needQRCode' };
    const qrProperties = toPlainObject(getQRCodeProperties({ values, theme: {} }));
    qrProperties.should.eql({
      qrActive: {
        label: 'QR code',
        type: 'boolean',
        optional: true,
        constraints: {},
        default: false,
        helperText: 'What are QR codes?',
        helperLink: 'https://support.raydiant.com/hc/en-us/articles/360049375592',
      },
      qrSource: {
        label: 'QR code',
        type: 'toggleButtonGroup',
        optional: true,
        constraints: {},
        options: [
          { label: 'I need a QR code', value: 'needQRCode' },
          { label: 'I have a QR code', value: 'haveQRCode' },
        ],
        exclusive: true,
        default: 'needQRCode',
        hide: false,
      },
      qrUrlContent: {
        label: 'QR code destination URL',
        type: 'string',
        optional: true,
        constraints: {
          format: {
            regex:
              '^\\s*(http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?\\s*$',
            errorMessage: 'Please enter a valid website URL',
          },
        },
        hide: false,
      },
      qrImage: {
        label: 'QR code graphic',
        type: 'file',
        optional: true,
        constraints: {
          'content-length': 500000000,
          'content-types': ['image/png', 'image/jpeg', 'image/svg+xml', 'image/bmp', 'image/tiff'],
        },
        hide: true,
        helperText: 'Upload your QR code',
      },
      qrSize: {
        label: 'Size',
        type: 'toggleButtonGroup',
        optional: true,
        constraints: {},
        options: [
          { label: 'Small', value: 'small' },
          { label: 'Medium', value: 'medium' },
          { label: 'Large', value: 'large' },
        ],
        exclusive: true,
        default: 'large',
        hide: false,
        helperText: 'Large: Scannable from approx 4.5ft away',
      },
      qrCallToAction: {
        label: 'Call to action',
        type: 'text',
        optional: true,
        constraints: { maxlength: 40 },
        hide: false,
        helperText: 'Ex "Scan for mobile menu". Max 40 characters',
      },
    });
  });

  it('should hide all controls if qrActive is false', () => {
    const values: QRPoperties = { qrActive: false, qrSource: 'needQRCode' };
    const qrProperties = toPlainObject(getQRCodeProperties({ values, theme: {} }));

    qrProperties.qrSource.hide.should.be.true();
    qrProperties.qrUrlContent.hide.should.be.true();
    qrProperties.qrImage.hide.should.be.true();
    qrProperties.qrSize.hide.should.be.true();
    qrProperties.qrCallToAction.hide.should.be.true();
  });

  it('should hide qrUrlContent if qrSource is haveQRCode', () => {
    const values: QRPoperties = { qrActive: true, qrSource: 'haveQRCode' };
    const qrProperties = toPlainObject(getQRCodeProperties({ values, theme: {} }));

    qrProperties.qrSource.hide.should.be.false();
    qrProperties.qrUrlContent.hide.should.be.true();
    qrProperties.qrImage.hide.should.be.false();
    qrProperties.qrSize.hide.should.be.false();
    qrProperties.qrCallToAction.hide.should.be.false();
  });

  it('should have different size helper texts', () => {
    const smallValues: QRPoperties = { qrActive: true, qrSource: 'haveQRCode', qrSize: 'small' };
    const smallQRProperties = toPlainObject(getQRCodeProperties({ values: smallValues, theme: {} }));
    smallQRProperties.qrSize.helperText.should.equal('Small: Scannable from approx 2ft away');


    const mediumValues: QRPoperties = { qrActive: true, qrSource: 'haveQRCode', qrSize: 'medium' };
    const mediumQRProperties = toPlainObject(getQRCodeProperties({ values: mediumValues, theme: {} }));
    mediumQRProperties.qrSize.helperText.should.equal('Medium: Scannable from approx 3.5ft away');

    const largeValues: QRPoperties = { qrActive: true, qrSource: 'haveQRCode', qrSize: 'large' };
    const largeQRProperties = toPlainObject(getQRCodeProperties({ values: largeValues, theme: {} }));
    largeQRProperties.qrSize.helperText.should.equal('Large: Scannable from approx 4.5ft away');
  });

  it('should return correct QR URL regex validation', () => {
    const values: QRPoperties = { qrActive: true, qrSource: 'needQRCode' };
    const qrProperties = toPlainObject(getQRCodeProperties({ values, theme: {} }));

    const urlRegex = qrProperties.qrUrlContent.constraints.format.regex;
    const re = new RegExp(urlRegex);

    re.test('abc').should.be.false();
    re.test('http://abc').should.be.false();
    re.test('http:/abc.com').should.be.false();
    re.test('http://abc.c').should.be.false();

    re.test('http://abc.com').should.be.true();
    re.test('https://abc.com').should.be.true();
    re.test('http://abc.co').should.be.true();
    re.test('http://www.abc123.co').should.be.true();
    re.test('abc.co').should.be.true();
    re.test('  abc.co').should.be.true();
    re.test('  abc.co  ').should.be.true();
  });
});
