// import Feather from '@expo/vector-icons/Feather'
import { Feather } from 'app/ui/icons'

import { Button, ButtonProps } from './button'
import { ComponentProps } from 'react'

export type IconButtonProps = {
  icon: ComponentProps<typeof Feather>['name']
  iconSize?: number
  color?: string
} & ButtonProps
export default function IconButton({
  icon,
  iconSize = 24,
  color,
  ...props
}: IconButtonProps) {
  return (
    <Button {...props}>
      <Feather name={icon} size={iconSize} color={color} />
    </Button>
  )
}
