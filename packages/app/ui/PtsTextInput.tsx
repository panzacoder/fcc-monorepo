'use client'

import { TextInput, TextInputProps, View } from 'react-native'
import { cn } from './utils'
import React from 'react'

export type PtsTextInputProps = {
  keyboard?: TextInputProps['keyboardType']
  isEditable?: TextInputProps['editable']
  onChangeText?: TextInputProps['onChangeText']
  trailingSlot?: React.ReactNode
  valid?: boolean
  textClassName?: string
} & TextInputProps

const PtsTextInput = React.forwardRef(function PtsTextInput(
  {
    className,
    textClassName,
    onChangeText,
    valid = true,
    keyboard = 'default',
    keyboardType = keyboard,
    isEditable = true,
    editable = isEditable,
    trailingSlot,
    onSubmitEditing,
    returnKeyType = 'next',
    ...rest
  }: PtsTextInputProps,
  ref: React.Ref<TextInput>
) {
  return (
    <View
      className={cn(
        'flex flex-row justify-between rounded-lg',
        valid ? 'border-gray-400' : 'border-destructive',
        editable ? '' : 'bg-muted',
        className
      )}
    >
      <TextInput
        ref={ref}
        className={cn(
          'active:border-primary focus:border-primary h-11 flex-1 flex-row rounded-lg  border-[1px] border-gray-400 px-4 placeholder:text-gray-400',
          editable ? '' : 'text-muted-foreground',
          textClassName
        )}
        editable={editable}
        keyboardType={keyboardType}
        returnKeyType={returnKeyType}
        blurOnSubmit={!onSubmitEditing}
        onSubmitEditing={onSubmitEditing}
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
})

export default PtsTextInput
