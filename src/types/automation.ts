export type AutomationTemplateType = 'youtube_to_clips' | 'twitch_to_clips'
export type AutomationStatus = 'active' | 'paused' | 'draft'
export type AutomationRunStatus = 'running' | 'completed' | 'failed' | 'no_new_content'

export interface SourceConfig {
  channelUrl: string
  contentType?: 'clip' | 'vod'
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
