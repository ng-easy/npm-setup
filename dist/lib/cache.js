"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNpmCache = exports.getNodeModulesCache = exports.saveCacheAction = exports.restoreCacheAction = exports.CACHE_VERSION = exports.NPM_CACHE = exports.NODE_MODULES = void 0;
const os_1 = require("os");
const path_1 = require("path");
const cache_1 = require("@actions/cache");
const core_1 = require("@actions/core");
const hash_1 = require("./hash");
// TODO: Add platform and arch to cache keys
exports.NODE_MODULES = 'node_modules';
exports.NPM_CACHE = path_1.normalize(path_1.join(os_1.homedir(), '.npm'));
exports.CACHE_VERSION = 'v1';
async function restoreCacheAction(cache) {
    core_1.info(`Trying to restore cache for ${cache.path}`);
    let cacheHit;
    try {
        cacheHit = await cache_1.restoreCache([cache.path], cache.keys[0], cache.keys);
        if (cacheHit) {
            core_1.info(`${cache.path} cache hit ${cacheHit}`);
            return true;
        }
    }
    catch (err) {
        core_1.error(err.message);
    }
    core_1.info(`Cache for ${cache.path} not found`);
    return false;
}
exports.restoreCacheAction = restoreCacheAction;
async function saveCacheAction(cache) {
    core_1.info(`Saving cache for ${cache.path}`);
    try {
        await cache_1.saveCache([cache.path], cache.keys[0]);
        return true;
    }
    catch (err) {
        if (err instanceof cache_1.ReserveCacheError) {
            core_1.warning(err.message);
            return true;
        }
        core_1.error(err.message);
    }
    core_1.info(`Cache for ${cache.path} not found`);
    return false;
}
exports.saveCacheAction = saveCacheAction;
async function getNodeModulesCache() {
    const { packageLockJsonHash } = await hash_1.getPackageHashes();
    return {
        path: exports.NODE_MODULES,
        keys: [`node-${exports.CACHE_VERSION}-${packageLockJsonHash}`],
    };
}
exports.getNodeModulesCache = getNodeModulesCache;
async function getNpmCache() {
    const { packageJsonHash, packageLockJsonHash } = await hash_1.getPackageHashes();
    return {
        path: exports.NPM_CACHE,
        keys: [
            `npm-${exports.CACHE_VERSION}-${packageJsonHash}-${packageLockJsonHash}`,
            `npm-${exports.CACHE_VERSION}-${packageJsonHash}`,
            `npm-${exports.CACHE_VERSION}`,
        ],
    };
}
exports.getNpmCache = getNpmCache;
