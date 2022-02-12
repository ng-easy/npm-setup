import { pathExists, readFile } from 'fs-extra';

import { hasNpmDependency } from './package-json';

export const ANGULAR_CLI = '@angular/cli';
export const ANGULAR_JSON = 'angular.json';

interface AngularJson {
  cli?: {
    cache?: {
      enabled?: boolean;
      environment?: 'local' | 'ci' | 'all';
      path?: string;
    };
  };
}

export async function isAngularRequired(): Promise<boolean> {
  if (!(await hasNpmDependency(ANGULAR_CLI))) {
    return false;
  }

  angularConfig = await getAngularConfig();

  if (!angularConfig) {
    return false;
  }

  const cache = angularConfig.cli?.cache;

  return (cache?.enabled ?? true) && (cache?.environment === 'ci' || cache?.environment === 'all');
}

let angularConfig: AngularJson | null | undefined = undefined;

export async function getAngularConfig(): Promise<AngularJson | null> {
  if (angularConfig !== undefined) {
    return angularConfig;
  }

  angularConfig = null;
  if (await pathExists(ANGULAR_JSON)) {
    angularConfig = JSON.parse((await readFile(ANGULAR_JSON)).toString()) as AngularJson;
  }

  return angularConfig;
}
