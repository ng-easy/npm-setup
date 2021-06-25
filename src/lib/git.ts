import { getExecOutput } from '@actions/exec';
import { which } from '@actions/io';
import quote from 'quote';

let gitSha: string | null = null;

export async function getGitSha(): Promise<string> {
  if (gitSha != null) {
    return gitSha;
  }

  const gitPath: string = await which('git', true);
  const shaExecOutput = await getExecOutput(quote(gitPath), ['rev-parse', 'HEAD']);

  if (shaExecOutput.exitCode) {
    throw new Error(`Can't get sha from current commit`);
  }

  gitSha = shaExecOutput.stdout.trim();
  return gitSha;
}
