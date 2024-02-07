import { View } from 'react-native'

export function Card({ children }) {
  return (
    <View className="m-auto grid h-full">
      <View className="mx-4 my-auto rounded-2xl bg-white px-4 pt-5">
        {children}
      </View>
    </View>
  )
}
