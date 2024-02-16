import { FieldValues } from 'react-hook-form'
import { SecureField, SecureFieldProps } from 'app/ui/form-fields/secure-field'
import {
  ControlledTextField,
  ControlledTextFieldProps
} from './controlled-field'

export type ControlledSecureFieldProps<T extends FieldValues> =
  SecureFieldProps & ControlledTextFieldProps<T>

export function ControlledSecureField<T extends FieldValues>({
  ...rest
}: ControlledSecureFieldProps<T>) {
  return <ControlledTextField InputComponent={SecureField} {...rest} />
}
