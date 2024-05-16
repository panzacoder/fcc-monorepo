import type { NextRequest } from 'next/server'
import { NextResponse, userAgent } from 'next/server'
import { track } from '@vercel/analytics/server'

const IOSUrl =
  'https://apps.apple.com/us/app/family-care-circle-mobile-app/id1602521967?ppid=a1dcf835-b698-4a4d-bc42-0777b16175a0'
const APKUrl =
  'https://play.google.com/store/apps/details?id=com.familycarecircle.fccmobileapp&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'

export async function middleware(req: NextRequest) {
  const { ua } = userAgent(req)

  if (/iP(hone|ad|od)/.test(ua)) {
    await track(
      'iOS App Store Redirect',
      { destination: IOSUrl, location: 'middleware' },
      { request: req }
    )
    return NextResponse.redirect(IOSUrl)
  } else if (/Android/.test(ua)) {
    await track(
      'Android Play Store Redirect',
      { destination: APKUrl, location: 'middleware' },
      { request: req }
    )
    return NextResponse.redirect(APKUrl)
  }
}

export const config = {
  matcher: '/links'
}
