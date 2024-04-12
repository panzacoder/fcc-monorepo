import { View } from 'react-native'
import CalendarPicker, {
  CalendarPickerProps
} from 'react-native-calendar-picker'
import { Button } from '../button'

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
