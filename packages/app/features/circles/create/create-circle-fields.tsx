import { Feather } from 'app/ui/icons'
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
import { AddressFields } from 'app/ui/form-fields/address-fields'
import * as z from 'zod'
import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ControlledCheckbox } from 'app/ui/form-fields/controlled-checkbox'
import { CreateCircleSchema } from './useCircleForm'
import { findCircle } from 'app/data/circle/find'

export function CircleNameFields() {
  const { setFocus } = useFormContext()
  return (
    <View className="flex items-start gap-2">
      <View className="flex-row items-center gap-2 pb-2">
        <Feather name={'info'} size={20} className="color-primary" />
        <Typography className="">
          {'Circles organize caregiving details for an individual.'}
        </Typography>
      </View>

      <Typography variant="h5">Who is this Circle for?</Typography>
      <View className="flex w-full flex-row gap-2">
        <ControlledTextField
          name="firstName"
          placeholder={'First Name'}
          className="flex-1"
          onSubmitEditing={() => {
            setFocus('lastName')
          }}
        />
        <ControlledTextField
          name="lastName"
          placeholder="Last Name"
          className="flex-1"
          onSubmitEditing={() => {
            setFocus('email')
          }}
        />
      </View>
    </View>
  )
}

const emailCheckSchema = z.object({
  email: z.string().email()
})

export type CheckCircleSchema = z.infer<typeof emailCheckSchema>

export function CircleEmailFields() {
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
      setValue('circleExists', true)
    }
  }
  if (!firstName || !lastName) {
    return null
  }
  return (
    <>
      <Divider className="bg-muted mt-6" />
      <View className="flex flex-row items-center gap-2">
        <Typography variant="h5" className="basis-1/2">
          {`Do you want ${firstName} to manage their circle?`}
        </Typography>
        <ManagedSwitch
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

export function CircleAddressFields() {
  const [firstName, lastName, email, authorizedCaregiver] =
    useWatch<CreateCircleSchema>({
      name: ['firstName', 'lastName', 'email', 'authorizedCaregiver']
    })
  if (!(firstName && lastName && (email || authorizedCaregiver))) {
    return null
  }
  return (
    <>
      <Divider className="bg-muted" />
      <Typography variant="h4">
        {`What is ${firstName}'s primary address?`}
      </Typography>
      <AddressFields className="w-full" />
    </>
  )
}
