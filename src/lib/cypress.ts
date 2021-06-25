import { info } from '@actions/core';
import { exec } from '@actions/exec';
import { which } from '@actions/io';
import quote from 'quote';

export async function installCypress() {
  info(`Installing Cypress`);
  const npxPath: string = await which('npx', true);
  await exec(quote(npxPath), ['cypress', 'install']);
}
