# Vercel Functions Implementation Example

## Simple Registration System Without External Database

This example uses Vercel's KV storage (or simple JSON files) to implement a registration system that works in China.

## Setup

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Create API Directory Structure
```
/api
  /registrations
    - create.ts
    - list.ts
  /sessions
    - create.ts
    - update.ts
  /auth
    - login.ts
```

### 3. Example Implementation

#### Registration API (`/api/registrations/create.ts`)
```typescript
import { VercelRequest, VercelResponse } from '@vercel/node';

// In production, use Vercel KV or external database
let registrations: any[] = [];

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { sessionId, name, timestamp } = req.body;

  if (!sessionId || !name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Add registration
  const registration = {
    id: Date.now().toString(),
    sessionId,
    name: name.trim(),
    timestamp: timestamp || Date.now()
  };

  registrations.push(registration);

  // Enable CORS for your domain
  res.setHeader('Access-Control-Allow-Origin', 'https://your-github-pages-url.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  
  return res.status(200).json({ success: true, registration });
}
```

#### List Registrations (`/api/registrations/list.ts`)
```typescript
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const { sessionId } = req.query;

  let filtered = registrations;
  if (sessionId) {
    filtered = registrations.filter(r => r.sessionId === sessionId);
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.status(200).json({ registrations: filtered });
}
```

### 4. Frontend Integration

#### Update Registration Service (`src/services/registration.ts`)
```typescript
const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://your-project.vercel.app/api'
  : 'http://localhost:3000/api';

export async function registerForSession(
  sessionId: string, 
  name: string
): Promise<Registration> {
  const response = await fetch(`${API_BASE}/registrations/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, name })
  });
  
  if (!response.ok) throw new Error('Registration failed');
  
  const data = await response.json();
  return data.registration;
}

export async function getRegistrations(
  sessionId?: string
): Promise<Registration[]> {
  const url = sessionId 
    ? `${API_BASE}/registrations/list?sessionId=${sessionId}`
    : `${API_BASE}/registrations/list`;
    
  const response = await fetch(url);
  const data = await response.json();
  return data.registrations;
}
```

### 5. Simple Teacher Auth

#### Login (`/api/auth/login.ts`)
```typescript
import jwt from 'jsonwebtoken';

const TEACHER_PASSWORD = process.env.TEACHER_PASSWORD || 'change-me';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const { password } = req.body;

  if (password !== TEACHER_PASSWORD) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  const token = jwt.sign(
    { role: 'teacher', exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) },
    JWT_SECRET
  );

  return res.status(200).json({ token });
}
```

### 6. Environment Variables

Create `.env.local`:
```
TEACHER_PASSWORD=your-secure-password
JWT_SECRET=your-jwt-secret
```

### 7. Deployment

```bash
vercel --prod
```

## Alternative: Using GitHub Issues as Backend

If you prefer not to set up any backend:

```typescript
// Using GitHub Issues API
export async function registerViaGitHub(sessionId: string, name: string) {
  // Users need to authenticate with GitHub
  const octokit = new Octokit({ 
    auth: 'user-github-token' 
  });

  // Post comment on dedicated issue
  await octokit.issues.createComment({
    owner: 'your-username',
    repo: 'your-repo',
    issue_number: 1, // Dedicated registration issue
    body: `Registration: ${name} for session ${sessionId}`
  });
}
```

## Pros of This Approach

1. **Works in China** - Vercel has good connectivity
2. **Free tier** - Generous limits for small projects  
3. **Simple** - No external database needed initially
4. **Scalable** - Can add database later
5. **Secure** - HTTPS by default

## Next Steps

1. Choose your preferred approach
2. Set up Vercel account (free)
3. Implement basic registration
4. Add teacher authentication later

Would you like me to implement any of these options for your project?
