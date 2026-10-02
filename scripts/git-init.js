import fs from 'fs';
import path from 'path';
import git from 'isomorphic-git';

const projectDir = path.resolve('.');

async function main() {
  console.log('Initializing git repository in:', projectDir);

  // 1. Initialize repository
  await git.init({ fs, dir: projectDir, defaultBranch: 'main' });
  console.log('Git repo initialized successfully.');

  // 2. Collect all files to stage, respecting .gitignore
  const filesToStage = [];
  const ignoredPatterns = [
    'node_modules',
    '.git',
    '.env',
    '.env.local',
    'dist'
  ];

  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      const relPath = path.relative(projectDir, fullPath).replace(/\\/g, '/');

      // Check ignore
      if (ignoredPatterns.some(p => relPath === p || relPath.startsWith(p + '/'))) {
        continue;
      }

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile()) {
        filesToStage.push(relPath);
      }
    }
  }

  walk(projectDir);
  console.log(`Staging ${filesToStage.length} files...`);

  for (const filepath of filesToStage) {
    await git.add({ fs, dir: projectDir, filepath });
  }

  // 3. Commit
  const sha = await git.commit({
    fs,
    dir: projectDir,
    author: {
      name: 'vdhruvan',
      email: 'vdhruvan@users.noreply.github.com'
    },
    message: 'Initial commit: Library Finder - Nearby libraries web application'
  });
  console.log('Committed successfully. SHA:', sha);

  // 4. Configure remote
  const remotes = await git.listRemotes({ fs, dir: projectDir });
  const hasOrigin = remotes.some(r => r.remote === 'origin');
  if (hasOrigin) {
    await git.deleteRemote({ fs, dir: projectDir, remote: 'origin' });
  }
  await git.addRemote({
    fs,
    dir: projectDir,
    remote: 'origin',
    url: 'https://github.com/vdhruvan/Anything-near-me.git'
  });
  console.log('Remote "origin" set to https://github.com/vdhruvan/Anything-near-me.git');

  // 5. Ensure branch main
  await git.branch({ fs, dir: projectDir, ref: 'main', checkout: true });
  console.log('Active branch set to main.');
}

main().catch(err => {
  console.error('Error initializing git:', err);
  process.exit(1);
});
