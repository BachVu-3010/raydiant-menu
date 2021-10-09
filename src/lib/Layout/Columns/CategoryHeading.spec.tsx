import React from 'react';
import { mount } from 'enzyme';
import { ThemeProvider } from '@emotion/react';

import CategoryHeading from './CategoryHeading';
import * as Styles from './CategoryHeading.styles';
import createTheme from '../../themes/createTheme';

describe('CategoryHeading', () => {
  it('should render category name and description', () => {
    const wrapper = mount(
      <ThemeProvider theme={createTheme({}, false)}>
        <CategoryHeading name='name' description='description' />
      </ThemeProvider>
    );

    wrapper.find(Styles.Heading).text().should.equal('name');
    wrapper.find(Styles.Description).text().should.be.equal('description');
  });

  it('should not render category description if no description', () => {
    const wrapper = mount(
      <ThemeProvider theme={createTheme({}, false)}>
        <CategoryHeading name='name' description='' />
      </ThemeProvider>
    );

    wrapper.find(Styles.Heading).text().should.equal('name');
    wrapper.find(Styles.Description).exists().should.false();
  });

  it('should not render category heading if no name', () => {
    const wrapper = mount(
      <ThemeProvider theme={createTheme({}, false)}>
        <CategoryHeading name='' description='description' />
      </ThemeProvider>
    );

    wrapper.find(Styles.Heading).exists().should.false();
    wrapper.find(Styles.Description).text().should.be.equal('description');
    wrapper.find(Styles.Description).prop('noTopPadding').should.be.true();
  });

  it('should be able to hide category name', () => {
    const wrapper = mount(
      <ThemeProvider theme={createTheme({}, false)}>
        <CategoryHeading name='name' description='description' hideName />
      </ThemeProvider>
    );

    wrapper.find(Styles.Heading).exists().should.be.false();
    wrapper.find(Styles.Description).text().should.be.equal('description');
    wrapper.find(Styles.Description).prop('noTopPadding').should.be.true();
  });

  it('should be able to hide category description', () => {
    const wrapper = mount(
      <ThemeProvider theme={createTheme({}, false)}>
        <CategoryHeading name='name' description='description' hideDescription />
      </ThemeProvider>
    );

    wrapper.find(Styles.Heading).text().should.equal('name');
    wrapper.find(Styles.Description).exists().should.be.false();
  });
});
