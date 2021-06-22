import * as React from 'react';
import Layout, { LayoutProps } from './Layout';
import { ImageData } from '../types';
import useCalculatedImage from './useCalculatedImage';

export interface MenuLayoutProps extends LayoutProps {
  fontsLoaded?: boolean;
  imageUrl?: string;
}

const MenuLayout: React.FC<MenuLayoutProps> = ({ fontsLoaded, imageUrl, ...otherProps }) => {
  const image: ImageData = useCalculatedImage(imageUrl);

  const shouldRenderLayout: boolean =
    fontsLoaded &&
    (!image || !!(image.width && image.height));

  return shouldRenderLayout ? <Layout {...otherProps} image={image} /> : null;
};

export default MenuLayout;
