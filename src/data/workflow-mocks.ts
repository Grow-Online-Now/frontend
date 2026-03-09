/**
 * Mock data for the Automate / Workflows module
 * Used during development before API integration
 */

import {
  Zap,
  Clock,
  Play,
  Link,
  Film,
  MonitorPlay,
  Gamepad2,
  Scissors,
  Captions,
  Image,
  Sparkles,
  FileText,
  Bot,
  Globe,
  GitBranch,
  Timer,
  Filter,
  Camera,
  Music,
  Youtube,
  Bell,
  Upload,
} from 'lucide-react'
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
    key: 'cron_trigger',
    category: 'trigger',
    nameKey: 'dashboard.workflows.nodes.cronTrigger.name',
    descriptionKey: 'dashboard.workflows.nodes.cronTrigger.desc',
    icon: Clock,
    configSchema: [
      { key: 'schedule', type: 'cron', labelKey: 'dashboard.workflows.fields.schedule', required: true },
    ],
    outputs: [],
  },
  manual_trigger: {
    key: 'manual_trigger',
    category: 'trigger',
    nameKey: 'dashboard.workflows.nodes.manualTrigger.name',
    descriptionKey: 'dashboard.workflows.nodes.manualTrigger.desc',
    icon: Play,
    configSchema: [],
    outputs: [],
  },
  webhook_trigger: {
    key: 'webhook_trigger',
    category: 'trigger',
    nameKey: 'dashboard.workflows.nodes.webhookTrigger.name',
    descriptionKey: 'dashboard.workflows.nodes.webhookTrigger.desc',
    icon: Link,
    configSchema: [],
    outputs: [],
  },
  youtube_fetch: {
    key: 'youtube_fetch',
    category: 'media',
    nameKey: 'dashboard.workflows.nodes.youtubeFetch.name',
    descriptionKey: 'dashboard.workflows.nodes.youtubeFetch.desc',
    icon: MonitorPlay,
    configSchema: [
      { key: 'channel_url', type: 'text', labelKey: 'dashboard.workflows.fields.channelUrl', required: true },
    ],
    outputs: [
      { key: 'video_url', type: 'string' },
      { key: 'title', type: 'string' },
      { key: 'duration', type: 'number' },
      { key: 'transcript', type: 'string' },
    ],
  },
  twitch_clip: {
    key: 'twitch_clip',
    category: 'media',
    nameKey: 'dashboard.workflows.nodes.twitchClip.name',
    descriptionKey: 'dashboard.workflows.nodes.twitchClip.desc',
    icon: Gamepad2,
    configSchema: [
      { key: 'channel', type: 'text', labelKey: 'dashboard.workflows.fields.channel', required: true },
    ],
    outputs: [
      { key: 'clip_url', type: 'string' },
      { key: 'title', type: 'string' },
    ],
  },
  video_clip: {
    key: 'video_clip',
    category: 'media',
    nameKey: 'dashboard.workflows.nodes.videoClip.name',
    descriptionKey: 'dashboard.workflows.nodes.videoClip.desc',
    icon: Scissors,
    configSchema: [
      { key: 'start', type: 'text', labelKey: 'dashboard.workflows.fields.start', required: true },
      { key: 'end', type: 'text', labelKey: 'dashboard.workflows.fields.end', required: true },
    ],
    outputs: [
      { key: 'clip_url', type: 'string' },
      { key: 'duration', type: 'number' },
    ],
  },
  subtitle_overlay: {
    key: 'subtitle_overlay',
    category: 'media',
    nameKey: 'dashboard.workflows.nodes.subtitleOverlay.name',
    descriptionKey: 'dashboard.workflows.nodes.subtitleOverlay.desc',
    icon: Captions,
    configSchema: [],
    outputs: [{ key: 'video_url', type: 'string' }],
  },
  thumbnail_gen: {
    key: 'thumbnail_gen',
    category: 'media',
    nameKey: 'dashboard.workflows.nodes.thumbnailGen.name',
    descriptionKey: 'dashboard.workflows.nodes.thumbnailGen.desc',
    icon: Image,
    configSchema: [],
    outputs: [{ key: 'thumbnail_url', type: 'string' }],
  },
  text_template: {
    key: 'text_template',
    category: 'text',
    nameKey: 'dashboard.workflows.nodes.textTemplate.name',
    descriptionKey: 'dashboard.workflows.nodes.textTemplate.desc',
    icon: FileText,
    configSchema: [
      { key: 'template', type: 'textarea', labelKey: 'dashboard.workflows.fields.template', required: true },
    ],
    outputs: [{ key: 'text', type: 'string' }],
  },
  ai_caption: {
    key: 'ai_caption',
    category: 'text',
    nameKey: 'dashboard.workflows.nodes.aiCaption.name',
    descriptionKey: 'dashboard.workflows.nodes.aiCaption.desc',
    icon: Bot,
    configSchema: [
      { key: 'tone', type: 'text', labelKey: 'dashboard.workflows.fields.tone', required: true },
      { key: 'max_length', type: 'number', labelKey: 'dashboard.workflows.fields.maxLength' },
    ],
    outputs: [
      { key: 'caption', type: 'string' },
      { key: 'hashtags', type: 'string[]' },
    ],
  },
  ai_translate: {
    key: 'ai_translate',
    category: 'text',
    nameKey: 'dashboard.workflows.nodes.aiTranslate.name',
    descriptionKey: 'dashboard.workflows.nodes.aiTranslate.desc',
    icon: Globe,
    configSchema: [
      {
        key: 'target_language',
        type: 'select',
        labelKey: 'dashboard.workflows.fields.targetLanguage',
        required: true,
        options: [
          { labelKey: 'dashboard.workflows.languages.en', value: 'en' },
          { labelKey: 'dashboard.workflows.languages.es', value: 'es' },
          { labelKey: 'dashboard.workflows.languages.fr', value: 'fr' },
        ],
      },
    ],
    outputs: [{ key: 'translated_text', type: 'string' }],
  },
  if_else: {
    key: 'if_else',
    category: 'logic',
    nameKey: 'dashboard.workflows.nodes.ifElse.name',
    descriptionKey: 'dashboard.workflows.nodes.ifElse.desc',
    icon: GitBranch,
    configSchema: [
      { key: 'condition', type: 'text', labelKey: 'dashboard.workflows.fields.condition', required: true },
    ],
    outputs: [],
  },
  delay: {
    key: 'delay',
    category: 'logic',
    nameKey: 'dashboard.workflows.nodes.delay.name',
    descriptionKey: 'dashboard.workflows.nodes.delay.desc',
    icon: Timer,
    configSchema: [
      { key: 'duration', type: 'text', labelKey: 'dashboard.workflows.fields.duration', required: true },
    ],
    outputs: [],
  },
  filter: {
    key: 'filter',
    category: 'logic',
    nameKey: 'dashboard.workflows.nodes.filter.name',
    descriptionKey: 'dashboard.workflows.nodes.filter.desc',
    icon: Filter,
    configSchema: [
      { key: 'criteria', type: 'text', labelKey: 'dashboard.workflows.fields.criteria', required: true },
    ],
    outputs: [],
  },
  post_instagram: {
    key: 'post_instagram',
    category: 'output',
    nameKey: 'dashboard.workflows.nodes.postInstagram.name',
    descriptionKey: 'dashboard.workflows.nodes.postInstagram.desc',
    icon: Camera,
    configSchema: [],
    outputs: [{ key: 'post_id', type: 'string' }],
  },
  post_tiktok: {
    key: 'post_tiktok',
    category: 'output',
    nameKey: 'dashboard.workflows.nodes.postTiktok.name',
    descriptionKey: 'dashboard.workflows.nodes.postTiktok.desc',
    icon: Music,
    configSchema: [],
    outputs: [{ key: 'post_id', type: 'string' }],
  },
  post_youtube: {
    key: 'post_youtube',
    category: 'output',
    nameKey: 'dashboard.workflows.nodes.postYoutube.name',
    descriptionKey: 'dashboard.workflows.nodes.postYoutube.desc',
    icon: Youtube,
    configSchema: [],
    outputs: [{ key: 'post_id', type: 'string' }],
  },
  notify: {
    key: 'notify',
    category: 'output',
    nameKey: 'dashboard.workflows.nodes.notify.name',
    descriptionKey: 'dashboard.workflows.nodes.notify.desc',
    icon: Bell,
    configSchema: [],
    outputs: [],
  },
}

// ─── Mock Workflows ───

export const MOCK_WORKFLOWS: Workflow[] = [
  {
    id: 'wf1',
    name: 'Daily YouTube → TikTok + IG',
    description: 'Fetches latest YouTube video, clips 60s, generates caption, posts to TikTok and Instagram',
    status: 'active',
    trigger: 'Cron · Every day at 9:00 AM',
    nodes: [],
    edges: [],
    lastRun: '2 min ago',
    lastStatus: 'success',
    runCount: 47,
    nodeCount: 6,
    createdAt: '2026-02-01T00:00:00Z',
    updatedAt: '2026-03-09T09:00:00Z',
  },
  {
    id: 'wf2',
    name: 'Twitch Highlights → YouTube Shorts',
    description: 'Grabs top Twitch clips weekly, adds subtitles, uploads as YouTube Shorts',
    status: 'active',
    trigger: 'Cron · Every Monday at 10:00 AM',
    nodes: [],
    edges: [],
    lastRun: '2 days ago',
    lastStatus: 'success',
    runCount: 12,
    nodeCount: 5,
    createdAt: '2026-01-15T00:00:00Z',
    updatedAt: '2026-03-07T10:00:00Z',
  },
  {
    id: 'wf3',
    name: 'Blog Post → Social Cards',
    description: 'When a new blog post is published, generate social media cards and post across platforms',
    status: 'paused',
    trigger: 'Webhook',
    nodes: [],
    edges: [],
    lastRun: '1 week ago',
    lastStatus: 'success',
    runCount: 8,
    nodeCount: 4,
    createdAt: '2026-01-20T00:00:00Z',
    updatedAt: '2026-03-02T00:00:00Z',
  },
  {
    id: 'wf4',
    name: 'Weekly Analytics Digest',
    description: 'Compiles weekly performance metrics and sends a summary notification',
    status: 'draft',
    trigger: 'Cron · Every Friday at 6:00 PM',
    nodes: [],
    edges: [],
    lastRun: null,
    lastStatus: null,
    runCount: 0,
    nodeCount: 3,
    createdAt: '2026-03-01T00:00:00Z',
    updatedAt: '2026-03-01T00:00:00Z',
  },
]

// ─── Mock Nodes for Editor (workflow wf1) ───

export const MOCK_EDITOR_NODES: WorkflowNode[] = [
  { id: 'n1', type: 'cron_trigger', position: { x: 60, y: 180 }, config: { schedule: 'Every day at 9:00 AM' } },
  { id: 'n2', type: 'youtube_fetch', position: { x: 310, y: 120 }, config: { channel_url: 'https://youtube.com/@channel' } },
  { id: 'n3', type: 'video_clip', position: { x: 560, y: 70 }, config: { start: '0s', end: '60s' } },
  { id: 'n4', type: 'ai_caption', position: { x: 560, y: 260 }, config: { tone: 'Engaging & casual', max_length: '280' } },
  { id: 'n5', type: 'post_tiktok', position: { x: 820, y: 70 }, config: {} },
  { id: 'n6', type: 'post_instagram', position: { x: 820, y: 260 }, config: {} },
]

export const MOCK_EDITOR_EDGES: WorkflowEdge[] = [
  { id: 'e1', sourceNodeId: 'n1', targetNodeId: 'n2' },
  { id: 'e2', sourceNodeId: 'n2', targetNodeId: 'n3' },
  { id: 'e3', sourceNodeId: 'n2', targetNodeId: 'n4' },
  { id: 'e4', sourceNodeId: 'n3', targetNodeId: 'n5' },
  { id: 'e5', sourceNodeId: 'n3', targetNodeId: 'n6' },
  { id: 'e6', sourceNodeId: 'n4', targetNodeId: 'n5' },
  { id: 'e7', sourceNodeId: 'n4', targetNodeId: 'n6' },
]

// ─── Mock Execution History ───

export const MOCK_EXECUTIONS: WorkflowRun[] = [
  { id: 'run_001', workflowId: 'wf1', status: 'success', startedAt: 'Today, 09:00', duration: '12.4s', stepsCompleted: 6, stepsTotal: 6 },
  { id: 'run_002', workflowId: 'wf1', status: 'success', startedAt: 'Yesterday, 09:00', duration: '14.1s', stepsCompleted: 6, stepsTotal: 6 },
  { id: 'run_003', workflowId: 'wf1', status: 'failed', startedAt: 'Mar 6, 09:00', duration: '8.2s', stepsCompleted: 4, stepsTotal: 6 },
  { id: 'run_004', workflowId: 'wf1', status: 'success', startedAt: 'Mar 5, 09:00', duration: '11.8s', stepsCompleted: 6, stepsTotal: 6 },
]

// ─── Mock Preview Data ───

export const MOCK_PREVIEW_DATA: Record<string, Record<string, string>> = {
  youtube_fetch: {
    video_url: 'https://youtube.com/watch?v=abc123',
    title: 'How I Built My SaaS in 30 Days',
    duration: '847',
    transcript: 'Hey everyone, today I\'m going to walk you through...',
  },
  ai_caption: {
    caption: 'Building a SaaS in 30 days — here\'s what I learned\n\nThe hardest part wasn\'t coding...',
    hashtags: '#saas, #buildinpublic, #indiehacker',
  },
  video_clip: {
    clip_url: 'https://cdn.grow.online/clips/abc123_0-60.mp4',
    duration: '60',
  },
}
