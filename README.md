Raydiant's React Menu component library for the Raydiant Menu apps.

## How to use
#### Install
`yarn add raydiant-menu`

#### Add Menu Properties
Your `getProperties.js` should look like this
```.js
import { getMenuProperties } from 'raydiant-menu';

export default ({ presentation }) => {
  return {
    // your other props here
    ...getMenuProperties(presentation),
    duration: PropTypes.number('duration').min(5).default(120).helperText('time in seconds.'),
  };
};
```

#### Wrap your App component with withMenu and render MenuLayout using injected MenuProps prop
```.js
\\ App.jsx

const App ({
  presentation: {
    values: {
      // other props
      ...
      // props from getMenuProperties
      shouldFormatPrice, // boolean
      currency, // string
      priceFormat, // string
      layout, // 'default' | 'flip'
      image, // { url: string }
      enableAnimation, // boolean
      footnote, // string
      footnoteSize, // 'small' | 'medium' | 'large'
      qrActive, // boolean
      qrSource, // 'needQRCode' | 'haveQRCode'
      qrUrlContent, // string
      qrImage, // { url: string }
      qrSize, // 'small' | 'medium' | 'large'
      qrCallToAction, // string
    },
    theme, // theme object from raydiant-kit PropTypes.theme
  }
  // Props injected by withMenu
  menuProps,
}) => {
  const categories = [...]; // App decides which content to be shown 

  return (
    <MenuLayout
      categories={categories}
      {...menuProps}
    />
  );
}

export default withRaydiantApp(withMenu(Clover));

```
MenuProps Type
```.ts
interface MenuProps {
  qr?: {
    url: string;
    size: 'small' | 'medium' | 'large';
    callToAction: string;
  };
  imageUrl?: string;
  fontsLoaded?: boolean;
  layoutMode?: 'default' | 'flip';
  footnote?: string;
  footnoteSize?: 'small' | 'medium' | 'large';
  animate?: boolean;
  enableAnimation?: boolean;
  priceFormatConfig?: {
    shouldFormatPrice?: boolean;
    currency?: string;
    priceFormat?: string;
  }
  onReady?: () => void;
}
```

## Installation

Use the version of Node.js specified in the `.nvmrc` file.

If you're using `nvm` run `nvm install` & `nvm use` to install and use the correct version of Node.js.

```bash
yarn install
```

## Development

Run `yarn start` to start the [styleguidist](https://github.com/styleguidist/react-styleguidist) server.

## Publishing

Publishing to NPM is currently a manual process:

1. Increment version in `package.json`.
2. Run `yarn deploy`.
3. Commit version bump and submit a PR (or push directly to main).
