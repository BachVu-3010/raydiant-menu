import styled, { StyledComponent } from '@emotion/styled';
import lineHighByFontSize from '../../themes/lineHighByFontSize';

interface HeadingProps {isSubHeading: boolean, fontSize: number}
export const Heading: StyledComponent<HeadingProps>  = styled('h1')(({ theme, isSubHeading, fontSize }) => ({
  paddingTop: 0,
  marginTop: 0,
  marginBottom: 0,
  ...(isSubHeading ? theme.subHeadingText(fontSize) : theme.headingText(fontSize)),
}));

export const Description: StyledComponent<{
  fontSize: number,
  noTopPadding: boolean,
}> = styled('div')(({ fontSize, noTopPadding }) => ({
  marginTop: noTopPadding ? 0 : '0.25em',
  whiteSpace: 'pre-wrap',
  lineHeight: lineHighByFontSize(fontSize),
}));
