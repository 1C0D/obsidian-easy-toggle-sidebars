import { execSync } from 'child_process';

execSync('start /B code .', { stdio: 'ignore', shell: true });
execSync('npm install', { stdio: 'inherit' });
execSync('npm run dev', { stdio: 'inherit' });