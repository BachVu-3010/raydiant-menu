import React from 'react';
import { mount } from 'enzyme';

import useDeepMemo from './useDeepMemo';

describe('useDeepMemo', () => {
  const TestChildComponent = ({ memoProps }: { memoProps: object }) => <div>{JSON.stringify(memoProps)}</div>;
  const TestComponent = (props: {firstProp: object, secondProps: object}) => {
    const memoProps = useDeepMemo((...args) => [...args], Object.values(props));
    return <TestChildComponent memoProps={memoProps} />;
  };

  it('should return the same value if the args are deeply unchanged', () => {
    const wrapper = mount(
      <TestComponent firstProp={{ key: 'a', value: '1' }} secondProps={{ key: 'b', value: '2' }} />
    );

    const props = wrapper.find(TestChildComponent).prop('memoProps');

    props.should.eql([
      { key: 'a', value: '1' },
      { key: 'b', value: '2' },
    ]);

    wrapper.setProps({
      firstProp: { key: 'a', value: '1' },
      secondProps: { key: 'b', value: '2' },
    });

    wrapper.update().find(TestChildComponent).prop('memoProps').should.equal(props);

    wrapper.setProps({
      firstProp: { key: 'a', value: '1' },
      secondProps: { key: 'b', value: '3' },
    });

    wrapper
      .update()
      .find(TestChildComponent)
      .prop('memoProps')
      .should.eql([
        { key: 'a', value: '1' },
        { key: 'b', value: '3' },
      ]);
  });
});
