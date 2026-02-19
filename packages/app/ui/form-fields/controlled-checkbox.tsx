import Checkbox from 'expo-checkbox'
import { useController, useFormState } from 'react-hook-form'
import { cn } from 'app/ui/utils'

export function ControlledCheckbox({
  name,
  disabled,
  className,
  ...rest
}: { name: string } & React.ComponentProps<typeof Checkbox>) {
  const {
    field: { onChange, value },
    fieldState: { invalid }
  } = useController({ name })
  const { isSubmitting } = useFormState()

  return (
    <Checkbox
      value={value}
      onValueChange={onChange}
      className={cn(invalid ? 'border-red-500' : '', className)}
      disabled={disabled || isSubmitting}
      {...rest}
    />
  )
}
