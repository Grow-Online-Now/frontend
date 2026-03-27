/**
 * MediaPreviewModal Component
 * Full-size media preview with actions
 */

import { useTranslation } from 'react-i18next'
import { X, Trash2, PenSquare, Download, Image as ImageIcon, Film } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn, formatFileSize } from '@/lib/utils'
import { apiClient } from '@/lib/api-client'
import type { MediaItem } from '@/types/media'

interface MediaPreviewModalProps {
  media: MediaItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete?: (media: MediaItem) => void
  onUseInPost?: (media: MediaItem) => void
}

function formatDate(dateString: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(dateString))
}

export function MediaPreviewModal({
  media,
  open,
  onOpenChange,
  onDelete,
  onUseInPost,
}: MediaPreviewModalProps) {
  const { t, i18n } = useTranslation()

  if (!media) return null

  const isVideo = media.mediaType === 'video'

  const handleDownload = async () => {
    try {
      const { url } = await apiClient.get<{ url: string; expiresAt: string }>(
        `/api/media/${media.id}/download-url`
      )
      const link = document.createElement('a')
      link.href = url
      link.download = media.fileName
      link.target = '_blank'
      link.click()
    } catch {
      // Fallback to media.url if download-url endpoint fails
      if (!media.url) return
      const link = document.createElement('a')
      link.href = media.url
      link.download = media.fileName
      link.target = '_blank'
      link.click()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0">
        <DialogHeader className="border-border flex flex-row items-center justify-between border-b p-4">
          <DialogTitle className="text-base font-medium">
            {t('dashboard.media.preview.title')}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>

        <div className="flex flex-col md:flex-row">
          {/* Media Preview */}
          <div className="bg-muted/30 flex flex-1 items-center justify-center p-4">
            {media.url ? (
              isVideo ? (
                <video
                  src={media.url}
                  controls
                  className="max-h-[60vh] w-full rounded-lg object-contain"
                />
              ) : (
                <img
                  src={media.url}
                  alt={media.fileName}
                  className="max-h-[60vh] w-full rounded-lg object-contain"
                />
              )
            ) : (
              <div className="bg-muted flex h-64 w-full items-center justify-center rounded-lg">
                {isVideo ? (
                  <Film className="text-muted-foreground h-12 w-12" />
                ) : (
                  <ImageIcon className="text-muted-foreground h-12 w-12" />
                )}
              </div>
            )}
          </div>

          {/* Details Sidebar */}
          <div className="border-border w-full border-t p-4 md:w-72 md:border-t-0 md:border-l">
            {/* File Info */}
            <div className="space-y-3">
              <div>
                <p className="text-muted-foreground text-xs font-medium uppercase">
                  {t('dashboard.media.details.fileName')}
                </p>
                <p className="text-foreground mt-1 text-sm break-all">{media.fileName}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-muted-foreground text-xs font-medium uppercase">
                    {t('dashboard.media.details.fileType')}
                  </p>
                  <p className="text-foreground mt-1 text-sm capitalize">{media.mediaType}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs font-medium uppercase">
                    {t('dashboard.media.details.fileSize')}
                  </p>
                  <p className="text-foreground mt-1 text-sm">{formatFileSize(media.fileSize)}</p>
                </div>
              </div>

              <div>
                <p className="text-muted-foreground text-xs font-medium uppercase">
                  {t('dashboard.media.details.uploadedAt')}
                </p>
                <p className="text-foreground mt-1 text-sm">
                  {formatDate(media.createdAt, i18n.language)}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground text-xs font-medium uppercase">
                  {t('dashboard.media.details.status')}
                </p>
                <span
                  className={cn(
                    'mt-1 inline-block rounded px-2 py-0.5 text-xs font-medium',
                    media.status === 'ready' && 'bg-success/10 text-success',
                    media.status === 'pending' && 'bg-warning/10 text-warning',
                    media.status === 'failed' && 'bg-destructive/10 text-destructive'
                  )}
                >
                  {t(`dashboard.media.status.${media.status}`)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="border-border mt-6 space-y-2 border-t pt-6">
              {onUseInPost && (
                <Button
                  className="w-full"
                  onClick={() => {
                    onUseInPost(media)
                    onOpenChange(false)
                  }}
                >
                  <PenSquare className="mr-2 h-4 w-4" />
                  {t('dashboard.media.card.useInPost')}
                </Button>
              )}

              {media.url && (
                <Button variant="outline" className="w-full" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  {t('dashboard.media.card.download')}
                </Button>
              )}

              {onDelete && (
                <Button
                  variant="outline"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full"
                  onClick={() => {
                    onDelete(media)
                    onOpenChange(false)
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t('dashboard.media.card.delete')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
