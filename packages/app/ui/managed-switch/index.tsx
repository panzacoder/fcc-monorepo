import { MotiView } from 'moti'
import { TouchableOpacity, View } from 'react-native'
import { Typography } from '../typography'
import { cn } from '../utils'

export type ManagedSwitchProps = {
  className?: string
  onText?: string
  offText?: string
  value: boolean
  onValueChange: (value: boolean) => void
}
export function ManagedSwitch({
  className,
  onText = 'On',
  offText = 'Off',
  value,
  onValueChange
}: ManagedSwitchProps) {
  return (
    <View
      className={cn(
        'bg-muted flex w-[180px] flex-row rounded-full p-2',
        className
      )}
    >
      <MotiView
        className="bg-primary absolute left-0 m-2 h-10 w-1/2 rounded-full"
        from={{
          translateX: 0
        }}
        animate={{
          translateX: value ? 0 : 80
        }}
        transition={{
          type: 'timing',
          duration: 200
        }}
      />
      <TouchableOpacity
        onPress={() => {
          onValueChange(true)
        }}
        className={cn(`flex-1 px-8 py-2`)}
      >
        <Typography
          className={cn(
            `items-center self-center  font-bold`,
            value ? 'text-white' : 'text-black'
          )}
        >
          {onText}
        </Typography>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          onValueChange(false)
        }}
        className={cn(`flex-1 px-8 py-2`)}
      >
        <Typography
          className={cn(
            `items-center self-center  font-bold`,
            !value ? 'text-white' : 'text-black'
          )}
        >
          {offText}
        </Typography>
      </TouchableOpacity>
    </View>
  )
}
