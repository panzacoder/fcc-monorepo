/** @jsxImportSource react */

import { Button } from 'app/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export function AppBar() {
  return (
    <div className="flex h-16 items-center justify-between">
      <Link href="/">
        <Image
          src="/logos/full-stacked-white.png"
          alt="Family Care Circle logo"
          width={150}
          height={40}
        />
      </Link>
      <div className="flex items-center gap-2">
        <div className="hidden md:flex">
          <Link href="https://familycarecircle.com/#/login">
            <Button variant="link-secondary" className="" title="Log in" />
          </Link>
          <Link href="https://familycarecircle.com/#/createAccount">
            <Button variant="light" title="Sign up" />
          </Link>
        </div>
        <Link href="/links">
          <Button variant="accent" className="mr-4" title="Get the app" />
        </Link>
      </div>
    </div>
  )
}
