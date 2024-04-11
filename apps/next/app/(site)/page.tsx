/** @jsxImportSource react */

import { Typography } from 'app/ui/typography'
import { NewsletterForm } from 'app/features/newsletter/form'
import { Card } from 'app/ui/card'

export default function ContactPage() {
  return (
    <div className="flex h-full flex-col items-center justify-around gap-10 py-10">
      <Card variant="glass" className="flex flex-col gap-4 text-center">
        <Typography variant="h1" className="text-center font-normal text-white">
          Caregiving can be <span className="font-extrabold italic">heavy</span>
          .
        </Typography>
        <Typography variant="h2" className="text-center font-bold text-white">
          We make it <span className="font-extralight">easier</span>.
        </Typography>
        <Typography
          variant="h4"
          className="text-accent-foreground text-center font-bold"
        >
          The new Family Care Circle app is coming soon.
        </Typography>
      </Card>

      <div>
        <NewsletterForm />
      </div>
    </div>
  )
}
