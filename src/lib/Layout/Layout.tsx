import * as React from 'react';
import { useTheme, Theme } from '@emotion/react';

import getFlyersLayout from '../utils/flyersLayout';
import CalculateTextLayout from './CalculateTextLayout';
import Columns from './Columns';
import * as Styles from './Layout.styles';
import ImageLayout from './ImageLayout';
import usePriceFormatter, { PriceFormatConfig } from './usePriceFormatter';
import { Category, ImageData, QR, Size, LayoutMode } from '../types';

export interface LayoutProps {
  image?: ImageData;
  qr?: QR;
  layoutMode?: LayoutMode,
  categories?: Category[],
  animate?: boolean;
  enableAnimation?: boolean;
  onReady?: () => void;
  priceFormatConfig?: PriceFormatConfig;
  footnote?: string;
  footnoteSize?: Size;
}

interface TextSizeDependencies {
  theme: Theme,
  layoutMode: LayoutMode,
  categories: Category[],
}

const Layout: React.FC<LayoutProps> = ({
  image,
  qr,
  layoutMode,
  categories,
  footnote,
  footnoteSize,
  animate,
  enableAnimation,
  onReady,
  priceFormatConfig,
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
  const priceFormatter = usePriceFormatter(priceFormatConfig);

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
    <Styles.Background>
      <Styles.MainLayout isStacked={layout.isStacked} reverse={layoutMode === 'flip'}>
        <ImageLayout
          width={layout.imageSize.width}
          height={layout.imageSize.height}
          image={image}
          qr={qr}
          animate={animate}
          enableAnimation={enableAnimation}
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
  );
};

Layout.defaultProps = {
  animate: false,
  enableAnimation: true,
};

export default Layout;
