// @ts-ignore
import * as PropTypes from 'raydiant-kit/prop-types';

import { PRICE_FORMATS } from '../constants';
import { Presentation } from '../types';
import getQRCodeProperties from './getQRCodeProperties';

export default (presentation: Presentation) => {
  const {
    image: selectedImage,
    footnote: selectedFootnote,
    shouldFormatPrice,
  } = presentation.values;

  return {
    shouldFormatPrice: PropTypes.boolean('format price').default(false),
    currency: PropTypes.string('currency')
      .maxLength(3)
      .hide(!shouldFormatPrice)
      .default('$')
      .helperText('3 character max'),
    priceFormat: PropTypes.toggleButtonGroup('format')
      .exclusive()
      .option(PRICE_FORMATS.SIMPLE.value, PRICE_FORMATS.SIMPLE.label)
      .option(PRICE_FORMATS.INT.value, PRICE_FORMATS.INT.label)
      .option(PRICE_FORMATS.FLOAT_1.value, PRICE_FORMATS.FLOAT_1.label)
      .option(PRICE_FORMATS.FLOAT_2.value, PRICE_FORMATS.FLOAT_2.label)
      .default(PRICE_FORMATS.DEFAULT)
      .hide(!shouldFormatPrice),
    layout: PropTypes.selection('layout').option('default', 'Default').option('flip', 'Flip').default('default'),
    image: PropTypes.image('image'),
    enableAnimation: PropTypes.boolean('animations').default(true).hide(!selectedImage),
    footnote: PropTypes.text('footnote').maxLength(340).helperText('340 character max'),
    footnoteSize: PropTypes.toggleButtonGroup('footnote size')
      .option('small', 'small')
      .option('medium', 'medium')
      .option('large', 'large')
      .default('small')
      .exclusive()
      .hide(!selectedFootnote),
    theme: PropTypes.theme(),
    ...getQRCodeProperties(presentation),
  };
};
