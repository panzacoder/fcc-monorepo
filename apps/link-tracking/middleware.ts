import { NextRequest, NextResponse } from 'next/server'

const originDomain = 'https://track.customer.io'
export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  // requestHeaders.set('X-Forwarded-Proto', 'https')
  // requestHeaders.set('X-Forwarded-Host', 'track.customer.io')
  requestHeaders.set('Host', 'email.familycarecircle.app')

  const rewritePath = new URL(request.nextUrl.pathname, originDomain)
  return NextResponse.rewrite(rewritePath, {
    headers: requestHeaders
  })
}

export const config = {
  matcher: '/:path*'
}
