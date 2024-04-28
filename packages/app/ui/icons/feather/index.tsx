'use client'
import { Feather as ExpoFeather } from '@expo/vector-icons'
import { cssInterop } from 'nativewind'
import { ComponentProps } from 'react'
import { Pressable } from 'react-native'

export const Feather = (props: ComponentProps<typeof ExpoFeather>) => {
  return <ExpoFeather {...props} />
}

cssInterop(Feather, {
  className: {
    target: 'style'
  }
})

export const FeatherButton = ({
  onPress,
  ...props
}: ComponentProps<typeof ExpoFeather> & { onPress: () => void }) => {
  return (
    <Pressable onPress={onPress}>
      <ExpoFeather {...props} />
    </Pressable>
  )
}

cssInterop(FeatherButton, {
  className: {
    target: 'style' // string or boolean
  }
})
