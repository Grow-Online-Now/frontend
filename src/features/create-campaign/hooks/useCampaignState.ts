/**
 * useCampaignState Hook
 * Manages the state for the Create Campaign page
 */

import { useReducer, useCallback, useMemo } from 'react'
import type { Connection } from '@/types/connections'
import type { ScheduleType } from '@/types/posts'
import type { CampaignState, CampaignAction, MediaAsset, PlatformVariation } from '../types'
import { createInitialCampaignState, createPlatformVariation } from '../types'

/**
 * Campaign state reducer
 */
function campaignReducer(state: CampaignState, action: CampaignAction): CampaignState {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, name: action.payload }

    case 'SET_MASTER_CAPTION': {
      const newState = { ...state, masterCaption: action.payload }
      // Auto-sync to all platforms that are synced to master
      newState.platformVariations = state.platformVariations.map((variation) =>
        variation.isSyncedToMaster ? { ...variation, caption: action.payload } : variation
      )
      return newState
    }

    case 'SET_SCHEDULE':
      return { ...state, schedule: action.payload }

    case 'SET_SCHEDULED_TIME':
      return { ...state, scheduledTime: action.payload }

    case 'ADD_ASSET':
      return { ...state, assets: [...state.assets, action.payload] }

    case 'REMOVE_ASSET': {
      const assetId = action.payload
      return {
        ...state,
        assets: state.assets.filter((a) => a.id !== assetId),
        // Also remove from any platform variations using this asset
        platformVariations: state.platformVariations.map((v) =>
          v.mediaAssetId === assetId ? { ...v, mediaAssetId: null } : v
        ),
      }
    }

    case 'ADD_PLATFORM_VARIATION':
      return {
        ...state,
        platformVariations: [...state.platformVariations, action.payload],
      }

    case 'REMOVE_PLATFORM_VARIATION':
      return {
        ...state,
        platformVariations: state.platformVariations.filter(
          (v) => v.connectionId !== action.payload
        ),
      }

    case 'UPDATE_PLATFORM_VARIATION':
      return {
        ...state,
        platformVariations: state.platformVariations.map((v) =>
          v.connectionId === action.payload.connectionId ? { ...v, ...action.payload.updates } : v
        ),
      }

    case 'TOGGLE_PLATFORM_INCLUDE':
      return {
        ...state,
        platformVariations: state.platformVariations.map((v) =>
          v.connectionId === action.payload ? { ...v, included: !v.included } : v
        ),
      }

    case 'TOGGLE_PLATFORM_SYNC': {
      return {
        ...state,
        platformVariations: state.platformVariations.map((v) => {
          if (v.connectionId !== action.payload) return v

          // If currently synced, unsync and keep current caption
          // If currently unsynced, sync and copy master caption
          const newIsSynced = !v.isSyncedToMaster
          return {
            ...v,
            isSyncedToMaster: newIsSynced,
            caption: newIsSynced ? state.masterCaption : v.caption,
          }
        }),
      }
    }

    case 'SET_PLATFORM_MEDIA':
      return {
        ...state,
        platformVariations: state.platformVariations.map((v) =>
          v.connectionId === action.payload.connectionId
            ? { ...v, mediaAssetId: action.payload.assetId }
            : v
        ),
      }

    case 'SET_PLATFORM_CAPTION':
      return {
        ...state,
        platformVariations: state.platformVariations.map((v) =>
          v.connectionId === action.payload.connectionId
            ? { ...v, caption: action.payload.caption, isSyncedToMaster: false }
            : v
        ),
      }

    case 'SYNC_ALL_CAPTIONS':
      return {
        ...state,
        platformVariations: state.platformVariations.map((v) => ({
          ...v,
          isSyncedToMaster: true,
          caption: state.masterCaption,
        })),
      }

    case 'RESET':
      return createInitialCampaignState()

    case 'LOAD_STATE':
      return action.payload

    default:
      return state
  }
}

/**
 * useCampaignState hook
 */
export function useCampaignState(_connections: Connection[]) {
  // Note: connections param kept for future use when auto-initializing variations
  void _connections
  const [state, dispatch] = useReducer(campaignReducer, undefined, createInitialCampaignState)

  // Initialize platform variations when connections change
  const initializePlatforms = useCallback(
    (conns: Connection[]) => {
      // Get active connections
      const activeConnections = conns.filter((c) => c.isActive && !c.isExpired && !c.needsRefresh)

      // Create variations for new connections
      activeConnections.forEach((conn) => {
        const exists = state.platformVariations.some((v) => v.connectionId === conn.id)
        if (!exists) {
          dispatch({
            type: 'ADD_PLATFORM_VARIATION',
            payload: createPlatformVariation(conn),
          })
        }
      })

      // Remove variations for disconnected accounts
      state.platformVariations.forEach((variation) => {
        const stillExists = activeConnections.some((c) => c.id === variation.connectionId)
        if (!stillExists) {
          dispatch({
            type: 'REMOVE_PLATFORM_VARIATION',
            payload: variation.connectionId,
          })
        }
      })
    },
    [state.platformVariations]
  )

  // Actions
  const setName = useCallback((name: string) => {
    dispatch({ type: 'SET_NAME', payload: name })
  }, [])

  const setMasterCaption = useCallback((caption: string) => {
    dispatch({ type: 'SET_MASTER_CAPTION', payload: caption })
  }, [])

  const setSchedule = useCallback((schedule: ScheduleType) => {
    dispatch({ type: 'SET_SCHEDULE', payload: schedule })
  }, [])

  const setScheduledTime = useCallback((time: Date | undefined) => {
    dispatch({ type: 'SET_SCHEDULED_TIME', payload: time })
  }, [])

  const addAsset = useCallback((asset: MediaAsset) => {
    dispatch({ type: 'ADD_ASSET', payload: asset })
  }, [])

  const removeAsset = useCallback((assetId: string) => {
    dispatch({ type: 'REMOVE_ASSET', payload: assetId })
  }, [])

  const togglePlatformInclude = useCallback((connectionId: string) => {
    dispatch({ type: 'TOGGLE_PLATFORM_INCLUDE', payload: connectionId })
  }, [])

  const togglePlatformSync = useCallback((connectionId: string) => {
    dispatch({ type: 'TOGGLE_PLATFORM_SYNC', payload: connectionId })
  }, [])

  const setPlatformMedia = useCallback((connectionId: string, assetId: string | null) => {
    dispatch({ type: 'SET_PLATFORM_MEDIA', payload: { connectionId, assetId } })
  }, [])

  const setPlatformCaption = useCallback((connectionId: string, caption: string) => {
    dispatch({ type: 'SET_PLATFORM_CAPTION', payload: { connectionId, caption } })
  }, [])

  const updatePlatformVariation = useCallback(
    (connectionId: string, updates: Partial<PlatformVariation>) => {
      dispatch({
        type: 'UPDATE_PLATFORM_VARIATION',
        payload: { connectionId, updates },
      })
    },
    []
  )

  const syncAllCaptions = useCallback(() => {
    dispatch({ type: 'SYNC_ALL_CAPTIONS' })
  }, [])

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' })
  }, [])

  // Computed values
  const includedVariations = useMemo(
    () => state.platformVariations.filter((v) => v.included),
    [state.platformVariations]
  )

  const includedCount = useMemo(() => includedVariations.length, [includedVariations])

  const hasUnsyncedCaptions = useMemo(
    () => state.platformVariations.some((v) => v.included && !v.isSyncedToMaster),
    [state.platformVariations]
  )

  const getVariationForConnection = useCallback(
    (connectionId: string): PlatformVariation | undefined => {
      return state.platformVariations.find((v) => v.connectionId === connectionId)
    },
    [state.platformVariations]
  )

  const getAssetById = useCallback(
    (assetId: string): MediaAsset | undefined => {
      return state.assets.find((a) => a.id === assetId)
    },
    [state.assets]
  )

  // Validation
  const validateCampaign = useCallback((): {
    isValid: boolean
    errors: string[]
  } => {
    const errors: string[] = []

    // Must have at least one included platform
    if (includedCount === 0) {
      errors.push('validation.noPlatformsSelected')
    }

    // Must have caption or media
    const hasContent = state.masterCaption.trim() || state.assets.length > 0
    if (!hasContent) {
      errors.push('validation.noContent')
    }

    // Scheduled posts must have a time
    if (state.schedule === 'scheduled' && !state.scheduledTime) {
      errors.push('validation.noScheduledTime')
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }, [includedCount, state.masterCaption, state.assets.length, state.schedule, state.scheduledTime])

  return {
    // State
    state,
    // Actions
    setName,
    setMasterCaption,
    setSchedule,
    setScheduledTime,
    addAsset,
    removeAsset,
    togglePlatformInclude,
    togglePlatformSync,
    setPlatformMedia,
    setPlatformCaption,
    updatePlatformVariation,
    syncAllCaptions,
    reset,
    initializePlatforms,
    // Computed
    includedVariations,
    includedCount,
    hasUnsyncedCaptions,
    getVariationForConnection,
    getAssetById,
    validateCampaign,
  }
}

export type UseCampaignStateReturn = ReturnType<typeof useCampaignState>
