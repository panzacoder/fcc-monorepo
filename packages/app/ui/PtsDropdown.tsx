import { View, Text, StyleSheet } from 'react-native'
import { useState } from 'react'
import { Dropdown } from 'react-native-element-dropdown'
import { cn } from './utils'
export type PtsDropdownProps = {
  label?: string
  maxHeight?: number
  value?: number
  list?: any
  onChangeValue?: CallableFunction
  error?: boolean
}
const PtsDropdown = ({
  label,
  maxHeight,
  value,
  list,
  onChangeValue,
  error
}: PtsDropdownProps) => {
  const [isFocus, setIsFocus] = useState(false)

  return (
    <View className="">
      {isFocus ? (
        <Text className="absolute left-[22] top-[8] z-[999] bg-white px-[8] text-[14px]">
          {label}
        </Text>
      ) : null}
      <View
        className={cn(
          'rounded-lg border-[1px] border-gray-400 px-4 py-1',
          'border-gray-400',
          isFocus && 'border-gray-400',
          error && 'border-destructive'
        )}
      >
        <Dropdown
          disable={list?.length === 0}
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
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item: any) => {
            onChangeValue && onChangeValue(item.value)
          }}
        />
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  icon: {
    marginRight: 5
  },
  placeholderStyle: {
    fontSize: 14
  },
  selectedTextStyle: {
    fontSize: 14
  },
  iconStyle: {
    width: 20,
    height: 20
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 14
  }
})

export default PtsDropdown
