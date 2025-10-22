import { randomBytes } from 'crypto';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Generate a secure random string
function generateSecret(length = 64) {
  return randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
}

// Generate secrets
const secrets = {
  JWT_SECRET: generateSecret(64),
  SESSION_SECRET: generateSecret(64),
  SESSION_SECRET_REFRESH: generateSecret(64),
  CSRF_TOKEN: generateSecret(32),
  // Generate a random password for the database user
  PGPASSWORD: generateSecret(32)
};

// Create .env file content
let envContent = `# Auto-generated secrets - DO NOT COMMIT TO VERSION CONTROL
# This file was generated on ${new Date().toISOString()}

# Security Secrets
JWT_SECRET="${secrets.JWT_SECRET}"
SESSION_SECRET="${secrets.SESSION_SECRET}"
SESSION_SECRET_REFRESH="${secrets.SESSION_SECRET_REFRESH}"
CSRF_TOKEN="${secrets.CSRF_TOKEN}"

# Database Password
PGPASSWORD="${secrets.PGPASSWORD}"
`;

// Write to .env file in the server directory
const envPath = join(__dirname, '..', 'server', '.env');
writeFileSync(envPath, envContent, 'utf8');

console.log('✅ Generated new secrets in server/.env');
console.log('🔐 Please keep these values secure and do not commit them to version control!');
console.log('📝 Update your database user password to match PGPASSWORD if needed');
