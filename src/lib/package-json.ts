import { info } from '@actions/core';
import { JSONSchemaForNPMPackageJsonFiles } from '@schemastore/package';
import { readFile } from 'fs-extra';

export const PACKAGE_JSON = 'package.json';
export const PACKAGE_LOCK_JSON = 'package-lock.json';

let npmDependencies: { [key: string]: any } | null = null;

export async function hasNpmDependency(name: string): Promise<boolean> {
  if (npmDependencies != null) {
    return npmDependencies[name] != null;
  }

  const packageJson: JSONSchemaForNPMPackageJsonFiles = JSON.parse((await readFile(PACKAGE_JSON)).toString());
  npmDependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  const hasDependency = npmDependencies[name] != null;

  info(hasDependency ? `Detected ${name} is a dependency` : `Detected ${name} is not a dependency`);

  return hasDependency;
}
