import { Section, SectionContent } from '@/components/common/Section'
import { SectionHeading, SectionSubtitle } from '@/components/common/Typography'

interface PreWrittenDraftSectionProps {
  title: React.ReactNode
  subtitle: React.ReactNode
}

export function PreWrittenDraftSection({ title, subtitle }: PreWrittenDraftSectionProps) {
  return (
    <Section>
      <SectionHeading>{title}</SectionHeading>
      <SectionSubtitle>{subtitle}</SectionSubtitle>
      <SectionContent className="flex justify-center">
        <img
          className="hidden md:block"
          src="/images/landing/pre-written.webp"
          alt="pre-written drafts"
          width={2000}
          height={2000}
        />
        <img
          className="block md:hidden"
          src="/images/landing/pre-written.webp"
          alt="an organized inbox"
          width={2000}
          height={2000}
        />
      </SectionContent>
    </Section>
  )
}
