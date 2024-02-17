'use client'

export function SplashBackground({ children }) {
  return (
    <div className="web-splash-gradient flex h-screen w-screen">
      <div className="absolute h-screen w-screen bg-black opacity-30"></div>
      <div className="flex flex-1 items-center justify-center px-4">
        {children}
      </div>
    </div>
  )
}
