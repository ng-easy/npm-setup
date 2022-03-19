import { setFailed, error, info } from '@actions/core';

import { isAngularRequired } from './lib/angular';
import {
  Cache,
  getAngularCache,
  getCypressCache,
  getNodeModulesCache,
  getNpmCache,
  getNxCache,
  restoreCacheAction,
  saveCacheAction,
} from './lib/cache';
import { installCypress, isCypressRequired } from './lib/cypress';
import { installDependencies } from './lib/npm';
import { ixNxCached } from './lib/nx';

export async function npmSetupMainAction() {
  const nodeModulesCache: Cache = await getNodeModulesCache();
  const npmModulesCache: Cache = await getNpmCache();
  const cypressCache: Cache = await getCypressCache();
  const nxCache: Cache = await getNxCache();
  const angularCache: Cache = await getAngularCache();

  if (await restoreCacheAction(nodeModulesCache)) {
    if ((await isCypressRequired()) && !(await restoreCacheAction(cypressCache))) {
      await installCypress();
    }
  } else {
    await restoreCacheAction(npmModulesCache);
    await installDependencies();
    await saveCacheAction(nodeModulesCache);
    await saveCacheAction(npmModulesCache);
    if (await isCypressRequired()) {
      await saveCacheAction(cypressCache);
    }
  }

  if (ixNxCached()) {
    await restoreCacheAction(nxCache);
  }

  if (await isAngularRequired()) {
    await restoreCacheAction(angularCache);
  }
}

if (require.main === module) {
  npmSetupMainAction()
    .then(() => {
      info('');
      info('npm dependencies restored successfully');
    })
    .catch((err) => {
      error(err);
      setFailed(err.message);
    });
}
