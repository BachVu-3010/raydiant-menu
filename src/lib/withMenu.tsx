import React from 'react';
import * as WebFont from 'webfontloader';
import { ThemeProvider, Global } from '@emotion/react';

import createTheme from './themes/createTheme';
import useDeepMemo from './utils/useDeepMemo';
import useQRCode from './useQRCode';
import { AppProps } from './types';
import { MenuLayoutProps } from './Layout/MenuLayout';

interface AdditionalProps {
  menuProps: MenuLayoutProps,
}

export default function withMenu<OriginalProps extends AppProps>(
  Component: React.ComponentType<OriginalProps & AdditionalProps>,
): React.FC<OriginalProps> {
  const WrappedComponent: React.FC<OriginalProps> = props => {
    const { presentation, onError, onReady, isPlaying } = props;
    const { theme: themeData = {}, values } = presentation;
    const { shouldFormatPrice, currency, priceFormat, image, layout, enableAnimation, footnote, footnoteSize } = values;

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
    const priceFormatConfig = React.useMemo(() => ({ shouldFormatPrice, currency, priceFormat }), [
      shouldFormatPrice,
      currency,
      priceFormat,
    ]);
    const menuProps = React.useMemo(() => ({
      imageUrl: image && image.url,
      fontsLoaded,
      qr,
      layoutMode: layout,
      footnote,
      footnoteSize,
      animate: isPlaying,
      enableAnimation,
      onReady,
      priceFormatConfig,
    }), [
      fontsLoaded,
      qr,
      layout,
      footnote,
      footnoteSize,
      isPlaying,
      enableAnimation,
      onReady,
      priceFormatConfig,
      image,
    ]);

    return (
      <ThemeProvider theme={theme}>
        {theme.globalStyles.map((globalStyle, index) => (
          <Global key={index} styles={globalStyle} />
        ))}
        <Component {...props} menuProps={menuProps} />
      </ThemeProvider>
    );
  };

  return WrappedComponent;
};
