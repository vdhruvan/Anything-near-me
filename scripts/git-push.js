import fs from 'fs';
import path from 'path';
import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';

const projectDir = path.resolve('.');

async function push() {
  const token = process.argv[2] || process.env.GITHUB_TOKEN || process.env.GH_TOKEN;

  console.log(`Pushing branch 'main' to https://github.com/vdhruvan/Anything-near-me.git...`);
  if (token) {
    console.log('Authenticating with GitHub Personal Access Token...');
  } else {
    console.log('No GitHub token provided.');
    console.log('To push to GitHub, supply a token:');
    console.log('  node scripts/git-push.js <YOUR_GITHUB_TOKEN>');
    console.log('  or set $env:GITHUB_TOKEN="<YOUR_TOKEN>" and run npm run push');
  }

  const pushResult = await git.push({
    fs,
    http,
    dir: projectDir,
    remote: 'origin',
    ref: 'main',
    onAuth: () => {
      if (token) {
        return { username: token, password: '' };
      }
      return undefined;
    }
  });

  console.log('Push completed successfully!', pushResult);
}

push().catch(err => {
  console.error('Push error:', err.message);
  if (err.data) {
    console.error('Details:', err.data);
  }
  process.exit(1);
});
