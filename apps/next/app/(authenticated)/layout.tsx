/** @jsxImportSource react */

import { AuthenticatedLayout } from 'app/layouts/authenticated'

export default function AuthenticatedRouteLayout({ children }) {
  return (
    <div className="bg-muted flex h-screen w-screen">
      <main>{children}</main>
    </div>
  )
}
