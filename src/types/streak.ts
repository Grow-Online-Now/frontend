/**
 * Streak Types
 * Types for the posting streak system
 */

/**
 * Response from GET /api/streaks
 */
export interface StreakResponse {
  currentStreak: number
  longestStreak: number
  lastPostDate: string | null
  isActiveToday: boolean
  nextMilestone: number
}

/**
 * Request body for PATCH /api/streaks/timezone
 */
export interface UpdateTimezoneRequest {
  timezone: string
}
