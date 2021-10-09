import React from 'react';
import { mount } from 'enzyme';
import { ThemeProvider } from '@emotion/react';

import Columns from '.';
import CategoryHeading from './CategoryHeading';
import createTheme from '../../themes/createTheme';
import * as Styles from './Columns.styles';
import Item from './Item';
import { Price as ItemPrice } from './Item.styles';
import { Price as VariantPrice } from './Variant.styles';
import { Category, PriceFormatter } from '../../types';

describe('Columns', () => {
  it('should create full width heading when there is a single category with wrapping enabled', () => {
    const categories: Category[] = [
      {
        name: 'Category',
        items: [{ name: 'Item1' }, { name: 'Item2' }, { name: 'Item3' }],
      },
    ];
    const wrapper = mount(
      <ThemeProvider theme={createTheme({}, false)}>
        <Columns 
          categories={categories}
          fontSize={20}
          columns={2}
          wrap
        />
      </ThemeProvider>
    );
    const categoryHeading = wrapper.find(CategoryHeading);
    categoryHeading.text().should.equal('Category');

    const itemIndents = wrapper.find(Styles.Indent);
    itemIndents.at(0).prop('indentLevel').should.equal(0);
    itemIndents.at(0).text().should.equal('Item1');
    itemIndents.at(1).prop('indentLevel').should.equal(0);
    itemIndents.at(1).text().should.equal('Item2');
    itemIndents.at(2).prop('indentLevel').should.equal(0);
    itemIndents.at(2).text().should.equal('Item3');

    const spacers = wrapper.find(Styles.Spacer);
    spacers.at(0).props().should.eql({ fontSize: 20, type: 'item' });
    spacers.at(1).props().should.eql({ fontSize: 20, type: 'item' });
  });

  it('should not create full width heading when the single category have no name', () => {
    const categories = [
      {
        items: [{ name: 'Item1' }, { name: 'Item2' }, { name: 'Item3' }],
      },
    ];
    const wrapper = mount(
      <ThemeProvider theme={createTheme({}, false)}>
        <Columns 
          categories={categories}
          fontSize={20}
          columns={2}
          wrap
        />
      </ThemeProvider>
    );
    wrapper.find(CategoryHeading).exists().should.be.false();

    wrapper.find(Styles.Spacer).props().should.eql({ fontSize: 20, type: 'item' });
  });

  it('should indent subgroups and its items', () => {
    const categories = [
      {
        name: 'Category',
        items: [{ name: '1st level item', pricing: () => 0 }],
        subgroups: [
          {
            name: 'Sub Category',
            items: [{ name: '2nd level item', pricing: () => 0 }],
            subgroups: [
              {
                name: 'lv2 Sub Category',
                items: [{ name: '3rd level item', pricing: () => 0 }],
              },
            ],
          },
        ],
      },
    ];
    const wrapper = mount(
      <ThemeProvider theme={createTheme({}, false)}>
        <Columns 
          categories={categories}
          fontSize={20}
          columns={2}
          wrap
        />
      </ThemeProvider>
    );

    const categoryHeading = wrapper.find(CategoryHeading).at(0);
    categoryHeading.text().should.equal('Category');

    const indents = wrapper.find(Styles.Indent);

    const firstLevelItemIndent = indents.at(0);
    firstLevelItemIndent.prop('indentLevel').should.equal(0);
    firstLevelItemIndent.find(Item).text().should.equal('1st level item');

    const subCategoryIndent = indents.at(1);
    subCategoryIndent.prop('indentLevel').should.equal(1);
    subCategoryIndent.find(CategoryHeading).prop('name').should.equal('Sub Category');

    const secondItemIndent = indents.at(2);
    secondItemIndent.prop('indentLevel').should.equal(1);
    secondItemIndent.find(Item).text().should.equal('2nd level item');

    const subSubCategoryIndent = indents.at(3);
    subSubCategoryIndent.prop('indentLevel').should.equal(2);
    subSubCategoryIndent.find(CategoryHeading).prop('name').should.equal('lv2 Sub Category');

    const thirdItemIndent = indents.at(4);
    thirdItemIndent.prop('indentLevel').should.equal(2);
    thirdItemIndent.find(Item).text().should.equal('3rd level item');
  });

  it('should be able to hide full width heading', () => {
    const categories = [
      {
        name: 'Category',
        hideName: true,
        items: [{ name: 'Item1' }, { name: 'Item2' }, { name: 'Item3' }],
      },
    ];
    const wrapper = mount(
      <ThemeProvider theme={createTheme({}, false)}>
        <Columns 
          categories={categories}
          fontSize={20}
          columns={2}
          wrap
        />
      </ThemeProvider>
    );

    wrapper.find(CategoryHeading).exists().should.be.false();
  });

  it('should format prices', () => {
    const categories = [
      {
        name: 'Category',
        items: [
          {
            name: '1st level item',
            pricing: (f: PriceFormatter) => f(1),
            variants: [{ 
              name: '1st level variant',
              pricing: (f: PriceFormatter) => f(12.0) }
            ],
          },
        ],
        subgroups: [
          {
            name: 'Sub Category',
            items: [{ 
              name: '2nd level item',
               pricing: (f: PriceFormatter) => f(1.0),
            }],
            subgroups: [
              {
                name: 'lv2 Sub Category',
                items: [{
                  name: '3rd level item',
                  pricing: (f: PriceFormatter) => f(1.5),
                }],
              },
            ],
          },
        ],
      },
    ];
    const wrapper = mount(
      <ThemeProvider theme={createTheme({}, false)}>
        <Columns 
          categories={categories}
          priceFormatter={(price) => `formatted ${price}`}
          fontSize={20}
          columns={2}
          wrap
        />
      </ThemeProvider>
    );

    const itemPrices = wrapper.find(ItemPrice);
    itemPrices.at(0).text().should.equal('formatted 1');
    itemPrices.at(1).text().should.equal('formatted 1');
    itemPrices.at(2).text().should.equal('formatted 1.5');
    wrapper.find(VariantPrice).text().should.equal('formatted 12');
  });

  it('should render separte spacers to avoid spacing at top of each columns', () => {
    const categories = [
      { name: 'Category 1', items: [{ name: '1st item', pricing: () => 0 }] },
      { name: 'Category 2', items: [{ name: '2nd item', pricing: () => 0 }] },
      { name: 'Category 3', items: [{ name: '3rd item', pricing: () => 0 }] },
    ];
    const wrapper = mount(
      <ThemeProvider theme={createTheme({}, false)}>
        <Columns 
          categories={categories}
          fontSize={20}
          columns={2}
          wrap
        />
      </ThemeProvider>
    );

    const columnsWrapper = wrapper.find(Styles.ColumnsWrapper).children();
    columnsWrapper.children().should.have.length(5);
    columnsWrapper.children().at(0).type().should.equal(Styles.ColumnItem);
    columnsWrapper.children().at(1).type().should.equal(Styles.Spacer);
    columnsWrapper.children().at(1).props().should.eql({ fontSize: 20, type: 'heading' });
    columnsWrapper.children().at(2).type().should.equal(Styles.ColumnItem);
    columnsWrapper.children().at(3).type().should.equal(Styles.Spacer);
    columnsWrapper.children().at(3).props().should.eql({ fontSize: 20, type: 'heading' });
    columnsWrapper.children().at(4).type().should.equal(Styles.ColumnItem);
  });
});
