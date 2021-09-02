import * as React from 'react';
import * as WebFont from 'webfontloader';
import { ThemeProvider, Global } from '@emotion/react';
import useCalculatedImage from './utils/useCalculatedImage';

import createTheme from './themes/createTheme';
import useDeepMemo from './utils/useDeepMemo';
import useQRCode from './useQRCode';
import { Presentation, ImageData, Category, MenuConfig } from './types';
import Layout from './Layout';
import { DEFAULT_CURRENCY } from './constants';

type OnError = (error: Error) => void;

interface MenuLayoutProps {
  presentation: Presentation;
  categories: Category[];
  onReady: () => void;
  onError: OnError;
  isPlaying?: boolean;
  isThumbnail?: boolean;
  config?: MenuConfig;
}

interface IgnorableOnError extends OnError {
  ignore(): void;
}

const createIgnorableOnError = (onError: OnError) : IgnorableOnError => {
  let ignored = false;

  function ignorableOnError (error: Error) {
    if (!ignored) {
      onError(error);
    }
  }

  ignorableOnError.ignore = () => {
    ignored = true;
  }

  return ignorableOnError;
}

const MenuLayout: React.FC<MenuLayoutProps> = props => {
  const { presentation, categories, onError, onReady, isPlaying, isThumbnail, config } = props;
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

  const ignorableOnError = React.useMemo(() => createIgnorableOnError(onError), [onError]);

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
        ignorableOnError(new Error('Failed to load fonts.'));
      },
    });
    return () => {
      ignorableOnError.ignore();
    };
  }, [theme.toLoadFonts, ignorableOnError]);

  const { qrActive, qrSource, qrUrlContent, qrSize, qrImage, qrCallToAction } = values;
  const qr = useQRCode({ qrActive, qrSource, qrUrlContent, qrSize, qrImage, qrCallToAction }, onError );

  const imageData: ImageData = useCalculatedImage(image && image.url);

  const shouldRenderLayout: boolean =
    fontsLoaded &&
    (!imageData || !!(imageData.width && imageData.height));

  return (
    <ThemeProvider theme={theme}>
      {theme.globalStyles.map((globalStyle, index) => (
        <Global key={index} styles={globalStyle} />
      ))}
        { shouldRenderLayout && (
            <Layout
              config={config}
              image={imageData}
              qr={qr}
              layoutMode={layout}
              categories={categories}
              isPlaying={isPlaying}
              isThumbnail={isThumbnail}
              enableAnimation={enableAnimation}
              onReady={onReady}
              shouldFormatPrice={shouldFormatPrice}
              currency={currency ?? DEFAULT_CURRENCY}
              priceFormat={priceFormat}
              footnote={footnote}
              footnoteSize={footnoteSize}
            />
          )
        }
    </ThemeProvider>
  );
};

MenuLayout.defaultProps = {
  config: {},
}

export default MenuLayout;
