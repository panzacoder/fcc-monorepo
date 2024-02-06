import { Feather as ExpoFeather } from '@expo/vector-icons'
import { cssInterop } from 'nativewind'
import { ComponentProps } from 'react'

const FeatherWrapper = (props: ComponentProps<typeof ExpoFeather>) => {
  console.log('FeatherWrapper')
  return <ExpoFeather {...props} />
}

cssInterop(FeatherWrapper, {
  className: {
    target: 'style' // string or boolean
  }
})

export const Feather = FeatherWrapper
