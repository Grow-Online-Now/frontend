# Frontend Integration Guide — Workflow Automation API

All workflow endpoints are workspace-scoped. Every request requires:
- **Authentication**: Session cookie (from better-auth)
- **Header**: `X-Workspace-Id: <workspaceId>`

Base URL: `http://localhost:3000`

Swagger docs: `http://localhost:3000/api/docs` (tag: `workflows`)

---

## TypeScript Types

Copy these into your frontend to match the backend API:

```typescript
// ─── Workflow ────────────────────────────────────────────────

interface Workflow {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  status: 'draft' | 'active' | 'paused';
  triggerType: 'manual' | 'cron' | 'webhook';
  triggerConfig: Record<string, unknown>;  // e.g. { schedule: "0 9 * * *" } for cron
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: string;  // ISO 8601
  updatedAt: string;
}

interface WorkflowNode {
  id: string;       // unique within workflow (e.g. "node_1", "youtube_fetch_1")
  type: string;     // must match a NodeTypeDefinition.type from GET /node-types
  position: { x: number; y: number };
  config: Record<string, unknown>;  // node-specific config values
}

interface WorkflowEdge {
  id: string;
  sourceNodeId: string;
  sourcePortKey: string;  // output port key of source node
  targetNodeId: string;
  targetPortKey: string;  // input port key of target node
}

// ─── Workflow Run ────────────────────────────────────────────

interface WorkflowRun {
  id: string;
  workflowId: string;
  status: 'running' | 'success' | 'failed';
  triggeredBy: 'manual' | 'cron' | 'webhook';
  steps: WorkflowStepResult[];
  startedAt: string;
  completedAt: string | null;
  durationMs: number | null;
}

interface WorkflowStepResult {
  nodeId: string;
  nodeType: string;
  status: 'pending' | 'running' | 'success' | 'failed' | 'skipped';
  input: Record<string, unknown> | null;
  output: Record<string, unknown> | null;
  error?: string;
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
}

// ─── Node Type Definitions (from GET /node-types) ────────────

type NodeCategory = 'trigger' | 'media' | 'text' | 'logic' | 'output' | 'ai';

interface NodeTypeDefinition {
  type: string;          // unique identifier (e.g. "youtube_fetch")
  name: string;          // display name (e.g. "YouTube Fetch")
  description: string;
  icon: string;          // icon name (e.g. "youtube", "play", "timer")
  category: NodeCategory;
  configSchema: ConfigFieldSchema[];  // form fields for node config panel
  inputPorts: PortSchema[];           // connection targets
  outputPorts: PortSchema[];          // connection sources
}

interface PortSchema {
  key: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'any';
  label: string;
  description?: string;
  required?: boolean;
}

interface ConfigFieldSchema {
  key: string;
  type: 'text' | 'number' | 'select' | 'toggle' | 'textarea' | 'variable_ref' | 'cron' | 'json';
  label: string;
  description?: string;
  placeholder?: string;
  default?: unknown;
  options?: { label: string; value: string }[];  // for "select" type
  validation?: { min?: number; max?: number; pattern?: string };
}
```

---

## API Endpoints

### 1. List Node Types

Get all available node types for the workflow editor palette.

```
GET /api/workflows/node-types
```

**Response** `200`: `NodeTypeDefinition[]`

**Example response:**
```json
[
  {
    "type": "manual_trigger",
    "name": "Manual Trigger",
    "description": "Trigger the workflow manually",
    "icon": "play",
    "category": "trigger",
    "configSchema": [],
    "inputPorts": [],
    "outputPorts": [
      { "key": "timestamp", "type": "string", "label": "Trigger time" },
      { "key": "run_id", "type": "string", "label": "Run ID" }
    ]
  },
  {
    "type": "youtube_fetch",
    "name": "YouTube Fetch",
    "description": "Download a video from YouTube",
    "icon": "youtube",
    "category": "media",
    "configSchema": [
      { "key": "url", "type": "text", "label": "YouTube URL", "placeholder": "https://youtube.com/watch?v=..." },
      { "key": "quality", "type": "select", "label": "Quality", "default": "best", "options": [
        { "label": "Best", "value": "best" },
        { "label": "1080p", "value": "1080p" },
        { "label": "720p", "value": "720p" }
      ]}
    ],
    "inputPorts": [],
    "outputPorts": [
      { "key": "video_path", "type": "string", "label": "Video file path" },
      { "key": "title", "type": "string", "label": "Video title" },
      { "key": "duration", "type": "number", "label": "Duration (seconds)" },
      { "key": "author", "type": "string", "label": "Channel name" }
    ]
  }
]
```

**Available node types (11 total):**

| Type | Name | Category | Config fields |
|------|------|----------|---------------|
| `manual_trigger` | Manual Trigger | trigger | — |
| `cron_trigger` | Cron Trigger | trigger | `schedule` (cron expression) |
| `youtube_fetch` | YouTube Fetch | media | `url`, `quality` |
| `video_clip` | Video Clip | media | `output_dir` |
| `subtitle_overlay` | Subtitle Overlay | media | `language`, `content_hint`, `max_clips`, `min_duration` |
| `text_template` | Text Template | text | `template` (with `{{ nodeId.portKey }}` variables) |
| `ai_caption` | AI Caption | ai | `n_clips`, `tone`, `language`, `content_hint` |
| `delay` | Delay | logic | `seconds` (1–86400) |
| `if_else` | If/Else | logic | `condition` (e.g. `{{ node1.count }} > 0`) |
| `post_instagram` | Post to Instagram | output | `caption`, `contentType` |
| `post_tiktok` | Post to TikTok | output | `caption`, `privacyLevel` |

---

### 2. List Workflows

```
GET /api/workflows?status=active&page=1&limit=20
```

**Query params** (all optional):
| Param | Type | Default | Values |
|-------|------|---------|--------|
| `status` | string | — | `draft`, `active`, `paused` |
| `page` | number | 1 | ≥ 1 |
| `limit` | number | 20 | 1–100 |

**Response** `200`:
```json
{
  "workflows": [Workflow, ...],
  "total": 42
}
```

---

### 3. Create Workflow

```
POST /api/workflows
Content-Type: application/json
```

**Body:**
```json
{
  "name": "YouTube to Instagram",
  "description": "Repurpose YouTube videos as Instagram Reels",
  "triggerType": "manual",
  "triggerConfig": {},
  "nodes": [
    {
      "id": "trigger_1",
      "type": "manual_trigger",
      "position": { "x": 100, "y": 200 },
      "config": {}
    },
    {
      "id": "fetch_1",
      "type": "youtube_fetch",
      "position": { "x": 400, "y": 200 },
      "config": { "url": "https://youtube.com/watch?v=abc123" }
    }
  ],
  "edges": [
    {
      "id": "edge_1",
      "sourceNodeId": "trigger_1",
      "sourcePortKey": "timestamp",
      "targetNodeId": "fetch_1",
      "targetPortKey": "trigger"
    }
  ]
}
```

| Field | Required | Type | Notes |
|-------|----------|------|-------|
| `name` | yes | string | max 255 chars |
| `description` | no | string | |
| `triggerType` | yes | string | `manual`, `cron`, `webhook` |
| `triggerConfig` | no | object | For cron: `{ "schedule": "0 9 * * *" }`. For webhook: `{ "secret": "abc" }` |
| `nodes` | no | array | Default: `[]`. Can add nodes later via update |
| `edges` | no | array | Default: `[]` |

**Response** `201`: `Workflow` (status will always be `"draft"`)

---

### 4. Get Workflow

```
GET /api/workflows/:id
```

**Response** `200`: `Workflow`

---

### 5. Update Workflow

```
PUT /api/workflows/:id
Content-Type: application/json
```

All fields are optional. Only send what changed.

```json
{
  "name": "Updated name",
  "nodes": [...],
  "edges": [...],
  "status": "active"
}
```

**Status transitions:**
- `draft` → `active`: Activates the workflow. For cron triggers, starts the schedule (requires `triggerConfig.schedule`).
- `active` → `paused`: Pauses execution. Deactivates cron schedule.
- `paused` → `active`: Re-activates.
- Any → `draft`: Deactivates triggers, returns to draft.

**Response** `200`: `Workflow`

**Errors:**
- `400`: Cannot activate cron workflow without `triggerConfig.schedule`

---

### 6. Delete Workflow

```
DELETE /api/workflows/:id
```

**Response** `204`: No content. Cascades to delete all runs.

---

### 7. Run Workflow (Manual Trigger)

```
POST /api/workflows/:id/run
```

Starts immediate execution. Workflow must be `active` or `paused` (not `draft`).

**Response** `200`: `WorkflowRun`

```json
{
  "id": "run-uuid",
  "workflowId": "wf-uuid",
  "status": "success",
  "triggeredBy": "manual",
  "steps": [
    {
      "nodeId": "trigger_1",
      "nodeType": "manual_trigger",
      "status": "success",
      "input": {},
      "output": { "timestamp": "2026-03-09T12:00:00Z", "run_id": "run-uuid" },
      "startedAt": "2026-03-09T12:00:00.000Z",
      "completedAt": "2026-03-09T12:00:00.001Z",
      "durationMs": 1
    },
    {
      "nodeId": "fetch_1",
      "nodeType": "youtube_fetch",
      "status": "success",
      "input": { "trigger": "2026-03-09T12:00:00Z" },
      "output": { "video_path": "/tmp/video.mp4", "title": "My Video", "duration": 300, "author": "Channel" },
      "startedAt": "2026-03-09T12:00:00.002Z",
      "completedAt": "2026-03-09T12:00:05.500Z",
      "durationMs": 5498
    }
  ],
  "startedAt": "2026-03-09T12:00:00.000Z",
  "completedAt": "2026-03-09T12:00:05.501Z",
  "durationMs": 5501
}
```

**Errors:**
- `400`: Workflow is draft
- `404`: Workflow not found

---

### 8. List Runs

```
GET /api/workflows/:id/runs?page=1&limit=20
```

**Response** `200`:
```json
{
  "runs": [WorkflowRun, ...],
  "total": 15
}
```

---

### 9. Get Run Detail

```
GET /api/workflows/:id/runs/:runId
```

**Response** `200`: `WorkflowRun` (with full `steps` array)

Use this to poll for run progress — check `status` field.

---

### 10. Webhook Trigger (Public — No Auth)

```
POST /api/webhooks/:workflowId
X-Webhook-Secret: optional-secret-here
```

No authentication required. Validates:
- Workflow exists and is `active`
- Workflow trigger type is `webhook`
- Secret matches (if configured in `triggerConfig.secret`)

**Response** `200`:
```json
{
  "runId": "run-uuid",
  "status": "running"
}
```

**Errors:**
- `403`: Workflow not active, not webhook type, or invalid secret
- `404`: Workflow not found

---

## Frontend Implementation Notes

### Workflow Editor (Node Graph)

Use the `GET /api/workflows/node-types` response to:
1. **Build the node palette** — group by `category`, display `name` + `icon`
2. **Render config panels** — use `configSchema` to dynamically generate form fields
3. **Render ports** — `inputPorts` on left, `outputPorts` on right of each node
4. **Validate connections** — check port `type` compatibility when user draws edges

### Variable References

Nodes can reference outputs from upstream nodes using `{{ nodeId.portKey }}` syntax in any config string value. For example:

```json
{
  "id": "template_1",
  "type": "text_template",
  "config": {
    "template": "Check out this video by {{ fetch_1.author }}: {{ fetch_1.title }}"
  }
}
```

The frontend should provide autocomplete for `{{ }}` references based on connected upstream nodes and their `outputPorts`.

### Polling for Run Status

After calling `POST /api/workflows/:id/run`, the response includes the full completed run. For long-running workflows, you may want to:
1. Fire the run request
2. Poll `GET /api/workflows/:id/runs/:runId` every 2–5 seconds
3. Stop polling when `status` is `success` or `failed`

### Typical React Fetch Example

```typescript
const API_BASE = 'http://localhost:3000';

async function fetchWorkflows(workspaceId: string) {
  const res = await fetch(`${API_BASE}/api/workflows`, {
    headers: { 'X-Workspace-Id': workspaceId },
    credentials: 'include',
  });
  return res.json() as Promise<{ workflows: Workflow[]; total: number }>;
}

async function createWorkflow(workspaceId: string, data: CreateWorkflowBody) {
  const res = await fetch(`${API_BASE}/api/workflows`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Workspace-Id': workspaceId,
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  return res.json() as Promise<Workflow>;
}

async function runWorkflow(workspaceId: string, workflowId: string) {
  const res = await fetch(`${API_BASE}/api/workflows/${workflowId}/run`, {
    method: 'POST',
    headers: { 'X-Workspace-Id': workspaceId },
    credentials: 'include',
  });
  return res.json() as Promise<WorkflowRun>;
}

async function getNodeTypes(workspaceId: string) {
  const res = await fetch(`${API_BASE}/api/workflows/node-types`, {
    headers: { 'X-Workspace-Id': workspaceId },
    credentials: 'include',
  });
  return res.json() as Promise<NodeTypeDefinition[]>;
}
```

### If/Else Branching

The `if_else` node outputs `{ branch: "true" | "false" }`. The DAG engine automatically skips nodes connected to the inactive branch. Connect the `true` output port to one branch and the `false` output port to the other.

### Cron Schedule Format

The `cron_trigger` uses standard 5-field cron syntax:
```
┌───────────── minute (0–59)
│ ┌───────────── hour (0–23)
│ │ ┌───────────── day of month (1–31)
│ │ │ ┌───────────── month (1–12)
│ │ │ │ ┌───────────── day of week (0–7, Sun=0 or 7)
│ │ │ │ │
* * * * *
```

Examples:
- `0 9 * * *` — Every day at 9:00 AM
- `0 9 * * 1-5` — Weekdays at 9:00 AM
- `*/30 * * * *` — Every 30 minutes
