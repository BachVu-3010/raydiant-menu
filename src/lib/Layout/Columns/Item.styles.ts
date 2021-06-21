import styled, { StyledComponent } from '@emotion/styled';

import lineHighByFontSize from '../../themes/lineHighByFontSize';

export const Name: StyledComponent<{ strikethrough?: boolean, fontSize: number }> = styled('h2')(({ theme, strikethrough, fontSize }) => ({
  paddingTop: '1em',
  paddingBottom: '0.25em',
  marginTop: 0,
  marginBottom: 0,
  display: 'flex',
  alignItems: 'center',
  textDecoration: strikethrough ? 'line-through' : 'none',
  ...theme.itemText(fontSize),
}));

export const PriceSeparator: StyledComponent<{}> = styled('span')({ flex: 1 });

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
