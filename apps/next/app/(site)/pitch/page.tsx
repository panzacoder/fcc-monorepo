'use client'

import { Typography } from 'app/ui/typography'

export default function PitchPage() {
  return (
    <div className="grid max-w-screen-xl grid-cols-1 grid-rows-[min-content_1fr] place-items-center  gap-3">
      <Typography
        variant="h1"
        className="text-primary-foreground drop-shadow-lg"
      >
        Interested in investing?
      </Typography>
      <div className="flex w-full flex-col items-center gap-2">
        <Typography
          variant="h3"
          className="text-primary-foreground drop-shadow-lg"
        >
          Check out our plans for the future 👇
        </Typography>

        <div className="relative h-0 w-full max-w-screen-xl overflow-hidden rounded-2xl pb-[56.25%] shadow-md">
          <iframe
            loading="lazy"
            className="padding-0 margin-0 absolute left-0 top-0 h-full w-full border-none"
            src="https://www.canva.com/design/DAGBZlJxv1U/4FRIFrPTqJe_NvWxjFPqgw/view?embed"
            allowFullScreen
            allow="fullscreen"
          ></iframe>
        </div>
      </div>
    </div>
  )
}
