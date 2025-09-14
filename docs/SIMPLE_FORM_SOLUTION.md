# Simplest Solution: Web3Forms + Public Google Sheets

## Overview

This is the simplest solution that requires NO backend coding and works in China.

## How It Works

1. **Web3Forms** (or Formspree) - Collects registrations
2. **Google Sheets** - Stores data (with public read access)
3. **Your Site** - Reads and displays data from Google Sheets

## Setup Steps

### 1. Create Google Sheet

1. Create a new Google Sheet
2. Set up columns: Name, SessionID, Timestamp
3. Make it publicly readable: Share → Anyone with link can view
4. Publish to web: File → Share → Publish to web

### 2. Set up Web3Forms

1. Go to https://web3forms.com (free, works in China)
2. Create a form with your email
3. Get your access key
4. Configure to send data to Google Sheets via Zapier/IFTTT

### 3. Frontend Implementation

```typescript
// src/services/simpleRegistration.ts

// Submit registration
export async function submitRegistration(
  sessionId: string,
  name: string,
  email?: string
) {
  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      access_key: 'YOUR-ACCESS-KEY',
      subject: `New Registration: ${name}`,
      name: name,
      session_id: sessionId,
      timestamp: new Date().toISOString()
    }),
  });

  return response.json();
}

// Read registrations from public Google Sheet
export async function getRegistrations() {
  // Google Sheets API v4 public endpoint
  const SHEET_ID = 'your-sheet-id';
  const API_KEY = 'your-api-key'; // For public sheets
  const RANGE = 'Sheet1!A:C';
  
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  // Transform data to your format
  return data.values.slice(1).map((row: any[]) => ({
    name: row[0],
    sessionId: row[1],
    timestamp: row[2]
  }));
}
```

### 4. Alternative: Use Tencent Docs (腾讯文档)

For better China performance, use Tencent Docs instead of Google Sheets:

```typescript
// Using Tencent Docs public API
export async function getRegistrationsFromTencent() {
  // Tencent Docs provides public URLs for shared documents
  const TENCENT_DOC_URL = 'https://docs.qq.com/sheet/your-doc-id';
  
  // Parse the public view
  // Note: This requires some web scraping or using their API if available
}
```

## Pros and Cons

### Pros:
- ✅ Zero backend code
- ✅ Completely free
- ✅ Works in China (with Web3Forms)
- ✅ Easy to implement
- ✅ Teachers can edit directly in Google Sheets

### Cons:
- ❌ Not real-time (needs refresh)
- ❌ Google Sheets might be slow in China
- ❌ Less control over data
- ❌ No built-in auth for teachers

## Quick Start Implementation

Would you like me to implement this simple solution first? It would:

1. Use Web3Forms for registration collection
2. Store manually in a JSON file in your repo (updated via GitHub)
3. Display registrations from the JSON file

This gives you a working system immediately while you decide on a more robust solution.

## Enhanced Version: GitHub + Actions

For a fully GitHub-based solution:

1. Registrations submitted via Web3Forms
2. Web3Forms webhook triggers GitHub Action
3. GitHub Action updates a JSON file in your repo
4. Site reads from the JSON file

This keeps everything within GitHub and works globally!
