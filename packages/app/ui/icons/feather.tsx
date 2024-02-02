import { Feather } from '@expo/vector-icons'
import { cssInterop } from 'nativewind'
import { ComponentProps } from 'react'

const FeatherWrapper = (props: ComponentProps<typeof Feather>) => {
  return <Feather {...props} />
}

cssInterop(FeatherWrapper, {
  className: {
    target: 'style' // string or boolean
  }
})

export default FeatherWrapper
