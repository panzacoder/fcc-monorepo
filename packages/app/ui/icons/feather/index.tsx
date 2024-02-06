import { Feather as ExpoFeather } from '@expo/vector-icons'
import { cssInterop } from 'nativewind'
import { ComponentProps } from 'react'
import { TouchableOpacity } from 'react-native'

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
    <TouchableOpacity onPress={onPress}>
      <ExpoFeather {...props} />
    </TouchableOpacity>
  )
}

cssInterop(FeatherButton, {
  className: {
    target: 'style' // string or boolean
  }
})
