#!/usr/bin/env node
/**
 * Create three JSONBin.io bins for Tokyo (sessions, registrations, admin config),
 * matching the app's expectations for Shanghai-style city storage.
 *
 * Prerequisites:
 *   - JSONBin Master API Key (same as VITE_JSONBIN_API_KEY)
 * Optional env:
 *   - TOKYO_ADMIN_INITIAL_PASSWORD — first teacher password stored in Tokyo admin bin (default: changeme)
 *
 * Usage:
 *   VITE_JSONBIN_API_KEY=your_key node scripts/create-tokyo-jsonbins.mjs
 *
 * Or merge .env.local + .env.development + .env (VITE_JSONBIN_API_KEY or BASE64 variant):
 *   node scripts/create-tokyo-jsonbins.mjs
 *
 * Or read credentials from ONE file only (recommended for prod; avoids picking up dev .env.local):
 *   node scripts/create-tokyo-jsonbins.mjs --use-env-file .env.production
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const JSONBIN_CREATE = 'https://api.jsonbin.io/v3/b';

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const text = fs.readFileSync(filePath, 'utf8');
  const out = {};
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

function parseArgs() {
  const argv = process.argv.slice(2);
  let envFileExclusive = null;
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--use-env-file' && argv[i + 1]) {
      envFileExclusive = argv[i + 1];
      i += 1;
    }
  }
  return { envFileExclusive };
}

/** @param {{ envFileExclusive?: string | null }} opts */
function loadApiKey(opts = {}) {
  const fromProcess = process.env.VITE_JSONBIN_API_KEY || process.env.JSONBIN_API_KEY;
  if (fromProcess) return fromProcess.replace(/^["']|["']$/g, '');

  if (opts.envFileExclusive) {
    const full = path.isAbsolute(opts.envFileExclusive)
      ? opts.envFileExclusive
      : path.join(root, opts.envFileExclusive);
    if (!fs.existsSync(full)) {
      console.error(`Env file not found: ${full}`);
      return '';
    }
    const fileEnv = parseEnvFile(full);

    const b64 = fileEnv.VITE_JSONBIN_API_KEY_BASE64;
    if (b64) {
      try {
        return Buffer.from(String(b64).trim(), 'base64').toString('utf8');
      } catch {
        /* ignore */
      }
    }
    const plain = fileEnv.VITE_JSONBIN_API_KEY || fileEnv.JSONBIN_API_KEY || '';
    return plain.replace(/^["']|["']$/g, '');
  }

  const mergedLocal = {};
  for (const name of ['.env.local', '.env.development', '.env']) {
    Object.assign(mergedLocal, parseEnvFile(path.join(root, name)));
  }

  const b64 =
    mergedLocal.VITE_JSONBIN_API_KEY_BASE64 || process.env.VITE_JSONBIN_API_KEY_BASE64;
  if (b64) {
    try {
      return Buffer.from(String(b64).trim(), 'base64').toString('utf8');
    } catch {
      /* ignore */
    }
  }

  const k = mergedLocal.VITE_JSONBIN_API_KEY || mergedLocal.JSONBIN_API_KEY || '';
  return k.replace(/^["']|["']$/g, '');
}

function btoaNode(str) {
  return Buffer.from(str, 'utf8').toString('base64');
}

async function createBin(apiKey, body, binName) {
  const res = await fetch(JSONBIN_CREATE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': apiKey,
      'X-Bin-Name': binName,
      'X-Bin-Private': 'true',
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`Create bin "${binName}" failed: ${res.status} ${text}`);
  }

  if (!res.ok) {
    throw new Error(data?.message || `Create bin "${binName}" failed: ${res.status} ${text}`);
  }

  const id = data?.metadata?.id;
  if (!id) {
    throw new Error(`No bin id in response for "${binName}": ${text}`);
  }
  return id;
}

async function main() {
  const { envFileExclusive } = parseArgs();
  if (envFileExclusive) {
    console.log(`Using (--use-env-file) ${envFileExclusive}\n`);
  }

  const apiKey = loadApiKey({ envFileExclusive });

  if (!apiKey) {
    console.error(
      'Missing API key. Export VITE_JSONBIN_API_KEY, or run:\n  node scripts/create-tokyo-jsonbins.mjs --use-env-file .env.production\n'
    );
    process.exit(1);
  }

  const initialPassword = process.env.TOKYO_ADMIN_INITIAL_PASSWORD || 'changeme';
  const adminBody = {
    passwordHash: btoaNode(initialPassword),
    lastUpdated: new Date().toISOString(),
  };

  const isProdTarget =
    envFileExclusive &&
    (envFileExclusive.includes('.env.production') || /(^|\/)\.env\.production$/.test(envFileExclusive));
  const nameTag = isProdTarget ? '-prod' : '';

  // JSONBin rejects []; placeholders are stripped client-side (jsonBinService)
  const sessionsSeed = [
    {
      id: 'placeholder',
      date: '2020-01-01',
      classes: [],
      location: 'Placeholder',
    },
  ];
  const registrationsSeed = [
    {
      id: 'placeholder',
      sessionId: 'placeholder',
      name: 'Placeholder',
      email: 'placeholder@example.com',
      timestamp: 946684800000,
    },
  ];

  console.log('Creating Tokyo bins on JSONBin.io ...\n');

  const sessionsId = await createBin(apiKey, sessionsSeed, `sanshi-tokyo-sessions${nameTag}`);
  console.log('Sessions bin:', sessionsId);

  const registrationsId = await createBin(apiKey, registrationsSeed, `sanshi-tokyo-registrations${nameTag}`);
  console.log('Registrations bin:', registrationsId);

  const adminId = await createBin(apiKey, adminBody, `sanshi-tokyo-admin${nameTag}`);
  console.log('Admin config bin:', adminId);

  console.log('\n--- Add these to .env.development / .env.local OR .env.production / GH secrets ---\n');
  console.log(`VITE_TOKYO_SESSIONS_BIN_ID=${sessionsId}`);
  console.log(`VITE_TOKYO_REGISTRATIONS_BIN_ID=${registrationsId}`);
  console.log(`VITE_TOKYO_ADMIN_CONFIG_BIN_ID=${adminId}`);
  console.log('\nTokyo teacher login initial password:', initialPassword);
  console.log('(Change from the Tokyo admin panel after first login on production build.)\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
