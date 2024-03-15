import PtsTextInput, { PtsTextInputProps } from 'app/ui/PtsTextInput'
import { Typography } from 'app/ui/typography'
import { cn } from 'app/ui/utils'
import React from 'react'
import { Controller, ControllerProps, FieldValues } from 'react-hook-form'
import { TextInput, View } from 'react-native'

export type ControlledTextFieldProps<T extends FieldValues> =
  PtsTextInputProps &
    Omit<ControllerProps<T>, 'render'> & {
      inputClassName?: string
      InputComponent?: React.ComponentType<any>
    }

export function ControlledTextField<T extends FieldValues>({
  control,
  name,
  rules,
  onChangeText,
  className,
  inputClassName,
  InputComponent = PtsTextInput,
  ...rest
}: ControlledTextFieldProps<T>) {
  return (
    <Controller<T>
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, ...fieldProps }, fieldState }) => {
        const handleChange = (text: string) => {
          onChange(text)
          onChangeText && onChangeText(text)
        }
        return (
          <View className={cn('flex w-full gap-1', className)}>
            <InputComponent
              className={
                (cn('', fieldState?.invalid && 'border-destructive'),
                inputClassName)
              }
              onChangeText={handleChange}
              {...fieldProps}
              {...rest}
            />
            {fieldState?.invalid && (
              <Typography className="text-destructive">
                {fieldState?.error?.message}
              </Typography>
            )}
          </View>
        )
      }}
    />
  )
}
