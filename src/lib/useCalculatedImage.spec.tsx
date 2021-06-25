import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import useCalculatedImage from './useCalculatedImage';

describe('useCalculatedImage', () => {
  const TestComponent: React.FC<{ imageUrl?: string }> = ({ imageUrl }) => {
    const calculatedImage = useCalculatedImage(imageUrl);
    return <div className='test--useCalculatedImage'>{JSON.stringify(calculatedImage)}</div>;
  };

  it('should return image sizes and url', () => {
    const fakeImage = new Image();
    const RealImage = Image;
    window.Image = jest.fn().mockImplementation(() => fakeImage);

    const imageUrl = 'https://lvh.me/image.png';
    const wrapper = mount(<TestComponent imageUrl={imageUrl} />);

    wrapper
      .update()
      .find('.test--useCalculatedImage')
      .text()
      .should.be.equal(JSON.stringify({ url: 'https://lvh.me/image.png' }));
    fakeImage.src.should.equal('https://lvh.me/image.png');

    fakeImage.width = 1920;
    fakeImage.height = 1080;
    act(() => {
      fakeImage.onload(null);
    });

    wrapper
      .update()
      .find('.test--useCalculatedImage')
      .text()
      .should.be.equal(
        JSON.stringify({
          url: 'https://lvh.me/image.png',
          width: 1920,
          height: 1080,
        })
      );

    window.Image = RealImage;
  });
});
