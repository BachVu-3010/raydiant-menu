import React from 'react';
import { MenuConfig } from '../types';

export const DEFAULT_CONFIG: MenuConfig = {};

export const MenuConfigContext = React.createContext<MenuConfig>(DEFAULT_CONFIG);

const useMenuConfig = (): MenuConfig => {
  const config = React.useContext(MenuConfigContext);
  return {
    ...DEFAULT_CONFIG,
    ...config,
  };
}

export default useMenuConfig;
