import { View, Text, TextInput, Pressable } from 'react-native'
import React, { useMemo, useState } from 'react'
import { cn } from './utils'
import {
  AutocompleteDropdown,
  AutocompleteDropdownProps
} from 'react-native-autocomplete-dropdown'

export type DropdownItem = {
  id: string
  title: string
}

export type PtsDropdownProps = {
  label?: string
  maxHeight?: number
  value?: string
  defaultValue?: string
  list: any[]
  onChangeValue?: (item: DropdownItem) => void
  error?: boolean
  emptyResultText?: string
  onSubmitEditing?: (e?: any) => void
} & Omit<AutocompleteDropdownProps, 'ref'>

const DropdownInput = React.forwardRef<TextInput>(
  function DropdownInput(props, ref) {
    return (
      <TextInput
        ref={ref}
        blurOnSubmit={false}
        {...props}
        style={{}}
        className="flex h-9 shrink grow items-center overflow-hidden placeholder:text-black focus:outline-none"
      />
    )
  }
)

const PtsDropdown = React.forwardRef(function PtsDropdown(
  {
    label,
    // defaultValue,
    // value, // unused right now, is hooked into to sync with form state but is not "controlled"
    list,
    onChangeValue,
    error,
    emptyResultText = 'No options',
    onSubmitEditing,
    textInputProps
  }: PtsDropdownProps,
  ref: React.Ref<TextInput>
) {
  const [isFocus, setIsFocus] = useState(false)

  const dataSet = useMemo(() => {
    return list.map((item) => {
      return {
        title: item.title || item.name || item.label,
        id: item.id || item.value
      }
    })
  }, [list])

  return (
    <View className="">
      <Text className="absolute -top-[9px] left-2 z-[999] bg-white px-1 text-sm">
        {label}
      </Text>
      <Pressable
        className={cn(
          'web:pr-3 native:pr-0 h-11 rounded-lg border-[1px] border-gray-400 pl-4',
          isFocus && 'border-primary',
          error && 'border-destructive'
        )}
      >
        <AutocompleteDropdown
          ref={ref}
          emptyResultText={emptyResultText}
          key={`dropdown-${label}`}
          inputContainerStyle={{
            backgroundColor: 'transparent',
            height: '100%',
            alignItems: 'center',
            margin: 0
          }}
          clearOnFocus={false}
          closeOnSubmit
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onSelectItem={(item: DropdownItem) => {
            onChangeValue?.(item)
            item && onSubmitEditing?.()
          }}
          dataSet={dataSet}
          textInputProps={{
            placeholder: label,
            onSubmitEditing,
            blurOnSubmit: !!onSubmitEditing,
            ...textInputProps
          }}
          InputComponent={DropdownInput}
        />
      </Pressable>
    </View>
  )
})

export default PtsDropdown
