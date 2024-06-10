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
    defaultValue,
    value = defaultValue,
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

  const valueObject = dataSet.find((item) => item.id === value)

  // console.log('value', value)
  return (
    <View className="flex">
      {label && (
        <Text className="text-muted-foreground px-1 text-sm">{label}</Text>
      )}
      <Pressable
        className={cn(
          'web:pr-3 native:pr-0 h-11 rounded-lg border-[1px] border-gray-400 pl-4',
          isFocus && 'border-primary',
          error && 'border-destructive'
        )}
      >
        <AutocompleteDropdown
          initialValue={valueObject}
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
          closeOnBlur
          closeOnSubmit
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onSelectItem={(item: DropdownItem) => {
            console.log('item', item)
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
