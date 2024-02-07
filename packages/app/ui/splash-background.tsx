'use client'
import { ImageBackground, View } from 'react-native'

export function SplashBackground({ children }) {
  return (
    <>
      <View className="flex-1">
        <ImageBackground
          source={require('app/assets/splash.png')}
          className="flex-1"
        >
          <View className="absolute h-full w-full bg-black opacity-40"></View>
          {children}
        </ImageBackground>
      </View>
    </>
  )
}
