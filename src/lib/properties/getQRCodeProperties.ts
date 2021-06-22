// @ts-ignore
import * as PropTypes from 'raydiant-kit/prop-types';

import { Presentation } from '../types';

const sizeHelperTexts = {
  small: 'Small: Scannable from approx 2ft away',
  medium: 'Medium: Scannable from approx 3.5ft away',
  large: 'Large: Scannable from approx 4.5ft away',
};

export default (presentation: Presentation) => {
  const selectedQRActive = presentation.values.qrActive || false;
  const selectedQRSource = presentation.values.qrSource || 'needQRCode';
  const selectedQRSize = presentation.values.qrSize || 'large';

  const qrActive = PropTypes.boolean('QR code')
    .default(false)
    .helperText('What are QR codes?')
    .helperLink('https://support.raydiant.com/hc/en-us/articles/360049375592');
  const showQRControls = selectedQRActive;

  const qrSource = PropTypes.toggleButtonGroup('QR code')
    .exclusive()
    .option('needQRCode', 'I need a QR code')
    .option('haveQRCode', 'I have a QR code')
    .default('needQRCode')
    .show(showQRControls);

  const urlRe =
    '^\\s*(http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/)?[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?\\s*$';
  const qrUrlContent = PropTypes.string('QR code destination URL')
    .format(urlRe, 'Please enter a valid website URL')
    .show(showQRControls && selectedQRSource === 'needQRCode');

  const qrImage = PropTypes.file('QR code graphic')
    .contentTypes(['image/png', 'image/jpeg', 'image/svg+xml', 'image/bmp', 'image/tiff'])
    .show(showQRControls && selectedQRSource === 'haveQRCode')
    .helperText('Upload your QR code');

  const qrSize = PropTypes.toggleButtonGroup('Size')
    .exclusive()
    .option('small', 'Small')
    .option('medium', 'Medium')
    .option('large', 'Large')
    .default('large')
    .show(showQRControls);
  qrSize.helperText(sizeHelperTexts[selectedQRSize]);

  const qrCallToAction = PropTypes.text('Call to action')
    .maxLength(40)
    .show(showQRControls)
    .helperText('Ex "Scan for mobile menu". Max 40 characters');

  return {
    qrActive,
    qrSource,
    qrUrlContent,
    qrImage,
    qrSize,
    qrCallToAction,
  };
};
