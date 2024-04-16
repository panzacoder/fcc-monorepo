'use client'

import { Typography } from 'app/ui/typography'
import { Card } from 'app/ui/card'

import Image from 'next/image'

export default function LinkPage() {
  const APKUrl =
    'https://play.google.com/store/apps/details?id=com.familycarecircle.fccmobileapp&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'
  const IOSUrl =
    'https://apps.apple.com/us/app/family-care-circle-mobile-app/id1602521967?ppid=a1dcf835-b698-4a4d-bc42-0777b16175a0'

  return (
    <div className="flex h-full flex-col items-center justify-start py-8">
      <Card
        variant="glass"
        className="flex w-full max-w-screen-sm items-center p-4"
      >
        <Typography
          variant="h1"
          className="flex w-fit text-center font-normal text-white"
        >
          👇 Get the app! <p className="scale-x-[-1]">👇</p>
        </Typography>
      </Card>
      <div className="flex flex-col-reverse items-center md:flex-row">
        <Image
          width={400}
          height={600}
          src="/screenshots/splash-screen.png"
          alt="FCC app mockup"
        />
        <div className="flex w-full items-center p-4 md:flex-col">
          <a href={IOSUrl}>
            <Image
              className="p-4"
              width={200}
              height={60}
              alt="Download on the App Store"
              src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg"
            />
          </a>
          <a href={APKUrl}>
            <Image
              width={200}
              height={60}
              alt="Get it on Google Play"
              src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
            />
          </a>
        </div>
      </div>
    </div>
  )
}
