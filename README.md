# @ng-easy/npm-setup

[![CI](https://github.com/ng-easy/platform/actions/workflows/ci.yml/badge.svg)](https://github.com/ng-easy/npm-setup/actions/workflows/ci.yml) [![npm latest version](https://img.shields.io/npm/v/@ng-easy/npm-setup/latest.svg)](https://www.npmjs.com/package/@ng-easy/eslint-config) ![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)

Opinionated zero-config [GitHub Action](https://github.com/marketplace/actions/npm-setup) to automate the installation of npm dependencies for [Angular](https://angular.io/) projects and [Nx](https://nx.dev/) workspaces.

It is heavily inspired of [`npm-install`](https://github.com/bahmutov/npm-install), and it might be used for other Node projects as well, as long as this requirements are met:

- Use `npm` as dependency manager, others not supported
- Have a `package-lock.json` and use `npm ci` for installation
- Just use a root `node_modules`

The approach taken for caching is:

- Try to restore `node_modules` if there is an exact match for `package-lock.json`
- If not, restore `~/.npm` based on `package-lock.json` and `package.json`, and use [rolling cache to avoid cache snowball](https://glebbahmutov.com/blog/do-not-let-npm-cache-snowball/)

## Usage

```yml
name: main
on: [push]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    name: Build and test
    steps:
      - uses: actions/checkout@v2
      - uses: ng-easy/npm-install@v1
      - run: npm run build
```
