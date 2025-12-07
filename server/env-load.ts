import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ESM __dirname shim
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file FIRST before any other imports
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('✅ Environment variables loaded');
