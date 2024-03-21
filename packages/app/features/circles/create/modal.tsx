import { FormProvider, SubmitHandler } from 'react-hook-form'
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Button } from 'app/ui/button'
import { Typography } from 'app/ui/typography'
import { useRouter } from 'solito/navigation'
import { CreateCircleProps, createCircle } from 'app/data/circle/create'
import { CircleNameSection } from './name-section'
import { CircleEmailSection } from './email-section'
import { CircleAddressSection } from './address-section'
import { CreateCircleSchema, useCreateCircleForm } from './form-helpers'
import { Card } from 'app/ui/card'
import { joinCircle } from 'app/data/circle/join'
import { ModalScreen } from 'app/ui/modal-screen'

export function CreateCircle() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const submitCircleForm: SubmitHandler<CreateCircleSchema> = async (
    formData: CreateCircleSchema
  ) => {
    const circleRequestProps: CreateCircleProps = {
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      address: {
        line: formData.address,
        city: formData.city,
        state: {
          id: formData.state,
          country: {
            id: formData.country
          }
        },
        timezone: {
          id: formData.timezone
        },
        zipCode: formData.postalCode
      }
    }

    const res = await createCircle(circleRequestProps)
    if (res) {
      router.replace('/circles')
    }
  }

  const formMethods = useCreateCircleForm()
  const {
    watch,
    handleSubmit,
    formState: { isValid }
  } = formMethods

  const [firstName, email, circleExists] = watch([
    'firstName',
    'email',
    'circleExists'
  ])

  return (
    <AutocompleteDropdownContextProvider headerOffset={insets.top}>
      <FormProvider {...formMethods}>
        <ModalScreen title="Create a Circle">
          <CircleNameSection />
          <CircleEmailSection />

          {circleExists && email ? (
            <Card className="bg-secondary flex w-full flex-col gap-5 py-5">
              <Typography className="text-secondary-foreground text-lg">
                {`A circle already exists for ${firstName}\n`}
                {`You can request to join this circle, or go back and choose a different email for this circle.`}
              </Typography>

              <Button
                variant="outline"
                title={'Go back'}
                onPress={() => {
                  formMethods.setValue('email', '')
                  formMethods.setValue('circleExists', false)
                }}
              />
              <Button
                title={'Request to Join'}
                onPress={() => joinCircle({ email })}
              />
            </Card>
          ) : (
            <>
              <CircleAddressSection />
              <Button
                disabled={!isValid}
                className="w-full"
                title={'Create Circle'}
                onPress={handleSubmit(submitCircleForm)}
              />
            </>
          )}
        </ModalScreen>
      </FormProvider>
    </AutocompleteDropdownContextProvider>
  )
}
