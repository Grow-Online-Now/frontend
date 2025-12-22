import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

export function EnterpriseContact() {
  const { t } = useTranslation()

  const handleContact = () => {
    window.location.href = 'mailto:contact@growonline.now'
  }

  return (
    <div className="bg-bg-subtle rounded-xl p-6">
      <div className="flex flex-col items-center text-center md:flex-row md:items-start md:justify-between md:text-left">
        <div className="mb-4 md:mb-0">
          <h3 className="text-text-primary text-lg font-semibold tracking-tight">
            {t('dashboard.billing.enterprise.title')}
          </h3>
          <p className="text-text-muted mt-1 text-sm">
            {t('dashboard.billing.enterprise.description')}
          </p>
        </div>
        <Button onClick={handleContact} variant="outline" className="shrink-0">
          {t('dashboard.billing.enterprise.cta')}
        </Button>
      </div>
    </div>
  )
}
