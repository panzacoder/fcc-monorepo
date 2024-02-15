import {
  Select as SelectComponent,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Option
} from 'base-ui'
import React from 'react'
import { Platform } from 'react-native'

export function Select({
  placeholder,
  onValueChange,
  options
}: {
  placeholder: string
  onValueChange?: (val: Option) => void
  options: string[]
}) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState<Option>()

  function handleValueChange(val: Option) {
    // prevent unselecting on native to replicate web behavior
    if (val) {
      // On web, the label and the value are the same.
      // Ex: { label: 'apple', value: 'apple' }
      // To replicate the native behavior, we need to set the proper label
      if (Platform.OS === 'web') {
        val.label = val.label in options ? options[val.label] : val.label
      }
      setValue(val)
      onValueChange?.(val)
    }
  }
  return (
    <SelectComponent
      open={open}
      onOpenChange={setOpen}
      value={value}
      onValueChange={handleValueChange}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue
          className="text-foreground native:text-lg text-sm"
          placeholder={placeholder}
        />
      </SelectTrigger>
      <SelectContent className="w-[180px]">
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          {options.map((option) => {
            if (option) {
              return (
                <SelectItem key={option} value={option} label={option}>
                  {option}
                </SelectItem>
              )
            }
          })}
        </SelectGroup>
      </SelectContent>
    </SelectComponent>
  )
}
