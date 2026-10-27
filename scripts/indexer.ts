import fs from 'fs';
import path from 'path';

interface FileInfo {
  path: string;
  exports: string[];
  imports: string[];
  purpose: string;
}

const SRC_DIR = './src';
const OUTPUT_FILE = './project-map.json';

function getFiles(dir: string): string[] {
  const files: string[] = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      files.push(...getFiles(filePath));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      files.push(filePath);
    }
  }
  return files;
}

function analyzeFile(filePath: string): FileInfo {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Simple regex for exports
  const exportRegex = /export\s+(?:const|function|class|interface|type|enum)\s+([a-zA-Z0-9_]+)/g;
  const exports: string[] = [];
  let match;
  while ((match = exportRegex.exec(content)) !== null) {
    exports.push(match[1]);
  }

  // Default export
  if (content.includes('export default')) {
    exports.push('default');
  }

  // Simple regex for imports
  const importRegex = /import\s+.*from\s+['"](.*)['"]/g;
  const imports: string[] = [];
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }

  // Infer purpose
  let purpose = '';
  if (filePath.includes('components')) purpose = 'UI Component';
  else if (filePath.includes('services')) purpose = 'API/External Service Logic';
  else if (filePath.includes('contexts')) purpose = 'React Context/State Management';
  else if (filePath.includes('lib')) purpose = 'Utility/Library functions';
  else if (filePath.endsWith('types.ts')) purpose = 'Type Definitions';
  else if (filePath.endsWith('App.tsx')) purpose = 'Main Application Entry/Routing';
  else purpose = 'General Logic';

  return {
    path: filePath,
    exports,
    imports,
    purpose
  };
}

function main() {
  console.log('Indexing project...');
  const files = getFiles(SRC_DIR);
  const index = files.map(analyzeFile);
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index, null, 2));
  console.log(`Indexed ${files.length} files to ${OUTPUT_FILE}`);
}

main();
