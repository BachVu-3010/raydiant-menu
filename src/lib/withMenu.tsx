import React from 'react';
import * as WebFont from 'webfontloader';
import { ThemeProvider, Global } from '@emotion/react';

import createTheme from './themes/createTheme';
import useDeepMemo from './utils/useDeepMemo';
import useQRCode from './useQrCode';
import { QR, AppProps } from './types';

interface AdditionalProps {
  fontsLoaded: boolean;
  qr: QR;
}

export default function withMenu<OriginalProps extends AppProps>(
  Component: React.ComponentType<OriginalProps & AdditionalProps>,
): React.FC<OriginalProps> {
  const WrappedComponent: React.FC<OriginalProps> = props => {
    const { presentation, onError } = props;
    const { theme: themeData = {}, values } = presentation;

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

    const { qrActive, qrSource, qrUrlContent, qrSize, qrImage, qrCallToAction } = values;
    const qr = useQRCode({ qrActive, qrSource, qrUrlContent, qrSize, qrImage, qrCallToAction }, onError );

    return (
      <ThemeProvider theme={theme}>
        {theme.globalStyles.map((globalStyle, index) => (
          <Global key={index} styles={globalStyle} />
        ))}
        <Component {...props} qr={qr} fontsLoaded={fontsLoaded} />
      </ThemeProvider>
    );
  };

  return WrappedComponent;
};
