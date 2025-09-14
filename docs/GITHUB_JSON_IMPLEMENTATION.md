# GitHub JSON-Based Implementation (No Backend)

## How It Works

1. **Calendar/Session Data**: Stored in `/public/data/sessions.json`
2. **Registration Data**: Stored in `/public/data/registrations.json`
3. **Updates**: Via GitHub web interface or local commits
4. **Reading**: Your React app fetches these JSON files

## Data Structure

### `/public/data/sessions.json`
```json
{
  "sessions": [
    {
      "id": "2024-01-06",
      "date": "2024-01-06",
      "location": "酒友(sakatomo): 水城南路71号1F",
      "classes": [
        {
          "id": "2024-01-06-intermediate",
          "type": "intermediate",
          "startTime": "14:00",
          "duration": 50,
          "maxParticipants": 15,
          "instructor": "田中先生"
        },
        {
          "id": "2024-01-06-experience",
          "type": "experience",
          "startTime": "15:00",
          "duration": 50,
          "maxParticipants": 20,
          "instructor": "田中先生"
        },
        {
          "id": "2024-01-06-beginner",
          "type": "beginner",
          "startTime": "16:00",
          "duration": 50,
          "maxParticipants": 15,
          "instructor": "田中先生"
        }
      ]
    }
  ]
}
```

### `/public/data/registrations.json`
```json
{
  "registrations": [
    {
      "id": "reg-001",
      "sessionId": "2024-01-06-intermediate",
      "name": "张三",
      "timestamp": "2024-01-01T10:30:00Z"
    },
    {
      "id": "reg-002",
      "sessionId": "2024-01-06-intermediate",
      "name": "李四",
      "timestamp": "2024-01-01T11:00:00Z"
    }
  ]
}
```

## Implementation Steps

### 1. Create Initial JSON Files
- Calendar data with upcoming sessions
- Empty registrations file

### 2. Update React App to Read JSON
- Fetch data from public JSON files
- Display registrations in real-time
- Merge registration data with session data

### 3. Registration Process (Phase 1 - Manual)
- User fills form → Sends email/form
- Admin manually updates JSON file
- Commit & push → GitHub Pages auto-deploys

### 4. Registration Process (Phase 2 - Semi-Automated)
- Use GitHub Issues as registration requests
- GitHub Actions to auto-update JSON
- Or use Web3Forms → GitHub webhook

### 5. Teacher Updates
- Teachers edit JSON directly in GitHub
- Use GitHub's web editor (no coding needed)
- Changes deploy automatically

## Pros & Cons

### Pros ✅
- **100% Free** - No external services
- **Works everywhere** - Including China
- **Simple** - Just JSON files
- **Version controlled** - Full history of changes
- **Immediate** - Can implement right now

### Cons ❌
- **Manual updates** - Someone needs to update JSON
- **No real-time** - Users must refresh
- **No validation** - Can't prevent overbooking automatically
- **Public data** - All registrations visible in repo

## Future Enhancements

1. **GitHub Forms** - Use GitHub Issues as forms
2. **Automation** - GitHub Actions for updates
3. **Validation** - Client-side checking
4. **Notifications** - Email via GitHub Actions

## Is This Right For You?

Perfect if:
- Small community (< 100 active users)
- Trust between members
- OK with manual updates initially
- Want to start immediately

Not ideal if:
- Need instant registration
- Require payment processing
- Need private user data
- Expect high volume

Ready to implement this approach?
