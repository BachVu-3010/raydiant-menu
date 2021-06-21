import React from 'react';
import ReactDOM from 'react-dom';
import { mount } from 'enzyme';
import { stub, spy, useFakeTimers } from 'sinon';

import CalculateTextLayout, { CalculatingChildProps, FitValues, FONT_SIZES } from './CalculateTextLayout';

const COLUMN_SIZE_MAX = 4;
const calculate = (dimensions: {width: number, height: number}, renderFn: React.FC<CalculatingChildProps>, maxColumns = COLUMN_SIZE_MAX) =>
  new Promise((resolve) => {
    const element = document.createElement('div');
    element.style.width = String(dimensions.width);
    element.style.height = String(dimensions.height);

    ReactDOM.render(
      <CalculateTextLayout
        width={dimensions.width}
        height={dimensions.height}
        maxColumns={maxColumns}
        onCalculated={resolve}
      >
        {renderFn}
      </CalculateTextLayout>,
      element
    );
  });

const setupOverflow = (getFit: () => boolean) => {
  const dimensions = { width: 1920, height: 1080 };
  const overflowDimensions = { width: 1922, height: 1082 }; // overflow when > 1920 + 1 (eps)
  const element = {
    scrollWidth: overflowDimensions.width,
    scrollHeight: overflowDimensions.height,
    clientWidth: 1920,
    clientHeight: 1080,
  };
  stub(element, 'scrollWidth').get(() => (getFit() ? dimensions.width : overflowDimensions.width));
  stub(element, 'scrollHeight').get(() => (getFit() ? dimensions.height : overflowDimensions.height));
  return { dimensions, element };
};

test('Should stop calculating when a font size does not fit at all column', async () => {
  let layout: FitValues = null;
  const fontSizeFitIndex = 2;
  const columnSizeFit = 3;

  const getFit = () =>
    layout && layout.fontSize <= FONT_SIZES[fontSizeFitIndex] && layout.columns === columnSizeFit && layout.wrap;
  const { dimensions, element } = setupOverflow(getFit);

  const renderFn = jest.fn(({ measureRef, ...layoutProps }) => {
    layout = layoutProps;
    return <div ref={() => measureRef(element)} />;
  });

  const result = await calculate(dimensions, renderFn);
  // The render function will be called for only columns that fit until for every font size
  // until it reaches one that doesn't fit all columns.
  const passingFontSizeTestCount = (fontSizeFitIndex + 1) * columnSizeFit;
  // That last font size will test all columns.
  const failingFontSizeTestCount = COLUMN_SIZE_MAX;
  // We then do another test without wrapping categories, which fails, then we render one last time
  // with wrapping enabled (+2).
  const wrappingTestCount = 2;
  // One more render when update hide state from false to true
  const hideStateChangedCount = 1;
  expect(renderFn.mock.calls.length).toEqual(
    passingFontSizeTestCount + failingFontSizeTestCount + wrappingTestCount + hideStateChangedCount
  );
  expect(result).toEqual({
    fontSize: FONT_SIZES[fontSizeFitIndex],
    columns: columnSizeFit,
    wrap: true,
  });
});

test('Should accept a custom maxColumns', async () => {
  let layout: FitValues = null;
  const fontSizeFitIndex = 2;
  const columnSizeFit = 6;

  const getFit = () =>
    layout && layout.fontSize <= FONT_SIZES[fontSizeFitIndex] && layout.columns === columnSizeFit && layout.wrap;
  const { dimensions, element } = setupOverflow(getFit);

  const renderFn = jest.fn(({ measureRef, ...layoutProps }) => {
    layout = layoutProps;
    return <div ref={() => measureRef(element)} />;
  });

  const result = await calculate(dimensions, renderFn, 6);
  expect(result).toEqual({
    fontSize: FONT_SIZES[fontSizeFitIndex],
    columns: columnSizeFit,
    wrap: true,
  });
});

test('Should choose no wrap when it fits', async () => {
  let layout: FitValues = null;
  const fontSizeFitIndex = 2;
  const columnSizeFit = 3;

  const getFit = () => layout && layout.fontSize <= FONT_SIZES[fontSizeFitIndex] && layout.columns === columnSizeFit;
  const { dimensions, element } = setupOverflow(getFit);

  const renderFn = jest.fn(({ measureRef, ...layoutProps }) => {
    layout = layoutProps;
    return <div ref={() => measureRef(element)} />;
  });

  const result = await calculate(dimensions, renderFn);
  // The render function will be called for only columns that fit until for every font size
  // until it reaches one that doesn't fit all columns.
  const passingFontSizeTestCount = (fontSizeFitIndex + 1) * columnSizeFit;
  // That last font size will test all columns.
  const failingFontSizeTestCount = COLUMN_SIZE_MAX;
  // We then do another test without wrapping categories, which succeeds.
  const wrappingTestCount = 1;
  // One more render when update hide state from false to true
  const hideStateChangedCount = 1;
  expect(renderFn.mock.calls.length).toEqual(
    passingFontSizeTestCount + failingFontSizeTestCount + wrappingTestCount + hideStateChangedCount
  );
  expect(result).toEqual({
    fontSize: FONT_SIZES[fontSizeFitIndex],
    columns: columnSizeFit,
    wrap: false,
  });
});

it('should recalculate text size when textSizeDependencies are changed', () => {
  const onCalculated = spy();
  // @ts-ignore:
  const element: HTMLPreElement = {
    scrollWidth: 1920,
    scrollHeight: 1080,
    clientWidth: 1920,
    clientHeight: 1080,
  };

  const clock = useFakeTimers(new Date());
  const wrapper = mount(
    <CalculateTextLayout
      width={1920}
      height={1080}
      maxColumns={4}
      onCalculated={onCalculated}
      textSizeDependencies={{ layout: 'default' }}
    >
      {({ measureRef }) => {
        return <div ref={() => measureRef(element)} className='test-component' />;
      }}
    </CalculateTextLayout>
  );

  onCalculated.should.not.be.called();

  clock.tick(150);

  onCalculated.should.be.called();
  onCalculated.resetHistory();

  clock.tick(6000);
  onCalculated.should.not.be.called();

  wrapper.setProps({
    textSizeDependencies: { layout: 'flip' },
  });

  clock.tick(150);
  onCalculated.should.be.called();

  clock.restore();
});

it('should stop calculating if does not fit with smallest font size', async () => {
  const getFit = stub().callsFake(() => false);
  const { dimensions, element } = setupOverflow(getFit);

  const renderFn = jest.fn(({ measureRef }) => {
    return <div ref={() => measureRef(element)} />;
  });
  const clock = useFakeTimers(new Date());

  calculate(dimensions, renderFn);

  clock.tick(10);
  clock.tick(10);
  clock.tick(10);
  clock.tick(10);
  clock.tick(10);
  clock.tick(10);

  getFit.callCount.should.be.equal(8);

  clock.tick(10);
  clock.tick(10);
  clock.tick(10);

  getFit.callCount.should.be.equal(10); // if the calculating doesn't stop, getFit should be called more than 10
  clock.restore();
});
