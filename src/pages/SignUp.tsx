import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { HelmetProvider } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Loader2 } from 'lucide-react'
import { SEOHead } from '@/lib/seo/SEOHead'
import { signUp, signIn } from '@/lib/auth-client'
import { Link } from '@/components/common/LocalizedLink'
import { useLocalizedHref } from '@/hooks/useLocalizedHref'
import { cn } from '@/lib/utils'

interface SignUpFormData {
  name: string
  email: string
  password: string
}

export function SignUp() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const localizeHref = useLocalizedHref()
  const [isLoading, setIsLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<'google' | 'github' | null>(null)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>()

  async function onSubmit(data: SignUpFormData) {
    setIsLoading(true)
    setError(null)

    try {
      const { error: signUpError } = await signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      })

      if (signUpError) {
        setError(signUpError.message || t('auth.signup.errors.generic'))
        setIsLoading(false)
        return
      }

      navigate(localizeHref('/dashboard'))
    } catch {
      setError(t('auth.signup.errors.generic'))
      setIsLoading(false)
    }
  }

  async function handleSocialSignUp(provider: 'google' | 'github') {
    setSocialLoading(provider)
    setError(null)

    try {
      await signIn.social({
        provider,
        callbackURL: `${import.meta.env.VITE_APP_URL}${localizeHref('/dashboard')}`,
      })
    } catch {
      setError(t('auth.signup.errors.generic'))
      setSocialLoading(null)
    }
  }

  return (
    <HelmetProvider>
      <div className="bg-background flex min-h-screen items-center justify-center px-4 py-12">
        <SEOHead
          title={t('auth.signup.seo.title')}
          description={t('auth.signup.seo.description')}
          pagePath="/signup"
          lang={i18n.language}
        />

        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="mb-8 text-center">
            <Link to="/" className="inline-block">
              <img src="/images/favicon.png" alt="Grow Online" className="mx-auto h-10 w-10" />
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-foreground text-2xl font-semibold">{t('auth.signup.title')}</h1>
            <p className="text-muted-foreground mt-2 text-sm">{t('auth.signup.subtitle')}</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-destructive/10 text-destructive mb-6 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Social Sign Up */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleSocialSignUp('github')}
              disabled={isLoading || socialLoading !== null}
              className={cn(
                'flex w-full items-center justify-center gap-3 rounded-lg px-4 py-2.5',
                'border-border bg-background border',
                'text-foreground text-sm font-medium',
                'hover:bg-accent transition-colors',
                'disabled:cursor-not-allowed disabled:opacity-50'
              )}
            >
              {socialLoading === 'github' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              )}
              <span>{t('auth.signup.social.github')}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialSignUp('google')}
              disabled={isLoading || socialLoading !== null}
              className={cn(
                'flex w-full items-center justify-center gap-3 rounded-lg px-4 py-2.5',
                'border-border bg-background border',
                'text-foreground text-sm font-medium',
                'hover:bg-accent transition-colors',
                'disabled:cursor-not-allowed disabled:opacity-50'
              )}
            >
              {socialLoading === 'google' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                /* Google brand colors are required by brand guidelines - intentional exception */
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              <span>{t('auth.signup.social.google')}</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="border-border w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background text-muted-foreground px-2">
                {t('auth.signup.divider')}
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className="text-foreground mb-1.5 block text-sm font-medium">
                {t('auth.signup.form.name')}
              </label>
              <input
                id="name"
                type="text"
                placeholder={t('auth.signup.form.namePlaceholder')}
                className={cn(
                  'bg-background w-full rounded-lg border px-3 py-2.5',
                  'text-foreground placeholder:text-muted-foreground text-sm',
                  'focus:ring-primary focus:ring-2 focus:ring-offset-1 focus:outline-none',
                  errors.name ? 'border-destructive' : 'border-border'
                )}
                {...register('name', {
                  required: t('auth.signup.errors.name'),
                })}
              />
              {errors.name && (
                <p className="text-destructive mt-1 text-xs">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="text-foreground mb-1.5 block text-sm font-medium">
                {t('auth.signup.form.email')}
              </label>
              <input
                id="email"
                type="email"
                placeholder={t('auth.signup.form.emailPlaceholder')}
                className={cn(
                  'bg-background w-full rounded-lg border px-3 py-2.5',
                  'text-foreground placeholder:text-muted-foreground text-sm',
                  'focus:ring-primary focus:ring-2 focus:ring-offset-1 focus:outline-none',
                  errors.email ? 'border-destructive' : 'border-border'
                )}
                {...register('email', {
                  required: t('auth.signup.errors.email'),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t('auth.signup.errors.email'),
                  },
                })}
              />
              {errors.email && (
                <p className="text-destructive mt-1 text-xs">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-foreground mb-1.5 block text-sm font-medium"
              >
                {t('auth.signup.form.password')}
              </label>
              <input
                id="password"
                type="password"
                placeholder={t('auth.signup.form.passwordPlaceholder')}
                className={cn(
                  'bg-background w-full rounded-lg border px-3 py-2.5',
                  'text-foreground placeholder:text-muted-foreground text-sm',
                  'focus:ring-primary focus:ring-2 focus:ring-offset-1 focus:outline-none',
                  errors.password ? 'border-destructive' : 'border-border'
                )}
                {...register('password', {
                  required: t('auth.signup.errors.password'),
                  minLength: {
                    value: 8,
                    message: t('auth.signup.errors.password'),
                  },
                })}
              />
              {errors.password && (
                <p className="text-destructive mt-1 text-xs">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || socialLoading !== null}
              className={cn(
                'flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5',
                'bg-primary text-primary-foreground text-sm font-medium',
                'hover:bg-primary/90 transition-colors',
                'disabled:cursor-not-allowed disabled:opacity-50'
              )}
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoading ? t('auth.signup.form.submitting') : t('auth.signup.form.submit')}
            </button>
          </form>

          {/* Terms */}
          <p className="text-muted-foreground mt-6 text-center text-xs">
            {t('auth.signup.terms.prefix')}{' '}
            <Link to="/terms" className="hover:text-foreground underline underline-offset-2">
              {t('auth.signup.terms.termsLink')}
            </Link>{' '}
            {t('auth.signup.terms.and')}{' '}
            <Link to="/privacy" className="hover:text-foreground underline underline-offset-2">
              {t('auth.signup.terms.privacyLink')}
            </Link>
            .
          </p>

          {/* Login Link */}
          <p className="text-muted-foreground mt-6 text-center text-sm">
            {t('auth.signup.login.text')}{' '}
            <Link to="/login" className="text-foreground font-medium hover:underline">
              {t('auth.signup.login.link')}
            </Link>
          </p>
        </div>
      </div>
    </HelmetProvider>
  )
}
