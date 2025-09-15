/**
 * JSONBin.io Configuration
 * 
 * For production deployment, create a separate config file that's not committed to git:
 * 1. Copy this file to src/config/jsonbin.config.prod.ts
 * 2. Add your actual credentials there
 * 3. Add jsonbin.config.prod.ts to .gitignore
 * 4. Import from jsonbin.config.prod.ts in production builds
 */

export const JSONBIN_CONFIG = {
  // Demo/Development configuration
  // These are public demo bins for testing
  SESSIONS_BIN_ID: '68c66d1043b1c97be9426885',
  REGISTRATIONS_BIN_ID: '68c66d1ed0ea881f407d55e3',
  API_KEY: '$2a$10$ZNhbsC7HtDBBM2bkdV.EZ.C8NDvJvl8IJPE7WgUzb1cFDYNgSaJ3S',
  ADMIN_CONFIG_BIN_ID: '68c66d2743b1c97be94268a1'
};

// For GitHub Pages deployment, you can:
// 1. Use these demo credentials (data is public)
// 2. Or create your own JSONBin account and replace these values
// 3. Or implement a build script that injects credentials during deployment
