import React from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { useFakeTimers } from 'sinon';
import fetchMock from 'fetch-mock';

import useCachedImageUrl from './useCachedImageUrl';

describe('useCachedImageUrl', () => {
  const TestComponent: React.FC<{ url: string }> = ({ url }) => {
    const cachedUrl = useCachedImageUrl(url);
    return <div className='test--useCachedImageUrl'>{cachedUrl}</div>;
  };

  it('should return the orignal URL by default', () => {
    const wrapper = mount(<TestComponent url='https://lvh.me/image.png' />);
    wrapper.update().find('.test--useCachedImageUrl').text().should.be.equal('https://lvh.me/image.png');

    act(() => wrapper.setProps({ url: '' }) && undefined);
    wrapper.update().find('.test--useCachedImageUrl').text().should.be.equal('');

    act(() => wrapper.setProps({ url: 'blob:https://lvh.me/image.png' }) && undefined);
    wrapper.update().find('.test--useCachedImageUrl').text().should.be.equal('blob:https://lvh.me/image.png');
  });

  it('should return the old URL while checking the new URL if there is an error with loading the new URL', async (done) => {
    fetchMock.mock('https://lvh.me/uploading-image.png', 403);

    const realSetImmediate = setImmediate;
    const clock = useFakeTimers(new Date());

    const wrapper = mount(<TestComponent url='blob:https://lvh.me/image.png' />);

    wrapper.update().find('.test--useCachedImageUrl').text().should.be.equal('blob:https://lvh.me/image.png');

    act(() => wrapper.setProps({ url: 'https://lvh.me/uploading-image.png' }) && undefined);
    act(() => clock.tick(100) && undefined);

    realSetImmediate(async () => {
      wrapper.update().find('.test--useCachedImageUrl').text().should.be.equal('blob:https://lvh.me/image.png');

      fetchMock.mock('https://lvh.me/uploading-image.png', 200, { overwriteRoutes: true });
      act(() => clock.tick(200) && undefined);

      realSetImmediate(() => {
        wrapper.update().find('.test--useCachedImageUrl').text().should.be.equal('https://lvh.me/uploading-image.png');

        clock.restore();
        fetchMock.restore();
        done();
      });
    });
  });
});
