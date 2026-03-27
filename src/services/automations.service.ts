import { apiClient } from '@/lib/api-client'
import { buildQueryString } from '@/lib/query-utils'
import type {
  Automation,
  AutomationRun,
  AutomationsListResponse,
  AutomationRunsResponse,
  TemplatesResponse,
  CreateAutomationRequest,
  UpdateAutomationRequest,
} from '@/types/automation'

const BASE = '/api/automations'

export async function getTemplates(): Promise<TemplatesResponse> {
  return apiClient.get<TemplatesResponse>(`${BASE}/templates`)
}

export async function getAutomations(params?: {
  page?: number
  limit?: number
  status?: string
}): Promise<AutomationsListResponse> {
  const query = buildQueryString(params)
  return apiClient.get<AutomationsListResponse>(`${BASE}${query}`)
}

export async function getAutomation(id: string): Promise<Automation> {
  return apiClient.get<Automation>(`${BASE}/${id}`)
}

export async function createAutomation(data: CreateAutomationRequest): Promise<Automation> {
  return apiClient.post<Automation>(BASE, data)
}

export async function updateAutomation(
  id: string,
  data: UpdateAutomationRequest
): Promise<Automation> {
  return apiClient.put<Automation>(`${BASE}/${id}`, data)
}

export async function deleteAutomation(id: string): Promise<void> {
  await apiClient.delete(`${BASE}/${id}`)
}

export async function activateAutomation(id: string): Promise<Automation> {
  return apiClient.post<Automation>(`${BASE}/${id}/activate`)
}

export async function pauseAutomation(id: string): Promise<Automation> {
  return apiClient.post<Automation>(`${BASE}/${id}/pause`)
}

export async function triggerAutomationRun(id: string): Promise<AutomationRun> {
  return apiClient.post<AutomationRun>(`${BASE}/${id}/run`)
}

export async function getAutomationRuns(
  id: string,
  params?: { page?: number; limit?: number }
): Promise<AutomationRunsResponse> {
  const query = buildQueryString(params)
  return apiClient.get<AutomationRunsResponse>(`${BASE}/${id}/runs${query}`)
}
