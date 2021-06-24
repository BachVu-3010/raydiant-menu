```js
const PRICE_FORMATS = require('./constants').PRICE_FORMATS;
const pricing = () => Math.floor(Math.random() * 11);
const createCategories = (extraCategories) => {
  let numCategories = 10;
  try {
    numCategories = Math.max(0, parseInt(String(extraCategories)));
  } catch (e) {}
  
  return [
    {
      name: 'First Category',
      description: 'category description',
      items: [
        {
          name: 'first item',
          description: 'description is optional',
          pricing: () => 1,
          variants: [
            { name: 'Vairant #1', pricing },
            { name: 'Vairant #2', pricing },
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
              { name: 'Sub category Vairant', pricing },
            ]
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
              { name: `#${idx + 2} category Vairant`, pricing },
            ]
          }
      ],
    })),
  ];
};

initialState = {
  vertical: false,
  qrActive: false,
  isPlaying: false,
  extraCategories: '10',
};

const createPresentation = (themeVars, qrActive, imageUrl) => ({
  values: {
    layoutMode: 'default',
    image: { url: imageUrl },
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
  <Preview vertical={state.vertical} >
    {
      (themeVars, imageUrl) => (
        <MenuLayout 
          presentation={createPresentation(themeVars, state.qrActive, imageUrl)}
          categories={createCategories(state.extraCategories)}
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
    <input id='qr' type='checkbox' value={state.qrActive} onChange={(event) => {
      setState(state => ({ ...state, qrActive: !state.qrActive}));
    }} />
    QR Code?
  </h2>
</div>
```
