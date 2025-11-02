#!/bin/zsh
# Remove ESLint config files and dependencies
rm -f .eslintrc.json eslint.config.mjs
npm uninstall eslint @eslint/js @eslint/eslintrc eslint-plugin-prettier typescript-eslint
