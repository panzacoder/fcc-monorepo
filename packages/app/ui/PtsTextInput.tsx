import { TextInput, TextInputProps, View } from 'react-native'
import { cn } from './utils'

export type PtsTextInputProps = {
  keyboard?: TextInputProps['keyboardType']
  isEditable?: TextInputProps['editable']
  onChangeText?: TextInputProps['onChangeText']
  trailingSlot?: React.ReactNode
} & TextInputProps

const PtsTextInput = ({
  className,
  onChangeText,
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
        'flex flex-row justify-between rounded-lg border-[1px] border-gray-400 px-4 py-3',
        className
      )}
    >
      <TextInput
        className="flex-1"
        editable={editable}
        keyboardType={keyboardType}
        onChangeText={(text) => {
          console.log('text', text)
          onChangeText && onChangeText(text)
        }}
        {...rest}
      />
      {trailingSlot}
    </View>
  )
}
export default PtsTextInput
