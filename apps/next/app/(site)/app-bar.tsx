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
      <div className="flex items-center">
        {/* <Button variant="ghost-secondary" className="mr-4" title="Log in" /> */}
        {/* <Button variant="secondary" title="Sign up" /> */}
      </div>
    </div>
  )
}
