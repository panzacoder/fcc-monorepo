'use client'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { Form, useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from 'app/ui/button'
import { View } from 'react-native'
import { Card } from 'app/ui/card'
import { Typography } from 'app/ui/typography'

const schema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email()
})

export function NewsletterForm() {
  const {
    control,
    formState: { isSubmitSuccessful }
  } = useForm({
    defaultValues: {
      email: ''
    },
    resolver: zodResolver(schema)
  })

  const newsletterEndpoint =
    'https://customerioforms.com/forms/submit_action?site_id=aa324c82886ca70cf61f&form_id=ee843af016f04b0&success_url=https://familycarecircle.app'
  return (
    <Form
      control={control}
      action={newsletterEndpoint}
      render={({ submit }) => (
        <View className="flex-row items-center gap-2 ">
          {isSubmitSuccessful ? (
            <Typography variant="h6" className="text-secondary text-center">
              🎉 {`You're in!`} 🎉
            </Typography>
          ) : (
            <ControlledTextField
              className="text-secondary flex-1"
              control={control}
              name="email"
              placeholder="Enter your email"
              trailingSlot={
                <Button
                  variant="ghost-secondary"
                  iconOnly
                  trailingIcon="arrow-right-circle"
                  onPress={() => submit()}
                />
              }
            />
          )}
        </View>
      )}
    />
  )
}
