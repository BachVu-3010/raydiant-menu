import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import fetchMock from 'fetch-mock';
import { useFakeTimers } from 'sinon';

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

  it('should display the old one while trying to reload the image if there is an error with loading the new image', async (done) => {
    fetchMock.mock('https://lvh.me/uploading-image.png', 403);

    const realSetImmediate = setImmediate;
    const fakeImage = new Image();
    const RealImage = Image;
    window.Image = jest.fn().mockImplementation(() => fakeImage);
    const clock = useFakeTimers(new Date());

    const wrapper = mount(<TestComponent imageUrl='blob:https://lvh.me/image.png' />);
    fakeImage.width = 1920;
    fakeImage.height = 1080;
    act(() => fakeImage.onload(null) && undefined);

    wrapper
      .update()
      .find('.test--useCalculatedImage')
      .text()
      .should.be.equal(JSON.stringify({ url: 'blob:https://lvh.me/image.png', width: 1920, height: 1080 }));

    act(() => wrapper.setProps({ imageUrl: 'https://lvh.me/uploading-image.png' }) && undefined);
    act(() => clock.tick(100) && undefined);

    realSetImmediate(async () => {
      wrapper
        .update()
        .find('.test--useCalculatedImage')
        .text()
        .should.be.equal(JSON.stringify({ url: 'blob:https://lvh.me/image.png', width: 1920, height: 1080 }));

      fetchMock.mock('https://lvh.me/uploading-image.png', 200, { overwriteRoutes: true });
      act(() => clock.tick(200) && undefined);

      realSetImmediate(() => {
        wrapper
          .update()
          .find('.test--useCalculatedImage')
          .text()
          .should.be.equal(JSON.stringify({ url: 'https://lvh.me/uploading-image.png', width: 1920, height: 1080 }));

        clock.restore();
        fetchMock.restore();
        window.Image = RealImage;
        done();
      });
    });
  });

  it('should return empty if no image url', () => {
    const wrapper = mount(<TestComponent imageUrl='' />);

    wrapper.update().find('.test--useCalculatedImage').text().should.be.equal(JSON.stringify(null));
  });
});
