# Managing Sessions and Registrations

This guide explains how to manage class sessions and registrations for the Shanghai Sanshi Shimasenkai website.

## Overview

The website uses two JSON files to store data:
- `/public/data/sessions.json` - Class schedule information
- `/public/data/registrations.json` - Student registrations

## For Teachers/Administrators

### Editing Sessions

1. **Navigate to the sessions file** on GitHub:
   - Go to your repository
   - Navigate to `public/data/sessions.json`
   - Click the pencil icon to edit

2. **Session Structure**:
```json
{
  "id": "session-2024-01-06",
  "date": "2024-01-06",
  "location": "酒友(sakatomo): 水城南路71号1F",
  "classes": [
    {
      "id": "class-2024-01-06-14:00",
      "date": "2024-01-06",
      "type": "intermediate",
      "startTime": "14:00",
      "duration": 50,
      "maxParticipants": 15,
      "instructor": "田中先生"
    }
  ]
}
```

3. **Class Types**:
   - `experience` - 素人体验 / 体験クラス / Experience Class
   - `beginner` - 初级课程 / ゆるりクラス / Beginner Class
   - `intermediate` - 中高级课程 / 民謡/早弾きクラス / Intermediate/Advanced

4. **Important Fields**:
   - `id` - Must be unique (use format: `class-YYYY-MM-DD-HH:MM`)
   - `date` - Format: YYYY-MM-DD
   - `startTime` - Format: HH:MM (24-hour)
   - `maxParticipants` - Maximum number of students

### Adding New Sessions

Copy an existing session block and modify:
```json
{
  "id": "session-2024-02-03",
  "date": "2024-02-03",
  "location": "酒友(sakatomo): 水城南路71号1F",
  "classes": [...]
}
```

### Managing Registrations

1. **When a student registers**, they will receive registration information
2. **Add to registrations.json**:
```json
{
  "id": "reg-2024-01-15-001",
  "sessionId": "class-2024-01-20-14:00",
  "name": "Student Name",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

3. **Important**:
   - `sessionId` must match the class `id` exactly
   - Use ISO format for timestamp
   - Keep registrations in chronological order

### Removing Old Sessions

To keep the file clean:
1. Remove sessions older than 1 month
2. Archive registration data if needed
3. Always keep at least 2 upcoming sessions

### Tips

- **Test locally** before committing
- **Use JSON validator** to check syntax
- **Commit message** should describe changes (e.g., "Add February sessions")
- **Regular updates** - Add new sessions at least 2 weeks in advance

## For Students

### How to Register

1. Click "Register" on your desired class
2. Enter your name
3. Submit the form
4. You'll receive registration details to send to the organizer
5. The organizer will confirm your registration within 24 hours

### Checking Registration Status

- Refresh the page to see updated registration lists
- Your name will appear once the organizer processes your registration

## Automation (Future Enhancement)

We can later add:
- GitHub Actions for automatic registration processing
- Email notifications
- Registration forms that create GitHub issues
- Automated data validation

## Need Help?

Contact the technical administrator or create an issue in the GitHub repository.
