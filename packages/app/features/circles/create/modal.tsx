import { View } from 'react-native'
import { FormProvider, SubmitHandler } from 'react-hook-form'
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Button } from 'app/ui/button'
import { Typography } from 'app/ui/typography'
import { ScrollView } from 'app/ui/scroll-view'
import { Divider } from 'app/ui/divider'
import { useRouter } from 'solito/navigation'
import { CreateCircleProps, createCircle } from 'app/data/circle/create'
import {
  CircleAddressFields,
  CircleEmailFields,
  CircleNameFields
} from './create-circle-fields'
import { CreateCircleSchema, useCreateCircleForm } from './useCircleForm'
import { Card } from 'app/ui/card'
import { joinCircle } from 'app/data/circle/join'

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

  console.log('isValid', isValid)
  const [firstName, email, circleExists] = watch([
    'firstName',
    'email',
    'circleExists'
  ])

  return (
    <AutocompleteDropdownContextProvider headerOffset={insets.top}>
      <FormProvider {...formMethods}>
        <View className="flex h-full items-center">
          <Typography
            variant="h1"
            className="bg-accent text-accent-foreground w-full py-4 text-center"
          >
            Create a Circle
          </Typography>
          <Divider className="bg-accent-foreground" />
          <ScrollView
            automaticallyAdjustKeyboardInsets={true}
            contentInsetAdjustmentBehavior="automatic"
            className="w-full bg-white p-4"
          >
            <View className="flex items-start gap-4">
              <CircleNameFields />
              <CircleEmailFields />

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
                  <CircleAddressFields />
                  <Button
                    disabled={!isValid}
                    className="w-full"
                    title={'Create Circle'}
                    onPress={handleSubmit(submitCircleForm)}
                  />
                </>
              )}
            </View>
          </ScrollView>
        </View>
      </FormProvider>
    </AutocompleteDropdownContextProvider>
  )
}
