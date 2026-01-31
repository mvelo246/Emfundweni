#!/usr/bin/env node

/**
 * Pre-deployment Validation Script
 * Checks that all code is working correctly before deployment
 */

const fs = require('fs');
const path = require('path');

console.log('╔════════════════════════════════════════════════════════╗');
console.log('║     Emfudweni High School - Pre-Deployment Check      ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

let hasErrors = false;

// Set development mode for testing
process.env.NODE_ENV = 'development';

// Test 1: Check mysql2 package
console.log('1. Checking mysql2 package...');
try {
  require('mysql2');
  console.log('   ✓ mysql2 is installed\n');
} catch (error) {
  console.log('   ✗ mysql2 is NOT installed');
  console.log('   Run: npm install mysql2\n');
  hasErrors = true;
}

// Test 2: Check database.js
console.log('2. Checking database.js...');
try {
  const db = require('./database.js');
  const exports = Object.keys(db);
  if (exports.includes('initDatabase') && exports.includes('getDatabase') && exports.includes('closeDatabase')) {
    console.log('   ✓ database.js is valid');
    console.log('   ✓ All functions exported:', exports.join(', ') + '\n');
  } else {
    console.log('   ✗ database.js is missing required exports\n');
    hasErrors = true;
  }
} catch (error) {
  console.log('   ✗ database.js has errors:', error.message + '\n');
  hasErrors = true;
}

// Test 3: Check route files
console.log('3. Checking route files...');
const routes = ['auth.js', 'schoolInfo.js', 'topStudents.js'];
let routeErrors = 0;

routes.forEach(route => {
  try {
    require(`./routes/${route}`);
    console.log(`   ✓ routes/${route}`);
  } catch (error) {
    console.log(`   ✗ routes/${route}:`, error.message);
    routeErrors++;
    hasErrors = true;
  }
});
if (routeErrors === 0) {
  console.log('   ✓ All route files valid\n');
} else {
  console.log(`   ✗ ${routeErrors} route file(s) have errors\n`);
}

// Test 4: Check server.js
console.log('4. Checking server.js...');
try {
  require('./server.js');
  console.log('   ✓ server.js is valid');
  console.log('   ✓ Express app configured\n');
} catch (error) {
  console.log('   ✗ server.js has errors:', error.message + '\n');
  hasErrors = true;
}

// Test 5: Check required files exist
console.log('5. Checking required files...');
const requiredFiles = [
  'package.json',
  '.env.example',
  'ecosystem.config.js',
  'nginx.conf'
];

let missingFiles = 0;
requiredFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    console.log(`   ✓ ${file} exists`);
  } else {
    console.log(`   ✗ ${file} is missing`);
    missingFiles++;
    hasErrors = true;
  }
});
if (missingFiles === 0) {
  console.log('   ✓ All required files present\n');
} else {
  console.log(`   ✗ ${missingFiles} file(s) missing\n`);
}

// Test 6: Check package.json dependencies
console.log('6. Checking package.json dependencies...');
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  const requiredDeps = ['mysql2', 'express', 'bcrypt', 'jsonwebtoken', 'cors', 'dotenv'];
  let missingDeps = 0;

  requiredDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      console.log(`   ✓ ${dep} in dependencies`);
    } else {
      console.log(`   ✗ ${dep} NOT in dependencies`);
      missingDeps++;
      hasErrors = true;
    }
  });

  if (missingDeps === 0) {
    console.log('   ✓ All required dependencies listed\n');
  } else {
    console.log(`   ✗ ${missingDeps} dependency(ies) missing\n`);
  }
} catch (error) {
  console.log('   ✗ Error reading package.json:', error.message + '\n');
  hasErrors = true;
}

// Test 7: Check deployment files
console.log('7. Checking deployment files...');
const deployFiles = [
  { name: 'ecosystem.config.js', desc: 'PM2 configuration' },
  { name: 'nginx.conf', desc: 'Nginx template' },
  { name: '../deploy-hostinger.sh', desc: 'Deployment script' },
  { name: '../HOSTINGER_DEPLOYMENT.md', desc: 'Deployment guide' }
];

let missingDeployFiles = 0;
deployFiles.forEach(({ name, desc }) => {
  if (fs.existsSync(path.join(__dirname, name))) {
    console.log(`   ✓ ${desc} (${name})`);
  } else {
    console.log(`   ✗ ${desc} is missing (${name})`);
    missingDeployFiles++;
    hasErrors = true;
  }
});
if (missingDeployFiles === 0) {
  console.log('   ✓ All deployment files present\n');
} else {
  console.log(`   ✗ ${missingDeployFiles} deployment file(s) missing\n`);
}

// Final result
console.log('═'.repeat(56));
if (hasErrors) {
  console.log('✗ VALIDATION FAILED - Please fix errors above');
  console.log('═'.repeat(56));
  process.exit(1);
} else {
  console.log('✓ VALIDATION PASSED - Ready for deployment!');
  console.log('═'.repeat(56));
  console.log('\nNext steps:');
  console.log('1. Update deploy-hostinger.sh with your VPS details');
  console.log('2. Run: ./deploy-hostinger.sh');
  console.log('3. Set up .env file on VPS');
  console.log('4. Configure MySQL database on Hostinger\n');
  process.exit(0);
}
