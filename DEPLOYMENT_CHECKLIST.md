# 🚀 Deployment Checklist for GitHub Pages

## Step 1: Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

## Step 2: Test the Build Locally (Optional)

```bash
npm run preview
```

Visit http://localhost:4173 to test the production build.

## Step 3: Commit Your Changes

```bash
# Add all changes
git add .

# Commit with a descriptive message
git commit -m "Add real-time registration system with JSONBin.io integration"

# Push to main branch
git push origin main
```

## Step 4: Deploy to GitHub Pages

Since you already have GitHub Pages set up:

```bash
# Deploy the dist folder to gh-pages branch
npm run deploy
```

This command builds and deploys in one step!

## Step 5: Wait for Deployment

- GitHub Pages takes 2-5 minutes to update
- Check deployment status at: https://github.com/YOUR-USERNAME/shanghai-sanshin-shimasenkai/actions

## Step 6: Test Live Site

Visit your live site and test:
1. ✅ Registration works
2. ✅ Teacher admin login works
3. ✅ Data persists between visits
4. ✅ Multiple users see same data

## Important Notes

### About the Demo JSONBin Account

Currently using a demo account I created. It will work but for production you should:

1. **Create your own JSONBin account** at https://jsonbin.io
2. **Create two bins:**
   - One for sessions
   - One for registrations
3. **Get your API key** from JSONBin dashboard

### Setting Up Your Own JSONBin (Recommended)

1. Create `.env` file in project root:
```
VITE_JSONBIN_API_KEY=your-api-key
VITE_SESSIONS_BIN_ID=your-sessions-bin-id
VITE_REGISTRATIONS_BIN_ID=your-registrations-bin-id
```

2. Add `.env` to `.gitignore` (if not already there)

3. For GitHub Pages, add secrets:
   - Go to repo Settings → Secrets → Actions
   - Add the same environment variables

### First Time Setup

When you first deploy:
1. Visit the sessions page
2. Click "Teacher Admin Access"
3. Set your admin password
4. Create your real sessions
5. Delete the demo session

## Troubleshooting

**Site not updating?**
- Clear browser cache
- Check GitHub Actions for errors
- Wait a few more minutes

**Registration not working?**
- Check browser console for errors
- Verify JSONBin is accessible
- Try in incognito mode

**Want to reset everything?**
- Clear your JSONBin data
- Or create new bins

## Success! 🎉

Your registration system is now live with:
- Real-time shared data
- Teacher admin panel
- Automatic 3-month cleanup
- Works in China
- Free hosting on GitHub Pages
