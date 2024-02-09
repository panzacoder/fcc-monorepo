'use client'
import { ImageBackground, View } from 'react-native'

export function SplashBackground({ children }) {
  return (
    <ImageBackground
      source={require('app/assets/splash.png')}
      className="h-screen w-screen flex-1"
    >
      <View className="absolute h-screen w-screen bg-black opacity-40"></View>
      {children}
    </ImageBackground>
  )
}
