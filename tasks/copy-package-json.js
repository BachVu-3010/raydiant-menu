const fs = require('fs-extra');
const path = require('path');
const rootPackageJson = require('../package.json');

const npmPackgeJson = {
  name: rootPackageJson.name,
  version: rootPackageJson.version,
  repository: rootPackageJson.repository,
  author: rootPackageJson.author,
  license: rootPackageJson.license,
  dependencies: rootPackageJson.dependencies,
};

fs.writeJSONSync(
  path.resolve(__dirname, '../build/lib/package.json'),
  npmPackgeJson,
  { spaces: 2 },
);
