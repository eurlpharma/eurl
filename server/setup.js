#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

console.log('🚀 Welcome to Healthy Store Setup!');
console.log('This script will help you set up your environment variables.\n');

async function setup() {
  try {
    // Check if .env already exists
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
      const overwrite = await question('⚠️  .env file already exists. Do you want to overwrite it? (y/N): ');
      if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
        console.log('❌ Setup cancelled.');
        rl.close();
        return;
      }
    }

    console.log('\n📋 Please provide the following information:\n');

    // Database configuration
    const dbHost = await question('Database host (default: localhost): ') || 'localhost';
    const dbPort = await question('Database port (default: 3306): ') || '3306';
    const dbUser = await question('Database username (default: root): ') || 'root';
    const dbPassword = await question('Database password: ');
    const dbName = await question('Database name (default: healthy_db): ') || 'healthy_db';

    // JWT configuration
    const jwtSecret = await question('JWT secret (default: your_jwt_secret_here_change_this_in_production): ') || 'your_jwt_secret_here_change_this_in_production';
    const jwtExpire = await question('JWT expire time (default: 30d): ') || '30d';

    // Server configuration
    const port = await question('Server port (default: 5000): ') || '5000';
    const apiUrl = await question('API URL (default: http://localhost:5000): ') || 'http://localhost:5000';

    // Email configuration (optional)
    const emailHost = await question('Email host (optional, default: smtp.gmail.com): ') || 'smtp.gmail.com';
    const emailPort = await question('Email port (optional, default: 587): ') || '587';
    const emailUser = await question('Email username (optional): ') || 'your_email@gmail.com';
    const emailPass = await question('Email password (optional): ') || 'your_email_password';

    // Create .env content
    const envContent = `# Server Configuration
NODE_ENV=development
PORT=${port}

# Database Configuration (PostgreSQL)
DATABASE_URL="postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}"

# JWT Configuration
JWT_SECRET=${jwtSecret}
JWT_EXPIRE=${jwtExpire}

# Email Configuration (Optional)
EMAIL_HOST=${emailHost}
EMAIL_PORT=${emailPort}
EMAIL_USER=${emailUser}
EMAIL_PASS=${emailPass}

# API Configuration
API_URL=${apiUrl}

# File Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
`;

    // Write .env file
    fs.writeFileSync(envPath, envContent);

    console.log('\n✅ Environment variables have been set up successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Make sure MySQL is running');
    console.log('2. Create the database if it doesn\'t exist:');
    console.log(`   CREATE DATABASE ${dbName};`);
    console.log('3. Run the following commands:');
    console.log('   npm run db:generate');
    console.log('   npm run db:push');
    console.log('   npm run db:seed');
    console.log('   npm run dev');
    console.log('\n🎉 Your Healthy Store backend is ready to go!');

  } catch (error) {
    console.error('❌ Error during setup:', error.message);
  } finally {
    rl.close();
  }
}

setup(); 