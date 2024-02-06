import { View, Text, StyleSheet } from 'react-native'
import { useState } from 'react'
import { Dropdown } from 'react-native-element-dropdown'
export type Props = {
  label?: string
  maxHeight?: number
  value?: number
  list?: any
  onChangeValue?: CallableFunction
}
const PtsDropdown = ({
  label,
  maxHeight,
  value,
  list,
  onChangeValue
}: Props) => {
  const [isFocus, setIsFocus] = useState(false)
  const renderLabel = () => {
    if (isFocus) {
      return (
        <Text className="absolute left-[22] top-[8] z-[999] bg-white px-[8] text-[14px]">
          {label}
        </Text>
      )
    }
    return null
  }

  return (
    <View className="bg-white p-[16]">
      {renderLabel()}
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={list}
        search
        maxHeight={maxHeight ? maxHeight : 300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? 'Select ' + label : '...'}
        searchPlaceholder="Search..."
        // value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item: any) => {
          // setValue(item.value ? item.value : '')
          onChangeValue && onChangeValue(item.value)
          //   setIsFocus(false)
        }}
      />
    </View>
  )
}
const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    borderColor: '#808080',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8
  },
  icon: {
    marginRight: 5
  },
  placeholderStyle: {
    fontSize: 16
  },
  selectedTextStyle: {
    fontSize: 16
  },
  iconStyle: {
    width: 20,
    height: 20
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16
  }
})

export default PtsDropdown
