import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { usePlatformConfig } from '@/lib/platforms'
import { useLocalizedHref } from '@/hooks/useLocalizedHref'

export function PlatformFAQ() {
  const { t } = useTranslation()
  const localizeHref = useLocalizedHref()
  const config = usePlatformConfig()
  const { theme, faqs } = config

  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="bg-muted/20 relative px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-3xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="font-display text-foreground mb-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            {t('platforms.common.faq.title', { platform: t(config.nameKey) })}
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {t('platforms.common.faq.subtitle')}
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={cn(
                'border-border bg-card overflow-hidden rounded-xl border transition-all duration-300',
                openIndex === index && 'border-border shadow-sm'
              )}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="hover:bg-muted/50 flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition-colors"
                aria-expanded={openIndex === index}
              >
                <span className="text-foreground text-base font-medium">{t(faq.questionKey)}</span>
                <ChevronDown
                  className={cn(
                    'text-muted-foreground h-5 w-5 shrink-0 transition-transform duration-300',
                    openIndex === index && 'rotate-180'
                  )}
                />
              </button>

              <div
                className={cn(
                  'grid transition-all duration-300',
                  openIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                )}
              >
                <div className="overflow-hidden">
                  <div className="text-muted-foreground px-6 pb-4">
                    <p className="leading-relaxed">{t(faq.answerKey)}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Still have questions CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground mb-4 text-base">
            {t('platforms.common.faq.stillHaveQuestions')}
          </p>
          <a
            href={localizeHref('/contact')}
            className={cn(
              'inline-flex items-center gap-2 text-base font-medium transition-colors hover:opacity-80',
              theme.accent
            )}
          >
            {t('platforms.common.faq.contactUs')}
          </a>
        </motion.div>
      </div>
    </section>
  )
}
