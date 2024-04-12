/** @jsxImportSource react */

import { SplashBackground } from 'app/ui/splash-background'
import { AppBar } from './app-bar'

export default function SplashLayout({ children }) {
  return (
    <SplashBackground>
      <div className="grid-rows-[min-content 1fr] grid h-full w-full max-w-screen-xl grid-cols-1">
        <AppBar />
        {children}
      </div>
    </SplashBackground>
  )
}
