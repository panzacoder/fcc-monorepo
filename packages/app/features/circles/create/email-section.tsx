import { Divider } from 'app/ui/divider'
import { View } from 'react-native'
import { Typography } from 'app/ui/typography'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { Card } from 'app/ui/card'
import { ManagedSwitch } from 'app/ui/managed-switch'
import {
  SubmitHandler,
  useForm,
  useFormContext,
  useWatch
} from 'react-hook-form'
import * as z from 'zod'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ControlledCheckbox } from 'app/ui/form-fields/controlled-checkbox'
import { findCircle } from 'app/data/circle/find'

const emailCheckSchema = z.object({
  email: z.string().email()
})

export type CheckCircleSchema = z.infer<typeof emailCheckSchema>

export function CircleEmailSection() {
  const [firstName, lastName] = useWatch({
    name: ['firstName', 'lastName']
  })
  const email = useWatch({ name: 'email' })

  const [withEmail, setWithEmail] = useState(true)
  const { setFocus, setValue } = useFormContext()

  const emailCheckFormMethods = useForm<CheckCircleSchema>({
    mode: 'onSubmit',
    resolver: zodResolver(emailCheckSchema),
    values: { email }
  })

  const checkEmailFormSubmit: SubmitHandler<CheckCircleSchema> = async (
    formFields
  ) => {
    const circle = await findCircle(formFields)
    if (circle) {
      setValue('circleExists', circle)
    }
  }
  if (!firstName || !lastName) {
    return null
  }
  return (
    <>
      <Divider className="bg-muted mt-2" />
      <View className="flex flex-row flex-wrap gap-2 items-center justify-center">
        <Typography variant="h5" className="text-center basis-full">
          {`Do you want ${firstName} to manage their circle?`}
        </Typography>
        <ManagedSwitch
          className=''
          value={withEmail}
          onValueChange={setWithEmail}
          onText="Yes"
          offText="No"
        />
      </View>
      {withEmail ? (
        <ControlledTextField
          name="email"
          placeholder={'Email Address'}
          className="w-full"
          autoCapitalize="none"
          onBlur={emailCheckFormMethods.handleSubmit(checkEmailFormSubmit)}
          onSubmitEditing={() => setFocus('address')}
        />
      ) : (
        <Card className="bg-secondary flex w-full flex-col gap-5 py-5">
          <Typography className="text-secondary-foreground text-lg">
            {`You will be the sole manager of ${firstName + "'s"} Circle.\n`}
            {`If at any point ${firstName} wants to manage their Circle, you can add their email address in Circle settings.`}
          </Typography>
          <Divider className="bg-secondary-foreground/50" />
          <View className="flex flex-row items-center gap-4">
            <ControlledCheckbox name="authorizedCaregiver" />
            <Typography className="text-secondary-foreground text-lg">
              {`I am an authorized caregiver for ${firstName}.`}
            </Typography>
          </View>
        </Card>
      )}
    </>
  )
}
