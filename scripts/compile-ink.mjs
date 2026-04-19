#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { join, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Use inkjs compiler
const srcDir = join(__dirname, '..', 'src', 'data', 'ink-source');
const outDir = join(__dirname, '..', 'src', 'data', 'ink');

mkdirSync(outDir, { recursive: true });

async function compile() {
  const { Compiler } = await import('inkjs/compiler/Compiler');
  const files = readdirSync(srcDir).filter(f => f.endsWith('.ink'));

  if (files.length === 0) {
    console.warn('No .ink files found in', srcDir);
    return;
  }

  for (const file of files) {
    const source = readFileSync(join(srcDir, file), 'utf-8');
    const compiler = new Compiler(source);
    const story = compiler.Compile();
    const jsonStr = story.ToJson();
    const outName = basename(file, '.ink') + '.ink.json';
    writeFileSync(join(outDir, outName), jsonStr);
    console.log(`Compiled: ${file} -> ${outName}`);
  }

  console.log(`Done. Compiled ${files.length} ink file(s).`);
}

compile().catch(err => {
  console.error('Ink compilation failed:', err);
  process.exit(1);
});
