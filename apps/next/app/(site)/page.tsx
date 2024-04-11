/** @jsxImportSource react */

import { Typography } from 'app/ui/typography'
import { NewsletterForm } from 'app/features/newsletter/form'

export default function ContactPage() {
  return (
    <div className="flex flex-col items-center gap-10">
      <Typography variant="h1" className="text-center font-bold text-white">
        Caregiving can be <span className="italic">heavy</span>.
        {'\n\nWe make it lighter.'}
      </Typography>

      <Typography variant="h4" className="text-center font-bold text-white">
        The new Family Care Circle app is coming soon.
      </Typography>

      <NewsletterForm />
    </div>
  )
}
