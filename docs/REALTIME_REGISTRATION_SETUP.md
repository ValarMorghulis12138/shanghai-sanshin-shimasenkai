# Real-time Registration System Setup

## Overview

The system now supports real-time registration with teacher admin capabilities. Students can register directly and see results immediately, while teachers can manage sessions through a UI with password protection.

## How It Works

1. **Data Storage**: Uses localStorage by default (works immediately)
2. **Registration**: Students register directly, data saves automatically
3. **Admin Access**: Teachers login with password to manage sessions
4. **Real-time Updates**: All changes appear immediately

## Default Setup (localStorage)

The system works out of the box using browser localStorage:
- ✅ No configuration needed
- ✅ Works offline
- ✅ Perfect for testing
- ⚠️ Data is browser-specific (not synced between devices)

## Teacher Admin Access

### First Time Setup
1. Click "Teacher Admin Access" button
2. Enter any password you want (this becomes the admin password)
3. The password is saved locally

### Managing Sessions
- Add new sessions with date and class details
- Edit existing sessions
- Delete old sessions
- View all registrations

### Default Demo Session
The system creates one demo session automatically on first load (January 18, 2025).

## Optional: Cloud Storage with JSONBin

For data that syncs across devices:

### 1. Create JSONBin Account
- Go to https://jsonbin.io
- Sign up (free)
- Get your API key

### 2. Create Two Bins
- One for sessions
- One for registrations
- Set both to public read

### 3. Configure Your App
Create `.env.local` file:
```
VITE_JSONBIN_API_KEY=your-api-key
VITE_SESSIONS_BIN_ID=your-sessions-bin-id
VITE_REGISTRATIONS_BIN_ID=your-registrations-bin-id
```

### 4. Initialize Bins
Upload initial data to each bin:

Sessions bin:
```json
[]
```

Registrations bin:
```json
[]
```

## Features

### For Students
- Click "Register" on any class
- Enter name
- Submit - registration saves immediately
- See who else has registered

### For Teachers
- Password-protected admin panel
- Create/edit/delete sessions
- Set class times and capacities
- View all registrations

### Security
- Teacher password is hashed (basic protection)
- Students can only add registrations
- Only teachers can modify sessions

## Limitations

### With localStorage (Default)
- Data doesn't sync between browsers/devices
- Data clears if browser storage is cleared
- Maximum ~5MB storage

### With JSONBin (Optional)
- 10,000 API requests/month (free tier)
- Requires internet connection
- Small delay for updates

## Next Steps

1. **Test Locally**: Everything works immediately
2. **Set Admin Password**: First login sets the password
3. **Add Real Sessions**: Delete demo, add your schedule
4. **Optional Cloud**: Set up JSONBin for multi-device access

## Troubleshooting

**Registration not showing?**
- Refresh the page
- Check browser console for errors

**Can't login as teacher?**
- Clear localStorage to reset password
- Try a different browser

**Want to reset everything?**
- Open browser console
- Run: `localStorage.clear()`
- Refresh page
