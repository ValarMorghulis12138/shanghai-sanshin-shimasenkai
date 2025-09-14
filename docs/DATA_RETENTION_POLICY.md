# Data Retention Policy

## Automatic 3-Month Cleanup

The system automatically removes old data to keep things clean and efficient.

### What Gets Deleted

**Sessions older than 3 months:**
- Removed automatically when teachers update sessions
- Associated registrations are also deleted
- Helps keep the interface clean and relevant

### How It Works

```javascript
// Only when teachers update sessions:
1. Teacher adds/edits/deletes a session
2. System automatically checks all session dates
3. Removes any session older than 3 months
4. Cleans up orphaned registrations
5. Saves the cleaned data

// Regular users (students):
- Just see the current data
- No cleanup triggered
- Minimal API requests
```

### Example Timeline

```
Today: January 15, 2025

Kept:     ✅ December 2024 sessions
          ✅ November 2024 sessions  
          ✅ October 2024 sessions
          ✅ January 2025 sessions

Deleted:  ❌ September 2024 and earlier
```

### Benefits

1. **Cleaner Interface** - Only shows relevant upcoming/recent sessions
2. **Faster Loading** - Less data to transfer
3. **Storage Efficiency** - Stays within free tier limits
4. **Privacy** - Old registration data automatically removed

### Manual Cleanup

Teachers can also manually delete specific sessions through the admin panel if needed before the 3-month period.

### Backup Recommendations

If you need to keep historical records:
1. Export data monthly before it's auto-deleted
2. Save to your own records
3. Or adjust the retention period in the code

### Changing Retention Period

To change from 3 months to a different period, modify in `jsonBinService.ts`:

```javascript
// Change this line:
threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

// To keep 6 months:
threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 6);

// To keep 1 month:
threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 1);
```

### Notes

- Cleanup runs only when teachers modify sessions
- Students never trigger cleanup (saves API requests)
- Past sessions are removed, not future ones
- System always keeps at least the current month's data
- Zero overhead for regular users
