# Frontend Migration Guide: Workspace System

This document outlines all the changes required for the frontend to adapt to the new workspace-based architecture.

## Overview

The backend has migrated from a **user-centric** model to a **workspace-centric** model:

- **Before**: Posts, Media, and Social Connections belonged directly to a User
- **After**: Posts, Media, and Social Connections belong to a Workspace. Users are members of Workspaces.

### Key Concepts

| Concept | Description |
|---------|-------------|
| **Workspace** | A container representing a brand/client. Has its own connections, posts, and media. |
| **Personal Workspace** | Auto-created for each user on signup. Cannot be deleted. |
| **Workspace Member** | A user's membership in a workspace with a role (OWNER or MEMBER). |
| **X-Workspace-Id Header** | Required header for all workspace-scoped API calls. |

---

## Breaking Changes

### 1. Required Header for Most Endpoints

All workspace-scoped endpoints now require the `X-Workspace-Id` header:

```typescript
// Before
fetch('/api/posts', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// After
fetch('/api/posts', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'X-Workspace-Id': workspaceId  // NEW - Required
  }
});
```

**Endpoints requiring X-Workspace-Id:**
- `GET/POST /api/posts`
- `GET/POST/DELETE /api/media/*`
- `GET/DELETE /api/connections`
- `GET /api/connections/:platform/connect`

### 2. Social Connections Model Change

Social connections are now **per-workspace**, not per-user. Each workspace can have ONE connection per platform.

```typescript
// Before: User could have multiple LinkedIn accounts
// After: Workspace has exactly one LinkedIn connection (or none)

// Connection response now includes workspaceId instead of userId
interface SocialConnection {
  id: string;
  workspaceId: string;  // Changed from userId
  platform: string;
  displayName: string;
  avatarUrl: string;
  // ...
}
```

### 3. OAuth Flow Changes

OAuth endpoints now require `workspaceId` parameter:

```typescript
// Before
window.location.href = `/api/connections/linkedin/connect`;

// After - Must include workspace context
window.location.href = `/api/connections/linkedin/connect`;
// With X-Workspace-Id header set, or use legacy endpoints:
window.location.href = `/api/oauth/linkedin/login?userId=${userId}&workspaceId=${workspaceId}`;
```

**OAuth callback responses now include:**
```typescript
{
  success: true,
  data: {
    connectionId: string,   // NEW
    workspaceId: string,    // NEW
    platform: string,
    platformUserId: string,
    platformUsername: string,
    scopes: string[],
    expiresAt: string
  }
}
```

### 4. Posts Model Change

Posts now belong to workspaces:

```typescript
// Before
interface CreatePostDto {
  caption: string;
  // userId was implicit from auth
}

// After - workspaceId comes from header
// Post responses include workspaceId
interface Post {
  id: string;
  workspaceId: string;  // Changed from userId
  caption: string;
  // ...
}
```

### 5. Media Model Change

Media uploads are now workspace-scoped:

```typescript
// S3 key format changed
// Before: media/{userId}/{uuid}/{filename}
// After:  media/{workspaceId}/{uuid}/{filename}

// Media responses include workspaceId
interface Media {
  id: string;
  workspaceId: string;  // Changed from userId
  // ...
}
```

---

## New Endpoints

### Workspaces API

#### List User's Workspaces
```http
GET /api/workspaces
Authorization: Bearer {token}
```

Response:
```json
{
  "workspaces": [
    {
      "id": "ws_123",
      "name": "John's Workspace",
      "slug": "personal-user123",
      "isPersonal": true,
      "role": "OWNER",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    {
      "id": "ws_456",
      "name": "Acme Corp",
      "slug": "acme-corp",
      "isPersonal": false,
      "role": "MEMBER",
      "createdAt": "2024-01-15T00:00:00Z"
    }
  ]
}
```

#### Create Workspace
```http
POST /api/workspaces
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "My New Brand",
  "slug": "my-new-brand"  // Optional, auto-generated if not provided
}
```

#### Get Workspace Details
```http
GET /api/workspaces/:id
Authorization: Bearer {token}
X-Workspace-Id: {workspaceId}
```

#### Update Workspace (Owner Only)
```http
PATCH /api/workspaces/:id
Authorization: Bearer {token}
X-Workspace-Id: {workspaceId}
Content-Type: application/json

{
  "name": "Updated Name"
}
```

#### Delete Workspace (Owner Only, Non-Personal)
```http
DELETE /api/workspaces/:id
Authorization: Bearer {token}
X-Workspace-Id: {workspaceId}
```

### Workspace Members API

#### List Members
```http
GET /api/workspaces/:id/members
Authorization: Bearer {token}
X-Workspace-Id: {workspaceId}
```

Response:
```json
{
  "members": [
    {
      "id": "member_123",
      "userId": "user_456",
      "role": "OWNER",
      "user": {
        "id": "user_456",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Add Member (Owner Only)
```http
POST /api/workspaces/:id/members
Authorization: Bearer {token}
X-Workspace-Id: {workspaceId}
Content-Type: application/json

{
  "email": "newmember@example.com",
  "role": "MEMBER"  // OWNER or MEMBER
}
```

#### Update Member Role (Owner Only)
```http
PATCH /api/workspaces/:id/members/:userId
Authorization: Bearer {token}
X-Workspace-Id: {workspaceId}
Content-Type: application/json

{
  "role": "OWNER"
}
```

#### Remove Member (Owner Only)
```http
DELETE /api/workspaces/:id/members/:userId
Authorization: Bearer {token}
X-Workspace-Id: {workspaceId}
```

#### Leave Workspace
```http
POST /api/workspaces/:id/leave
Authorization: Bearer {token}
X-Workspace-Id: {workspaceId}
```

---

## Updated Endpoints

### Connections

#### List Connections (Now Workspace-Scoped)
```http
GET /api/connections
Authorization: Bearer {token}
X-Workspace-Id: {workspaceId}
```

Response:
```json
{
  "count": 2,
  "connections": [
    {
      "id": "conn_123",
      "platform": "linkedin",
      "displayName": "John Doe",
      "avatarUrl": "https://...",
      "platformUserId": "abc123",
      "platformUsername": "johndoe",
      "isActive": true,
      "expiresAt": "2024-06-01T00:00:00Z",
      "isExpired": false,
      "needsRefresh": false
    }
  ]
}
```

#### Connect Platform
```http
GET /api/connections/:platform/connect
Authorization: Bearer {token}
X-Workspace-Id: {workspaceId}
```

Redirects to OAuth provider. On callback, creates connection for the workspace.

#### Disconnect
```http
DELETE /api/connections/:id
Authorization: Bearer {token}
X-Workspace-Id: {workspaceId}
```

#### Refresh Connection
```http
POST /api/connections/:id/refresh
Authorization: Bearer {token}
X-Workspace-Id: {workspaceId}
```

### Posts

#### Create Post
```http
POST /api/posts
Authorization: Bearer {token}
X-Workspace-Id: {workspaceId}
Content-Type: application/json

{
  "caption": "Hello world!",
  "socialAccountIds": ["conn_123", "conn_456"],
  "mediaIds": ["media_789"],
  "isDraft": false,
  "scheduledFor": null,
  "platformConfigurations": {
    "twitter": {
      "thread": [{"text": "Thread reply 1"}]
    }
  }
}
```

#### List Posts
```http
GET /api/posts?status=completed&limit=10&page=1
Authorization: Bearer {token}
X-Workspace-Id: {workspaceId}
```

### Media

#### Request Upload URL
```http
POST /api/media/request-upload
Authorization: Bearer {token}
X-Workspace-Id: {workspaceId}
Content-Type: application/json

{
  "fileName": "image.jpg",
  "fileSize": 1024000,
  "contentType": "image/jpeg"
}
```

#### Confirm Upload
```http
POST /api/media/confirm-upload
Authorization: Bearer {token}
X-Workspace-Id: {workspaceId}
Content-Type: application/json

{
  "mediaId": "media_123"
}
```

#### List Media
```http
GET /api/media?status=ready&type=image&limit=20
Authorization: Bearer {token}
X-Workspace-Id: {workspaceId}
```

---

## Frontend Implementation Checklist

### 1. State Management

Add workspace state to your app:

```typescript
interface AppState {
  user: User | null;
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
}

// Store the current workspace ID
const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | null>(null);
```

### 2. API Client Updates

Update your API client to include the workspace header:

```typescript
// api-client.ts
class ApiClient {
  private workspaceId: string | null = null;

  setWorkspace(id: string) {
    this.workspaceId = id;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    if (this.workspaceId) {
      headers['X-Workspace-Id'] = this.workspaceId;
    }

    return headers;
  }

  async get(url: string) {
    return fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });
  }

  // ... other methods
}
```

### 3. Workspace Selector Component

Add a workspace selector to your UI:

```tsx
function WorkspaceSelector({
  workspaces,
  currentWorkspace,
  onSelect
}: {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  onSelect: (workspace: Workspace) => void;
}) {
  return (
    <select
      value={currentWorkspace?.id || ''}
      onChange={(e) => {
        const ws = workspaces.find(w => w.id === e.target.value);
        if (ws) onSelect(ws);
      }}
    >
      {workspaces.map(ws => (
        <option key={ws.id} value={ws.id}>
          {ws.name} {ws.isPersonal ? '(Personal)' : ''}
        </option>
      ))}
    </select>
  );
}
```

### 4. Initial Load Flow

On app initialization:

```typescript
async function initializeApp() {
  // 1. Authenticate user
  const user = await auth.getCurrentUser();

  // 2. Fetch user's workspaces
  const { workspaces } = await api.get('/api/workspaces');

  // 3. Select default workspace (personal or last used)
  const savedWorkspaceId = localStorage.getItem('currentWorkspaceId');
  const currentWorkspace = workspaces.find(w => w.id === savedWorkspaceId)
    || workspaces.find(w => w.isPersonal)
    || workspaces[0];

  // 4. Set workspace in API client
  api.setWorkspace(currentWorkspace.id);

  // 5. Store in state
  setWorkspaces(workspaces);
  setCurrentWorkspace(currentWorkspace);
}
```

### 5. OAuth Flow Updates

When connecting a social platform:

```typescript
async function connectPlatform(platform: string) {
  // Ensure workspace is selected
  if (!currentWorkspace) {
    throw new Error('Please select a workspace first');
  }

  // The X-Workspace-Id header is sent automatically by the API client
  // Just redirect to the connect endpoint
  window.location.href = `/api/connections/${platform}/connect`;
}
```

### 6. Post Creation Updates

When creating a post:

```typescript
async function createPost(data: CreatePostInput) {
  // Workspace ID comes from header, not body
  const response = await api.post('/api/posts', {
    caption: data.caption,
    socialAccountIds: data.selectedConnections, // Connection IDs from current workspace
    mediaIds: data.mediaIds,
    isDraft: data.isDraft,
    scheduledFor: data.scheduledFor,
    platformConfigurations: data.platformConfig,
  });

  return response;
}
```

---

## Error Handling

### New Error Codes

| Status | Error | Description |
|--------|-------|-------------|
| 400 | `WORKSPACE_REQUIRED` | X-Workspace-Id header is missing |
| 403 | `NOT_WORKSPACE_MEMBER` | User is not a member of the workspace |
| 403 | `NOT_WORKSPACE_OWNER` | Action requires owner role |
| 404 | `WORKSPACE_NOT_FOUND` | Workspace does not exist |
| 409 | `SLUG_TAKEN` | Workspace slug already exists |
| 409 | `PLATFORM_ALREADY_CONNECTED` | Workspace already has a connection for this platform |

### Error Response Format

```json
{
  "statusCode": 403,
  "message": "You do not have permission to access this workspace",
  "error": "Forbidden"
}
```

---

## Migration Steps for Existing Users

1. **Existing users** automatically have a personal workspace created
2. **Existing connections** are migrated to the user's personal workspace
3. **Existing posts** are migrated to the user's personal workspace
4. **Existing media** is migrated to the user's personal workspace

No data is lost. Users can immediately use their personal workspace without any action.

---

## TypeScript Types

```typescript
// Workspace types
interface Workspace {
  id: string;
  name: string;
  slug: string;
  isPersonal: boolean;
  createdAt: string;
  updatedAt: string;
}

interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: 'OWNER' | 'MEMBER';
  user: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

interface WorkspaceWithRole extends Workspace {
  role: 'OWNER' | 'MEMBER';
}

// Updated connection type
interface SocialConnection {
  id: string;
  workspaceId: string;  // Changed from userId
  platform: string;
  displayName: string | null;
  avatarUrl: string | null;
  platformUserId: string;
  platformUsername: string | null;
  isActive: boolean;
  expiresAt: string | null;
  isExpired: boolean;
  needsRefresh: boolean;
}

// Updated post type
interface Post {
  id: string;
  workspaceId: string;  // Changed from userId
  caption: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  isDraft: boolean;
  scheduledFor: string | null;
  createdAt: string;
  updatedAt: string;
}

// Updated media type
interface Media {
  id: string;
  workspaceId: string;  // Changed from userId
  fileName: string;
  fileSize: number;
  contentType: string;
  mediaType: 'image' | 'video';
  status: 'pending' | 'ready' | 'failed';
  url: string | null;
  createdAt: string;
}
```

---

## Questions?

If you have questions about the migration, please check:
1. The API documentation at `/api/docs` (Swagger)
2. The CLAUDE.md file for architecture details
3. Create an issue in the repository
