/**
 * Streak Service
 * Handles API calls for the posting streak system
 */

import { apiClient } from '@/lib/api-client'
import type { StreakResponse, UpdateTimezoneRequest } from '@/types/streak'

const ENDPOINTS = {
  streak: '/api/streaks',
  timezone: '/api/streaks/timezone',
} as const

/**
 * Get the current user's streak data
 */
export async function getStreak(): Promise<StreakResponse> {
  return apiClient.get<StreakResponse>(ENDPOINTS.streak)
}

/**
 * Update the user's timezone preference for streak calculation
 */
export async function updateTimezone(timezone: string): Promise<StreakResponse> {
  const body: UpdateTimezoneRequest = { timezone }
  return apiClient.patch<StreakResponse>(ENDPOINTS.timezone, body)
}

/**
 * Streak service object (alternative API)
 */
export const streakService = {
  get: getStreak,
  updateTimezone,
}
