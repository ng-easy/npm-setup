import { info } from '@actions/core';
import { exec } from '@actions/exec';
import { which } from '@actions/io';
import quote from 'quote';

export async function installDependencies(): Promise<void> {
  info(`Installing dependencies with npm ci`);
  const npmPath: string = await which('npm', true);
  await exec(quote(npmPath), ['ci']);
}

export function getNodeVersion(): string {
  return process.version;
}
