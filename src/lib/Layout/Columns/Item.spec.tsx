import React from 'react';
import { ThemeProvider } from '@emotion/react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { useFakeTimers } from 'sinon';

import Item from './Item';
import * as Styles from './Item.styles';
import createTheme from '../../themes/createTheme';
import { MenuConfigContext } from '../useMenuConfig';

describe('Item', () => {
  it("should render item's name, description and price", () => {
    const wrapper = mount(
      <ThemeProvider theme={createTheme({}, false)}>
        <Item
          fontSize={16}
          name='Neighborhood Pie'
          description='killer white sauce, spinach, pepperoni, cumbled italian sausage'
          pricing={() => 12}
          calories='cal 0.0'
        />
      </ThemeProvider>
    );
    const name = wrapper.find(Styles.Name);
    const price = name.find(Styles.Price);
    const description = wrapper.find(Styles.Description);

    name.text().should.equal('Neighborhood Pie12');
    description.text().should.equal('killer white sauce, spinach, pepperoni, cumbled italian sausage');
    price.text().should.equal('12');

    const calories = wrapper.find(Styles.Calories);
    (!!calories.prop('strikethrough')).should.be.false();
    calories.prop('fontSize').should.equal(16);
    calories.text().should.equal('cal 0.0');
  });

  it('should render texts with strikethrough is true', () => {
    const wrapper = mount(
      <ThemeProvider theme={createTheme({}, false)}>
        <Item
          fontSize={16}
          name='Neighborhood Pie'
          description='killer white sauce, spinach, pepperoni, cumbled italian sausage'
        />
      </ThemeProvider>
    );
    const name = wrapper.find(Styles.Name);
    const description = wrapper.find(Styles.Description);
    name.prop('strikethrough').should.be.false();
    description.prop('strikethrough').should.be.false();

    wrapper.setProps({
      children: (
        <Item
          fontSize={16}
          name='Neighborhood Pie'
          description='killer white sauce, spinach, pepperoni, cumbled italian sausage'
          pricing={() => 12}
          strikethrough
          calories={0.0}
        />
      ),
    });

    wrapper.update();
    wrapper.find(Styles.Name).prop('strikethrough').should.be.true();
    wrapper.find(Styles.Description).prop('strikethrough').should.be.true();
    wrapper.find(Styles.Description).prop('strikethrough').should.be.true();
  });

  it('should render texts properly when price is 0', () => {
    const wrapper = mount(
      <ThemeProvider theme={createTheme({}, false)}>
        <Item
          fontSize={16}
          name='Neighborhood Pie'
          description='killer white sauce, spinach, pepperoni, cumbled italian sausage'
          pricing={() => 0}
        />
      </ThemeProvider>
    );
    const name = wrapper.find(Styles.Name);

    name.text().should.equal('Neighborhood Pie');
    name.find(Styles.PriceSeparator).exists().should.be.false();
    name.find(Styles.Price).exists().should.be.false();
  });

  it('should be able to hide item name', () => {
    const wrapper = mount(
      <ThemeProvider theme={createTheme({}, false)}>
        <Item
          fontSize={16}
          name='Neighborhood Pie'
          description='killer white sauce, spinach, pepperoni, cumbled italian sausage'
          pricing={() => 12}
          hideName
        />
      </ThemeProvider>
    );
    const name = wrapper.find(Styles.Name);
    const price = name.find(Styles.Price);

    name.text().should.equal('12');
    price.text().should.equal('12');
    wrapper.find(Styles.Description).exists().should.be.true();
  });

  it('should be able to hide item description', () => {
    const wrapper = mount(
      <ThemeProvider theme={createTheme({}, false)}>
        <Item
          fontSize={16}
          name='Neighborhood Pie'
          description='killer white sauce, spinach, pepperoni, cumbled italian sausage'
          pricing={() => 12}
          hideDescription
        />
      </ThemeProvider>
    );
    const name = wrapper.find(Styles.Name);
    const price = name.find(Styles.Price);

    name.text().should.equal('Neighborhood Pie12');
    price.text().should.equal('12');
    wrapper.find(Styles.Description).exists().should.be.false();
  });

  it('should be able to hide price', () => {
    const wrapper = mount(
      <ThemeProvider theme={createTheme({}, false)}>
        <Item
          fontSize={16}
          name='Neighborhood Pie'
          description='killer white sauce, spinach, pepperoni, cumbled italian sausage'
          pricing={() => 12}
          calories={1500}
          hidePrice
        />
      </ThemeProvider>
    );

    wrapper.find(Styles.Description).exists().should.be.true();
    wrapper.find(Styles.Name).exists().should.be.true();
    wrapper.find(Styles.PriceSeparator).exists().should.be.false();
    wrapper.find(Styles.Price).exists().should.be.false();
    wrapper.find(Styles.Calories).exists().should.be.true();
  });

  it('should hide calories if it empty', () => {
    const wrapper = mount(
      <ThemeProvider theme={createTheme({}, false)}>
        <Item
          fontSize={16}
          name='Neighborhood Pie'
          description='killer white sauce'
          pricing={() => 12}
          calories=''
        />
      </ThemeProvider>
    );

    wrapper.find(Styles.Name).exists().should.be.true();
    wrapper.find(Styles.Description).exists().should.be.true();
    wrapper.find(Styles.Calories).exists().should.be.false();
  });

  it('should format price', () => {
    const wrapper = mount(
      <ThemeProvider theme={createTheme({}, false)}>
        <Item
          fontSize={16}
          name='Neighborhood Pie'
          description='killer white sauce, spinach, pepperoni, cumbled italian sausage'
          pricing={(priceFormatter) => priceFormatter(12)}
          priceFormatter={(p) => `formatted ${p}`}
        />
      </ThemeProvider>
    );
    const price = wrapper.find(Styles.Price);

    price.text().should.equal('formatted 12');
  });

  it('should update price if pricingUpdatingInterval is provided', () => {
    const clock = useFakeTimers(new Date());

    let count = 0;
    const wrapper = mount(
      <ThemeProvider theme={createTheme({}, false)}>
        <MenuConfigContext.Provider value={{ pricingUpdatingInterval: 500 }}>
          <Item
            fontSize={16}
            name='Neighborhood Pie'
            description='killer white sauce, spinach, pepperoni, cumbled italian sausage'
            pricing={(priceFormatter) => priceFormatter(count++)}
            priceFormatter={(price) => `formatted ${price}`}
          />
        </MenuConfigContext.Provider>
      </ThemeProvider>
    );

    wrapper.find(Styles.Price).text().should.equal('formatted 0');
    
    act(() => clock.tick(550) && undefined);
    wrapper.update().find(Styles.Price).text().should.equal('formatted 1');

    act(() => clock.tick(550) && undefined);
    wrapper.update().find(Styles.Price).text().should.equal('formatted 2');

    clock.restore();
  });
});
