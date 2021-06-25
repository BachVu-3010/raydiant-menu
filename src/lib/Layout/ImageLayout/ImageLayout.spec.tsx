import React from 'react';
import should from 'should';
import { shallow } from 'enzyme';

import ImageLayout from '.';
import QRCard from './QRCard';
import * as Styles from './ImageLayout.styles';
import { QR } from '../../types';

describe('ImageLayout', () => {
  it('should render qr and image', () => {
    const qr: QR = {
      url: 'https://lvh.me/new-qr-code-url',
      size: 'small',
      callToAction: 'Call To Action',
    };
    const image = { url: 'http://lvh.me/test-qr-image-url', width: 100, height: 100 };
    const wrapper = shallow(<ImageLayout qr={qr} image={image} width={500} height={600} animate enableAnimation />);

    const layout = wrapper.find(Styles.ImageLayout);
    layout.prop('width').should.equal(500);
    layout.prop('height').should.equal(600);

    const imageEl = layout.find(Styles.Image);
    imageEl.prop('src').should.equal('http://lvh.me/test-qr-image-url');
    imageEl.prop('animation').should.equal('horizontal');
    imageEl.prop('animate').should.be.true();

    const qrEl = layout.find(QRCard);
    qrEl.prop('textPosition').should.equal('bottom');
    qrEl.prop('qr').should.eql(qr);
  });

  it('should render nothing if no image and qr', () => {
    const wrapper = shallow(<ImageLayout width={500} height={600} animate enableAnimation />);

    should(wrapper.html()).be.null();
  });

  it('should render image without QR', () => {
    const image = { url: 'http://lvh.me/test-qr-image-url', width: 100, height: 100 };
    const wrapper = shallow(<ImageLayout image={image} width={500} height={600} animate enableAnimation />);

    const layout = wrapper.find(Styles.ImageLayout);
    layout.prop('width').should.equal(500);
    layout.prop('height').should.equal(600);

    const imageEl = layout.find(Styles.Image);
    imageEl.prop('src').should.equal('http://lvh.me/test-qr-image-url');
    imageEl.prop('animation').should.equal('horizontal');
    imageEl.prop('animate').should.be.true();

    layout.find(QRCard).exists().should.be.false();
  });

  it("should render QR with right text if width is greater than height and enough for QR's width", () => {
    const qr: QR = {
      url: 'https://lvh.me/new-qr-code-url',
      size: 'small',
      callToAction: 'Call To Action',
    };
    const wrapper = shallow(<ImageLayout qr={qr} width={900} height={600} animate enableAnimation />);

    const layout = wrapper.find(Styles.ImageLayout);
    layout.prop('width').should.equal(900);
    layout.prop('height').should.equal(600);

    const qrEl = layout.find(QRCard);
    qrEl.prop('textPosition').should.equal('right');
  });

  it("should not render QR with right text if width is greater than height but width is not enough for QR's width", () => {
    const qr: QR = {
      url: 'https://lvh.me/new-qr-code-url',
      size: 'small',
      callToAction: 'Call To Action',
    };
    const wrapper = shallow(<ImageLayout qr={qr} width={760} height={600} animate enableAnimation />);

    const layout = wrapper.find(Styles.ImageLayout);
    layout.prop('width').should.equal(760);
    layout.prop('height').should.equal(600);

    const qrEl = layout.find(QRCard);
    qrEl.prop('textPosition').should.equal('bottom');
  });

  it('should render QR with top style if isPortrait, isStacked and isFlip', () => {
    const qr: QR = {
      url: 'https://lvh.me/new-qr-code-url',
      size: 'small',
      callToAction: 'Call To Action',
    };
    const wrapper = shallow(<ImageLayout qr={qr} width={700} height={600} isPortrait isFlip isStacked />);

    const layout = wrapper.find(Styles.ImageLayout);
    const qrEl = layout.find(QRCard);
    qrEl.prop('styles').should.containEql({
      container: {
        top: 0,
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    });
  });

  it('should render QR with bottom style if isPortrait, isStacked and but not isFlip', () => {
    const qr: QR = {
      url: 'https://lvh.me/new-qr-code-url',
      size: 'small',
      callToAction: 'Call To Action',
    };
    const wrapper = shallow(<ImageLayout qr={qr} width={700} height={600} isPortrait isStacked isFlip={false} />);

    const layout = wrapper.find(Styles.ImageLayout);
    const qrEl = layout.find(QRCard);
    qrEl.prop('styles').should.containEql({
      container: {
        bottom: 0,
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    });
  });

  it('should render QR with left bottom style if isPortrait, isFlip but not isStacked ', () => {
    const qr: QR = {
      url: 'https://lvh.me/new-qr-code-url',
      size: 'small',
      callToAction: 'Call To Action',
    };
    const wrapper = shallow(<ImageLayout qr={qr} width={700} height={600} isPortrait isStacked={false} isFlip />);

    const layout = wrapper.find(Styles.ImageLayout);
    const qrEl = layout.find(QRCard);
    qrEl.prop('styles').should.containEql({
      container: {
        left: 0,
        bottom: 0,
      },
    });
  });

  it('should render QR with right bottom style if isPortrait but not isStacked and not isFlip', () => {
    const qr: QR = {
      url: 'https://lvh.me/new-qr-code-url',
      size: 'small',
      callToAction: 'Call To Action',
    };
    const wrapper = shallow(
      <ImageLayout qr={qr} width={700} height={600} isPortrait isStacked={false} isFlip={false} />
    );

    const layout = wrapper.find(Styles.ImageLayout);
    const qrEl = layout.find(QRCard);
    qrEl.prop('styles').should.containEql({
      container: {
        right: 0,
        bottom: 0,
      },
    });
  });

  it('should render QR with right top style if landscape, isStacked and isFlip', () => {
    const qr: QR = {
      url: 'https://lvh.me/new-qr-code-url',
      size: 'small',
      callToAction: 'Call To Action',
    };
    const wrapper = shallow(<ImageLayout qr={qr} width={700} height={600} isPortrait={false} isStacked isFlip />);

    const layout = wrapper.find(Styles.ImageLayout);
    const qrEl = layout.find(QRCard);
    qrEl.prop('styles').should.containEql({
      container: {
        right: 0,
        top: 0,
      },
    });
  });

  it('should render QR with right bottom style if landscape, isStacked but not isFlip', () => {
    const qr: QR = {
      url: 'https://lvh.me/new-qr-code-url',
      size: 'small',
      callToAction: 'Call To Action',
    };
    const wrapper = shallow(
      <ImageLayout qr={qr} width={700} height={600} isPortrait={false} isStacked isFlip={false} />
    );

    const layout = wrapper.find(Styles.ImageLayout);
    const qrEl = layout.find(QRCard);
    qrEl.prop('styles').should.containEql({
      container: {
        right: 0,
        bottom: 0,
      },
    });
  });

  it('should render QR with left bottom style if landscape, isFlip but not isStacked', () => {
    const qr: QR = {
      url: 'https://lvh.me/new-qr-code-url',
      size: 'small',
      callToAction: 'Call To Action',
    };
    const wrapper = shallow(
      <ImageLayout qr={qr} width={700} height={600} isPortrait={false} isStacked={false} isFlip />
    );

    const layout = wrapper.find(Styles.ImageLayout);
    const qrEl = layout.find(QRCard);
    qrEl.prop('styles').should.containEql({
      container: {
        left: 0,
        bottom: 0,
      },
    });
  });

  it('should render QR with right bottom style if landscape but not isStacked and not isFlip', () => {
    const qr: QR = {
      url: 'https://lvh.me/new-qr-code-url',
      size: 'small',
      callToAction: 'Call To Action',
    };
    const wrapper = shallow(
      <ImageLayout qr={qr} width={700} height={600} isPortrait={false} isStacked={false} isFlip={false} />
    );

    const layout = wrapper.find(Styles.ImageLayout);
    const qrEl = layout.find(QRCard);
    qrEl.prop('styles').should.containEql({
      container: {
        right: 0,
        bottom: 0,
      },
    });
  });

  describe('Image', () => {
    it('should not animate if animate is false', () => {
      const image = { url: 'http://lvh.me/test-qr-image-url', width: 100, height: 100 };
      const wrapper = shallow(<ImageLayout image={image} width={500} height={600} animate={false} enableAnimation />);

      const layout = wrapper.find(Styles.ImageLayout);
      layout.prop('width').should.equal(500);
      layout.prop('height').should.equal(600);
      const imageEl = layout.find(Styles.Image);
      imageEl.prop('src').should.equal('http://lvh.me/test-qr-image-url');
      imageEl.prop('animation').should.equal('horizontal');
      imageEl.prop('animate').should.be.false();
    });

    it('should not animate if disable animation', () => {
      const image = { url: 'http://lvh.me/test-qr-image-url', width: 100, height: 100 };
      const wrapper = shallow(<ImageLayout image={image} width={500} height={600} animate enableAnimation={false} />);

      const imageEl = wrapper.find(Styles.Image);
      imageEl.prop('src').should.equal('http://lvh.me/test-qr-image-url');
      should(imageEl.prop('animation')).be.undefined();
    });

    it('should animate vertical if image ratio is smaller than container ratio', () => {
      const image = {
        url: 'http://lvh.me/test-qr-image-url',
        width: 400,
        height: 600,
      };
      const wrapper = shallow(<ImageLayout image={image} width={500} height={600} animate enableAnimation />);

      wrapper.find(Styles.Image).prop('animation').should.equal('vertical');
    });

    it('should animate horizontal if image ratio is bigger than container ratio', () => {
      const image = {
        url: 'http://lvh.me/test-qr-image-url',
        width: 600,
        height: 600,
      };
      const wrapper = shallow(<ImageLayout image={image} width={500} height={600} animate enableAnimation />);

      wrapper.find(Styles.Image).prop('animation').should.equal('horizontal');
    });

    it('should zoom if image ratio equals container ratio', () => {
      const image = {
        url: 'http://lvh.me/test-qr-image-url',
        width: 500,
        height: 600,
      };
      const wrapper = shallow(<ImageLayout image={image} width={500} height={600} animate enableAnimation />);

      wrapper.find(Styles.Image).prop('animation').should.equal('zoom');
    });
  });
});
