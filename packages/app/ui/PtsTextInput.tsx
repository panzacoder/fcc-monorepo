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
        'flex flex-row justify-between rounded-lg border-[1px] border-gray-400 px-4 py-3',
        valid ? 'border-gray-400' : 'border-destructive',
        editable ? '' : 'bg-muted',
        className
      )}
    >
      <TextInput
        className={cn(
          'flex-1',
          editable ? '' : 'text-muted-foreground',
          textClassName
        )}
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
