/** @jsxImportSource react */

import { Typography } from 'app/ui/typography'
import Link from 'next/link'

export default function ContactPage() {
  return (
    <div className="flex flex-col items-center gap-10">
      <Typography
        variant="h1"
        as="h1"
        className="text-center font-bold text-white"
      >
        Caregiving can be <span className="italic">heavy</span>.
        {"\n\nLet's lighten the load."}
      </Typography>

      <Link href="/sign-up">
        <Typography variant="h4" className="text-center font-bold text-white">
          Log in
        </Typography>
      </Link>
    </div>
  )
}
