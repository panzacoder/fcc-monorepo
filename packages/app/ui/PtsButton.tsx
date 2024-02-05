import { View, Image, Pressable, PressableProps } from 'react-native'
import { Typography } from 'app/ui/typography'
import { cn } from './utils'
import { Feather } from 'app/ui/icons'
import { ComponentProps } from 'react'
export type ButtonProps = PressableProps & {
  title?: string
  leadingIcon?: ComponentProps<typeof Feather>['name']
  trailingIcon?: ComponentProps<typeof Feather>['name']
  children?: React.ReactNode
  isDisabled?: boolean
  className?: string
  onPress?: {}
}
const PtsButton = ({
  title,
  leadingIcon,
  trailingIcon,
  isDisabled,
  className = '',
  onPress
}: ButtonProps) => {
  return (
    <Pressable
      disabled={isDisabled}
      className={cn(
        'bg-primary flex-row justify-center self-center rounded-[20px] p-[10]',
        className
      )}
      onPress={onPress}
    >
      {leadingIcon && (
        <Feather name={leadingIcon} size={16} color="white" className="" />
      )}
      <Typography className="text-primary-foreground mx-[5] text-center font-bold">
        {title}
      </Typography>
      {trailingIcon && (
        <Feather name={trailingIcon} size={16} color="white" className="" />
      )}
    </Pressable>
  )
}
export default PtsButton
