import { setFailed, error, info } from '@actions/core';

import { Cache, getNxCache, saveCacheAction } from './lib/cache';
import { ixNxCached } from './lib/nx';

export async function npmSetupPostAction() {
  const nxCache: Cache = await getNxCache();

  if (ixNxCached()) {
    await saveCacheAction(nxCache);
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
