import { Pressable, View } from 'react-native'
import CalendarPicker, {
  CalendarPickerProps
} from 'react-native-calendar-picker'
import { Button } from '../button'
import { Typography } from '../typography'

export type CalenderViewProps = {
  calendarPickerProps: CalendarPickerProps
  onCancel: () => void
  onClear: () => void
}

export function CalendarView({ calendarPickerProps, onCancel, onClear }) {
  return (
    <View className="absolute top-[40] w-full self-center bg-white">
      <View className="bg-primary h-[50] w-full items-center justify-center rounded-tl-[20px] rounded-tr-[20px]">
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
      <Button
        title={'Clear'}
        className="mt-5 w-[40%] self-center bg-[#86939e]"
        onPress={onClear}
      />
    </View>
  )
}

export type CalendarPickerInputProps = {
  label: string
  onPress: () => void
  value: string
}

export function CalendarViewInput({ label, onPress, value }) {
  return (
    <Pressable
      onPress={onPress}
      className="flex w-full flex-row justify-between rounded-lg border border-gray-400 px-4 py-3"
    >
      <Typography className={`text-muted-foreground leading-tight`}>
        {label}
      </Typography>

      <Typography className={`text-foreground leading-tight`}>
        {value}
      </Typography>
    </Pressable>
  )
}
