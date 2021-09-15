import styled, { StyledComponent } from '@emotion/styled';

import lineHighByFontSize from '../../themes/lineHighByFontSize';

export const Name: StyledComponent<{ strikethrough?: boolean, fontSize: number }> = styled('h2')(({ theme, strikethrough, fontSize }) => ({
  paddingTop: '1em',
  paddingBottom: '0.25em',
  marginTop: 0,
  marginBottom: 0,
  display: 'flex',
  alignItems: 'flex-start',
  textDecoration: strikethrough ? 'line-through' : 'none',
  ...theme.itemText(fontSize),
}));

export const PriceSeparator: StyledComponent<{}> = styled('span')({ flex: 1, margin: '0 1em' });

export const Price: StyledComponent<{ fontSize: number }> = styled('span')(({ theme, fontSize }) => ({
  textAlign: 'right',
  textDecoration: 'inherit',
  ...theme.itemPriceText(fontSize),
}));

export const Description: StyledComponent<{ strikethrough?: boolean, fontSize: number }> = styled('div')(({ strikethrough, fontSize }) => ({
  whiteSpace: 'pre-wrap',
  textDecoration: strikethrough ? 'line-through' : 'none',
  lineHeight: lineHighByFontSize(fontSize),
}));

export const Calories: StyledComponent<{ strikethrough?: boolean, fontSize: number }> = styled('div')(({ strikethrough, fontSize }) => ({
  opacity: 0.8,
  textDecoration: strikethrough ? 'line-through' : 'none',
  fontSize: '0.77em',
  paddingTop: '0.25em',
  lineHeight: lineHighByFontSize(fontSize * 0.77),
}));
