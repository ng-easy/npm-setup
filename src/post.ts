import { setFailed, error, info } from '@actions/core';

import { isAngularRequired } from './lib/angular';
import { Cache, getAngularCache, getNxCache, saveCacheAction } from './lib/cache';
import { ixNxCached } from './lib/nx';

export async function npmSetupPostAction() {
  const nxCache: Cache = await getNxCache();
  const angularCache: Cache = await getAngularCache();

  if (ixNxCached()) {
    await saveCacheAction(nxCache);
  }

  if (await isAngularRequired()) {
    await saveCacheAction(angularCache);
  }
}

if (!module.parent) {
  npmSetupPostAction()
    .then(() => {
      info('');
      info('Dependencies cache saved successfully');
    })
    .catch((err) => {
      error(err);
      setFailed(err.message);
    });
}
