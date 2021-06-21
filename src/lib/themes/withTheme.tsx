import React from 'react';
import * as WebFont from 'webfontloader';
import { ThemeProvider, Global } from '@emotion/react';

import createTheme, { ThemeVars } from './createTheme';
import useDeepMemo from '../utils/useDeepMemo';

interface AdditionalProps {
  fontsLoaded: boolean;
}

export interface WrappedComponentBaseProps {
  presentation: {
    theme: ThemeVars;
  };
  onError?: (error: Error) => void;
}

export default function withThemeSelector<OriginalProps extends WrappedComponentBaseProps>(
  Component: React.ComponentType<OriginalProps & AdditionalProps>,
): React.SFC<OriginalProps> {
  const WrappedComponent: React.SFC<OriginalProps> = props => {
    const { presentation, onError } = props;
    const { theme: themeData = {} } = presentation;

    const [isPortrait, setIsPortrait] = React.useState(window.innerWidth <= window.innerHeight);
    const [fontsLoaded, setFontsLoaded] = React.useState(false);

    React.useEffect(() => {
      const updateIsPortrait = () => setIsPortrait(window.innerWidth <= window.innerHeight);

      window.addEventListener('orientationchange', updateIsPortrait);
      window.addEventListener('resize', updateIsPortrait);
    }, [setIsPortrait]);

    const theme = useDeepMemo(createTheme, [themeData, isPortrait]);

    React.useEffect(() => {
      const families = theme.toLoadFonts;
      if (families.length === 0) {
        return;
      }

      // Prevents rendering the layout until the fonts are loaded.
      setFontsLoaded(false);
      // Wait for the fonts to be loaded before rendering the layout.
      WebFont.load({
        custom: { families },
        active: () => {
          setFontsLoaded(true);
        },
        inactive: () => {
          onError(new Error('Failed to load fonts.'));
        },
      });
    }, [theme.toLoadFonts, onError]);

    return (
      <ThemeProvider theme={theme}>
        {theme.globalStyles.map((globalStyle, index) => (
          <Global key={index} styles={globalStyle} />
        ))}
        <Component {...props} fontsLoaded={fontsLoaded} />
      </ThemeProvider>
    );
  };

  return WrappedComponent;
};
