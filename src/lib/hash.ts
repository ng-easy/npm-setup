import { debug } from '@actions/core';
import { pathExists } from 'fs-extra';
import { fromFile } from 'hasha';

import { PACKAGE_JSON, PACKAGE_LOCK_JSON } from './package-json';

interface PackageHashes {
  packageLockJsonHash: string;
  packageJsonHash: string;
}

let cachedPackageHashes: PackageHashes | null = null;

export async function getPackageHashes(): Promise<PackageHashes> {
  if (cachedPackageHashes != null) {
    return cachedPackageHashes;
  }

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

  cachedPackageHashes = { packageLockJsonHash, packageJsonHash };
  return cachedPackageHashes;
}
