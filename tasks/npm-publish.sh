#!/bin/bash
set -e

# Clean build
rm -rf build
mkdir build

# Copy node_modules to a tmp folder
mv node_modules build/node_modules

# Install dependencies
yarn install --pure-lockfile

# Build project
yarn build

# Restore node_modules
rm -rf node_modules
mv build/node_modules node_modules 

# Publish from build/lib
cd build/lib
yarn publish --non-interactive --tag v4
