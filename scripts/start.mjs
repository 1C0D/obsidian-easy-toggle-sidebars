import { execSync } from 'child_process';
import fs from 'fs';

if (fs.existsSync('src/main.ts')) {
    execSync('start /B code src/main.ts', { stdio: 'ignore', shell: true });
} else {
    execSync('start /B code main.ts', { stdio: 'ignore', shell: true });
}

execSync('npm install', { stdio: 'inherit' });
execSync('npm run dev', { stdio: 'inherit' });