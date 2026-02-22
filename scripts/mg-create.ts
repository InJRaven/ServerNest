import { execSync } from 'child_process';
import { mkdirSync, existsSync } from 'fs';
import { join } from 'path';
const validFolders = ['admin', 'core', 'public'] as const;
type Folder = (typeof validFolders)[number];

const [folder, name] = process.argv.slice(2) as [Folder, string];

if (!folder || !name) {
  console.error('❌ Usage: npm run mg:create <folder> <name>');
  console.error('   Example: npm run mg:create admin CreateAdmins');
  process.exit(1);
}

if (!validFolders.includes(folder)) {
  console.error(
    `❌ Invalid folder "${folder}". Must be one of: ${validFolders.join(', ')}`,
  );
  process.exit(1);
}

const dir = join('src', 'database', 'migrations', folder);

if (!existsSync(dir)) {
  mkdirSync(dir, { recursive: true });
  console.log(`📁 Created folder: ${dir}`);
}

const filePath = join(dir, name);

try {
  execSync(`typeorm-ts-node-commonjs migration:create ${filePath}`, {
    stdio: 'inherit',
  });
} catch {
  process.exit(1);
}
