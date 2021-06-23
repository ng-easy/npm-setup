import { homedir } from 'os';
import { join, normalize } from 'path';

import { saveCache, ReserveCacheError, restoreCache } from '@actions/cache';
import { error, info, warning } from '@actions/core';

import { getPackageHashes } from './hash';

export const NODE_MODULES = 'node_modules';
export const NPM_CACHE = normalize(join(homedir(), '.npm'));
export const PLATFORM_ARCH = `${process.platform}-${process.arch}`;
const NOW = new Date();
export const ROLLING_CACHE_KEY = `${NOW.getFullYear()}-${NOW.getMonth()}`;
export const CACHE_VERSION = 'v1';

export interface Cache {
  path: string;
  keys: string[];
}

export async function restoreCacheAction(cache: Cache): Promise<boolean> {
  info(`Trying to restore cache for ${cache.path}`);

  let cacheHit: string | undefined;

  try {
    cacheHit = await restoreCache([cache.path], cache.keys[0], cache.keys);
    if (cacheHit) {
      info(`${cache.path} cache hit ${cacheHit}`);
      return true;
    }
  } catch (err) {
    error(err.message);
  }

  info(`Cache for ${cache.path} not found`);
  return false;
}

export async function saveCacheAction(cache: Cache): Promise<boolean> {
  info(`Saving cache for ${cache.path}`);

  try {
    await saveCache([cache.path], cache.keys[0]);
    return true;
  } catch (err) {
    if (err instanceof ReserveCacheError) {
      warning(err.message);
      return true;
    }
    error(err.message);
  }

  info(`Cache for ${cache.path} not found`);
  return false;
}

export async function getNodeModulesCache(): Promise<Cache> {
  const { packageLockJsonHash } = await getPackageHashes();

  return {
    path: NODE_MODULES,
    keys: [`node-${CACHE_VERSION}-${PLATFORM_ARCH}-${packageLockJsonHash}`],
  };
}

export async function getNpmCache(): Promise<Cache> {
  const { packageJsonHash, packageLockJsonHash } = await getPackageHashes();

  return {
    path: NPM_CACHE,
    keys: [
      `npm-${CACHE_VERSION}-${PLATFORM_ARCH}-${ROLLING_CACHE_KEY}-${packageJsonHash}-${packageLockJsonHash}`,
      `npm-${CACHE_VERSION}-${PLATFORM_ARCH}-${ROLLING_CACHE_KEY}-${packageJsonHash}`,
      `npm-${CACHE_VERSION}-${PLATFORM_ARCH}-${ROLLING_CACHE_KEY}`,
    ],
  };
}
