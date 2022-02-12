import { info } from '@actions/core';
import { exec } from '@actions/exec';
import { which } from '@actions/io';
import quote from 'quote';

import { hasNpmDependency } from './package-json';

export const CYPRESS = 'cypress';

export async function installCypress(): Promise<void> {
  info('');
  info(`Installing Cypress`);
  const npxPath: string = await which('npx', true);
  await exec(quote(npxPath), ['--no-install', CYPRESS, 'install']);
}

export async function isCypressRequired(): Promise<boolean> {
  return await hasNpmDependency(CYPRESS);
}
