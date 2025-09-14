# Registration System Backend Options for China

## Overview
Since Firebase/Google services are blocked in mainland China, we need alternative solutions for implementing the class registration system.

## Option 1: LeanCloud (推荐 for China)
**Pros:**
- Chinese company, no firewall issues
- Free tier: 30,000 API requests/day
- Built-in user management
- Real-time data sync
- Good documentation in Chinese

**Cons:**
- Requires Chinese phone number for registration
- Documentation primarily in Chinese

**Implementation:**
```javascript
// Example LeanCloud setup
import AV from 'leancloud-storage';

AV.init({
  appId: 'your-app-id',
  appKey: 'your-app-key',
  serverURL: 'https://your-custom-api.leanapp.cn'
});
```

## Option 2: Supabase (Open Source Alternative)
**Pros:**
- Open source Firebase alternative
- Can be self-hosted if needed
- Good free tier
- Built-in auth and real-time features
- Works in China (but slower than local services)

**Cons:**
- Hosted version might be slower in China
- Self-hosting requires technical knowledge

## Option 3: Minimal Backend with Vercel/Netlify Functions
**Pros:**
- You control everything
- Can use any database (MongoDB Atlas, PostgreSQL, etc.)
- Serverless, pay only for usage
- Can implement exactly what you need

**Cons:**
- More work to implement
- Need to handle auth yourself

**Example Structure:**
```
/api
  - register.js (handles registration)
  - get-registrations.js (fetches registration data)
  - auth.js (teacher authentication)
```

## Option 4: GitHub as a Backend (Creative Solution)
**Pros:**
- Completely free
- No additional services needed
- Works everywhere GitHub works

**Cons:**
- Not real-time (requires page refresh)
- Limited by GitHub API rate limits
- Users need GitHub accounts

**How it works:**
- Use GitHub Issues API to store registrations
- Each registration creates a comment on a dedicated issue
- Can use GitHub Actions for automation

## Option 5: Third-party Form Services + Display
**Services like:**
- Formspree (works in China)
- Getform
- Basin

**Pros:**
- Easy to implement
- No backend code needed

**Cons:**
- Can't display registration data publicly
- Only suitable for collecting data, not displaying

## Recommendation for Your Use Case

Given your requirements:
1. Users need to register for classes ✓
2. Others need to see who registered ✓
3. Teachers need to edit calendar (future) ✓
4. Must work in mainland China ✓
5. Preferably free/low-cost ✓

**I recommend: LeanCloud or Minimal Backend on Vercel**

### Why LeanCloud?
- Designed for Chinese market
- Free tier is generous
- Handles all your requirements
- Has built-in user authentication

### Why Vercel Functions?
- More control over implementation
- Can start simple and expand
- Works globally including China
- Can use simple JSON storage initially

## Implementation Plan

### Phase 1: Basic Registration (No Auth)
1. Users can register with just their name
2. Display registered names publicly
3. Store in chosen backend

### Phase 2: Teacher Authentication
1. Add simple password protection for teachers
2. Teachers can create/edit sessions
3. Use JWT tokens or session-based auth

### Phase 3: Enhanced Features
1. Email notifications
2. Registration limits
3. Waiting lists
4. Calendar management UI

## Decision Questions

1. **Do you have a preference for Chinese services vs international?**
2. **Are you comfortable with some backend coding?**
3. **Do you need email notifications?**
4. **What's your budget (if any)?**
5. **Do teachers need individual accounts or shared access?**

Based on your answers, I can provide specific implementation code for your chosen solution.
