# @ng-easy/npm-setup

[![CI](https://github.com/ng-easy/platform/actions/workflows/ci.yml/badge.svg)](https://github.com/ng-easy/npm-setup/actions/workflows/ci.yml) [![npm latest version](https://img.shields.io/npm/v/@ng-easy/npm-setup/latest.svg)](https://www.npmjs.com/package/@ng-easy/npm-setup) [![Downloads](https://img.shields.io/npm/dm/@ng-easy/npm-setup)](https://www.npmjs.com/package/@ng-easy/npm-setup) ![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg) ![renovate](https://img.shields.io/badge/maintaied%20with-renovate-blue?logo=renovatebot)

Opinionated zero-config [GitHub Action](https://github.com/marketplace/actions/npm-setup) to automate the installation of npm dependencies for [Angular](https://angular.io/) projects and [Nx](https://nx.dev/) workspaces.

It is heavily inspired of [`npm-install` GitHub action](https://github.com/bahmutov/npm-install), and it might be used for other Node projects as well, as long as these requirements are met:

- Use `npm` as dependency manager, others not supported
- Have a `package-lock.json` and run `npm ci` for installation
- Just use a root `node_modules`

The approach taken for caching is:

- Try to restore `node_modules` if there is an exact match for `package-lock.json`
- If not, restore `~/.npm` based on `package-lock.json` and `package.json`, and use [rolling cache to avoid cache snowball](https://glebbahmutov.com/blog/do-not-let-npm-cache-snowball/)
- Detects if [Cypress](https://www.cypress.io/) is a dependency, if so caches its installation
- Detects if [Angular](https://angular.io/) is a dependency, if so caches its build artifacts
- Caches [Nx](https://nx.dev/) local execution cache instead of relying on Nx Cloud if an input is provided, using rolling cache as well

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
      - uses: ng-easy/npm-install@v2
      - run: npm run build
```

If you want to cache [Nx](https://nx.dev/) local execution cache then pass `nx-key` input:

```yml
- uses: ng-easy/npm-install@v2
  with:
    nx-key: build # or any other key you want to use for the cache that uniquely identifies the job in the workflow
```
