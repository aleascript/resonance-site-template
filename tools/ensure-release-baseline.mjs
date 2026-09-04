import {execFileSync} from 'node:child_process';

function git(args) {
  return execFileSync('git', args, {encoding: 'utf8'}).trim();
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
console.log(`Created local semantic-release baseline v0.0.0 at ${baselineCommit}.`);
