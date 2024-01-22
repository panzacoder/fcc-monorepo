import { Feather } from '@expo/vector-icons'
import { cssInterop } from 'nativewind'
import { ComponentProps } from 'react'

const FeatherWrapper = ({
  color,
  ...props
}: ComponentProps<typeof Feather>) => {
  console.log('FeatherWrapper', color)
  return <Feather color={color} {...props} />
}

const FeatherInterop = cssInterop(FeatherWrapper, {
  className: {
    target: false, // string or boolean
    nativeStyleToProp: {
      backgroundColor: 'color',
    },
  },
})

export default FeatherInterop
