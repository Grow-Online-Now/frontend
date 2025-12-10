/**
 * CreateCampaignPage Component
 * Main page for creating multi-platform campaigns
 */

import { useState, useCallback, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core'
import type { DragStartEvent, DragEndEvent, DragOverEvent } from '@dnd-kit/core'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useConnections } from '@/hooks/useConnections'
import { useMediaUpload } from '@/hooks/useMediaUpload'
import { useCreatePost } from '@/hooks/useCreatePost'
import { useLocalizedHref } from '@/hooks/useLocalizedHref'
import { CampaignHeader } from './components/CampaignHeader'
import { MediaPanel, AssetThumbnailDragOverlay } from './components/MediaPanel'
import { MobileMediaBar } from './components/MobileMediaBar'
import { PlatformCardsGrid } from './components/PlatformCards'
import { SettingsPanel } from './components/SettingsPanel'
import { MobileSettingsSheet } from './components/MobileSettingsSheet'
import { useCampaignState } from './hooks/useCampaignState'
import { DND_CONFIG } from './constants'
import type { MediaAsset } from './types'

export function CreateCampaignPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const getLocalizedHref = useLocalizedHref()

  // Connections
  const { connections } = useConnections()

  // Media upload
  const {
    uploadsArray,
    isUploading,
    addFiles,
    removeFile,
    retryUpload,
    completedUploads,
    getMediaIds,
  } = useMediaUpload()

  // Post creation
  const { submitPost, isLoading: isSubmitting } = useCreatePost()

  // Campaign state
  const {
    state,
    setName,
    setMasterCaption,
    setSchedule,
    setScheduledTime,
    togglePlatformInclude,
    togglePlatformSync,
    setPlatformMedia,
    setPlatformCaption,
    updatePlatformVariation,
    includedVariations,
    includedCount,
    initializePlatforms,
    validateCampaign,
  } = useCampaignState(connections)

  // Local state
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [dragActiveId, setDragActiveId] = useState<string | null>(null)
  const [dragOverConnectionId, setDragOverConnectionId] = useState<string | null>(null)

  // Initialize platform variations when connections load
  useEffect(() => {
    if (connections.length > 0) {
      initializePlatforms(connections)
    }
  }, [connections, initializePlatforms])

  // Convert uploads to MediaAsset format for campaign state
  const mediaAssets = useMemo((): MediaAsset[] => {
    return completedUploads.map((upload) => ({
      id: upload.id,
      type: upload.type,
      url: upload.mediaItem?.url || upload.localUrl,
      thumbnailUrl: upload.localUrl,
      filename: upload.file.name,
      fileSize: upload.file.size,
      dimensions: { width: 0, height: 0 }, // Would need to extract from file
      mediaItem: upload.mediaItem || undefined,
    }))
  }, [completedUploads])

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: DND_CONFIG.dragActivationDelay,
        tolerance: 5,
      },
    })
  )

  // DnD handlers
  const handleDragStart = useCallback((event: DragStartEvent) => {
    setDragActiveId(event.active.id as string)
  }, [])

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { over } = event
    if (over?.data.current?.type === 'media-slot') {
      setDragOverConnectionId(over.data.current.connectionId)
    } else {
      setDragOverConnectionId(null)
    }
  }, [])

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      setDragActiveId(null)
      setDragOverConnectionId(null)

      if (!over) return

      // Check if dropped on a media slot
      if (over.data.current?.type === 'media-slot') {
        const connectionId = over.data.current.connectionId
        const assetId = active.id as string
        setPlatformMedia(connectionId, assetId)
      }
    },
    [setPlatformMedia]
  )

  // Media handlers
  const handleFilesAdded = useCallback(
    (files: FileList) => {
      addFiles(files)
    },
    [addFiles]
  )

  const handleMediaRemove = useCallback(
    async (id: string) => {
      await removeFile(id)
    },
    [removeFile]
  )

  // Platform card handlers
  const handlePlatformMediaDrop = useCallback(
    (connectionId: string, assetId: string) => {
      setPlatformMedia(connectionId, assetId)
    },
    [setPlatformMedia]
  )

  const handlePlatformMediaRemove = useCallback(
    (connectionId: string) => {
      setPlatformMedia(connectionId, null)
    },
    [setPlatformMedia]
  )

  const handleAddPlatform = useCallback(() => {
    // Navigate to accounts page to connect more platforms
    navigate(getLocalizedHref('/dashboard/accounts'))
  }, [navigate, getLocalizedHref])

  // Computed values
  const includedPlatforms = useMemo(() => {
    return includedVariations.map((v) => v.platform)
  }, [includedVariations])

  const syncedCount = useMemo(() => {
    return state.platformVariations.filter((v) => v.included && v.isSyncedToMaster).length
  }, [state.platformVariations])

  // Get the dragged upload for overlay
  const draggedUpload = useMemo(() => {
    if (!dragActiveId) return null
    return uploadsArray.find((u) => u.id === dragActiveId) || null
  }, [dragActiveId, uploadsArray])

  // Submit handler
  const handleSubmit = useCallback(async () => {
    const { isValid, errors } = validateCampaign()

    if (!isValid) {
      errors.forEach((errorKey) => {
        toast.error(t(`dashboard.campaign.${errorKey}`))
      })
      return
    }

    if (isUploading) {
      toast.error(t('dashboard.campaign.validation.uploadsInProgress'))
      return
    }

    try {
      // Build the request
      const mediaIds = getMediaIds()

      // For now, we'll use the master caption for all platforms
      // In a full implementation, we'd handle per-platform captions
      const result = await submitPost({
        caption: state.masterCaption,
        social_accounts: includedVariations.map((v) => v.connectionId),
        scheduled_at:
          state.schedule === 'scheduled' && state.scheduledTime
            ? state.scheduledTime.toISOString()
            : null,
        is_draft: state.schedule === 'draft',
        media_ids: mediaIds,
      })

      if (result) {
        toast.success(t('dashboard.campaign.success'))
        navigate(getLocalizedHref('/dashboard/posts'))
      }
    } catch (error) {
      toast.error(t('dashboard.campaign.error'))
    }
  }, [
    validateCampaign,
    isUploading,
    t,
    getMediaIds,
    submitPost,
    state.masterCaption,
    state.schedule,
    state.scheduledTime,
    includedVariations,
    navigate,
    getLocalizedHref,
  ])

  // Back handler
  const handleBack = useCallback(() => {
    navigate(getLocalizedHref('/dashboard/posts'))
  }, [navigate, getLocalizedHref])

  // Validation
  const canSubmit = useMemo(() => {
    const { isValid } = validateCampaign()
    return isValid && !isUploading
  }, [validateCampaign, isUploading])

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <CampaignHeader
          campaignName={state.name}
          onCampaignNameChange={setName}
          scheduleType={state.schedule}
          includedCount={includedCount}
          isSubmitting={isSubmitting}
          canSubmit={canSubmit}
          onSubmit={handleSubmit}
          onBack={handleBack}
        />

        {/* Mobile media bar (shown below lg breakpoint) */}
        <MobileMediaBar
          uploads={uploadsArray}
          isUploading={isUploading}
          onFilesAdded={handleFilesAdded}
          onRemove={handleMediaRemove}
          className="lg:hidden"
        />

        {/* Three-panel layout */}
        <div className="flex min-h-0 flex-1 gap-6 pt-6">
          {/* Left Panel: Media Assets (hidden on mobile/tablet) */}
          <MediaPanel
            uploads={uploadsArray}
            isUploading={isUploading}
            onFilesAdded={handleFilesAdded}
            onRemove={handleMediaRemove}
            onRetry={retryUpload}
            className="hidden flex-shrink-0 lg:flex"
          />

          {/* Center Panel: Platform Cards */}
          <PlatformCardsGrid
            connections={connections}
            variations={state.platformVariations}
            assets={mediaAssets}
            masterCaption={state.masterCaption}
            dragOverConnectionId={dragOverConnectionId}
            onToggleInclude={togglePlatformInclude}
            onMediaDrop={handlePlatformMediaDrop}
            onMediaRemove={handlePlatformMediaRemove}
            onCaptionChange={setPlatformCaption}
            onToggleSync={togglePlatformSync}
            onPlatformSettingsChange={(connectionId, settings) =>
              updatePlatformVariation(connectionId, { platformSettings: settings })
            }
            onAddPlatform={handleAddPlatform}
            className={cn('min-w-0 flex-1', 'campaign-panel-enter campaign-panel-enter-delay-1')}
          />

          {/* Right Panel: Settings (hidden on mobile/tablet) */}
          <SettingsPanel
            scheduleType={state.schedule}
            scheduledTime={state.scheduledTime}
            onScheduleChange={setSchedule}
            onScheduledTimeChange={setScheduledTime}
            masterCaption={state.masterCaption}
            onMasterCaptionChange={setMasterCaption}
            includedPlatforms={includedPlatforms}
            syncedCount={syncedCount}
            totalCount={includedCount}
            isPreviewMode={isPreviewMode}
            onPreviewModeChange={setIsPreviewMode}
            className="hidden flex-shrink-0 xl:flex"
          />
        </div>

        {/* Mobile settings sheet (shown below xl breakpoint) */}
        <MobileSettingsSheet
          scheduleType={state.schedule}
          scheduledTime={state.scheduledTime}
          onScheduleChange={setSchedule}
          onScheduledTimeChange={setScheduledTime}
          masterCaption={state.masterCaption}
          onMasterCaptionChange={setMasterCaption}
          includedPlatforms={includedPlatforms}
          syncedCount={syncedCount}
          totalCount={includedCount}
        />
      </div>

      {/* Drag overlay */}
      <DragOverlay dropAnimation={null}>
        {draggedUpload && <AssetThumbnailDragOverlay upload={draggedUpload} />}
      </DragOverlay>
    </DndContext>
  )
}
