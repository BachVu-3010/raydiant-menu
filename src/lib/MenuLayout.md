```js
const PRICE_FORMATS = require('./constants').PRICE_FORMATS;
const pricing = (priceFormatter) => priceFormatter(Math.floor(Math.random() * 11));
const createCategories = (extraCategories, withCalories) => {
  let numCategories = 10;
  try {
    numCategories = Math.max(0, parseInt(String(extraCategories)));
  } catch (e) {}
  
  return [
    {
      name: 'First Category',
      description: 'category description',
      hideDescription: true,
      items: [
        {
          name: 'first item',
          description: 'description is optional',
          pricing: (priceFormatter) => priceFormatter(1),
          variants: Array.from(Array(40).keys()).map((idx) => ({ name: `Variant #${idx + 1}`, pricing })),
          calories: withCalories ? 'cal 0' : undefined,
        },
        {
          name: 'Very long name item lorem ipsum dolor sit amet, consectetur i adipiscing elit',
          description: 'Long description, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et.',
          pricing: (priceFormatter) => priceFormatter(1),
          variants: [
            { name: 'Very long name variant lorem ipsum dolor sit amet, consectetur nil adipiscing elit', pricing },
          ],
          calories: withCalories ? 'cal 0' : undefined,
        }
      ],
      subgroups: [{
        name: 'Sub Category',
        description: 'sub category description',
        hideName: true,
        hideDescription: true,
        items: [
          {
            name: 'sub category item',
            pricing: (priceFormatter) => priceFormatter(1),
            variants: [
              { name: 'Sub category Variant', pricing },
            ],
            calories: withCalories ? 'cal 115.5' : undefined,
          }
        ],
      }]
    },
    ...Array.from(Array(numCategories).keys()).map((idx) => ({
      name: `'#${idx + 1} Category'`,
      description: 'category description',
      items: [
        {
          name: '#2 category item',
          pricing,
          variants: [
            { name: `#${idx + 2} category Variant`, pricing },
          ],
          calories: withCalories ? `cal ${Math.floor(Math.random() * 10000) / 10.0}` : undefined,
        }
      ],
    })),
    {
      name: 'Uncategorized Category',
      description: 'Uncategorized category description',
      isUncategorized: true,
      items: [
        {
          name: 'first uncategorized item',
          description: 'description is optional',
          pricing: (priceFormatter) => priceFormatter(1),
          variants: [
            { name: 'Variant #1', pricing },
            { name: 'Variant #2', pricing },
          ],
          calories: withCalories ? 'cal 0' : undefined,
        },
        {
          name: 'second uncategorized item',
          description: 'description is optional',
          pricing: (priceFormatter) => priceFormatter(1),
          variants: [{ name: 'Variant #1', pricing }],
          calories: withCalories ? 'cal 115.5' : undefined,
        }
      ]
    },
  ];
};

initialState = {
  withCalories: false,
  vertical: false,
  qrActive: false,
  shouldFormatPrice: false,
  isPlaying: false,
  extraCategories: '10',
};

const createPresentation = (themeVars, qrActive, imageUrl, shouldFormatPrice) => ({
  values: {
    layoutMode: 'default',
    image: { url: imageUrl },
    categories: createCategories(10),
    qrActive,
    qrSource: 'needQRCode',
    qrUrlContent: 'http://lvh.me/test-qr-url',
    qrSize: 'small',
    qrCallToAction: 'Call To Action',
    ...(shouldFormatPrice && { 
      shouldFormatPrice: true,
      priceFormat: PRICE_FORMATS.FLOAT_2.value,
    }),
    enableAnimation: true,
  },
  theme: themeVars,
});

<div style={{ width: '100%' }}>
  <Preview vertical={state.vertical} >
    {
      (themeVars, imageUrl) => (
        <MenuLayout 
          presentation={createPresentation(themeVars, state.qrActive, imageUrl, state.shouldFormatPrice)}
          categories={createCategories(state.extraCategories, state.withCalories)}
          isPlaying={state.isPlaying}
          onError={(error) => {
            console.warn('onError', error);
          }}
          onReady={() => { 
            console.warn('onReady');
            if (!state.isPlaying) {
              setState({ isPlaying: true })
            }
          }}
          config={{ pricingUpdatingInterval: 1000 }}
        />
      )
    }
  </Preview>
  <h2>
    <div>Extra Categories?</div>
    <input id='extra-categories' type='number' value={state.extraCategories} onChange={(event) => {
      setState({ extraCategories: event.target.value });
    }} />
  </h2>
  <h2>
    <input id='vertical' type='checkbox' value={state.vertical} onChange={(event) => {
      setState(state => ({ ...state, vertical: !state.vertical}));
    }} />
    Vertical?
  </h2>
  <h2>
    <input id='calories' type='checkbox' value={state.withCalories} onChange={(event) => {
      setState(state => ({ ...state, withCalories: !state.withCalories}));
    }} />
    Calories?
  </h2>
  <h2>
    <input id='qr' type='checkbox' value={state.qrActive} onChange={(event) => {
      setState(state => ({ ...state, qrActive: !state.qrActive}));
    }} />
    QR Code?
  </h2>
  <h2>
    <input id='format-price' type='checkbox' value={state.shouldFormatPrice} onChange={(event) => {
      setState(state => ({ ...state, shouldFormatPrice: !state.shouldFormatPrice}));
    }} />
    Should format price?
  </h2>
</div>
```
