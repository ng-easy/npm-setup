import { restoreCache, ReserveCacheError, saveCache } from '@actions/cache';
import { setFailed, error, info, debug, warning } from '@actions/core';
import { exec } from '@actions/exec';
import { which } from '@actions/io';
import { pathExists } from 'fs-extra';
import { fromFile } from 'hasha';
import quote from 'quote';

const PACKAGE_JSON = 'package.json';
const PACKAGE_LOCK_JSON = 'package-lock.json';
const NODE_MODULES = 'node_modules';
const NPM_CACHE = '.npm';

interface PackageHashes {
  packageLockJsonHash: string;
  packageJsonHash: string;
}

// TODO: Add platform and arch to cache keys

export async function npmSetupAction() {
  const { packageLockJsonHash, packageJsonHash } = await packageHashes();

  if (await restoreNodeModulesCache(packageLockJsonHash)) {
    return;
  }

  await restoreNpmCache(packageLockJsonHash, packageJsonHash);

  await install();

  await saveNodeModulesCache(packageLockJsonHash);
  await saveNpmCache(packageLockJsonHash, packageJsonHash);
}

async function packageHashes(): Promise<PackageHashes> {
  // Calculate hash for package-lock.json
  if (!(await pathExists(PACKAGE_LOCK_JSON))) {
    throw new Error(`${PACKAGE_LOCK_JSON} doesn't exist`);
  }

  const packageLockJsonHash: string | undefined = await fromFile(PACKAGE_LOCK_JSON);
  if (!packageLockJsonHash) {
    throw new Error(`Could not compute has from file ${PACKAGE_LOCK_JSON}`);
  }
  debug(`${PACKAGE_LOCK_JSON} hash ${packageLockJsonHash}`);

  // Calculate hash for package.json
  if (!(await pathExists(PACKAGE_JSON))) {
    throw new Error(`${PACKAGE_JSON} doesn't exist`);
  }

  const packageJsonHash: string | undefined = await fromFile(PACKAGE_JSON);
  if (!packageJsonHash) {
    throw new Error(`Could not compute has from file ${PACKAGE_JSON}`);
  }
  debug(`${PACKAGE_JSON} hash ${packageJsonHash}`);

  return { packageLockJsonHash, packageJsonHash };
}

async function restoreNodeModulesCache(packageLockJsonHash: string): Promise<boolean> {
  info(`Trying to restore cache for ${NODE_MODULES}`);

  let cacheHit: string | undefined;

  try {
    cacheHit = await restoreCache([NODE_MODULES], `node-${packageLockJsonHash}`);
    if (cacheHit) {
      info(`${NODE_MODULES} cache hit ${cacheHit}`);
      return true;
    }
  } catch (err) {
    error(err.message);
  }

  info(`Cache for ${NODE_MODULES} not found`);
  return false;
}

async function saveNodeModulesCache(packageLockJsonHash: string): Promise<boolean> {
  info(`Saving cache for ${NODE_MODULES}`);

  try {
    await saveCache([NODE_MODULES], `node-${packageLockJsonHash}`);
    info(`Cache for ${NODE_MODULES} saved`);
    return true;
  } catch (err) {
    if (err instanceof ReserveCacheError) {
      warning(err.message);
      return true;
    }
    error(err.message);
  }

  info(`Cache for ${NODE_MODULES} not found`);
  return false;
}

async function restoreNpmCache(packageLockJsonHash: string, packageJsonHash: string): Promise<boolean> {
  info(`Trying to restore cache for ${NPM_CACHE}`);

  // TODO: use rolling cache
  const restoreKeys: string[] = [`npm-${packageJsonHash}-${packageLockJsonHash}`, `npm-${packageJsonHash}`, `npm`];
  let cacheHit: string | undefined;

  try {
    cacheHit = await restoreCache([NPM_CACHE], restoreKeys[0], restoreKeys);
    if (cacheHit) {
      info(`${NPM_CACHE} cache hit ${cacheHit}`);
      return true;
    }
  } catch (err) {
    error(err.message);
  }

  info(`Cache for ${NPM_CACHE} not found`);
  return false;
}

async function saveNpmCache(packageLockJsonHash: string, packageJsonHash: string): Promise<boolean> {
  info(`Saving cache for ${NPM_CACHE}`);

  try {
    await saveCache([NPM_CACHE], `npm-${packageJsonHash}-${packageLockJsonHash}`);
    info(`Cache for ${NPM_CACHE} saved`);
    return true;
  } catch (err) {
    if (err instanceof ReserveCacheError) {
      warning(err.message);
      return true;
    }
    error(err.message);
  }

  info(`Cache for ${NPM_CACHE} not found`);
  return false;
}

async function install() {
  info(`Installing dependencies with npm ci`);
  const npmPath: string = await which('npm', true);
  await exec(quote(npmPath), ['ci']);
}

if (!module.parent) {
  npmSetupAction()
    .then(() => {
      info('npm dependencies installed successfully');
    })
    .catch((err) => {
      error(err);
      setFailed(err.message);
    });
}
