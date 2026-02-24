'use client'

export function SplashBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="web-splash-gradient flex min-h-screen w-screen">
      <div className="z-10 flex flex-1 items-center justify-center px-4">
        {children}
      </div>
    </div>
  )
}
