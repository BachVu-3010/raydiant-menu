import {Theme as ThemeType} from './createTheme';


declare module '@emotion/react' {
  export interface Theme extends ThemeType {}
}
