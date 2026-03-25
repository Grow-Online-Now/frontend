import { useState, useEffect, useCallback } from 'react'
import {
  getAutomations,
  getAutomation,
  deleteAutomation,
  activateAutomation,
  pauseAutomation,
  triggerAutomationRun,
} from '@/services/automations.service'
import type { Automation, AutomationsListResponse } from '@/types/automation'

export function useAutomations(params?: { status?: string }) {
  const [data, setData] = useState<AutomationsListResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await getAutomations({ status: params?.status })
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load automations')
    } finally {
      setIsLoading(false)
    }
  }, [params?.status])

  useEffect(() => {
    fetch()
  }, [fetch])

  const remove = useCallback(
    async (id: string) => {
      try {
        await deleteAutomation(id)
        await fetch()
        return true
      } catch {
        return false
      }
    },
    [fetch],
  )

  const activate = useCallback(
    async (id: string) => {
      try {
        await activateAutomation(id)
        await fetch()
        return true
      } catch {
        return false
      }
    },
    [fetch],
  )

  const pause = useCallback(
    async (id: string) => {
      try {
        await pauseAutomation(id)
        await fetch()
        return true
      } catch {
        return false
      }
    },
    [fetch],
  )

  const trigger = useCallback(
    async (id: string) => {
      try {
        await triggerAutomationRun(id)
        await fetch()
        return true
      } catch {
        return false
      }
    },
    [fetch],
  )

  return {
    automations: data?.automations ?? [],
    total: data?.total ?? 0,
    isLoading,
    error,
    refetch: fetch,
    remove,
    activate,
    pause,
    trigger,
  }
}

export function useAutomation(id: string | undefined) {
  const [automation, setAutomation] = useState<Automation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    if (!id) return
    setIsLoading(true)
    setError(null)
    try {
      const result = await getAutomation(id)
      setAutomation(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load automation')
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { automation, isLoading, error, refetch: fetch }
}
