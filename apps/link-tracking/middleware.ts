import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const originDomain = 'https://track.customer.io'
// const originDomain = 'https://e.customeriomail.com'
export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
  console.log('existing host', requestHeaders.get('Host'))
  requestHeaders.set('Host', 'email.familycarecircle.app')

  console.log('new host', requestHeaders.get('Host'))
  const rewritePath = new URL(request.nextUrl.pathname, originDomain)
  const response = NextResponse.rewrite(rewritePath, {
    request: {
      headers: requestHeaders
    }
  })

  // console.log('response', response)
  return response
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico|index.html).*)'
}
