import { Pressable, Text, View } from 'react-native'
import CalendarPicker, {
  CalendarPickerProps
} from 'react-native-calendar-picker'
import { Button } from '../button'
import { Typography } from '../typography'
import { cn } from '../utils'

export type CalendarViewProps = {
  component: any
  calendarPickerProps: CalendarPickerProps
  onCancel: () => void
  onClear: () => void
}

export function CalendarView({
  component,
  calendarPickerProps,
  onCancel,
  onClear
}: CalendarViewProps) {
  return (
    <View className="border-primary absolute top-[40] w-[110%] self-center rounded-tl-[20px] rounded-tr-[20px] border-[1px] bg-white">
      <View className="bg-primary h-[50] w-full items-center justify-center self-center rounded-tl-[20px] rounded-tr-[20px]">
        <Button
          iconOnly
          onPress={onCancel}
          leadingIcon="x"
          variant="light"
          className="absolute right-3"
        />
      </View>
      <CalendarPicker {...calendarPickerProps} />
      <View className="mt-2 h-[1px] w-[97%] self-center bg-[#86939e]" />
      {component !== 'ConsolidatedView' ? (
        <Button
          title={'Clear'}
          className="my-2 w-[40%] self-center bg-[#86939e]"
          onPress={onClear}
        />
      ) : (
        <View />
      )}
    </View>
  )
}

export type CalendarPickerInputProps = {
  label: string
  onPress: () => void
  value: string
  className?: string
}

export function CalendarViewInput({
  label,
  onPress,
  value,
  className
}: CalendarPickerInputProps) {
  return (
    <View className={cn('flex', className)}>
      {label && (
        <Text className="text-muted-foreground } px-1 text-sm">{label}</Text>
      )}
      <Pressable
        onPress={onPress}
        className="flex w-full flex-row rounded-lg border border-gray-400 px-4 py-3"
      >
        <Typography
          className={`leading-tight text-black ${value.includes('Date') ? 'text-gray-400' : 'text-black'}`}
        >
          {value}
        </Typography>
      </Pressable>
    </View>
  )
}
