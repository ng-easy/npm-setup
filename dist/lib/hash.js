"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackageHashes = void 0;
const core_1 = require("@actions/core");
const fs_extra_1 = require("fs-extra");
const hasha_1 = require("hasha");
const package_json_1 = require("./package-json");
let cachedPackageHashes = null;
async function getPackageHashes() {
    if (cachedPackageHashes != null) {
        return cachedPackageHashes;
    }
    // Calculate hash for package-lock.json
    if (!(await fs_extra_1.pathExists(package_json_1.PACKAGE_LOCK_JSON))) {
        throw new Error(`${package_json_1.PACKAGE_LOCK_JSON} doesn't exist`);
    }
    const packageLockJsonHash = await hasha_1.fromFile(package_json_1.PACKAGE_LOCK_JSON);
    if (!packageLockJsonHash) {
        throw new Error(`Could not compute has from file ${package_json_1.PACKAGE_LOCK_JSON}`);
    }
    core_1.debug(`${package_json_1.PACKAGE_LOCK_JSON} hash ${packageLockJsonHash}`);
    // Calculate hash for package.json
    if (!(await fs_extra_1.pathExists(package_json_1.PACKAGE_JSON))) {
        throw new Error(`${package_json_1.PACKAGE_JSON} doesn't exist`);
    }
    const packageJsonHash = await hasha_1.fromFile(package_json_1.PACKAGE_JSON);
    if (!packageJsonHash) {
        throw new Error(`Could not compute has from file ${package_json_1.PACKAGE_JSON}`);
    }
    core_1.debug(`${package_json_1.PACKAGE_JSON} hash ${packageJsonHash}`);
    cachedPackageHashes = { packageLockJsonHash, packageJsonHash };
    return cachedPackageHashes;
}
exports.getPackageHashes = getPackageHashes;
