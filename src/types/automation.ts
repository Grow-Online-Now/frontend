export type AutomationTemplateType = 'youtube_to_clips' | 'twitch_to_clips'
export type AutomationStatus = 'active' | 'paused' | 'draft' | 'failed'
export type AutomationRunStatus = 'running' | 'completed' | 'failed' | 'no_new_content'

export interface ChannelMeta {
  name: string
  handle: string
  subscriberCount: number | null
  videoCount: number | null
  viewCount: number | null
  thumbnailUrl: string | null
}

export interface SourceConfig {
  channelUrl: string
  contentType?: 'clip' | 'vod'
  channelMeta?: ChannelMeta
}

export interface ClipConfig {
  n_clips: number
  clip_duration_min: number
  clip_duration_max: number
  tone: string
}

export interface PostingConfig {
  socialAccountIds: string[]
  clipsPerDay: number
  postingTimes: string[]
  timezone: string
}

export interface AutomationRun {
  id: string
  automationId: string
  workflowRunId: string | null
  status: AutomationRunStatus
  videoUrl: string | null
  videoTitle: string | null
  clipsGenerated: number
  postsScheduled: number
  error: string | null
  startedAt: string
  completedAt: string | null
}

export interface Automation {
  id: string
  workspaceId: string
  name: string
  templateType: AutomationTemplateType
  status: AutomationStatus
  sourceConfig: SourceConfig
  clipConfig: ClipConfig
  subtitleConfig: Record<string, unknown>
  postingConfig: PostingConfig
  processedVideos: string[]
  workflowId: string | null
  createdAt: string
  updatedAt: string
  runs?: AutomationRun[]
}

export interface AutomationTemplate {
  type: AutomationTemplateType
  name: string
  description: string
  icon: string
}

export interface SubtitlePreset {
  key: string
  config: Record<string, unknown>
}

export interface AutomationsListResponse {
  automations: Automation[]
  total: number
}

export interface AutomationRunsResponse {
  runs: AutomationRun[]
  total: number
}

export interface TemplatesResponse {
  templates: AutomationTemplate[]
  subtitlePresets: SubtitlePreset[]
}

export interface CreateAutomationRequest {
  name: string
  templateType: AutomationTemplateType
  sourceConfig: SourceConfig
  clipConfig: ClipConfig
  subtitleConfig: Record<string, unknown>
  postingConfig: PostingConfig
  status?: 'active' | 'draft'
}

export interface UpdateAutomationRequest {
  name?: string
  sourceConfig?: SourceConfig
  clipConfig?: ClipConfig
  subtitleConfig?: Record<string, unknown>
  postingConfig?: PostingConfig
}

export interface AutomationPostMedia {
  id: string
  url: string | null
  fileName: string
  contentType: string
  mediaType: 'image' | 'video'
}

export interface AutomationPostAccount {
  id: string
  platform: string
  displayName: string | null
}

export interface AutomationPostPlatformResult {
  platform: string
  status: string
  url: string | null
  postedAt: string | null
}

export interface AutomationPost {
  id: string
  caption: string
  status: string
  scheduled_at: string | null
  created_at: string
  automationRunId: string | null
  media: AutomationPostMedia[]
  social_accounts: AutomationPostAccount[]
  platform_results: AutomationPostPlatformResult[]
}

export interface AutomationPostsResponse {
  posts: AutomationPost[]
}

// Wizard step state
export interface WizardState {
  source: {
    templateType: AutomationTemplateType | null
    channelUrl: string
    contentType: 'clip' | 'vod'
  }
  clips: ClipConfig
  subtitles: {
    preset: string
    config: Record<string, unknown>
  }
  posting: {
    socialAccountIds: string[]
    clipsPerDay: number
    postingTimes: string[]
  }
  name: string
}

export const DEFAULT_WIZARD_STATE: WizardState = {
  source: {
    templateType: null,
    channelUrl: '',
    contentType: 'clip',
  },
  clips: {
    n_clips: 3,
    clip_duration_min: 15,
    clip_duration_max: 60,
    tone: 'engaging',
  },
  subtitles: {
    preset: 'tiktok_viral',
    config: {},
  },
  posting: {
    socialAccountIds: [],
    clipsPerDay: 3,
    postingTimes: ['09:00', '14:00', '19:00'],
  },
  name: '',
}
