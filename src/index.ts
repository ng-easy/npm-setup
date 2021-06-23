import { setFailed, error, info } from '@actions/core';

import { Cache, getNodeModulesCache, getNpmCache, restoreCacheAction, saveCacheAction } from './lib/cache';
import { installDependencies } from './lib/npm';

export async function npmSetupAction() {
  const nodeModulesCache: Cache = await getNodeModulesCache();
  const npmModulesCache: Cache = await getNpmCache();

  if (await restoreCacheAction(nodeModulesCache)) {
    return;
  }

  await restoreCacheAction(npmModulesCache);

  await installDependencies();

  await saveCacheAction(nodeModulesCache);
  await saveCacheAction(npmModulesCache);
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
