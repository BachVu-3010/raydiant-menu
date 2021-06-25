import styled, { StyledComponent } from '@emotion/styled';

export const Name: StyledComponent<{ strikethrough?: boolean, fontSize: number }> = styled('h2')(({ theme, strikethrough, fontSize }) => ({
  fontSize: '1em',
  paddingTop: '0.5em',
  marginTop: 0,
  marginBottom: 0,
  marginLeft: '1em',
  display: 'flex',
  alignItems: 'flex-start',
  textDecoration: strikethrough ? 'line-through' : 'none',
  ...theme.variantText(fontSize),
}));

export const PriceSeparator: StyledComponent<{}> = styled('span')(({ theme }) => ({
  margin: '1px 1em 0',
  minWidth: '1em',
  flex: 1,
  height: 1,
  backgroundColor: theme.separator.background,
}));

export const Price: StyledComponent<{}> = styled('span')(({ theme }) => ({
  ...theme.variantPriceText(),
}));

export const NameWrapper: StyledComponent<{ width: number }> = styled('div')(({ width }) => ({
  overflow: 'hidden',
  width,
}));

export const PriceWrapper: StyledComponent<{}> = styled('div')({
  display: 'flex',
  alignItems: 'center',
  flex: 1,
});
