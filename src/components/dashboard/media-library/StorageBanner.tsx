/**
 * StorageBanner
 * Displays workspace storage usage with a breakdown by media type
 */

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { HardDrive, Image, Video } from 'lucide-react'
import { getStorageUsage } from '@/services/media.service'
import type { StorageUsage } from '@/types/media'

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const value = bytes / Math.pow(k, i)
  return `${value < 10 ? value.toFixed(1) : Math.round(value)} ${units[i]}`
}

interface StorageBannerProps {
  className?: string
  /** Increment to trigger a refetch */
  refreshKey?: number
}

export function StorageBanner({ className = '', refreshKey = 0 }: StorageBannerProps) {
  const { t } = useTranslation()
  const [usage, setUsage] = useState<StorageUsage | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    getStorageUsage()
      .then((data) => {
        if (!cancelled) setUsage(data)
      })
      .catch(() => {
        // Silently fail — banner is non-critical
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [refreshKey])

  if (isLoading) {
    return (
      <div className={`bg-bg-elevated border-border-default rounded-xl border p-4 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="bg-bg-hover h-9 w-9 animate-pulse rounded-lg" />
          <div className="flex-1 space-y-2">
            <div className="bg-bg-hover h-4 w-32 animate-pulse rounded" />
            <div className="bg-bg-hover h-2 w-full animate-pulse rounded-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!usage) return null

  const { totalBytes, fileCount, byType } = usage
  const imagePercent = totalBytes > 0 ? (byType.image.bytes / totalBytes) * 100 : 0
  const videoPercent = totalBytes > 0 ? (byType.video.bytes / totalBytes) * 100 : 0

  return (
    <div className={`bg-bg-elevated border-border-default rounded-xl border p-4 ${className}`}>
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-bg-hover flex h-9 w-9 items-center justify-center rounded-lg">
            <HardDrive className="text-text-secondary h-4 w-4" />
          </div>
          <div>
            <p className="text-text-primary text-sm font-medium">
              {formatBytes(totalBytes)}
            </p>
            <p className="text-text-muted text-xs">
              {t('dashboard.media.storage.fileCount', { count: fileCount })}
            </p>
          </div>
        </div>
      </div>

      {/* Bar */}
      {totalBytes > 0 && (
        <div className="mt-3 flex h-1.5 w-full overflow-hidden rounded-full bg-bg-hover">
          {imagePercent > 0 && (
            <div
              className="bg-info h-full transition-all"
              style={{ width: `${imagePercent}%` }}
            />
          )}
          {videoPercent > 0 && (
            <div
              className="bg-warning h-full transition-all"
              style={{ width: `${videoPercent}%` }}
            />
          )}
        </div>
      )}

      {/* Breakdown */}
      <div className="mt-3 flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Image className="text-info h-3.5 w-3.5" />
          <span className="text-text-secondary text-xs">
            {t('dashboard.media.storage.images', { size: formatBytes(byType.image.bytes), count: byType.image.count })}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Video className="text-warning h-3.5 w-3.5" />
          <span className="text-text-secondary text-xs">
            {t('dashboard.media.storage.videos', { size: formatBytes(byType.video.bytes), count: byType.video.count })}
          </span>
        </div>
      </div>
    </div>
  )
}
