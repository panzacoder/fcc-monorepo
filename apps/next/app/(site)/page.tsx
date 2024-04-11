/** @jsxImportSource react */

import { Typography } from 'app/ui/typography'
import { NewsletterForm } from 'app/features/newsletter/form'
import { Card } from 'app/ui/card'
import Image from 'next/image'

export default function ContactPage() {
  return (
    <div className="grid grid-cols-1 gap-5 self-start py-10 md:gap-20">
      <Card variant="glass" className="flex flex-col gap-4 text-center">
        <Typography variant="h1" className="text-center font-normal text-white">
          Caregiving can be{' '}
          <span className="font-extrabold underline">heavy.</span>
        </Typography>
        <Typography variant="h2" className="text-center font-bold text-white">
          We make it <span className="font-extralight italic">lighter.</span>
        </Typography>
      </Card>
      <div className="grid grid-cols-subgrid gap-2">
        <Image
          src="/screenshots/old-to-new.webp"
          alt="A mockup of the new Family Care Circle design, overlapping a mockup of the old design"
          width={500}
          height={200}
        />
        <Typography
          variant="h4"
          className="text-background text-center font-bold drop-shadow-lg"
        >
          The new Family Care Circle app is coming soon.
        </Typography>
      </div>

      <Card
        variant="muted"
        className="gap-3 pb-5 pt-3"
        title="Be the first to know when the new Family Care Circle is available."
      >
        <NewsletterForm />
      </Card>
    </div>
  )
}
