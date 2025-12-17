import { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import { useWorkspaceMembers } from '@/hooks/useWorkspaceMembers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import type { WorkspaceRole } from '@/types/workspace'

interface InviteMemberModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function InviteMemberModalComponent({ open, onOpenChange }: InviteMemberModalProps) {
  const { t } = useTranslation()
  const { addMember } = useWorkspaceMembers()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<WorkspaceRole>('MEMBER')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setError(t('dashboard.workspace.members.errors.emailRequired'))
      return
    }

    if (!validateEmail(email.trim())) {
      setError(t('dashboard.workspace.members.errors.invalidEmail'))
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await addMember({
        email: email.trim(),
        role,
      })
      toast.success(t('dashboard.workspace.members.inviteSuccess'))
      onOpenChange(false)
      setEmail('')
      setRole('MEMBER')
    } catch (err) {
      const message =
        err instanceof Error ? err.message : t('dashboard.workspace.errors.inviteFailed')
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false)
      setEmail('')
      setRole('MEMBER')
      setError(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>{t('dashboard.workspace.members.inviteTitle')}</DialogTitle>
          <DialogDescription>
            {t('dashboard.workspace.members.inviteDescription')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="member-email">{t('dashboard.workspace.members.emailLabel')}</Label>
            <Input
              id="member-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('dashboard.workspace.members.emailPlaceholder')}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label>{t('dashboard.workspace.members.roleLabel')}</Label>
            <RadioGroup
              value={role}
              onValueChange={(value) => setRole(value as WorkspaceRole)}
              disabled={isLoading}
            >
              <div className="border-border flex items-start space-x-3 rounded-lg border p-3">
                <RadioGroupItem value="MEMBER" id="role-member" className="mt-0.5" />
                <div className="flex-1">
                  <Label htmlFor="role-member" className="cursor-pointer font-medium">
                    {t('dashboard.workspace.roles.member')}
                  </Label>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    {t('dashboard.workspace.members.memberRoleDescription')}
                  </p>
                </div>
              </div>
              <div className="border-border flex items-start space-x-3 rounded-lg border p-3">
                <RadioGroupItem value="OWNER" id="role-owner" className="mt-0.5" />
                <div className="flex-1">
                  <Label htmlFor="role-owner" className="cursor-pointer font-medium">
                    {t('dashboard.workspace.roles.owner')}
                  </Label>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    {t('dashboard.workspace.members.ownerRoleDescription')}
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              {t('common.actions.cancel')}
            </Button>
            <Button type="submit" disabled={isLoading || !email.trim()}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('dashboard.workspace.members.inviteSubmit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export const InviteMemberModal = memo(InviteMemberModalComponent)
