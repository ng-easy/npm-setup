import { setFailed, error, info } from '@actions/core';

import { Cache, getCypressCache, getNodeModulesCache, getNpmCache, restoreCacheAction, saveCacheAction } from './lib/cache';
import { installCypress } from './lib/cypress';
import { installDependencies } from './lib/npm';

export async function npmSetupAction() {
  const nodeModulesCache: Cache = await getNodeModulesCache();
  const npmModulesCache: Cache = await getNpmCache();
  const cypressCache: Cache = await getCypressCache();

  const nodeModulesCacheRestored: boolean = await restoreCacheAction(nodeModulesCache);

  if (nodeModulesCacheRestored) {
    const cypressCacheRestored: boolean = await restoreCacheAction(cypressCache);
    if (!cypressCacheRestored) {
      await installCypress();
    }
  } else {
    await restoreCacheAction(npmModulesCache);
    await installDependencies();
    await saveCacheAction(nodeModulesCache);
    await saveCacheAction(npmModulesCache);
    await saveCacheAction(cypressCache);
  }
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
