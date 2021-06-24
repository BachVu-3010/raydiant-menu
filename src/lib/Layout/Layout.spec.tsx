import React from 'react';
import { mount } from 'enzyme';
import { spy } from 'sinon';
import { ThemeProvider } from '@emotion/react';

import { PRICE_FORMATS } from '../constants';
import { createTestCategory, createTestItem, createTestVariant } from './Columns/useMenuGroups.spec';
import createTheme from '../themes/createTheme';
import Layout from './Layout';
import * as Styles from './Layout.styles';
import CalculateTextLayout from './CalculateTextLayout';
import ImageLayout from './ImageLayout';
import Columns from './Columns';
import { ImageData, QR } from '../types';

describe('Layout', () => {
  it('should render enough content in landscape wrapper', () => {
    const image: ImageData = { url: '', width: 900, height: 1600 };
    const qr: QR = { url: '', size: 'large' };
    const categories = [
      createTestCategory(1, [
        createTestItem(1, [createTestVariant(1), createTestVariant(2), createTestVariant(3)]),
      ]),
    ];
    const onReady = spy();
    const theme = createTheme({}, false);
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <Layout
          image={image}
          qr={qr}
          layoutMode='default'
          isPlaying
          categories={categories}
          onReady={onReady}
        />
      </ThemeProvider>
    );

    const background = wrapper.find(Styles.Background);
    background.prop('hide').should.be.false();
    const mainLayout = background.find(Styles.MainLayout);
    mainLayout.prop('isStacked').should.be.false();
    mainLayout.prop('reverse').should.be.false();

    const imageLayout = mainLayout.find(ImageLayout);
    imageLayout.prop('width').should.equal(875);
    imageLayout.prop('height').should.equal(1080);
    imageLayout.prop('image').should.eql(image);
    imageLayout.prop('qr').should.eql(qr);
    imageLayout.prop('isPortrait').should.be.false();
    imageLayout.prop('isFlip').should.be.false();
    imageLayout.prop('isStacked').should.be.false();

    const textLayout = mainLayout.find(Styles.TextLayout);
    textLayout.prop('overscan').should.eql({
      top: 56,
      right: 16,
      bottom: 56,
      left: 104,
    });

    const calculateTextLayout = textLayout.find(CalculateTextLayout);
    calculateTextLayout.prop('width').should.equal(925);
    calculateTextLayout.prop('height').should.equal(968);
    calculateTextLayout.prop('maxColumns').should.equal(4);
    calculateTextLayout.prop('onCalculated').should.equal(onReady);
    calculateTextLayout.prop('textSizeDependencies').should.containEql({ layoutMode: 'default', categories });

    const columns = calculateTextLayout.find(Columns);
    columns.prop('categories').should.eql(categories);
    columns.prop('columns').should.equal(1);
  });

  it('should render enough content in portrait wrapper', () => {
    const image: ImageData = { url: '', width: 900, height: 1600 };
    const qr: QR = { url: '', size: 'large' };
    const categories = [
      createTestCategory(1, [
        createTestItem(1, [createTestVariant(1), createTestVariant(2), createTestVariant(3)]),
      ]),
    ];
    const onReady = spy();
    const theme = createTheme({}, true);
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <Layout
          image={image}
          qr={qr}
          layoutMode='default'
          categories={categories}
          onReady={onReady}
        />
      </ThemeProvider>
    );

    const mainLayout = wrapper.find(Styles.MainLayout);
    mainLayout.prop('isStacked').should.be.true();
    mainLayout.prop('reverse').should.be.false();

    const imageLayout = mainLayout.find(ImageLayout);
    imageLayout.prop('width').should.equal(1080);
    imageLayout.prop('height').should.equal(875);
    imageLayout.prop('image').should.eql(image);
    imageLayout.prop('qr').should.eql(qr);
    imageLayout.prop('isPortrait').should.be.true();
    imageLayout.prop('isFlip').should.be.false();
    imageLayout.prop('isStacked').should.be.true();

    const textLayout = mainLayout.find(Styles.TextLayout);
    textLayout.prop('overscan').should.eql({
      top: 16,
      right: 56,
      bottom: 104,
      left: 56,
    });

    const calculateTextLayout = textLayout.find(CalculateTextLayout);
    calculateTextLayout.prop('width').should.equal(968);
    calculateTextLayout.prop('height').should.equal(925);
    calculateTextLayout.prop('maxColumns').should.equal(4);
    calculateTextLayout.prop('onCalculated').should.equal(onReady);
    calculateTextLayout.prop('textSizeDependencies').should.containEql({ layoutMode: 'default', categories });

    const columns = calculateTextLayout.find(Columns);
    columns.prop('categories').should.eql(categories);
    columns.prop('columns').should.equal(1);
  });

  it('should not render footnote if footnote is empty or only spaces', () => {
    const categories = [createTestCategory(1, [createTestItem(1, [createTestVariant(1)])])];
    const wrapper = mount(
      <ThemeProvider theme={createTheme({}, false)}>
        <Layout
          layoutMode='default'
          categories={categories}
          onReady={spy()}
        />
      </ThemeProvider>
    );

    wrapper.find(Styles.Footnote).exists().should.be.false();
  });

  it('should render footnote with max 2 lines', () => {
    const categories = [createTestCategory(1, [createTestItem(1, [createTestVariant(1)])])];
    const wrapper = mount(
      <ThemeProvider theme={createTheme({}, false)}>
        <Layout
          layoutMode='default'
          categories={categories}
          footnote={'\n\n footnote first line \n second line \n third line \n  \n  '}
          footnoteSize='medium'
          onReady={spy()}
        />
      </ThemeProvider>
    );

    const contentWrapper = wrapper.find(Styles.ContentWrapper);
    contentWrapper.prop('reverse').should.be.false();
    contentWrapper.find(Styles.TextLayout).exists().should.be.true();

    const footnote = contentWrapper.find(Styles.Footnote);
    footnote.prop('size').should.equal('medium');
    footnote.text().should.equal('footnote first line \n second line ');
  });

  it('should render footnote on top if image is at bottom', () => {
    const categories = [createTestCategory(1, [createTestItem(1, [createTestVariant(1)])])];
    const wrapper = mount(
      <ThemeProvider theme={createTheme({}, false)}>
        <Layout
          layoutMode='flip'
          categories={categories}
          image={{ url: '', width: 1600, height: 900 }}
          footnote='\n\n footnote first line \n second line \n third line \n  \n  '
          footnoteSize='medium'
          onReady={spy()}
        />
      </ThemeProvider>
    );

    const mainLayout = wrapper.find(Styles.MainLayout);
    mainLayout.prop('isStacked').should.be.true();

    const contentWrapper = mainLayout.find(Styles.ContentWrapper);
    contentWrapper.prop('reverse').should.be.true();
  });

  it('should pass priceFormatter into Columns', () => {
    const categories = [
      createTestCategory(1, [
        createTestItem(1, [createTestVariant(1), createTestVariant(2), createTestVariant(3)]),
      ]),
    ];
    const onReady = spy();
    const wrapper = mount(
      <ThemeProvider theme={createTheme({}, false)}>
        <Layout
          layoutMode='default'
          categories={categories}
          onReady={onReady}
          shouldFormatPrice
          currency={'$'}
          priceFormat={PRICE_FORMATS.FLOAT_2.value}
        />
      </ThemeProvider>
    );

    const columns = wrapper.find(Columns);
    columns.prop('priceFormatter')(11).should.equal('$11.00');
    columns.prop('priceFormatter')(11.556).should.equal('$11.56');
  });

  it('should hide content while isPlaying is false', () => {
    const wrapper = mount(
      <ThemeProvider theme={createTheme({}, false)}>
        <Layout
          categories={[]}
          isPlaying={false}
          layoutMode='default'
          onReady={spy()}
        />
      </ThemeProvider>
    );

    const background = wrapper.find(Styles.Background);
    background.prop('hide').should.be.true();
  });

  it('should not hide content while isPlaying is false but isThumbnail is true', () => {
    const wrapper = mount(
      <ThemeProvider theme={createTheme({}, false)}>
        <Layout
          categories={[]}
          isThumbnail={true}
          isPlaying={false}
          layoutMode='default'
          onReady={spy()}
        />
      </ThemeProvider>
    );

    const background = wrapper.find(Styles.Background);
    background.prop('hide').should.be.false();
  });
});
