import styled, { StyledComponent } from '@emotion/styled';

const MIN_CHARACTERS_PER_LINE = 16;
const MAX_INDENT_LEVEL = 5;
const INDENT_SIZE_PER_LEVEL = 8;

export const Wrapper: StyledComponent<{ 
  ref: React.RefObject<HTMLDivElement> | ((element: HTMLElement) => void), 
  fontSize: number,
  hide: boolean 
}> = styled('div')(({ theme, fontSize, hide }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  fontSize: theme.vw(fontSize) || 'unset',
  opacity: hide ? 0 : 1,
}));

export const ColumnsWrapper: StyledComponent<{}> = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'wrap',
  // For Firefox: https://stackoverflow.com/a/44387212/1249098
  minHeight: 0,
  minWidth: 0,
});

export const ColumnItem: StyledComponent<{ columns: number, fontSize: number }> = styled('div')(({ theme, columns, fontSize }) => ({
  width: columns ? `${100 / columns}%` : '',
  minWidth: fontSize ? theme.vw(fontSize * MIN_CHARACTERS_PER_LINE) : '',
  boxSizing: 'border-box',
  paddingLeft: '1em',
  paddingRight: '1em',
}));

export const Indent: StyledComponent<{ indentLevel: number }> = styled('div')(({ theme, indentLevel }) => ({
  paddingLeft: theme.vw(Math.min(MAX_INDENT_LEVEL, indentLevel) * INDENT_SIZE_PER_LEVEL),
}));

export const Divider: StyledComponent<{}> = styled('div')(({ theme }) => ({
  border: `0.125em solid ${theme.headingText().color}`,
  backgroundColor: theme.headingText().color,
  marginTop: '2em',
  marginBottom: '1em',
}));
