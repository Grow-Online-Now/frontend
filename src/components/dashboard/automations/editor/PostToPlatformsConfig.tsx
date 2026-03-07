/**
 * PostToPlatformsConfig Component
 * Configuration panel for the post-to-platforms node
 */

import { useTranslation } from 'react-i18next'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useConnections } from '@/hooks/useConnections'
import { PlatformIcon } from '@/components/dashboard/posts/PlatformIcon'

interface PostToPlatformsConfigProps {
  config: Record<string, unknown>
  onChange: (config: Record<string, unknown>) => void
}

export function PostToPlatformsConfig({ config, onChange }: PostToPlatformsConfigProps) {
  const { t } = useTranslation()
  const { connections, isLoading } = useConnections()

  const selectedIds = (config.connectionIds as string[]) || []

  const activeConnections = connections.filter(
    (c) => c.isActive && !c.isExpired
  )

  const toggleConnection = (connectionId: string) => {
    const updated = selectedIds.includes(connectionId)
      ? selectedIds.filter((id) => id !== connectionId)
      : [...selectedIds, connectionId]
    onChange({ ...config, connectionIds: updated })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>
          {t('dashboard.automations.editor.config.post.connectionsLabel')}
        </Label>
        <p className="text-text-muted text-xs">
          {t('dashboard.automations.editor.config.post.connectionsHint')}
        </p>
      </div>

      {isLoading ? (
        <div className="text-text-muted py-4 text-center text-sm">
          {t('common.loading')}
        </div>
      ) : activeConnections.length === 0 ? (
        <div className="text-text-muted py-4 text-center text-sm">
          {t('dashboard.automations.editor.config.post.noConnections')}
        </div>
      ) : (
        <div className="space-y-2">
          {activeConnections.map((connection) => (
            <label
              key={connection.id}
              className="hover:bg-bg-hover flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-all duration-150"
            >
              <Checkbox
                checked={selectedIds.includes(connection.id)}
                onCheckedChange={() => toggleConnection(connection.id)}
              />
              <PlatformIcon platform={connection.platform} size="sm" showBackground />
              <div className="min-w-0 flex-1">
                <p className="text-text-primary truncate text-sm font-medium">
                  {connection.displayName || connection.platformUsername}
                </p>
                <p className="text-text-muted text-xs">{connection.platform}</p>
              </div>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
