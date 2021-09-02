[![Codeship Status for mirainc/raydiant-menu](https://app.codeship.com/projects/3885e309-9d92-4362-8485-ea00332428b0/status?branch=main)](https://app.codeship.com/projects/447621)
[![Netlify Status](https://api.netlify.com/api/v1/badges/36c0b433-bcd5-4ba7-ae88-b10f0a967730/deploy-status)](https://app.netlify.com/sites/raydiant-menu/deploys)

Raydiant's React Menu component library for the Raydiant Menu apps.

## How to use
### 1. Install raydiant-menu
`yarn add raydiant-menu`

**IMPORTANT** Make sure you are using react@16.8.0

### 2. Add Menu Properties
Your `getProperties.js` should look like this
```js
import getMenuProperties from 'raydiant-menu/properties';

export default ({ presentation }) => {
  return {
    // your other props here
    ...getMenuProperties(presentation),
    duration: PropTypes.number('duration').min(5).default(120).helperText('time in seconds.'),
  };
};
```
Your App presentation will have more props
```js
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
```

### 3. Render MenuLayout
```js
// App.jsx
import MenuLayout from 'raydiant-menu';

const App ({
  presentation,
  isPlaying,
  isThumbnail,
  onReady,
  onError,
}) => {
  const categories = [...]; // App decides which content to be shown
  const config = {
    pricingUpdatingInterval: 1000, // optional, if provided, refresh prices every [pricingUpdatingInterval] miliseconds
  };

  return (
    <MenuLayout
      categories={categories}
      presentation={presentation}
      isPlaying={isPlaying}
      isThumbnail={isThumbnail}
      onReady={onReady}
      onError={onError}
      config={}
    />
  );
}
```
