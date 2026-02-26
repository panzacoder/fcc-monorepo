'use client'
import { Feather as ExpoFeather } from '@expo/vector-icons'
import { withUniwind } from 'uniwind'
import { ComponentProps } from 'react'
import { TouchableOpacity } from 'react-native'

export const Feather = withUniwind(ExpoFeather)

export const FeatherButton = ({
  onPress,
  ...props
}: ComponentProps<typeof ExpoFeather> & { onPress: () => void }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <ExpoFeather {...props} />
    </TouchableOpacity>
  )
}
