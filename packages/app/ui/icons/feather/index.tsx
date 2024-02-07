import { Feather as ExpoFeather } from '@expo/vector-icons'
import { cssInterop } from 'nativewind'
import { ComponentProps } from 'react'

const FeatherWrapper = (props: ComponentProps<typeof ExpoFeather>) => {
  return <ExpoFeather {...props} />
}

cssInterop(FeatherWrapper, {
  className: {
    target: 'style'
  }
})

export const Feather = FeatherWrapper
