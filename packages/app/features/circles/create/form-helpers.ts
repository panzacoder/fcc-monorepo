import * as z from 'zod'
import { addressSchema } from 'app/ui/form-fields/address-fields'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

const schema = addressSchema.extend({
  email: z.string().email().optional(),
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  authorizedCaregiver: z.boolean().optional(),
  circleExists: z.boolean().optional()
})

export const resolver = zodResolver(schema)

export type CreateCircleSchema = z.infer<typeof schema>

export function useCreateCircleForm() {
  return useForm<CreateCircleSchema>({
    mode: 'onBlur',
    resolver
  })
}
