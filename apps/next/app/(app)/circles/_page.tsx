/** @jsxImportSource react */

import { Typography } from 'app/ui/typography'

export default function CirclesTab() {
  return (
    <div className="grid h-screen place-items-center">
      <div className="flex flex-col items-center">
        <Typography variant="h1">Circles</Typography>
        <Typography variant="h2">Coming Soon</Typography>
        <Typography variant="h3" className="pt-8">
          This page is rendered only in the web app!
        </Typography>
      </div>
    </div>
  )
}
