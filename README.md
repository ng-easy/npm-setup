# @ng-easy/npm-setup

Opinionated zero-config [GitHub Action](https://github.com/marketplace/actions/npm-setup) to automate the installation of npm dependencies for [Angular](https://angular.io/) projects and [Nx](https://nx.dev/) workspaces.

It is heavily inspired of [`npm-install`](https://github.com/bahmutov/npm-install), and it might be used for other Node projects as well, as long as this requirements are met:

- Use `npm` as dependency manager, others not supported
- Have a `package-lock.json` and use `npm ci` for installation
- Just use a root `node_modules`

The approach taken for caching is:

- Try to restore `node_modules` if there is an exact match for `package-lock.json`
- If not, restore `~/.npm` based on `package-lock.json` and `package.json`, and use [rolling cache to avoid cache snowball](https://glebbahmutov.com/blog/do-not-let-npm-cache-snowball/)
