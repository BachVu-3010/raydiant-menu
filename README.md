[![Codeship Status for mirainc/raydiant-menu](https://app.codeship.com/projects/3885e309-9d92-4362-8485-ea00332428b0/status?branch=main)](https://app.codeship.com/projects/447621)
[![Netlify Status](https://api.netlify.com/api/v1/badges/36c0b433-bcd5-4ba7-ae88-b10f0a967730/deploy-status)](https://app.netlify.com/sites/raydiant-menu/deploys)

Raydiant's React Menu component library for the Raydiant Menu apps.

## How to use
Please look at the lib [README.md](src/lib/README.md) file

## Development

### Installation
Use the version of Node.js specified in the `.nvmrc` file.

If you're using `nvm` run `nvm install` & `nvm use` to install and use the correct version of Node.js.

```bash
yarn install
```

### Start styleguidist preview
Run `yarn start` to start the [styleguidist](https://github.com/styleguidist/react-styleguidist) server.

### Locally binding to an App
- Go to the `raydiant-menu` root directory
- run `nvm use; yarn; yarn build`
- CD to your App repository
- Edit the `package.json` file so that `dependencies` includes `"raydiant-menu": "file://[path-to-raydiant-menu]/build/lib"`
- Run `yarn` to install `raydiant-menu` (make sure you are using react and react-dom v16.8.0)

## Publishing
Publishing to NPM is currently a manual process:

1. Increment version in `package.json`.
2. Run `yarn deploy`.
3. Commit version bump and submit a PR (or push directly to main).
