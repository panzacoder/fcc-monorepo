import { FormProvider, SubmitHandler } from 'react-hook-form'
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ScrollView } from 'app/ui/scroll-view'
import { SafeAreaView } from 'app/ui/safe-area-view'
import { Button } from 'app/ui/button'
import { Typography } from 'app/ui/typography'
import { useRouter } from 'expo-router'
import {
  CreateCircleParams,
  createCircle,
  useJoinCircle
} from 'app/data/circle'
import { CircleNameSection } from './name-section'
import _ from 'lodash'
import { CircleEmailSection } from './email-section'
import { CircleAddressSection } from './address-section'
import { CreateCircleSchema, useCreateCircleForm } from './form-helpers'
import { Card } from 'app/ui/card'
import { useAppSelector } from 'app/redux/hooks'
import { logger } from 'app/utils/logger'
import { ModalScreen } from 'app/ui/modal-screen'

export function CreateCircle() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const header = useAppSelector((state) => state.headerState.header)
  const submitCircleForm: SubmitHandler<CreateCircleSchema> = async (
    formData: CreateCircleSchema
  ) => {
    const circleRequestProps: CreateCircleParams = {
      memberVo: {
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
    }

    const res = await createCircle(header, circleRequestProps)
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

  const joinCircleMutation = useJoinCircle(header)

  const [firstName, lastName, email, circleExists] = watch([
    'firstName',
    'lastName',
    'email',
    'circleExists'
  ])
  function joinCircle() {
    logger.debug('joinCircle', JSON.stringify(circleExists))
    let details: any = circleExists
    joinCircleMutation.mutate(
      {
        memberVo: {
          id: details !== undefined && details?.id ? details.id : ''
        }
      },
      {
        onSuccess: (data) => {
          if (data) {
            router.dismiss(2)
            router.replace('/circles')
          }
        }
      }
    )
  }
  return (
    <AutocompleteDropdownContextProvider headerOffset={insets.top}>
      <SafeAreaView>
        <ScrollView>
          <FormProvider {...formMethods}>
            <ModalScreen title="Create a Circle">
              <CircleNameSection />
              <CircleEmailSection />

              {circleExists && !_.isEmpty(circleExists) && email ? (
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
                    onPress={() => {
                      joinCircle()
                    }}
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
        </ScrollView>
      </SafeAreaView>
    </AutocompleteDropdownContextProvider>
  )
}
