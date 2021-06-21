```js
const withTheme = require('../themes/withTheme').default;
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
};

const App = withTheme(() => {
  return (
    <Layout
      layoutMode='default'
      categories={createCategories(10)}
      onReady={() => { 
        console.warn('onReady');
      }}
      priceFormatConfig={{
        shouldFormatPrice: true,
        currency: '$',
        priceFormat: PRICE_FORMATS.FLOAT_2.value,
      }}
    />
  );
});

<div style={{ width: '100%' }}>
  <Preview App={App} vertical={state.vertical}/>
  <h2>
    <input type='checkbox' value={state.vertical} onChange={(event) => {
      setState({vertical: event.target.checked});
    }} />
    Vertical?
  </h2>
</div>
```
