import { getInput, debug, setFailed, setOutput, info, error } from '@actions/core';

const token = getInput('token') || process.env.GH_PAT || process.env.GITHUB_TOKEN;

export const run = async () => {
  if (!token) throw new Error('GitHub token not found');
  const ms: string = getInput('milliseconds');
  info(`Waiting ${ms} milliseconds ...`);

  debug(new Date().toTimeString());
  await wait(parseInt(ms, 10));
  debug(new Date().toTimeString());

  setOutput('time', new Date().toTimeString());
};

export const wait = (milliseconds: number) => {
  return new Promise<void>((resolve) => setTimeout(() => resolve(), milliseconds));
};

run().catch((err) => {
  error(err);
  setFailed(err.message);
});
