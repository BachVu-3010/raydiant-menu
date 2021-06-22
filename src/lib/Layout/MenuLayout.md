```js
const withMenu = require('../withMenu').default;
const PRICE_FORMATS = require('../constants').PRICE_FORMATS;
const createCategories = (numOfExtraCategories) => [
  {
    name: 'First Category',
    description: 'category description',
    items: [
      {
        name: 'first item',
        description: 'description is optional',
        pricing: () => 1,
        variants: [
          { name: 'Vairant #1', pricing: () => 0.5 },
          { name: 'Vairant #2', pricing: () => 0.45 },
        ]
      }
    ],
    subgroups: [{
      name: 'Sub Category',
      description: 'sub category description',
      items: [
        {
          name: 'sub category item',
          pricing: () => 1,
          variants: [
            { name: 'Sub category Vairant', pricing: () => 0.5 },
          ]
        }
      ],
    }]
  },
  ...Array.from(Array(numOfExtraCategories).keys()).map((idx) => ({
    name: `'#${idx + 1} Category'`,
    description: 'category description',
    items: [
      {
          name: '#2 category item',
          pricing: () => 1,
          variants: [
            { name: `#${idx + 1} category Vairant`, pricing: () => idx },
          ]
        }
    ]
  })),
];

initialState = {
  vertical: false,
  qrActive: false,
};

const App = withMenu(({presentation, qr, fontsLoaded}) => {
  const { imageUrl, categories } = presentation.values;
  return (
    <MenuLayout
      imageUrl={imageUrl}
      fontsLoaded={fontsLoaded}
      layoutMode='default'
      categories={categories}
      onReady={() => { 
        console.warn('onReady');
      }}
      qr={qr}
      priceFormatConfig={{
        shouldFormatPrice: true,
        currency: '$',
        priceFormat: PRICE_FORMATS.FLOAT_2.value,
      }}
    />
  );
});

const createPresentation = (themeVars, qrActive, imageUrl) => ({
  values: {
    imageUrl,
    categories: createCategories(10),
    qrActive,
    qrSource: 'needQRCode',
    qrUrlContent: 'http://lvh.me/test-qr-url',
    qrSize: 'small',
    qrCallToAction: 'Call To Action',
  },
  theme: themeVars,
});

<div style={{ width: '100%' }}>
  <Preview App={App} vertical={state.vertical} >
    {
      (themeVars, imageUrl) => (<App presentation={createPresentation(themeVars, state.qrActive, imageUrl)} />)
    }
  </Preview>
  <h2>
    <input id='vertical' type='checkbox' value={state.vertical} onChange={(event) => {
      setState(state => ({ ...state, vertical: !state.vertical}));
    }} />
    Vertical?
  </h2>
  <h2>
    <input id='qr' type='checkbox' value={state.qrActive} onChange={(event) => {
      setState(state => ({ ...state, qrActive: !state.qrActive}));
    }} />
    QR Code?
  </h2>
</div>
```
