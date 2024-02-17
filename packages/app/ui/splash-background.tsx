'use client'
import { ImageBackground, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export function SplashBackground({ children }) {
  return (
    <ImageBackground
      source={require('app/assets/splash.png')}
      className="h-screen w-screen flex-1"
    >
      <View className="absolute h-screen w-screen bg-black opacity-40"></View>
      <SafeAreaView className="flex flex-1 items-center justify-center px-4">
        {children}
      </SafeAreaView>
    </ImageBackground>
  )
}
