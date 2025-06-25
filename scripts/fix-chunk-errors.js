#!/usr/bin/env node

/**
 * Next.js Chunk Error Fix Script
 * 
 * This script helps resolve common Next.js ChunkLoadError issues
 * by clearing caches and restarting the development server.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Next.js Chunk Error Fix Script');
console.log('==================================\n');

function executeCommand(command, description) {
  try {
    console.log(`📋 ${description}...`);
    execSync(command, { stdio: 'inherit', cwd: process.cwd() });
    console.log(`✅ ${description} completed\n`);
  } catch (error) {
    console.log(`⚠️ ${description} failed (this might be normal): ${error.message}\n`);
  }
}

function removeDirectory(dirPath, description) {
  try {
    if (fs.existsSync(dirPath)) {
      console.log(`🗑️ ${description}...`);
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`✅ ${description} completed\n`);
    } else {
      console.log(`ℹ️ ${description} - directory doesn't exist\n`);
    }
  } catch (error) {
    console.log(`⚠️ ${description} failed: ${error.message}\n`);
  }
}

// Step 1: Remove Next.js build cache
removeDirectory('.next', 'Removing .next directory');

// Step 2: Remove node_modules cache
removeDirectory('node_modules/.cache', 'Removing node_modules cache');

// Step 3: Clear npm cache
executeCommand('npm cache clean --force', 'Clearing npm cache');

// Step 4: Reinstall dependencies (optional)
const shouldReinstall = process.argv.includes('--reinstall');
if (shouldReinstall) {
  removeDirectory('node_modules', 'Removing node_modules');
  executeCommand('npm install', 'Reinstalling dependencies');
}

console.log('🎉 Chunk error fix completed!');
console.log('📝 Next steps:');
console.log('   1. Run: npm run dev');
console.log('   2. Open: http://localhost:3000');
console.log('   3. Check if the ChunkLoadError is resolved\n');

console.log('💡 Prevention tips:');
console.log('   - Avoid force-stopping the dev server (use Ctrl+C gracefully)');
console.log('   - Don\'t edit files while Next.js is compiling');
console.log('   - Keep your Next.js version updated');
console.log('   - Run this script if you encounter chunk errors again');
