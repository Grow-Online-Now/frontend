/**
 * TriggerDataDialog Component
 * Dialog for entering trigger data key-value pairs before execution
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface TriggerDataDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onExecute: (data: Record<string, unknown>) => void
  isExecuting: boolean
}

interface KeyValuePair {
  key: string
  value: string
}

export function TriggerDataDialog({
  open,
  onOpenChange,
  onExecute,
  isExecuting,
}: TriggerDataDialogProps) {
  const { t } = useTranslation()
  const [pairs, setPairs] = useState<KeyValuePair[]>([{ key: '', value: '' }])

  const addPair = () => setPairs([...pairs, { key: '', value: '' }])

  const removePair = (index: number) => {
    setPairs(pairs.filter((_, i) => i !== index))
  }

  const updatePair = (index: number, field: 'key' | 'value', val: string) => {
    setPairs(pairs.map((p, i) => (i === index ? { ...p, [field]: val } : p)))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data: Record<string, unknown> = {}
    pairs.forEach(({ key, value }) => {
      if (key.trim()) {
        data[key.trim()] = value
      }
    })
    onExecute(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {t('dashboard.automations.executions.triggerDialog.title')}
          </DialogTitle>
          <DialogDescription>
            {t('dashboard.automations.executions.triggerDialog.description')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-2 py-4">
            {pairs.map((pair, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  placeholder={t(
                    'dashboard.automations.executions.triggerDialog.keyPlaceholder'
                  )}
                  value={pair.key}
                  onChange={(e) => updatePair(index, 'key', e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder={t(
                    'dashboard.automations.executions.triggerDialog.valuePlaceholder'
                  )}
                  value={pair.value}
                  onChange={(e) => updatePair(index, 'value', e.target.value)}
                  className="flex-1"
                />
                {pairs.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0"
                    onClick={() => removePair(index)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addPair}
              className="gap-1.5"
            >
              <Plus className="size-4" />
              {t('dashboard.automations.executions.triggerDialog.addField')}
            </Button>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {t('common.actions.cancel')}
            </Button>
            <Button type="submit" disabled={isExecuting}>
              {t('dashboard.automations.executions.triggerDialog.execute')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
