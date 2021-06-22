import getMenuProperties from './getMenuProperties';

const toPlainObject = (obj: object) => JSON.parse(JSON.stringify(obj));
const presentation = { values: { qrActive: false }, theme: {} };

describe('getMenuProperties', () => {
  it('should return enough controls', () => {
    const properties = toPlainObject(getMenuProperties(presentation));

    properties.should.have.properties([
      'shouldFormatPrice',
      'currency',
      'priceFormat',
      'layout',
      'image',
      'enableAnimation',
      'footnote',
      'footnoteSize',
      'outOfStockAction',
      'theme',
      'qrActive',
      'qrSource',
      'qrUrlContent',
      'qrImage',
      'qrSize',
      'qrCallToAction',
    ]);
  });

  describe('shouldFormatPrice', () => {
    it('should have correct attributes', () => {
      const properties = toPlainObject(getMenuProperties(presentation));
      properties.shouldFormatPrice.should.eql({
        label: 'format price',
        type: 'boolean',
        constraints: {},
        optional: true,
        default: false,
      });
    });
  });

  describe('currency', () => {
    it('should have correct attributes', () => {
      const properties = toPlainObject(getMenuProperties(presentation));
      properties.currency.should.eql({
        label: 'currency',
        type: 'string',
        constraints: {
          maxlength: 3,
        },
        optional: true,
        default: '$',
        helperText: '3 character max',
        hide: true,
      });
    });

    it('should appear when shouldFormatPrice is true', () => {
      const properties = toPlainObject(
        getMenuProperties({
          values: { shouldFormatPrice: true },
          theme: {},
        })
      );
      properties.currency.hide.should.be.false();
    });
  });

  describe('priceFormat', () => {
    it('should have correct attributes', () => {
      const properties = toPlainObject(getMenuProperties(presentation));
      properties.priceFormat.should.eql({
        label: 'format',
        type: 'toggleButtonGroup',
        constraints: {},
        optional: true,
        exclusive: true,
        default: 'simple-format',
        hide: true,
        options: [
          { label: 'Default', value: 'simple-format' },
          { label: '0', value: 'integer-format' },
          { label: '0.0', value: 'float-1-format' },
          { label: '0.00', value: 'float-2-format' },
        ],
      });
    });

    it('should appear when shouldFormatPrice is true', () => {
      const properties = toPlainObject(
        getMenuProperties({
          values: { shouldFormatPrice: true },
          theme: {},
        })
      );
      properties.priceFormat.hide.should.be.false();
    });
  });

  describe('image', () => {
    it('should have correct attributes', () => {
      const properties = toPlainObject(getMenuProperties(presentation));
      properties.image.should.eql({
        label: 'image',
        type: 'file',
        optional: true,
        constraints: {
          'content-length': 500000000,
          'content-types': ['image/png', 'image/jpeg', 'image/svg+xml', 'image/bmp', 'image/tiff', 'image/gif'],
        },
      });
    });
  });

  describe('layout', () => {
    it('should have correct attributes', () => {
      const properties = toPlainObject(getMenuProperties(presentation));
      properties.layout.should.eql({
        label: 'layout',
        type: 'selection',
        optional: true,
        constraints: {},
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Flip', value: 'flip' },
        ],
        default: 'default',
      });
    });
  });

  describe('enableAnimation', () => {
    it('should have correct attributes', () => {
      const properties = toPlainObject(getMenuProperties(presentation));
      properties.enableAnimation.should.eql({
        label: 'animations',
        type: 'boolean',
        optional: true,
        constraints: {},
        default: true,
        hide: true,
      });
    });

    it('should enable if there is an image', () => {
      const properties = toPlainObject(
        getMenuProperties({
          ...presentation,
          values: { image: { url: 'something' } },
        })
      );
      properties.enableAnimation.hide.should.be.false();
    });
  });

  describe('footnote', () => {
    it('should have correct attributes', () => {
      const properties = toPlainObject(getMenuProperties(presentation));
      properties.footnote.should.eql({
        label: 'footnote',
        type: 'text',
        optional: true,
        constraints: { maxlength: 340 },
        helperText: '340 character max',
      });
    });
  });

  describe('footnoteSize', () => {
    it('should have correct attributes', () => {
      const properties = toPlainObject(getMenuProperties(presentation));
      properties.footnoteSize.should.eql({
        label: 'footnote size',
        type: 'toggleButtonGroup',
        optional: true,
        constraints: {},
        options: [
          { label: 'small', value: 'small' },
          { label: 'medium', value: 'medium' },
          { label: 'large', value: 'large' },
        ],
        default: 'small',
        exclusive: true,
        hide: true,
      });
    });

    it('should enable if there is an image', () => {
      const properties = toPlainObject(
        getMenuProperties({
          ...presentation,
          values: { footnote: 'some footer message' },
        })
      );
      properties.footnoteSize.hide.should.be.false();
    });
  });

  describe('outOfStockAction', () => {
    it('should have correct attributes', () => {
      const properties = toPlainObject(getMenuProperties(presentation));
      properties.outOfStockAction.should.eql({
        label: 'out of stock items',
        type: 'toggleButtonGroup',
        optional: true,
        constraints: {},
        options: [
          { label: 'Leave it', value: 'LEAVE_IT' },
          { label: 'Remove', value: 'REMOVE' },
          { label: 'Strikethrough', value: 'STRIKETHROUGH' },
        ],
        default: 'LEAVE_IT',
        exclusive: true,
      });
    });
  });

  describe('theme', () => {
    it('should have correct attributes', () => {
      const properties = toPlainObject(getMenuProperties(presentation));
      properties.theme.should.eql({
        label: 'Theme',
        type: 'theme',
        optional: true,
        constraints: {},
      });
    });
  });
});
