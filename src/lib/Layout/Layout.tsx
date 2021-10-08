import * as React from 'react';
import { useTheme, Theme } from '@emotion/react';

import getFlyersLayout from '../utils/flyersLayout';
import CalculateTextLayout from './CalculateTextLayout';
import Columns from './Columns';
import * as Styles from './Layout.styles';
import ImageLayout from './ImageLayout';
import usePriceFormatter from './usePriceFormatter';
import { Category, ImageData, QR, Size, LayoutMode, MenuConfig } from '../types';
import { MenuConfigContext } from './useMenuConfig';

export interface LayoutProps {
  config?: MenuConfig;
  image?: ImageData;
  qr?: QR;
  layoutMode?: LayoutMode,
  categories?: Category[],
  isPlaying?: boolean;
  isThumbnail?: boolean;
  enableAnimation?: boolean;
  onReady?: () => void;
  shouldFormatPrice?: boolean;
  currency?: string,
  priceFormat?: string,
  footnote?: string;
  footnoteSize?: Size;
}

interface TextSizeDependencies {
  theme: Theme,
  layoutMode: LayoutMode,
  categories: Category[],
}

const Layout: React.FC<LayoutProps> = ({
  config,
  image,
  qr,
  layoutMode,
  categories,
  footnote,
  footnoteSize,
  isPlaying,
  isThumbnail,
  enableAnimation,
  onReady,
  shouldFormatPrice,
  currency,
  priceFormat,
}) => {
  const theme: Theme = useTheme();
  const isLandscape = !(theme && theme.isPortrait);
  const textSizeDependencies: TextSizeDependencies = React.useMemo(() => ({ theme, layoutMode, categories }), [
    theme,
    layoutMode,
    categories,
  ]);
  const layout = React.useMemo(() => getFlyersLayout(isLandscape, image, qr, layoutMode), [
    isLandscape,
    image,
    qr,
    layoutMode,
  ]);
  const priceFormatter = usePriceFormatter(shouldFormatPrice, currency, priceFormat);

  const textSpacing = layout.overscan;
  const textDimensions = {
    width: layout.textWrapperSize.width - textSpacing.left - textSpacing.right,
    height: layout.textWrapperSize.height - textSpacing.top - textSpacing.bottom,
  };

  const trimmedFootnote = footnote ? footnote.trim() : '';
  const formattedFootnote =
    trimmedFootnote &&
    trimmedFootnote
      .split('\n')
      .filter((s) => s && s.trim())
      .slice(0, 2)
      .join('\n');
  const footnoteOnTop = layout.isStacked && layoutMode === 'flip';

  return (
    <MenuConfigContext.Provider value={config}>
      <Styles.Background>
        <Styles.MainLayout isStacked={layout.isStacked} reverse={layoutMode === 'flip'}>
          <ImageLayout
            width={layout.imageSize.width}
            height={layout.imageSize.height}
            image={image}
            qr={qr}
            animate={isPlaying}
            enableAnimation={!isThumbnail && enableAnimation}
            isPortrait={!isLandscape}
            isFlip={layoutMode === 'flip'}
            isStacked={layout.isStacked}
          />
          <Styles.ContentWrapper reverse={footnoteOnTop}>
            <Styles.TextLayout overscan={textSpacing} footnoteOnTop={footnoteOnTop} hasFootnote={!!formattedFootnote}>
              <CalculateTextLayout
                {...textDimensions}
                maxColumns={4}
                onCalculated={onReady}
                textSizeDependencies={textSizeDependencies}
                priceFormatter={priceFormatter}
              >
                {({ measureRef, fontSize, columns, wrap, hide }) => (
                  <Columns
                    measureRef={measureRef}
                    categories={categories}
                    fontSize={fontSize}
                    columns={columns}
                    priceFormatter={priceFormatter}
                    wrap={wrap}
                    hide={hide}
                  />
                )}
              </CalculateTextLayout>
            </Styles.TextLayout>
            {formattedFootnote && <Styles.Footnote size={footnoteSize}>{formattedFootnote}</Styles.Footnote>}
          </Styles.ContentWrapper>
        </Styles.MainLayout>
      </Styles.Background>
    </MenuConfigContext.Provider>
  );
};

export default Layout;
