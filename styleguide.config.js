const path = require('path');

module.exports = {
  title: 'Raydiant Menu',
  components: 'src/lib/**/[A-Z]*.tsx',
  theme: {
    maxWidth: 'none',
  },
  pagePerSection: true,
  sections: [
    {
      name: 'MenuLayout',
      components: () => [
        path.join(__dirname, 'src', 'lib', 'Layout', 'Layout.tsx'),
        path.join(__dirname, 'src', 'styleguide', 'components', 'Preview.tsx'),
      ],
    },
  ],
  styleguideDir: path.join(__dirname, 'build/styleguide'),
  styleguideComponents: {},
  resolver: require('react-docgen').resolver.findAllComponentDefinitions,
  propsParser: require('react-docgen-typescript').withDefaultConfig({
    propFilter: { skipPropsWithoutDoc: true },
  }).parse,
  styles: {
    StyleGuide: {
      '@global html': {
        fontSize: 14,
      },
    },
    Playground: {
      preview: {
        padding: 0,
        border: 0,

        '& > div': {
          width: '100%',
          display: 'flex',
        },
      },
    },
  },
};
