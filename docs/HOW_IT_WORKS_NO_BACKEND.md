# How the Registration System Works Without a Backend

## The Magic: Browser localStorage

### What is localStorage?
- **Built-in browser storage** that persists data even after closing the browser
- Works like a simple key-value database in the user's browser
- Each domain gets ~5-10MB of storage space
- Data stays until explicitly cleared

### How Our System Uses It

```javascript
// When a student registers:
localStorage.setItem('sanshi_registrations', JSON.stringify([
  { id: 'reg-001', name: 'Student Name', sessionId: 'class-123' }
]));

// When loading the page:
const registrations = JSON.parse(localStorage.getItem('sanshi_registrations') || '[]');
```

## What Works on GitHub Pages ✅

1. **Everything runs in the browser**
   - React app loads and runs
   - UI interactions work perfectly
   - Password protection works

2. **Data persists locally**
   - Registrations save in each user's browser
   - Teacher password saves locally
   - Sessions data saves locally

## Critical Limitation on GitHub Pages ⚠️

**Data is NOT shared between users!**

Here's what happens:

```
Teacher's Browser          Student A's Browser       Student B's Browser
├── Sessions: [...]        ├── Sessions: []          ├── Sessions: []
├── Registrations: []      ├── Registrations: []     ├── Registrations: []
└── Password: "abc123"     └── Password: (none)      └── Password: (none)
```

Each browser has its own isolated data storage!

## The Problem Illustrated

1. **Teacher creates a session** → Only visible in teacher's browser
2. **Student A visits site** → Sees no sessions (empty localStorage)
3. **Student A registers** → Registration only in their browser
4. **Teacher checks registrations** → Sees none (different browser)

## Solutions for GitHub Pages

### Option 1: Manual Data Sharing (Current Approach)
```
Teacher → Export JSON → Share file → Students import
Students → Register → Export registrations → Send to teacher
```

### Option 2: Use a Free Database Service
Services that work with GitHub Pages:
- **JSONBin.io** - 10,000 requests/month free
- **Supabase** - Generous free tier
- **Airtable** - 1,200 records free

### Option 3: GitHub as Database
Use GitHub API to store data in the repository itself:
- Sessions in a JSON file
- Registrations as GitHub issues/comments
- Requires GitHub token

## Current Implementation Explained

```typescript
// In storageService.ts
const USE_LOCAL_STORAGE = !API_KEY || API_KEY === 'YOUR_API_KEY';

if (USE_LOCAL_STORAGE) {
  // Uses browser localStorage (no sharing between users)
  localStorage.setItem('sanshi_sessions', JSON.stringify(sessions));
} else {
  // Uses JSONBin.io API (data shared between all users)
  fetch('https://api.jsonbin.io/v3/b/YOUR_BIN_ID', {
    method: 'PUT',
    body: JSON.stringify(sessions)
  });
}
```

## Making It Work for Real Use

### Quick Fix: Add JSONBin.io (Free, Works in China)

1. **Sign up at jsonbin.io**
2. **Create two bins** (sessions, registrations)
3. **Add to your project**:

```javascript
// .env.local (don't commit this)
VITE_JSONBIN_API_KEY=your-secret-key
VITE_SESSIONS_BIN_ID=your-sessions-bin-id
VITE_REGISTRATIONS_BIN_ID=your-registrations-bin-id
```

4. **Deploy to GitHub Pages**
5. **Now all users share the same data!**

### Alternative: Manual Workflow

1. **Teacher Mode**:
   - Teacher manages sessions locally
   - Exports sessions.json
   - Commits to GitHub repo
   - GitHub Pages serves the file

2. **Student Mode**:
   - Students see sessions from the JSON file
   - Register via form
   - Form sends email/webhook to teacher

## Summary

**Currently with localStorage only:**
- ✅ Perfect for demo/testing
- ✅ Works offline
- ✅ No external dependencies
- ❌ No data sharing between users
- ❌ Each browser is isolated

**With JSONBin.io or similar:**
- ✅ Real-time data sharing
- ✅ Works on GitHub Pages
- ✅ Free tier sufficient
- ✅ Works in China
- ❌ Requires internet connection
- ❌ API key management

## Recommendation

For production use on GitHub Pages, you NEED one of:
1. External database service (JSONBin.io recommended)
2. GitHub repository as database
3. Manual update workflow

The current localStorage-only approach is perfect for:
- Development
- Demo/preview
- Single-user scenarios
- Understanding the system

But won't work for multiple users to share data without additional setup.
