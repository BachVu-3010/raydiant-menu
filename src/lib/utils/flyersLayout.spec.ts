import { QR } from '../types';
import getLayout, { MAX_RELATIVE_IMAGE_SIZE, OVERSCAN_LARGE, OVERSCAN_SMALL } from './flyersLayout';

describe('Image without QR', () => {
  it('should return props for landscape container with landscape image', () => {
    const isLandscape = true;
    const image = { width: 1920, height: 1080 };
    const result = getLayout(isLandscape, image);

    expect(result).toEqual({
      isStacked: true,
      imageSize: {
        width: image.width,
        height: Math.round(1080 * MAX_RELATIVE_IMAGE_SIZE),
      },
      textWrapperSize: {
        width: 1920,
        height: 1080 - Math.round(1080 * MAX_RELATIVE_IMAGE_SIZE),
      },
      overscan: {
        top: 32,
        right: OVERSCAN_LARGE,
        bottom: OVERSCAN_SMALL,
        left: OVERSCAN_LARGE,
      },
    });
  });

  it('should return props for landscape container with portrait image', () => {
    const isLandscape = true;
    const image = { width: 640, height: 1080 };
    const result = getLayout(isLandscape, image);

    expect(result).toEqual({
      isStacked: false,
      imageSize: {
        width: Math.round(1920 * MAX_RELATIVE_IMAGE_SIZE),
        height: 1080,
      },
      textWrapperSize: {
        width: 1920 - Math.round(1920 * MAX_RELATIVE_IMAGE_SIZE),
        height: 1080,
      },
      overscan: {
        top: OVERSCAN_SMALL,
        right: 32,
        bottom: OVERSCAN_SMALL,
        left: OVERSCAN_LARGE,
      },
    });
  });

  it('should return props for landscape container with square image', () => {
    const isLandscape = true;
    const image = { width: 1080, height: 1080 };
    const result = getLayout(isLandscape, image);

    expect(result).toEqual({
      isStacked: false,
      imageSize: {
        width: Math.round(1920 * MAX_RELATIVE_IMAGE_SIZE),
        height: 1080,
      },
      textWrapperSize: {
        width: 1920 - Math.round(1920 * MAX_RELATIVE_IMAGE_SIZE),
        height: 1080,
      },
      overscan: {
        top: OVERSCAN_SMALL,
        right: 32,
        bottom: OVERSCAN_SMALL,
        left: OVERSCAN_LARGE,
      },
    });
  });

  it('should return props for landscape container with no image', () => {
    const isLandscape = true;
    const result = getLayout(isLandscape, null);

    expect(result).toEqual({
      isStacked: false,
      imageSize: { width: 0, height: 0 },
      textWrapperSize: {
        width: 1920,
        height: 1080,
      },
      overscan: {
        top: OVERSCAN_SMALL,
        right: OVERSCAN_LARGE,
        bottom: OVERSCAN_SMALL,
        left: OVERSCAN_LARGE,
      },
    });
  });

  it('should return props for portrait container with portrait image', () => {
    const isLandscape = false;
    const image = { width: 1080, height: 1920 };
    const result = getLayout(isLandscape, image);

    expect(result).toEqual({
      isStacked: true,
      imageSize: {
        width: 1080,
        height: Math.round(1920 * MAX_RELATIVE_IMAGE_SIZE),
      },
      textWrapperSize: {
        width: 1080,
        height: 1920 - Math.round(1920 * MAX_RELATIVE_IMAGE_SIZE),
      },
      overscan: {
        top: 32,
        right: OVERSCAN_SMALL,
        bottom: OVERSCAN_LARGE,
        left: OVERSCAN_SMALL,
      },
    });
  });

  it('should return props for portrait container with landscape image', () => {
    const isLandscape = false;
    const image = { width: 1920, height: 500 };
    const result = getLayout(isLandscape, image);

    expect(result).toEqual({
      isStacked: true,
      imageSize: {
        width: 1080,
        height: Math.round((500 * 1080) / 1920),
      },
      textWrapperSize: {
        width: 1080,
        height: 1920 - Math.round((500 * 1080) / 1920),
      },
      overscan: {
        top: 32,
        right: OVERSCAN_SMALL,
        bottom: OVERSCAN_LARGE,
        left: OVERSCAN_SMALL,
      },
    });
  });

  it('should return props for portrait container with square image', () => {
    const isLandscape = false;
    const image = { width: 1080, height: 1080 };
    const result = getLayout(isLandscape, image);

    expect(result).toEqual({
      isStacked: true,
      imageSize: {
        height: Math.round(1920 * MAX_RELATIVE_IMAGE_SIZE),
        width: 1080,
      },
      textWrapperSize: {
        height: 1920 - Math.round(1920 * MAX_RELATIVE_IMAGE_SIZE),
        width: 1080,
      },
      overscan: {
        top: 32,
        right: OVERSCAN_SMALL,
        bottom: OVERSCAN_LARGE,
        left: OVERSCAN_SMALL,
      },
    });
  });

  it('should return props for portrait container with no image', () => {
    const isLandscape = false;
    const result = getLayout(isLandscape, null);

    expect(result).toEqual({
      isStacked: false,
      imageSize: { width: 0, height: 0 },
      textWrapperSize: {
        width: 1080,
        height: 1920,
      },
      overscan: {
        top: OVERSCAN_LARGE,
        right: OVERSCAN_SMALL,
        bottom: OVERSCAN_LARGE,
        left: OVERSCAN_SMALL,
      },
    });
  });

  it('should return props for landscape container with image in Flip layout', () => {
    const isLandscape = true;
    const image = { width: 1920, height: 1080 };
    const result = getLayout(isLandscape, image, undefined, 'flip');

    expect(result).toEqual({
      isStacked: true,
      imageSize: {
        width: image.width,
        height: Math.round(1080 * MAX_RELATIVE_IMAGE_SIZE),
      },
      textWrapperSize: {
        width: 1920,
        height: 1080 - Math.round(1080 * MAX_RELATIVE_IMAGE_SIZE),
      },
      overscan: {
        top: OVERSCAN_SMALL,
        right: OVERSCAN_LARGE,
        bottom: 32,
        left: OVERSCAN_LARGE,
      },
    });
  });

  it('should return props for portrait container with image in Flip layout', () => {
    const isLandscape = true;
    const image = { width: 640, height: 1080 };
    const result = getLayout(isLandscape, image, undefined, 'flip');

    expect(result).toEqual({
      isStacked: false,
      imageSize: {
        width: Math.round(1920 * MAX_RELATIVE_IMAGE_SIZE),
        height: 1080,
      },
      textWrapperSize: {
        width: 1920 - Math.round(1920 * MAX_RELATIVE_IMAGE_SIZE),
        height: 1080,
      },
      overscan: {
        top: OVERSCAN_SMALL,
        right: OVERSCAN_LARGE,
        bottom: OVERSCAN_SMALL,
        left: 32,
      },
    });
  });
});

describe('QR without image', () => {
  it('should return props for landscape container with large QR', () => {
    const isLandscape = true;
    const qr: QR = { url: '', size: 'large' };

    const expectation = {
      isStacked: false,
      imageSize: {
        width: 875,
        height: 1080,
      },
      textWrapperSize: {
        width: 1045,
        height: 1080,
      },
      overscan: {
        top: OVERSCAN_SMALL,
        right: 0,
        bottom: OVERSCAN_SMALL,
        left: OVERSCAN_LARGE,
      },
    };

    getLayout(isLandscape, undefined, qr).should.eql(expectation);
  });

  it('should return props for landscape container with medium QR', () => {
    const isLandscape = true;
    const qr: QR = { url: '', size: 'medium' };

    const expectation = {
      isStacked: false,
      imageSize: {
        width: 667,
        height: 1080,
      },
      textWrapperSize: {
        width: 1253,
        height: 1080,
      },
      overscan: {
        top: OVERSCAN_SMALL,
        right: 0,
        bottom: OVERSCAN_SMALL,
        left: OVERSCAN_LARGE,
      },
    };

    getLayout(isLandscape, undefined, qr).should.eql(expectation);
  });

  it('should return props for landscape container with small QR', () => {
    const isLandscape = true;
    const qr: QR = { url: '', size: 'small' };
    const result = getLayout(isLandscape, undefined, qr);

    result.should.eql({
      isStacked: false,
      imageSize: {
        width: 333,
        height: 1080,
      },
      textWrapperSize: {
        width: 1587,
        height: 1080,
      },
      overscan: {
        top: OVERSCAN_SMALL,
        right: 0,
        bottom: OVERSCAN_SMALL,
        left: OVERSCAN_LARGE,
      },
    });
  });

  it('should return props for portrait container with large QR', () => {
    const isLandscape = false;
    const qr: QR = { url: '', size: 'large' };

    const expectation = {
      isStacked: true,
      imageSize: {
        width: 1080,
        height: 875,
      },
      textWrapperSize: {
        width: 1080,
        height: 1045,
      },
      overscan: {
        top: 0,
        right: OVERSCAN_SMALL,
        bottom: OVERSCAN_LARGE,
        left: OVERSCAN_SMALL,
      },
    };

    getLayout(isLandscape, undefined, qr).should.eql(expectation);
  });

  it('should return props for portrait container with medium QR', () => {
    const isLandscape = false;
    const qr: QR = { url: '', size: 'medium' };

    const expectation = {
      isStacked: true,
      imageSize: {
        width: 1080,
        height: 667,
      },
      textWrapperSize: {
        width: 1080,
        height: 1253,
      },
      overscan: {
        top: 0,
        right: OVERSCAN_SMALL,
        bottom: OVERSCAN_LARGE,
        left: OVERSCAN_SMALL,
      },
    };

    getLayout(isLandscape, undefined, qr).should.eql(expectation);
  });

  it('should return props for portrait container with small QR', () => {
    const isLandscape = false;
    const qr: QR = { url: '', size: 'small' };
    const result = getLayout(isLandscape, undefined, qr);

    result.should.eql({
      isStacked: true,
      imageSize: {
        width: 1080,
        height: 333,
      },
      textWrapperSize: {
        width: 1080,
        height: 1587,
      },
      overscan: {
        top: 0,
        right: OVERSCAN_SMALL,
        bottom: OVERSCAN_LARGE,
        left: OVERSCAN_SMALL,
      },
    });
  });
});

describe('Image together with QR', () => {
  it('should return props for landscape container with small QR', () => {
    const isLandscape = true;
    const image = { width: 1920, height: 1080 };
    const qr: QR = { url: '', size: 'small' };
    const result = getLayout(isLandscape, image, qr);

    result.should.eql({
      isStacked: true,
      imageSize: {
        width: image.width,
        height: Math.round(1080 * MAX_RELATIVE_IMAGE_SIZE),
      },
      textWrapperSize: {
        width: 1920,
        height: 1080 - Math.round(1080 * MAX_RELATIVE_IMAGE_SIZE),
      },
      overscan: {
        top: 32,
        right: OVERSCAN_LARGE,
        bottom: OVERSCAN_SMALL,
        left: OVERSCAN_LARGE,
      },
    });
  });

  it('should return props for portrait container with small QR', () => {
    const isLandscape = false;
    const image = { width: 1920, height: 1080 };
    const qr: QR = { url: '', size: 'small' };
    const result = getLayout(isLandscape, image, qr);

    result.should.eql({
      isStacked: true,
      imageSize: {
        width: 1080,
        height: Math.round((1080 * 1080) / 1920),
      },
      textWrapperSize: {
        width: 1080,
        height: 1920 - Math.round((1080 * 1080) / 1920),
      },
      overscan: {
        top: 32,
        right: OVERSCAN_SMALL,
        bottom: OVERSCAN_LARGE,
        left: OVERSCAN_SMALL,
      },
    });
  });

  it('should increase height of landscape container with small QR and low-height image', () => {
    const isLandscape = true;
    const image = { width: 1920, height: 100 };
    const qr: QR = { url: '', size: 'small' };
    const result = getLayout(isLandscape, image, qr);

    result.should.eql({
      isStacked: true,
      imageSize: {
        width: image.width,
        height: 333,
      },
      textWrapperSize: {
        width: 1920,
        height: 1080 - 333,
      },
      overscan: {
        top: 32,
        right: OVERSCAN_LARGE,
        bottom: OVERSCAN_SMALL,
        left: OVERSCAN_LARGE,
      },
    });
  });

  it('should increase width of landscape container with small QR and low-width image', () => {
    const isLandscape = true;
    const image = { width: 100, height: 1080 };
    const qr: QR = { url: '', size: 'small' };
    const result = getLayout(isLandscape, image, qr);

    result.should.eql({
      isStacked: false,
      imageSize: {
        width: 333,
        height: 1080,
      },
      textWrapperSize: {
        width: 1920 - 333,
        height: 1080,
      },
      overscan: {
        top: OVERSCAN_SMALL,
        right: 32,
        bottom: OVERSCAN_SMALL,
        left: OVERSCAN_LARGE,
      },
    });
  });

  it('should increase height of portrait container with small QR and low-height image', () => {
    const isLandscape = false;
    const image = { width: 1080, height: 100 };
    const qr: QR = { url: '', size: 'small' };
    const result = getLayout(isLandscape, image, qr);

    result.should.eql({
      isStacked: true,
      imageSize: {
        width: image.width,
        height: 333,
      },
      textWrapperSize: {
        width: 1080,
        height: 1920 - 333,
      },
      overscan: {
        top: 32,
        right: OVERSCAN_SMALL,
        bottom: OVERSCAN_LARGE,
        left: OVERSCAN_SMALL,
      },
    });
  });

  it('should increase width of portrait container with small QR and low-width image', () => {
    const isLandscape = false;
    const image = { width: 100, height: 1920 };
    const qr: QR = { url: '', size: 'small' };
    const result = getLayout(isLandscape, image, qr);

    result.should.eql({
      isStacked: false,
      imageSize: {
        width: 333,
        height: 1920,
      },
      textWrapperSize: {
        width: 1080 - 333,
        height: 1920,
      },
      overscan: {
        top: OVERSCAN_LARGE,
        right: 32,
        bottom: OVERSCAN_LARGE,
        left: OVERSCAN_SMALL,
      },
    });
  });

  it('should force to not stack in landscape layout if qr size is not small', () => {
    const isLandscape = true;
    const image = { width: 1920, height: 1080 };
    const largeQr: QR = { url: '', size: 'large' };

    getLayout(isLandscape, image, largeQr).should.eql({
      isStacked: false,
      imageSize: {
        width: 875,
        height: image.height,
      },
      textWrapperSize: {
        width: 1920 - 875,
        height: 1080,
      },
      overscan: {
        top: OVERSCAN_SMALL,
        right: 32,
        bottom: OVERSCAN_SMALL,
        left: OVERSCAN_LARGE,
      },
    });

    const mediumQr: QR = { url: '', size: 'medium' };
    getLayout(isLandscape, image, mediumQr).should.eql({
      isStacked: false,
      imageSize: {
        width: 667,
        height: image.height,
      },
      textWrapperSize: {
        width: 1920 - 667,
        height: 1080,
      },
      overscan: {
        top: OVERSCAN_SMALL,
        right: 32,
        bottom: OVERSCAN_SMALL,
        left: OVERSCAN_LARGE,
      },
    });
  });

  it('should force to stack in portrait layout if qr size is not small', () => {
    const isLandscape = false;
    const image = { width: 100, height: 1920 };
    const largeQr: QR = { url: '', size: 'large' };

    getLayout(isLandscape, image, largeQr).should.eql({
      isStacked: true,
      imageSize: {
        width: 1080,
        height: 875,
      },
      textWrapperSize: {
        width: 1080,
        height: 1920 - 875,
      },
      overscan: {
        top: 32,
        right: OVERSCAN_SMALL,
        bottom: OVERSCAN_LARGE,
        left: OVERSCAN_SMALL,
      },
    });

    const mediumQr: QR = { url: '', size: 'medium' };
    getLayout(isLandscape, image, mediumQr).should.eql({
      isStacked: true,
      imageSize: {
        width: 1080,
        height: 667,
      },
      textWrapperSize: {
        width: 1080,
        height: 1920 - 667,
      },
      overscan: {
        top: 32,
        right: OVERSCAN_SMALL,
        bottom: OVERSCAN_LARGE,
        left: OVERSCAN_SMALL,
      },
    });
  });
});
