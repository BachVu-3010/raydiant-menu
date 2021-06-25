import styled, { StyledComponent } from '@emotion/styled';

import lineHighByFontSize from '../../../themes/lineHighByFontSize';

export const TextContent: StyledComponent<{
  ref: React.RefObject<HTMLDivElement>,
  elFontSize: number,
  calculating:boolean
}> = styled('div')(({ theme, elFontSize, calculating }) => ({
  width: calculating ? '100%' : null,
  height: calculating ? '100%' : null,
  fontSize: theme.vw(elFontSize),
  lineHeight: lineHighByFontSize(elFontSize),
  opacity: calculating ? 0 : 1,
  overflow: calculating ? 'hidden' : null,
}));
