import { Badge } from '@/components/ui/badge'
import { BlurFade } from '@/components/ui/blur-fade'
import { Card } from '@/components/ui/card'
import { CardWrapper } from '@/components/common/CardWrapper'
import { DisplayCard } from '@/components/ui/display-card'
import { Section, SectionContent } from '@/components/common/Section'
import { SectionHeading, SectionSubtitle } from '@/components/common/Typography'
import { Mail, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import GoogleIcon from '@/assets/icons/google.svg'
import GithubIcon from '@/assets/icons/github.svg'
import InstagramIcon from '@/assets/icons/instagram.svg'
import TiktokIcon from '@/assets/icons/tiktok.svg'
import XIcon from '@/assets/icons/x.svg'
import LinkedinIcon from '@/assets/icons/linkedin.svg'
import FacebookIcon from '@/assets/icons/facebook.svg'
import PinterestIcon from '@/assets/icons/pinterest.svg'
import ThreadsIcon from '@/assets/icons/threads.svg'
import BlueskyIcon from '@/assets/icons/bluesky.svg'

interface GetStartedSectionProps {
  titleKey: string
  subtitleKey: string
}

export function GetStartedSection({ titleKey, subtitleKey }: GetStartedSectionProps) {
  const { t } = useTranslation()

  return (
    <Section>
      <SectionHeading>{t(titleKey)}</SectionHeading>
      <SectionSubtitle>{t(subtitleKey)}</SectionSubtitle>
      <SectionContent>
        <CardWrapper className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <BlurFade inView>
            <DisplayCard
              titleKey="landing.getStarted.step1.title"
              descriptionKey="landing.getStarted.step1.description"
              icon={
                <Badge variant="default" size="sm" icon={<Mail />}>
                  {t('landing.getStarted.step1.badge')}
                </Badge>
              }
              centerContent={true}
              className="h-full"
            >
              <div className="flex gap-4">
                <CardWrapper padding="xs-2" rounded="full">
                  <Card variant="circle">
                    <div className="p-2">
                      <img src={GoogleIcon} alt="Google" width="64" height="64" />
                    </div>
                  </Card>
                </CardWrapper>
                <CardWrapper padding="xs-2" rounded="full">
                  <Card variant="circle">
                    <div className="p-2">
                      <img src={GithubIcon} alt="Github" width="64" height="64" />
                    </div>
                  </Card>
                </CardWrapper>
              </div>
            </DisplayCard>
          </BlurFade>
          <BlurFade delay={0.25} inView>
            <DisplayCard
              titleKey="landing.getStarted.step2.title"
              descriptionKey="landing.getStarted.step2.description"
              icon={
                <Badge variant="default" size="sm" icon={<Mail />}>
                  {t('landing.getStarted.step2.badge')}
                </Badge>
              }
              centerContent
              className="h-full"
            >
              <div className="flex scale-[110%] flex-col gap-2">
                <div className="flex gap-2">
                  <Badge variant="instagram" icon={<img src={InstagramIcon} alt="" />}>
                    Instagram
                  </Badge>
                  <Badge variant="tiktok" icon={<img src={TiktokIcon} alt="" />}>
                    TikTok
                  </Badge>
                  <Badge variant="twitter" icon={<img src={XIcon} alt="" />}>
                    X/Twitter
                  </Badge>
                  <Badge variant="linkedin" icon={<img src={LinkedinIcon} alt="" />}>
                    LinkedIn
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Badge variant="facebook" icon={<img src={FacebookIcon} alt="" />}>
                    Facebook
                  </Badge>
                  <Badge variant="pinterest" icon={<img src={PinterestIcon} alt="" />}>
                    Pinterest
                  </Badge>
                  <Badge variant="default" icon={<img src={ThreadsIcon} alt="" />}>
                    Threads
                  </Badge>
                  <Badge variant="twitter" icon={<img src={BlueskyIcon} alt="" />}>
                    Bluesky
                  </Badge>
                </div>
              </div>
            </DisplayCard>
          </BlurFade>
          <BlurFade delay={0.25 * 2} inView>
            <DisplayCard
              titleKey="landing.getStarted.step3.title"
              descriptionKey="landing.getStarted.step3.description"
              icon={
                <Badge variant="default" size="sm" icon={<Sparkles />}>
                  {t('landing.getStarted.step3.badge')}
                </Badge>
              }
            >
              <div className="pt-6 pl-6">
                <img
                  src="/images/login/1.jpg"
                  alt={t('landing.getStarted.step3.imageAlt')}
                  width={1000}
                  height={400}
                  className="overflow-hidden rounded-2xl"
                />
              </div>
            </DisplayCard>
          </BlurFade>
        </CardWrapper>
      </SectionContent>
    </Section>
  )
}
