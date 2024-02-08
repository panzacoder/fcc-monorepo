'use client'

export function SplashBackground({ children }) {
  return (
    <div className="bg-primary flex-1">
      {/* <ImageBackground */}
      {/*   source={require('app/assets/splash.png')} */}
      {/*   className="flex-1" */}
      {/* > */}
      <div className="absolute h-full w-full bg-black opacity-40"></div>
      {children}
      {/* </ImageBackground> */}
    </div>
  )
}
