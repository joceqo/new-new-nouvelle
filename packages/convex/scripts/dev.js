#!/usr/bin/env node

import { spawn } from 'child_process';
import { config } from 'dotenv';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local if it exists
const envFile = join(__dirname, '..', '.env.local');
if (existsSync(envFile)) {
  config({ path: envFile });
}

const url = process.env.CONVEX_SELF_HOSTED_URL || process.env.CONVEX_URL;

if (!url) {
  console.error('❌ Missing CONVEX_SELF_HOSTED_URL or CONVEX_URL in .env.local');
  process.exit(1);
}

console.log(`🔗 Connecting to Convex at: ${url}`);
console.log(`📝 Using environment file: .env.local`);

const args = ['convex', 'dev', '--env-file', join(__dirname, '..', '.env.local')];

const child = spawn('npx', args, {
  stdio: 'inherit',
  shell: true,
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
