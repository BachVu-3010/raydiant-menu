import {Theme as ThemeType} from './createTheme';


declare module '@emotion/styled' {
  export interface Theme extends ThemeType {}
}
