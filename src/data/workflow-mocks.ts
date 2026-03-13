/**
 * Mock data for the Automate / Workflows module
 * Used during development before API integration
 */

import { Zap, Film, Sparkles, GitBranch, Upload } from 'lucide-react'
import type {
  Workflow,
  WorkflowNode,
  WorkflowEdge,
  WorkflowRun,
  NodeTypeDefinition,
  CategoryDefinition,
} from '@/types/workflow'

// ─── Node Categories ───

export const NODE_CATEGORIES: CategoryDefinition[] = [
  {
    key: 'trigger',
    labelKey: 'dashboard.workflows.categories.triggers',
    icon: Zap,
    colorClass: 'text-text-primary',
    mutedColorClass: 'bg-bg-hover',
  },
  {
    key: 'media',
    labelKey: 'dashboard.workflows.categories.media',
    icon: Film,
    colorClass: 'text-success',
    mutedColorClass: 'bg-success-muted',
  },
  {
    key: 'text',
    labelKey: 'dashboard.workflows.categories.text',
    icon: Sparkles,
    colorClass: 'text-[#8b5cf6]',
    mutedColorClass: 'bg-[rgba(139,92,246,0.15)]',
  },
  {
    key: 'logic',
    labelKey: 'dashboard.workflows.categories.logic',
    icon: GitBranch,
    colorClass: 'text-warning',
    mutedColorClass: 'bg-warning-muted',
  },
  {
    key: 'output',
    labelKey: 'dashboard.workflows.categories.output',
    icon: Upload,
    colorClass: 'text-destructive',
    mutedColorClass: 'bg-destructive-muted',
  },
]

// ─── Node Type Definitions ───

export const NODE_TYPE_DEFINITIONS: Record<string, NodeTypeDefinition> = {
  cron_trigger: {
    type: 'cron_trigger',
    name: 'Cron Trigger',
    description: 'Trigger workflow on a schedule',
    icon: 'clock',
    category: 'trigger',
    configSchema: [{ key: 'schedule', type: 'cron', label: 'Schedule', required: true }],
    inputPorts: [],
    outputPorts: [],
  },
  manual_trigger: {
    type: 'manual_trigger',
    name: 'Manual Trigger',
    description: 'Run workflow manually',
    icon: 'play',
    category: 'trigger',
    configSchema: [],
    inputPorts: [],
    outputPorts: [],
  },
  webhook_trigger: {
    type: 'webhook_trigger',
    name: 'Webhook Trigger',
    description: 'Trigger workflow via webhook',
    icon: 'link',
    category: 'trigger',
    configSchema: [],
    inputPorts: [],
    outputPorts: [],
  },
  youtube_fetch: {
    type: 'youtube_fetch',
    name: 'YouTube Fetch',
    description: 'Fetch latest video from a YouTube channel',
    icon: 'monitor_play',
    category: 'media',
    configSchema: [{ key: 'channel_url', type: 'text', label: 'Channel URL', required: true }],
    inputPorts: [],
    outputPorts: [
      { key: 'video_url', type: 'string', label: 'Video URL' },
      { key: 'title', type: 'string', label: 'Title' },
      { key: 'duration', type: 'number', label: 'Duration' },
      { key: 'transcript', type: 'string', label: 'Transcript' },
    ],
  },
  twitch_clip: {
    type: 'twitch_clip',
    name: 'Twitch Clip',
    description: 'Fetch top clips from a Twitch channel',
    icon: 'gamepad',
    category: 'media',
    configSchema: [{ key: 'channel', type: 'text', label: 'Channel', required: true }],
    inputPorts: [],
    outputPorts: [
      { key: 'clip_url', type: 'string', label: 'Clip URL' },
      { key: 'title', type: 'string', label: 'Title' },
    ],
  },
  video_clip: {
    type: 'video_clip',
    name: 'Video Clip',
    description: 'Extract a clip from a video',
    icon: 'scissors',
    category: 'media',
    configSchema: [
      { key: 'start', type: 'text', label: 'Start', required: true },
      { key: 'end', type: 'text', label: 'End', required: true },
    ],
    inputPorts: [],
    outputPorts: [
      { key: 'clip_url', type: 'string', label: 'Clip URL' },
      { key: 'duration', type: 'number', label: 'Duration' },
    ],
  },
  subtitle_overlay: {
    type: 'subtitle_overlay',
    name: 'Subtitle Overlay',
    description: 'Add auto-generated subtitles to a video',
    icon: 'captions',
    category: 'media',
    configSchema: [],
    inputPorts: [],
    outputPorts: [{ key: 'video_url', type: 'string', label: 'Video URL' }],
  },
  thumbnail_gen: {
    type: 'thumbnail_gen',
    name: 'Thumbnail Generator',
    description: 'Generate a thumbnail from a video frame',
    icon: 'image',
    category: 'media',
    configSchema: [],
    inputPorts: [],
    outputPorts: [{ key: 'thumbnail_url', type: 'string', label: 'Thumbnail URL' }],
  },
  text_template: {
    type: 'text_template',
    name: 'Text Template',
    description: 'Generate text from a Mustache template',
    icon: 'file_text',
    category: 'text',
    configSchema: [{ key: 'template', type: 'textarea', label: 'Template', required: true }],
    inputPorts: [],
    outputPorts: [{ key: 'text', type: 'string', label: 'Text' }],
  },
  ai_caption: {
    type: 'ai_caption',
    name: 'AI Caption',
    description: 'Generate a caption using AI',
    icon: 'bot',
    category: 'text',
    configSchema: [
      { key: 'tone', type: 'text', label: 'Tone', required: true },
      { key: 'max_length', type: 'number', label: 'Max Length' },
    ],
    inputPorts: [],
    outputPorts: [
      { key: 'caption', type: 'string', label: 'Caption' },
      { key: 'hashtags', type: 'array', label: 'Hashtags' },
    ],
  },
  ai_translate: {
    type: 'ai_translate',
    name: 'AI Translate',
    description: 'Translate text to another language',
    icon: 'globe',
    category: 'text',
    configSchema: [
      {
        key: 'target_language',
        type: 'select',
        label: 'Target Language',
        required: true,
        options: [
          { label: 'English', value: 'en' },
          { label: 'Español', value: 'es' },
          { label: 'Français', value: 'fr' },
        ],
      },
    ],
    inputPorts: [],
    outputPorts: [{ key: 'translated_text', type: 'string', label: 'Translated Text' }],
  },
  if_else: {
    type: 'if_else',
    name: 'If / Else',
    description: 'Branch workflow based on a condition',
    icon: 'git_branch',
    category: 'logic',
    configSchema: [{ key: 'condition', type: 'text', label: 'Condition', required: true }],
    inputPorts: [],
    outputPorts: [],
  },
  delay: {
    type: 'delay',
    name: 'Delay',
    description: 'Wait for a specified duration',
    icon: 'timer',
    category: 'logic',
    configSchema: [{ key: 'duration', type: 'text', label: 'Duration', required: true }],
    inputPorts: [],
    outputPorts: [],
  },
  filter: {
    type: 'filter',
    name: 'Filter',
    description: 'Filter items based on criteria',
    icon: 'filter',
    category: 'logic',
    configSchema: [{ key: 'criteria', type: 'text', label: 'Criteria', required: true }],
    inputPorts: [],
    outputPorts: [],
  },
  post_instagram: {
    type: 'post_instagram',
    name: 'Post to Instagram',
    description: 'Publish content to Instagram',
    icon: 'camera',
    category: 'output',
    configSchema: [],
    inputPorts: [],
    outputPorts: [{ key: 'post_id', type: 'string', label: 'Post ID' }],
  },
  post_tiktok: {
    type: 'post_tiktok',
    name: 'Post to TikTok',
    description: 'Publish content to TikTok',
    icon: 'music',
    category: 'output',
    configSchema: [],
    inputPorts: [],
    outputPorts: [{ key: 'post_id', type: 'string', label: 'Post ID' }],
  },
  post_youtube: {
    type: 'post_youtube',
    name: 'Post to YouTube',
    description: 'Upload content to YouTube',
    icon: 'youtube',
    category: 'output',
    configSchema: [],
    inputPorts: [],
    outputPorts: [{ key: 'post_id', type: 'string', label: 'Post ID' }],
  },
  notify: {
    type: 'notify',
    name: 'Notify',
    description: 'Send a notification',
    icon: 'bell',
    category: 'output',
    configSchema: [],
    inputPorts: [],
    outputPorts: [],
  },
}

// ─── Mock Workflows ───

export const MOCK_WORKFLOWS: Workflow[] = [
  {
    id: 'wf1',
    workspaceId: 'ws1',
    name: 'Daily YouTube → TikTok + IG',
    description:
      'Fetches latest YouTube video, clips 60s, generates caption, posts to TikTok and Instagram',
    status: 'active',
    triggerType: 'cron',
    triggerConfig: { schedule: '0 9 * * *' },
    nodes: [],
    edges: [],
    createdAt: '2026-02-01T00:00:00Z',
    updatedAt: '2026-03-09T09:00:00Z',
  },
  {
    id: 'wf2',
    workspaceId: 'ws1',
    name: 'Twitch Highlights → YouTube Shorts',
    description: 'Grabs top Twitch clips weekly, adds subtitles, uploads as YouTube Shorts',
    status: 'active',
    triggerType: 'cron',
    triggerConfig: { schedule: '0 10 * * 1' },
    nodes: [],
    edges: [],
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-03-07T10:00:00Z',
  },
  {
    id: 'wf3',
    workspaceId: 'ws1',
    name: 'Blog Post → Social Cards',
    description:
      'When a new blog post is published, generate social media cards and post across platforms',
    status: 'paused',
    triggerType: 'webhook',
    triggerConfig: {},
    nodes: [],
    edges: [],
    createdAt: '2026-01-20T00:00:00Z',
    updatedAt: '2026-03-02T00:00:00Z',
  },
  {
    id: 'wf4',
    workspaceId: 'ws1',
    name: 'Weekly Analytics Digest',
    description: 'Compiles weekly performance metrics and sends a summary notification',
    status: 'draft',
    triggerType: 'cron',
    triggerConfig: { schedule: '0 18 * * 5' },
    nodes: [],
    edges: [],
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-03-01T00:00:00Z',
  },
]

// ─── Mock Nodes for Editor (workflow wf1) ───

export const MOCK_EDITOR_NODES: WorkflowNode[] = [
  {
    id: 'n1',
    type: 'cron_trigger',
    position: { x: 60, y: 180 },
    config: { schedule: 'Every day at 9:00 AM' },
  },
  {
    id: 'n2',
    type: 'youtube_fetch',
    position: { x: 310, y: 120 },
    config: { channel_url: 'https://youtube.com/@channel' },
  },
  {
    id: 'n3',
    type: 'video_clip',
    position: { x: 560, y: 70 },
    config: { start: '0s', end: '60s' },
  },
  {
    id: 'n4',
    type: 'ai_caption',
    position: { x: 560, y: 260 },
    config: { tone: 'Engaging & casual', max_length: '280' },
  },
  { id: 'n5', type: 'post_tiktok', position: { x: 820, y: 70 }, config: {} },
  { id: 'n6', type: 'post_instagram', position: { x: 820, y: 260 }, config: {} },
]

export const MOCK_EDITOR_EDGES: WorkflowEdge[] = [
  {
    id: 'e1',
    sourceNodeId: 'n1',
    sourcePortKey: 'output',
    targetNodeId: 'n2',
    targetPortKey: 'input',
  },
  {
    id: 'e2',
    sourceNodeId: 'n2',
    sourcePortKey: 'output',
    targetNodeId: 'n3',
    targetPortKey: 'input',
  },
  {
    id: 'e3',
    sourceNodeId: 'n2',
    sourcePortKey: 'output',
    targetNodeId: 'n4',
    targetPortKey: 'input',
  },
  {
    id: 'e4',
    sourceNodeId: 'n3',
    sourcePortKey: 'output',
    targetNodeId: 'n5',
    targetPortKey: 'input',
  },
  {
    id: 'e5',
    sourceNodeId: 'n3',
    sourcePortKey: 'output',
    targetNodeId: 'n6',
    targetPortKey: 'input',
  },
  {
    id: 'e6',
    sourceNodeId: 'n4',
    sourcePortKey: 'output',
    targetNodeId: 'n5',
    targetPortKey: 'input',
  },
  {
    id: 'e7',
    sourceNodeId: 'n4',
    sourcePortKey: 'output',
    targetNodeId: 'n6',
    targetPortKey: 'input',
  },
]

// ─── Mock Execution History ───

export const MOCK_EXECUTIONS: WorkflowRun[] = [
  {
    id: 'run_001',
    workflowId: 'wf1',
    status: 'success',
    triggeredBy: 'cron',
    steps: [],
    startedAt: '2026-03-09T09:00:00Z',
    completedAt: '2026-03-09T09:00:12Z',
    durationMs: 12400,
  },
  {
    id: 'run_002',
    workflowId: 'wf1',
    status: 'success',
    triggeredBy: 'cron',
    steps: [],
    startedAt: '2026-03-08T09:00:00Z',
    completedAt: '2026-03-08T09:00:14Z',
    durationMs: 14100,
  },
  {
    id: 'run_003',
    workflowId: 'wf1',
    status: 'failed',
    triggeredBy: 'cron',
    steps: [],
    startedAt: '2026-03-06T09:00:00Z',
    completedAt: '2026-03-06T09:00:08Z',
    durationMs: 8200,
  },
  {
    id: 'run_004',
    workflowId: 'wf1',
    status: 'success',
    triggeredBy: 'cron',
    steps: [],
    startedAt: '2026-03-05T09:00:00Z',
    completedAt: '2026-03-05T09:00:11Z',
    durationMs: 11800,
  },
]

// ─── Mock Preview Data ───

export const MOCK_PREVIEW_DATA: Record<string, Record<string, string>> = {
  youtube_fetch: {
    video_url: 'https://youtube.com/watch?v=abc123',
    title: 'How I Built My SaaS in 30 Days',
    duration: '847',
    transcript: "Hey everyone, today I'm going to walk you through...",
  },
  ai_caption: {
    caption:
      "Building a SaaS in 30 days — here's what I learned\n\nThe hardest part wasn't coding...",
    hashtags: '#saas, #buildinpublic, #indiehacker',
  },
  video_clip: {
    clip_url: 'https://cdn.grow.online/clips/abc123_0-60.mp4',
    duration: '60',
  },
}
