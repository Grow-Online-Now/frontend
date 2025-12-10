import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Mail } from 'lucide-react'
import { GlassButton } from '@/components/glass/GlassButton'
import { GlassInput } from '@/components/glass/GlassInput'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { toast } from 'sonner'

const emailSchema = z.object({
  email: z.string().email('landing.form.invalidEmail'),
})

type EmailFormData = z.infer<typeof emailSchema>

export function WaitlistHero() {
  const { t } = useTranslation()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  })

  const onSubmit = async (data: EmailFormData) => {
    setIsSubmitting(true)

    try {
      // TODO: Replace with actual API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log('Email submitted:', data.email)
      toast.success(t('landing.form.success'))
      reset()
    } catch (error) {
      console.error('Error submitting email:', error)
      toast.error(t('landing.form.error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="bg-primary/20 absolute -top-[40%] left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-1/2 right-[10%] h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[100px]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl text-center">
        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display text-foreground mb-6 text-6xl leading-tight font-black tracking-tight sm:text-7xl lg:text-8xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {t('landing.hero.title')
            .split('\n')
            .map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-muted-foreground mx-auto mb-12 max-w-2xl text-lg leading-relaxed sm:text-xl"
        >
          {t('landing.hero.subtitle')}
        </motion.p>

        {/* Email Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto mb-8 max-w-md"
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <GlassInput
                {...register('email')}
                type="email"
                placeholder={t('landing.hero.emailPlaceholder')}
                icon={<Mail className="h-5 w-5" />}
                error={!!errors.email}
              />
              {errors.email && (
                <p className="text-destructive mt-2 text-sm">{t(errors.email.message as string)}</p>
              )}
            </div>
            <GlassButton type="submit" size="lg" loading={isSubmitting} className="sm:px-8">
              {t('landing.hero.cta')}
            </GlassButton>
          </div>
        </motion.form>

        {/* Social Proof */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-muted-foreground text-sm"
        >
          {t('landing.hero.socialProof', { count: 1247 })}
        </motion.p>

        {/* Platform Logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 opacity-50 grayscale transition-all hover:opacity-100 hover:grayscale-0"
        >
          {['Instagram', 'TikTok', 'Twitter', 'LinkedIn', 'YouTube'].map((platform) => (
            <div
              key={platform}
              className="text-muted-foreground text-xs font-semibold tracking-wider uppercase"
            >
              {platform}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
