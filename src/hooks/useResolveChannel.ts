import { useState, useEffect, useRef } from 'react'
import { resolveChannel } from '@/services/automations.service'
import type { ChannelMeta } from '@/types/automation'

export function useResolveChannel(
  channelUrl: string,
  platform: 'youtube' | 'twitch' | null
) {
  const [channelMeta, setChannelMeta] = useState<ChannelMeta | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    setChannelMeta(null)
    setError(null)

    if (!channelUrl || !platform || channelUrl.length < 10) {
      return
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(async () => {
      setIsLoading(true)
      setError(null)
      try {
        const meta = await resolveChannel(channelUrl, platform)
        setChannelMeta(meta)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to resolve channel'
        )
      } finally {
        setIsLoading(false)
      }
    }, 800)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [channelUrl, platform])

  return { channelMeta, isLoading, error }
}
