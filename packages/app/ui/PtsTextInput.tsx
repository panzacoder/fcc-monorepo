import { View, TextInput } from 'react-native'
export type Props = {
  value?: any
  className?: string
  placeHolder?: string
  defaultValue?: string
  keyboard?: any
  onChangeText?: CallableFunction
  isEditable?: boolean
}
const PtsTextInput = ({
  value,
  className,
  placeHolder,
  defaultValue,
  onChangeText,
  keyboard,
  isEditable,
}: Props) => {
  return (
    <View>
      <TextInput
        editable={isEditable !== undefined ? isEditable : true}
        className={className}
        onChangeText={(text) => {
          onChangeText && onChangeText(text)
        }}
        placeholder={placeHolder}
        value={value}
        defaultValue={defaultValue}
        keyboardType={keyboard ? keyboard : 'default'}
      />
    </View>
  )
}
export default PtsTextInput
