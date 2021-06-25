import { info } from '@actions/core';
import { exec } from '@actions/exec';
import { which } from '@actions/io';
import { JSONSchemaForNPMPackageJsonFiles } from '@schemastore/package';
import { readFile } from 'fs-extra';
import quote from 'quote';

import { PACKAGE_JSON } from './package-json';

export const CYPRESS = 'cypress';

let isRequired: boolean | null = null;

export async function installCypress(): Promise<void> {
  info('');
  info(`Installing Cypress`);
  const npxPath: string = await which('npx', true);
  await exec(quote(npxPath), ['--no-install', CYPRESS, 'install']);
}

export async function isCypressRequired(): Promise<boolean> {
  if (isRequired != null) {
    return isRequired;
  }

  const packageJson: JSONSchemaForNPMPackageJsonFiles = JSON.parse((await readFile(PACKAGE_JSON)).toString());
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  isRequired = deps[CYPRESS] != null;

  info(isRequired ? `Detected Cypress is used` : `Detected Cypress is not used`);

  return isRequired;
}
