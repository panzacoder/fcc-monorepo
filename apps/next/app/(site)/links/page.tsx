'use client'

import { Typography } from 'app/ui/typography'
import { Card } from 'app/ui/card'
import Image from 'next/image'
import { Feather } from 'app/ui/icons'

function IosBadge() {
  const IOSUrl =
    'https://apps.apple.com/us/app/family-care-circle-mobile-app/id1602521967?ppid=a1dcf835-b698-4a4d-bc42-0777b16175a0'

  return (
    <a href={IOSUrl} className="w-full">
      <Image
        className="w-full px-6"
        width={200}
        height={60}
        alt="Download on the App Store"
        src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg"
      />
    </a>
  )
}

function AndroidBadge() {
  const APKUrl =
    'https://play.google.com/store/apps/details?id=com.familycarecircle.fccmobileapp&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'

  return (
    <a href={APKUrl} className="w-full">
      <Image
        className="w-full"
        width={250}
        height={60}
        alt="Get it on Google Play"
        src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
      />
    </a>
  )
}

export default function LinkPage() {
  return (
    <div className="flex h-full flex-col items-center justify-start space-y-10 py-8">
      <div className="flex flex-col-reverse items-center md:flex-row">
        <Card
          variant="glass"
          className="flex w-full max-w-screen-sm items-center gap-4 p-4"
        >
          <Typography
            as="h1"
            variant="h2"
            className="text-center text-white/80"
          >
            Organize the chaos, and spend more time with your family.
          </Typography>
          <Typography
            variant="h1"
            as="h2"
            className="mt-8 flex w-fit text-center font-normal text-white"
          >
            👇 Get the app! <p className="scale-x-[-1]">👇</p>
          </Typography>

          <div className="grid w-3/4 grid-cols-2 items-center justify-items-stretch gap-x-4">
            <IosBadge />
            <AndroidBadge />
          </div>
        </Card>
      </div>
      <section className="mx-auto max-w-screen-md space-y-10">
        <div className="grid grid-cols-[40%_1fr] grid-rows-1 items-start gap-6">
          <Image
            width={400}
            height={600}
            src="/screenshots/circles_v1.png"
            alt="View of the circles feature in the app"
          />
          <div className="sticky top-4 pt-2">
            <Feather name="calendar" size={20} className="mr-2" />
            <Typography variant="h4">Stay organized</Typography>
            <p className="text-sm text-gray-900">
              Keep track of all your caregiving tasks in one place.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_40%] grid-rows-1 items-start gap-6">
          <div className="sticky top-4 pt-2">
            <Feather name="users" size={20} className="mr-2" />
            <Typography variant="h4">Grow your circle</Typography>
            <p className="text-sm text-gray-900">
              Invite friends and family to view and discuss your upcoming
              appointments, discuss updates, and coordinate transportation.
            </p>
          </div>
          <Image
            width={400}
            height={600}
            src="/screenshots/appointments_v1.png"
            alt="View of the circles feature in the app"
          />
        </div>

        <div className="grid grid-cols-[40%_1fr] grid-rows-1 items-start gap-6">
          <Image
            width={400}
            height={600}
            src="/screenshots/splash_v2.png"
            alt="New app splash screen"
          />
          <div className="sticky top-4 pt-2">
            <Feather name="alert-circle" size={20} className="mr-2" />
            <Typography variant="h4">New look coming this sumer</Typography>
            <p className="text-sm text-gray-900">
              Download today and get priority access to new features.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-card/50 space-y-4 rounded-2xl py-16 text-center shadow-2xl">
        <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
          Download the App Now
        </h2>
        <p className="text-lg text-gray-600 md:text-xl dark:text-gray-400">
          Give the best care possible, one day at a time.{' '}
        </p>
        <div className="w-100 grid grid-cols-2 items-center justify-items-stretch gap-x-4">
          <IosBadge />
          <AndroidBadge />
        </div>
      </section>
    </div>
  )
}
