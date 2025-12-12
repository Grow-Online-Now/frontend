/**
 * ThumbnailSelectorModal Component
 * Modal for selecting a video frame as thumbnail
 */

import { useRef, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { extractVideoFrame, blobToThumbnailFile, formatVideoTime } from '@/lib/video-utils'

interface ThumbnailSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  videoUrl: string
  videoFileName: string
  onFrameSelected: (file: File) => void
}

export function ThumbnailSelectorModal({
  isOpen,
  onClose,
  videoUrl,
  videoFileName,
  onFrameSelected,
}: ThumbnailSelectorModalProps) {
  const { t } = useTranslation()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isExtracting, setIsExtracting] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [error, setError] = useState<string | null>(null)

  // Update current time display when video time changes
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    return () => video.removeEventListener('timeupdate', handleTimeUpdate)
  }, [isOpen])

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setError(null)
      setCurrentTime(0)
    }
  }, [isOpen])

  const handleExtractFrame = async () => {
    const video = videoRef.current
    if (!video) return

    setIsExtracting(true)
    setError(null)

    try {
      // Pause the video to ensure we get the exact frame
      video.pause()

      // Extract the frame
      const blob = await extractVideoFrame(video)

      // Convert to File
      const file = blobToThumbnailFile(blob, videoFileName)

      // Call the callback
      onFrameSelected(file)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract frame')
    } finally {
      setIsExtracting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {t('dashboard.createPost.platformConfig.youtube.thumbnailSelector.title')}
          </DialogTitle>
          <p className="text-muted-foreground text-sm">
            {t('dashboard.createPost.platformConfig.youtube.thumbnailSelector.description')}
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Video Player */}
          <div className="bg-muted/30 relative overflow-hidden rounded-lg">
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              className="aspect-video w-full"
              preload="metadata"
            />
          </div>

          {/* Current Time Display */}
          <p className="text-muted-foreground text-center text-sm">
            {t('dashboard.createPost.platformConfig.youtube.thumbnailSelector.currentTime', {
              time: formatVideoTime(currentTime),
            })}
          </p>

          {/* Error Display */}
          {error && <p className="text-destructive text-center text-sm">{error}</p>}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={isExtracting}>
              {t('dashboard.createPost.platformConfig.youtube.thumbnailSelector.cancel')}
            </Button>
            <Button onClick={handleExtractFrame} disabled={isExtracting}>
              {isExtracting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isExtracting
                ? t('dashboard.createPost.platformConfig.youtube.thumbnailSelector.extracting')
                : t('dashboard.createPost.platformConfig.youtube.thumbnailSelector.select')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
