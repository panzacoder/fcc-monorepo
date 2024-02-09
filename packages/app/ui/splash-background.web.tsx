'use client'

export function SplashBackground({ children }) {
  return (
    <div className="web-splash-gradient h-screen w-screen flex-1">
      <div className="absolute h-screen w-screen bg-black opacity-30"></div>
      {children}
    </div>
  )
}
