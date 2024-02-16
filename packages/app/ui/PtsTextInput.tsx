import { TextInput, TextInputProps, View } from 'react-native'
import { cn } from './utils'

export type PtsTextInputProps = {
  keyboard?: TextInputProps['keyboardType']
  isEditable?: TextInputProps['editable']
  onChangeText?: TextInputProps['onChangeText']
  trailingSlot?: React.ReactNode
  valid?: boolean
  textClassName?: string
} & TextInputProps

const PtsTextInput = ({
  className,
  textClassName,
  onChangeText,
  valid = true,
  keyboard = 'default',
  keyboardType = keyboard,
  isEditable = true,
  editable = isEditable,
  trailingSlot,
  ...rest
}: PtsTextInputProps) => {
  return (
    <View
      className={cn(
        'flex flex-row justify-between rounded-lg ',
        valid ? 'border-gray-400' : 'border-destructive',
        editable ? '' : 'bg-muted',
        className
      )}
    >
      <TextInput
        className={cn(
          'active:border-primary focus:border-primary flex-1 rounded-lg  border-[1px] border-gray-400 px-4 py-3 ',
          editable ? '' : 'text-muted-foreground',
          textClassName
        )}
        editable={editable}
        keyboardType={keyboardType}
        onChangeText={(text) => {
          onChangeText && onChangeText(text)
        }}
        {...rest}
      />
      <View className="absolute bottom-0 right-3 top-0 flex justify-center">
        {trailingSlot}
      </View>
    </View>
  )
}
export default PtsTextInput
