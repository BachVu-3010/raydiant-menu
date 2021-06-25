import styled, { StyledComponent } from '@emotion/styled';
import lineHighByFontSize from '../../themes/lineHighByFontSize';

interface HeadingProps {isSubHeading: boolean, fontSize: number}
export const Heading: StyledComponent<HeadingProps>  = styled('h1')(({ theme, isSubHeading, fontSize }) => ({
  paddingTop: '0.5em',
  marginTop: 0,
  marginBottom: 0,
  ...(isSubHeading ? theme.subHeadingText(fontSize) : theme.headingText(fontSize)),
}));

export const Description: StyledComponent<{ fontSize: number }> = styled('div')(({ fontSize }) => ({
  marginTop: '0.25em',
  whiteSpace: 'pre-wrap',
  lineHeight: lineHighByFontSize(fontSize),
}));
