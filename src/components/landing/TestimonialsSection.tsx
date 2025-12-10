import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { Section, SectionContent } from '@/components/common/Section'
import { Card, CardContent } from '@/components/common/Card'
import { Paragraph, SectionHeading, SectionSubtitle } from '@/components/common/Typography'

type Testimonial = {
  body: string
  author: {
    name: string
    handle: string
    imageUrl: string
    logoUrl?: string
  }
}

const featuredTestimonial = {
  body: 'Grow Online completely transformed how we manage social media for our clients. What used to take our team 20+ hours a week now takes less than 5. The AI-generated content is spot-on.',
  author: {
    name: 'Marcus Chen',
    handle: 'Elevate Digital Agency',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    logoUrl: undefined,
  },
}

const sophiaTestimonial: Testimonial = {
  body: 'As a solo content creator, I was spending more time scheduling posts than actually creating. Grow Online gave me my life back. My engagement is up 340% in 3 months!',
  author: {
    name: 'Sophia Rodriguez',
    handle: '@sophiacreates',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia',
  },
}

const davidTestimonial: Testimonial = {
  body: 'Finally, a tool that actually understands my brand voice. The AI suggestions are so good I barely need to edit them anymore.',
  author: {
    name: 'David Park',
    handle: 'TechStartup Founder',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
  },
}

const emilyTestimonial: Testimonial = {
  body: 'We manage 15 client accounts and Grow Online handles them all seamlessly. Our clients love the consistency and we love the time savings.',
  author: {
    name: 'Emily Foster',
    handle: 'Foster Media Co.',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
  },
}

const jamesTestimonial: Testimonial = {
  body: "I went from 500 to 50k followers in 6 months. The smart scheduling feature posts at exactly the right times. It's like having a full marketing team.",
  author: {
    name: 'James Wilson',
    handle: '@jamesfitness',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JamesW',
  },
}

const priyaTestimonial: Testimonial = {
  body: "The analytics dashboard alone is worth it. I can finally see what's working across all my platforms in one place. Super intuitive!",
  author: {
    name: 'Priya Sharma',
    handle: 'Bloom Boutique',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
  },
}

const alexTestimonial: Testimonial = {
  body: "I was skeptical about AI-generated content, but Grow Online nails my tone every time. My followers can't tell the difference. Game changer for real.",
  author: {
    name: 'Alex Thompson',
    handle: '@alexthompson',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  },
}

const rachelTestimonial: Testimonial = {
  body: 'Running a restaurant and managing social media was impossible. Now I just approve what the AI suggests and focus on cooking. Our Instagram following tripled!',
  author: {
    name: 'Rachel Kim',
    handle: 'Seoul Kitchen',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel',
  },
}

const michaelTestimonial: Testimonial = {
  body: 'The cross-platform posting is seamless. One click and my content goes everywhere. I used to spend hours doing this manually.',
  author: {
    name: 'Michael Brooks',
    handle: 'Brooks Consulting',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
  },
}

const lisaTestimonial: Testimonial = {
  body: "Best investment I've made for my business this year. The ROI is insane—I've saved at least 15 hours every week.",
  author: {
    name: 'Lisa Martinez',
    handle: '@lisamarketingtips',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
  },
}

const chrisTestimonial: Testimonial = {
  body: 'Our agency tried every social media tool out there. Grow Online is the only one that actually delivers on its promises. Client retention is at an all-time high.',
  author: {
    name: 'Chris Anderson',
    handle: 'Momentum Marketing',
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chris',
  },
}

const desktopTestimonials: Testimonial[][][] = [
  [
    [sophiaTestimonial, davidTestimonial, priyaTestimonial],
    [emilyTestimonial, alexTestimonial],
  ],
  [
    [jamesTestimonial, michaelTestimonial],
    [rachelTestimonial, lisaTestimonial, chrisTestimonial],
  ],
]

const mobileTestimonials: Testimonial[] = [
  sophiaTestimonial,
  jamesTestimonial,
  davidTestimonial,
  rachelTestimonial,
  emilyTestimonial,
  alexTestimonial,
  priyaTestimonial,
]

export function TestimonialsSection() {
  const { t } = useTranslation()

  return (
    <Section>
      <SectionHeading wrap>{t('landing.testimonials.title')}</SectionHeading>
      <SectionSubtitle>{t('landing.testimonials.subtitle')}</SectionSubtitle>
      <SectionContent>
        {/* Mobile */}
        <div className="text-foreground grid gap-4 text-sm leading-6 sm:hidden">
          {mobileTestimonials.map((testimonial) => (
            <TestimonialCard testimonial={testimonial} key={testimonial.author.name} />
          ))}
        </div>

        {/* Desktop */}
        <div className="text-foreground hidden grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 sm:grid sm:grid-cols-2 xl:grid-flow-col xl:grid-cols-4">
          <TestimonialCard
            testimonial={featuredTestimonial}
            className="sm:col-span-2 xl:col-start-2 xl:row-end-1"
            variant="featured"
          />
          {desktopTestimonials.map((columnGroup, columnGroupIdx) => (
            <div key={columnGroupIdx} className="space-y-8 xl:contents xl:space-y-0">
              {columnGroup.map((column, columnIdx) => (
                <div
                  key={columnIdx}
                  className={clsx(
                    (columnGroupIdx === 0 && columnIdx === 0) ||
                      (columnGroupIdx === desktopTestimonials.length - 1 &&
                        columnIdx === columnGroup.length - 1)
                      ? 'xl:row-span-2'
                      : 'xl:row-start-1',
                    'space-y-8'
                  )}
                >
                  {column.map((testimonial) => (
                    <TestimonialCard testimonial={testimonial} key={testimonial.author.handle} />
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </SectionContent>
    </Section>
  )
}

function TestimonialCard({
  testimonial,
  variant = 'default',
  className,
}: {
  testimonial: Testimonial
  className?: string
  variant?: 'default' | 'featured'
}) {
  return (
    <Card key={testimonial.author.handle} className={className}>
      <CardContent>
        {variant === 'featured' ? (
          <Paragraph color="gray-700" size="lg" className="leading-7 font-semibold tracking-tight">
            {testimonial.body}
          </Paragraph>
        ) : (
          <Paragraph size="md" color="gray-500">
            {testimonial.body}
          </Paragraph>
        )}
      </CardContent>
      <CardContent className="border-border-subtle flex items-center justify-between border-t">
        <div className="flex items-center gap-4">
          <img
            className="border-border bg-muted size-14 rounded-full border-2 md:size-10"
            src={testimonial.author.imageUrl}
            alt={`${testimonial.author.name}, ${testimonial.author.handle}`}
            width={56}
            height={56}
          />
          <div className="text-left">
            <Paragraph size="md" color="dark" className="font-semibold">
              {testimonial.author.name}
            </Paragraph>
            {testimonial.author.handle ? (
              <Paragraph size="md">{testimonial.author.handle}</Paragraph>
            ) : undefined}
          </div>
        </div>
        {variant === 'featured' && testimonial.author.logoUrl ? (
          <img
            className="h-8 w-auto flex-none"
            src={testimonial.author.logoUrl}
            alt={`${testimonial.author.name}'s company logo`}
          />
        ) : null}
      </CardContent>
    </Card>
  )
}
