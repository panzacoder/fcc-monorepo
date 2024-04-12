'use client'

import { Typography } from 'app/ui/typography'

export default function PitchPage() {
  return (
    <div className="absolute grid h-screen w-screen place-items-center bg-black/40 p-10">
      <Typography
        variant="h1"
        className="text-primary-foreground drop-shadow-lg"
      >
        Interested in investing?
      </Typography>
      <div className="grid w-full place-items-center">
        <Typography
          variant="h3"
          className="text-primary-foreground drop-shadow-lg"
        >
          Check out our plans for the future 👇
        </Typography>

        <div className="relative mb-5 mt-8 h-0 w-full overflow-hidden rounded-2xl  bg-transparent pb-[56.25%] shadow-md">
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
