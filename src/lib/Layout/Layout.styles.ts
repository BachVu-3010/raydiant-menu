import styled, { StyledComponent } from '@emotion/styled';
import { OverScan, Size } from '../types';


export const Background: StyledComponent<{}> = styled('div')(({ theme }) => ({
  height: '100%',
  lineHeight: 1.2,
  ...theme.bodyText(),
  backgroundColor: theme.background,
  backgroundImage: `url(${theme.backgroundImage})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  '@media (orientation: portrait)': {
    backgroundImage: `url(${theme.backgroundImagePortrait || theme.backgroundImage || ''})`,
  },
}));

interface MainLayoutProps {isStacked: boolean, reverse: boolean}
export const MainLayout: StyledComponent<MainLayoutProps> = styled('div')(({ isStacked, reverse }) => ({
  position: 'relative',
  height: '100%',
  display: 'flex',
  flexDirection: isStacked ? (reverse ? 'column-reverse' : 'column') : reverse ? 'row' : 'row-reverse',
}));

interface TextLayoutProps {overscan: OverScan, footnoteOnTop: boolean, hasFootnote: boolean}
export const TextLayout: StyledComponent<TextLayoutProps> = styled('div')(
  ({ theme, overscan, footnoteOnTop, hasFootnote }) => ({
    position: 'relative',
    marginTop: hasFootnote && footnoteOnTop ? theme.vw(overscan.top * 0.3) : theme.vw(overscan.top),
    marginRight: theme.vw(overscan.right),
    marginBottom: hasFootnote && !footnoteOnTop ? theme.vw(overscan.bottom * 0.3) : theme.vw(overscan.bottom),
    marginLeft: theme.vw(overscan.left),
    flex: 1,
  }));

interface ContentWrapper { reverse: boolean }
export const ContentWrapper: StyledComponent<ContentWrapper> = styled('div')(({ reverse }) => ({
  display: 'flex',
  height: '100%',
  flex: 1,
  flexDirection: reverse ? 'column-reverse' : 'column',
  overflow: 'hidden',
}));

type SizeStyles = {
  [size in Size]: {
    maxHeight: number;
    fontSize: number;
  };
};
const sizeStyles: SizeStyles = {
  small: {
    maxHeight: 46,
    fontSize: 19,
  },
  medium: {
    maxHeight: 58,
    fontSize: 24,
  },
  large: {
    maxHeight: 67,
    fontSize: 28,
  },
};

interface FootnoteProps { size: Size }
export const Footnote: StyledComponent<FootnoteProps> = styled('div')(({ theme, size }) => ({
  width: '100%',
  padding: theme.vw(16),
  alignItems: 'start',
  maxHeight: theme.vw(sizeStyles[size].maxHeight),
  fontSize: theme.vw(sizeStyles[size].fontSize),
  whiteSpace: 'pre-wrap',
}));
