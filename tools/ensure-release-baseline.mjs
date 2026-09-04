import {execFileSync} from 'node:child_process';

function git(args, options = {}) {
  return execFileSync('git', args, {
    encoding: 'utf8',
    stdio: options.stdio ?? ['ignore', 'pipe', 'pipe'],
  }).trim();
}

const releaseTags = git(['tag', '--list', 'v[0-9]*'])
  .split(/\r?\n/)
  .map((value) => value.trim())
  .filter(Boolean);

if (releaseTags.length > 0) {
  console.log(`Release baseline already exists (${releaseTags.at(-1)}).`);
  process.exit(0);
}

let baselineCommit;
try {
  baselineCommit = git(['rev-parse', 'HEAD^']);
} catch {
  baselineCommit = git(['rev-list', '--max-parents=0', 'HEAD']);
}

git(['tag', 'v0.0.0', baselineCommit]);
git(['push', 'origin', 'refs/tags/v0.0.0'], {stdio: 'inherit'});
console.log(
  `Created semantic-release seed tag v0.0.0 at ${baselineCommit}. ` +
    'The seed has no GitHub Release and only establishes pre-1.0 SemVer history.',
);
