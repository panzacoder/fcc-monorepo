import { Typography } from 'app/ui/typography'
import { cn } from 'app/ui/utils'
import { Controller, ControllerProps, FieldValues } from 'react-hook-form'
import { View } from 'react-native'
import PtsDropdown, { PtsDropdownProps } from '../PtsDropdown'

export type ControlledDropdownProps<T extends FieldValues> = PtsDropdownProps &
  Omit<ControllerProps<T>, 'render'> & {
    className?: string
  }

export function ControlledDropdown<T extends FieldValues>({
  control,
  name,
  rules,
  onChangeValue,
  className,

  ...rest
}: ControlledDropdownProps<T>) {
  return (
    <Controller<T>
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value }, fieldState }) => {
        const handleChange = (text: string) => {
          onChange(text)
          onChangeValue && onChangeValue(text)
        }
        return (
          <View className={cn('flex w-full gap-1', className)}>
            <PtsDropdown
              error={fieldState?.invalid}
              onChangeValue={handleChange}
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
