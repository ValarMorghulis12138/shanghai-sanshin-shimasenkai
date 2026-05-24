# Tokyo branch — JSONBin setup

Tokyo uses **three dedicated bins**, same structural pattern as Shanghai:

| Bin | Env variable | Content |
| --- | --- | --- |
| Sessions | `VITE_TOKYO_SESSIONS_BIN_ID` | `SessionDay[]` (array JSON) |
| Registrations | `VITE_TOKYO_REGISTRATIONS_BIN_ID` | `Registration[]` |
| Teacher admin password | `VITE_TOKYO_ADMIN_CONFIG_BIN_ID` | `{ passwordHash, lastUpdated }` (Base64 hash, same semantics as Shanghai) |

## Creating bins locally

Requires a JSONBin master key (**same credential family** as Shanghai: `VITE_JSONBIN_API_KEY` or Base64-encoded `VITE_JSONBIN_API_KEY_BASE64` in `.env.local`).

```bash
# Development (uses merged .env.local + .env.development)
npm run create-tokyo-bins

# Production master key from .env.production only (recommended)
npm run create-tokyo-bins-prod
# same as:
node scripts/create-tokyo-jsonbins.mjs --use-env-file .env.production
```

Optional: set initial teacher password before running (default is `changeme`):

```bash
TOKYO_ADMIN_INITIAL_PASSWORD='your-strong-password' npm run create-tokyo-bins
```

The script prints three `VITE_TOKYO_*` lines—add them to `.env.development` and `.env.local` (they are ignored by Git).

**Important:** bins are tied to whatever account the **master key** belongs to when you run the script. If your **production** build uses **another JSONBin master key**, run the same command again **with that key exported** (`VITE_JSONBIN_API_KEY=...`) so production gets Tokyo bins owned by that key, then add the printed IDs to `.env.production` or GitHub Actions secrets (`TOKYO_SESSIONS_BIN_ID`, etc.)—do **not** mix production keys with bins created under dev keys.

## GitHub Actions

Add repository secrets mirroring Shanghai/Beijing (see `docs/GITHUB_ACTIONS_SETUP.md`):

- `TOKYO_SESSIONS_BIN_ID`
- `TOKYO_REGISTRATIONS_BIN_ID`
- `TOKYO_ADMIN_CONFIG_BIN_ID`

`deploy.yml` injects these as `VITE_TOKYO_*`. If you kept old env names only, legacy `VITE_FUZHOU_*` values are still read at runtime when `VITE_TOKYO_*` is unset.

## Seeds

Sessions and registrations bins are seeded with **`placeholder`** entries that the app ignores (same idea as Shanghai when saving an empty array). Replacing placeholder sessions happens automatically when admins add courses.
