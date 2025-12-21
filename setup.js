#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up ApniSec application...\n');

// Check if .env exists, if not copy from .env.example
if (!fs.existsSync('.env')) {
  if (fs.existsSync('.env.example')) {
    fs.copyFileSync('.env.example', '.env');
    console.log('✅ Created .env file from .env.example');
  } else {
    console.log('❌ .env.example not found');
  }
} else {
  console.log('✅ .env file already exists');
}

// Check if node_modules exists
if (!fs.existsSync('node_modules')) {
  console.log('📦 Please run: npm install');
} else {
  console.log('✅ Dependencies installed');
}

console.log('\n🔧 Setup complete! Next steps:');
console.log('1. Make sure MongoDB is running locally');
console.log('2. Update .env with your configuration');
console.log('3. Run: npm run dev');
console.log('4. Visit: http://localhost:3000');
console.log('\n📚 Check README.md for detailed instructions');