import PtsTextInput, { PtsTextInputProps } from 'app/ui/PtsTextInput'
import { Typography } from 'app/ui/typography'
import { cn } from 'app/ui/utils'
import { Controller, ControllerProps, FieldValues } from 'react-hook-form'
import { View } from 'react-native'

export type ControlledTextFieldProps<T extends FieldValues> =
  PtsTextInputProps &
    Omit<ControllerProps<T>, 'render'> & {
      InputComponent?: React.ComponentType<any>
    }

export function ControlledTextField<T extends FieldValues>({
  control,
  name,
  rules,
  onChangeText,
  className,
  InputComponent = PtsTextInput,

  ...rest
}: ControlledTextFieldProps<T>) {
  return (
    <Controller<T>
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value }, fieldState }) => {
        const handleChange = (text: string) => {
          onChange(text)
          onChangeText && onChangeText(text)
        }
        return (
          <View className="flex w-full gap-1">
            <InputComponent
              className={
                (cn('', fieldState?.invalid && 'border-destructive'), className)
              }
              onChangeText={handleChange}
              value={value}
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
