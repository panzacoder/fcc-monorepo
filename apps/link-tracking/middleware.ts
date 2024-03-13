import { NextRequest, NextResponse } from 'next/server'
import path from 'path'

const originDomain = 'https://track.customer.io'
export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('X-Forwarded-Proto', 'https')
  requestHeaders.set('X-Forwarded-Host', 'track.customer.io')
  requestHeaders.set('Host', 'email.familycarecircle.app')

  const rewritePath = path.join(originDomain, request.nextUrl.pathname)
  return NextResponse.rewrite(rewritePath, {
    headers: requestHeaders
  })
}
