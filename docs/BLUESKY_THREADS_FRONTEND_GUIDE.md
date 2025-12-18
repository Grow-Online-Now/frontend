# Frontend Integration Guide: Bluesky & Threads

This guide explains how to integrate Bluesky and Threads platforms into the frontend. Since you already have the structure for other platforms, this focuses on the differences and new requirements.

---

## Table of Contents

1. [Overview](#overview)
2. [Bluesky Integration](#bluesky-integration)
3. [Threads Integration](#threads-integration)
4. [Platform Configuration for Posts](#platform-configuration-for-posts)
5. [API Reference](#api-reference)

---

## Overview

| Platform | Auth Type | Flow |
|----------|-----------|------|
| Bluesky | Credential-based (App Password) | Form submission → Direct connection |
| Threads | OAuth 2.0 (Meta) | Redirect → Callback → Connection |

**Key Difference**: Bluesky does NOT use OAuth. Users enter their handle and app password directly in a form. Threads uses standard OAuth like Instagram/Facebook.

---

## Bluesky Integration

### Authentication Flow

Unlike other platforms, Bluesky uses **App Passwords** (not OAuth). Users need to:
1. Go to Bluesky Settings → App Passwords → Create new app password
2. Enter their handle (e.g., `username.bsky.social`) and app password in your form

### Connection Form UI

```tsx
// Example Bluesky connection form
interface BlueskyConnectForm {
  handle: string;      // e.g., "username.bsky.social" or "username.custom-domain.com"
  appPassword: string; // App password from Bluesky settings (NOT their account password)
}
```

**Important UX Notes:**
- Clearly label this is an "App Password", not their main password
- Link to Bluesky's app password settings: `https://bsky.app/settings/app-passwords`
- Handle can be with or without the `.bsky.social` suffix
- Show loading state during validation (credentials are validated server-side)

### API Endpoints

#### 1. Validate Credentials (Optional - for real-time validation)

```http
POST /api/connections/bluesky/validate
Content-Type: application/json
X-Workspace-Id: {workspaceId}

{
  "handle": "username.bsky.social",
  "appPassword": "xxxx-xxxx-xxxx-xxxx"
}
```

**Response (Success):**
```json
{
  "valid": true,
  "profile": {
    "did": "did:plc:xxxxx",
    "handle": "username.bsky.social",
    "displayName": "Display Name",
    "avatar": "https://cdn.bsky.app/..."
  }
}
```

**Response (Failure):**
```json
{
  "valid": false,
  "error": "Invalid handle or app password"
}
```

#### 2. Connect Bluesky Account

```http
POST /api/connections/bluesky/connect
Content-Type: application/json
X-Workspace-Id: {workspaceId}

{
  "handle": "username.bsky.social",
  "appPassword": "xxxx-xxxx-xxxx-xxxx"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Bluesky account connected successfully",
  "connection": {
    "id": "connection-uuid",
    "platform": "bluesky",
    "platformUserId": "did:plc:xxxxx",
    "platformUsername": "username.bsky.social",
    "displayName": "Display Name",
    "avatarUrl": "https://cdn.bsky.app/...",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response (Failure):**
```json
{
  "statusCode": 400,
  "message": "Invalid Bluesky credentials. Please check your handle and app password.",
  "error": "Bad Request"
}
```

#### 3. Check Connection Status

```http
GET /api/connections/bluesky/status
X-Workspace-Id: {workspaceId}
```

**Response:**
```json
{
  "connected": true,
  "connection": {
    "id": "connection-uuid",
    "platformUsername": "username.bsky.social",
    "displayName": "Display Name",
    "avatarUrl": "https://cdn.bsky.app/...",
    "isActive": true,
    "needsRefresh": false
  }
}
```

#### 4. Disconnect Bluesky

```http
DELETE /api/connections/bluesky
X-Workspace-Id: {workspaceId}
```

#### 5. Refresh Session (if needed)

```http
POST /api/connections/bluesky/refresh
X-Workspace-Id: {workspaceId}
```

### Example React Component

```tsx
import { useState } from 'react';

function BlueskyConnect({ workspaceId }: { workspaceId: string }) {
  const [handle, setHandle] = useState('');
  const [appPassword, setAppPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/connections/bluesky/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Workspace-Id': workspaceId,
        },
        body: JSON.stringify({ handle, appPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Connection failed');
      }

      // Success - refresh connections list or show success message
      console.log('Connected:', data.connection);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Connect Bluesky</h3>

      <p>
        You'll need an App Password from Bluesky.{' '}
        <a href="https://bsky.app/settings/app-passwords" target="_blank" rel="noopener">
          Create one here
        </a>
      </p>

      <input
        type="text"
        placeholder="Handle (e.g., username.bsky.social)"
        value={handle}
        onChange={(e) => setHandle(e.target.value)}
      />

      <input
        type="password"
        placeholder="App Password"
        value={appPassword}
        onChange={(e) => setAppPassword(e.target.value)}
      />

      {error && <p className="error">{error}</p>}

      <button onClick={handleConnect} disabled={loading || !handle || !appPassword}>
        {loading ? 'Connecting...' : 'Connect Bluesky'}
      </button>
    </div>
  );
}
```

---

## Threads Integration

### Authentication Flow

Threads uses **OAuth 2.0** via Meta's Threads API - similar to Instagram but with separate credentials.

### Connection Flow

1. User clicks "Connect Threads"
2. Redirect to `/api/oauth/threads/login?userId={userId}&workspaceId={workspaceId}`
3. User authorizes on Threads
4. Callback returns to your app with connection data

### API Endpoints

#### 1. Initiate OAuth Flow

```http
GET /api/oauth/threads/login?userId={userId}&workspaceId={workspaceId}
```

This redirects the user to Threads authorization page. After authorization, Threads redirects back to the callback endpoint.

**Frontend Implementation:**
```tsx
const connectThreads = (userId: string, workspaceId: string) => {
  // Redirect to backend OAuth endpoint
  window.location.href = `/api/oauth/threads/login?userId=${userId}&workspaceId=${workspaceId}`;
};
```

#### 2. OAuth Callback (Backend handles this)

```http
GET /api/oauth/threads/callback?code={code}&state={state}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Threads account connected successfully",
  "data": {
    "connectionId": "connection-uuid",
    "workspaceId": "workspace-uuid",
    "platform": "threads",
    "platformUserId": "12345678901234567",
    "platformUsername": "username",
    "scopes": ["threads_basic", "threads_content_publish"],
    "expiresAt": "2024-03-01T00:00:00.000Z",
    "threadsUserId": "12345678901234567"
  }
}
```

**Handling the Callback:**

Option A: Backend redirects to frontend success page
```tsx
// Your callback page component
function ThreadsCallback() {
  const searchParams = new URLSearchParams(window.location.search);
  const success = searchParams.get('success');
  const error = searchParams.get('error');

  if (success) {
    // Redirect to connections page or show success
    return <div>Threads connected successfully!</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <div>Processing...</div>;
}
```

Option B: Poll for connection status after redirect
```tsx
// After redirect, poll the status endpoint
const checkConnection = async (workspaceId: string) => {
  const response = await fetch(
    `/api/oauth/threads/status?connectionId=${connectionId}`,
    { headers: { 'X-Workspace-Id': workspaceId } }
  );
  return response.json();
};
```

#### 3. Check Connection Status

```http
GET /api/oauth/threads/status?connectionId={connectionId}
```

**Response:**
```json
{
  "connected": true,
  "connectionId": "connection-uuid",
  "workspaceId": "workspace-uuid",
  "platform": "threads",
  "platformUserId": "12345678901234567",
  "platformUsername": "username",
  "displayName": "Display Name",
  "avatarUrl": "https://...",
  "isExpired": false,
  "needsRefresh": false,
  "expiresAt": "2024-03-01T00:00:00.000Z"
}
```

#### 4. Disconnect Threads

```http
DELETE /api/oauth/threads/{connectionId}
```

**Response:**
```json
{
  "success": true,
  "message": "Threads account disconnected successfully",
  "platform": "threads"
}
```

#### 5. List All Threads Connections (Admin)

```http
GET /api/oauth/threads/users
```

---

## Platform Configuration for Posts

When creating posts, you can include platform-specific configuration for Bluesky and Threads.

### Bluesky Post Configuration

Bluesky uses the generic platform config (caption/media override only):

```json
{
  "caption": "Your post text",
  "social_accounts": ["bluesky-connection-uuid"],
  "platform_configurations": {
    "bluesky": {
      "caption": "Custom caption for Bluesky only",
      "media": ["https://example.com/bluesky-specific-image.jpg"]
    }
  }
}
```

**Bluesky Limits:**
- Text: 300 characters max
- Images: Up to 4 per post
- Videos: Not supported yet

### Threads Post Configuration

```typescript
interface ThreadsPlatformConfig {
  // Override caption for Threads
  caption?: string;

  // Override media for Threads
  media?: string[];

  // Content type (auto-detected if not set)
  contentType?: 'text' | 'image' | 'video' | 'carousel';

  // Who can reply to this post
  replyControl?: 'everyone' | 'accounts_you_follow' | 'mentioned_only';

  // Reply to an existing post (creates a reply thread)
  replyToId?: string;

  // Quote another post
  quotePostId?: string;
}
```

**Example Post Request with Threads Config:**

```json
{
  "caption": "Check out our new product!",
  "social_accounts": ["threads-connection-uuid", "instagram-connection-uuid"],
  "media_ids": ["media-uuid-1", "media-uuid-2"],
  "platform_configurations": {
    "threads": {
      "replyControl": "everyone",
      "caption": "Check out our new product! More details in the link below."
    },
    "instagram": {
      "contentType": "carousel"
    }
  }
}
```

**Threads Limits:**
- Text: 500 characters max
- Carousel: Up to 10 items
- Supports: Text-only, single image, single video, carousel

### Reply Control Options

| Value | Description |
|-------|-------------|
| `everyone` | Anyone can reply (default) |
| `accounts_you_follow` | Only accounts you follow can reply |
| `mentioned_only` | Only mentioned accounts can reply |

---

## API Reference

### Bluesky Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/connections/bluesky/connect` | Connect with handle + app password |
| `POST` | `/api/connections/bluesky/validate` | Validate credentials without saving |
| `GET` | `/api/connections/bluesky/status` | Check connection status |
| `DELETE` | `/api/connections/bluesky` | Disconnect account |
| `POST` | `/api/connections/bluesky/refresh` | Refresh session tokens |

### Threads Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/oauth/threads/login` | Initiate OAuth flow |
| `GET` | `/api/oauth/threads/callback` | OAuth callback (backend) |
| `GET` | `/api/oauth/threads/status` | Check connection status |
| `DELETE` | `/api/oauth/threads/{connectionId}` | Disconnect account |
| `GET` | `/api/oauth/threads/users` | List all connections (admin) |

### Common Headers

All workspace-scoped endpoints require:

```http
X-Workspace-Id: {workspaceId}
```

---

## Error Handling

### Bluesky Errors

| Error | Cause | User Message |
|-------|-------|--------------|
| `Invalid Bluesky credentials` | Wrong handle or app password | "Please check your handle and app password" |
| `Bluesky connection already exists` | Already connected | "Bluesky is already connected to this workspace" |
| `Session expired` | JWT tokens expired | "Please reconnect your Bluesky account" |

### Threads Errors

| Error | Cause | User Message |
|-------|-------|--------------|
| `OAuth authorization failed` | User denied permission | "Authorization was cancelled" |
| `Token expired` | Access token expired | "Please reconnect your Threads account" |
| `Rate limit exceeded` | Too many API calls | "Please try again later" |

---

## UI Recommendations

### Platform Icons
- Bluesky: Use the butterfly logo (available in their brand assets)
- Threads: Use the @ symbol logo (Meta brand guidelines)

### Connection Cards

```tsx
// Suggested connection card structure
interface ConnectionCard {
  platform: 'bluesky' | 'threads';
  username: string;
  displayName?: string;
  avatarUrl?: string;
  isConnected: boolean;
  needsReconnect?: boolean; // Token expired
}
```

### Status Indicators
- **Green**: Connected and healthy
- **Yellow**: Token expiring soon (needsRefresh: true)
- **Red**: Token expired or connection failed

---

## Migration Notes

If you previously had Bluesky with environment-based credentials:
- Old: Single account for all users via `.env`
- New: Per-workspace connections via `/api/connections/bluesky/connect`

Users will need to reconnect their Bluesky accounts using the new flow.
