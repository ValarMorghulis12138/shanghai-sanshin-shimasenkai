# GitHub Actions Auto-Deployment Setup

This guide explains how to set up automatic deployment to GitHub Pages whenever code is pushed to the main branch.

## Prerequisites

1. GitHub Pages must be enabled for your repository
2. You need admin access to the repository to add secrets

## Setup Steps

### 1. Add GitHub Secrets

Go to your repository on GitHub, then navigate to:
**Settings → Secrets and variables → Actions → New repository secret**

Add the following secrets (copy the values from your `.env.production` file):

**Required (Shanghai Branch):**
- `VITE_JSONBIN_API_KEY` - Your production JSONBin API key
- `VITE_SESSIONS_BIN_ID` - Shanghai sessions bin ID
- `VITE_REGISTRATIONS_BIN_ID` - Shanghai registrations bin ID
- `VITE_ADMIN_CONFIG_BIN_ID` - Shanghai admin config bin ID

**Optional (Beijing Branch - add when ready):**
- `VITE_BEIJING_SESSIONS_BIN_ID` - Beijing sessions bin ID
- `VITE_BEIJING_REGISTRATIONS_BIN_ID` - Beijing registrations bin ID
- `VITE_BEIJING_ADMIN_CONFIG_BIN_ID` - Beijing admin config bin ID

**Important**: Enter the values WITHOUT quotes, even if they have special characters.

### 2. Configure GitHub Pages Source

In your repository settings:
1. Go to **Settings → Pages**
2. Under "Build and deployment", set:
   - Source: **Deploy from a branch**
   - Branch: **gh-pages** (this will be created automatically)
   - Folder: **/ (root)**

### 3. Commit the Workflow File

The `.github/workflows/deploy.yml` file is already created. Once you push it to the main branch, the workflow will be active.

## Adding Beijing Branch Support

When you're ready to enable the Beijing branch:
1. Create the JSONBin bins for Beijing
2. Add the Beijing secrets to GitHub (see optional secrets above)
3. Uncomment the Beijing environment variables in `.github/workflows/deploy.yml` (lines 46-48)
4. Commit and push the changes

## How It Works

1. **Automatic Trigger**: Whenever anyone pushes to the main branch (including web edits), the workflow runs
2. **Manual Trigger**: You can also manually trigger deployment from the Actions tab
3. **Build Process**: The workflow:
   - Checks out the code
   - Installs dependencies
   - Creates `.env.production` from GitHub secrets
   - Builds the project
   - Deploys to the `gh-pages` branch

## Testing the Workflow

1. Make a small change to any file
2. Commit and push to main branch
3. Go to the **Actions** tab in your repository
4. Watch the "Deploy to GitHub Pages" workflow run
5. Once complete, your site will be updated at `https://[username].github.io/[repository-name]/`

## Troubleshooting

### If the workflow fails:

1. Check the Actions tab for error messages
2. Verify all secrets are correctly added
3. Ensure the secret values don't have extra quotes or spaces
4. Check that Node.js version in the workflow matches your local version

### If the site doesn't update:

1. Check that GitHub Pages is enabled and pointing to the `gh-pages` branch
2. Clear your browser cache or try incognito mode
3. It may take a few minutes for changes to propagate

## Benefits

- ✅ No need to run `npm run deploy` locally
- ✅ Collaborators can update content through GitHub web interface
- ✅ Automatic deployment on every commit to main
- ✅ Consistent build environment
- ✅ Build logs available in Actions tab
