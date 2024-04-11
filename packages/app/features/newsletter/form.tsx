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
        <Card
          variant="secondary"
          className="gap-3 pb-5 pt-3"
          title="Be the first to know when the new Family Care Circle is available."
        >
          {isSubmitSuccessful ? (
            <Typography variant="h6" className="text-primary text-center">
              🎉 {`You're in!`} 🎉
            </Typography>
          ) : (
            <View className="flex-row items-center gap-2 ">
              <ControlledTextField
                className="text-secondary-foreground flex-1"
                control={control}
                name="email"
                placeholder="Enter your email"
                trailingSlot={
                  <Button
                    variant="secondary"
                    iconOnly
                    trailingIcon="arrow-right-circle"
                    onPress={() => submit()}
                  />
                }
              />
            </View>
          )}
        </Card>
      )}
    />
  )
}
