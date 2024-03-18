import { Button } from 'app/ui/button'
import { Feather } from 'app/ui/icons'
import { Typography } from 'app/ui/typography'
import { useState } from 'react'
import { Alert, View } from 'react-native'

import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { FormProvider, useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ScrollView } from 'app/ui/scroll-view'
import { Divider } from 'app/ui/divider'
import { Card } from '../../../ui/card'
import { useRouter } from 'solito/navigation'
import {
  BASE_URL,
  CREATE_CIRCLE,
  CREATE_CIRCLE_NO_EMAIL
} from 'app/utils/urlConstants'
import { CallPostService } from 'app/utils/fetchServerData'
import store from 'app/redux/store'
import { ManagedSwitch } from 'app/ui/managed-switch'
import Checkbox from 'expo-checkbox'
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { addressSchema, AddressFields } from 'app/ui/form-fields/address-fields'

const schema = addressSchema.extend({
  email: z.string().email(),
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' })
})

export type Schema = z.infer<typeof schema>

export function CreateCircle() {
  const router = useRouter()
  const header = store.getState().headerState.header
  const [formStep, setFormStep] = useState(0)
  const [withEmail, setWithEmail] = useState(true)
  const [isAuthorizedCaregiver, setIsAuthorizedCaregiver] = useState(false)
  const insets = useSafeAreaInsets()

  async function createCircle() {
    let url = `${BASE_URL}${withEmail ? CREATE_CIRCLE_NO_EMAIL : CREATE_CIRCLE}`
    let dataObject = {
      header: header
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          router.push('/circles/')
        } else {
          Alert.alert('', data.message)
        }
        // setLoading(false)
      })
      .catch((error) => {
        // setLoading(false)
        console.log(error)
      })
  }

  const formMethods = useForm({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      country: -1,
      state: -1,
      timezone: '',
      postalCode: ''
    },
    resolver: zodResolver(schema)
  })

  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid }
  } = formMethods

  const firstName = watch('firstName')
  const lastName = watch('lastName')
  const timezone = watch('timezone')
  const email = watch('email')

  console.log('timezone', timezone)

  const previousFormStep = () => {
    if (formStep === 1) {
      setFormStep(0)
    } else if (formStep === 2) {
      setFormStep(1)
    }
  }
  const nextFormStep = () => {
    if (formStep === 0) {
      setFormStep(1)
    } else if (formStep === 1) {
      setFormStep(2)
    } else {
      // handleSubmit()
    }
  }

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
                    control={control}
                    name="firstName"
                    placeholder={'First Name'}
                    className="flex-1"
                    onSubmitEditing={() => {
                      formMethods.setFocus('lastName')
                    }}
                  />
                  <ControlledTextField
                    control={control}
                    name="lastName"
                    placeholder="Last Name"
                    className="flex-1"
                    onSubmitEditing={() => {
                      formMethods.setFocus('email')
                    }}
                  />
                </View>
              </View>
              {firstName && lastName && (
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
                      control={control}
                      name="email"
                      placeholder={'Email Address'}
                      className="w-full"
                      autoCapitalize="none"
                      onSubmitEditing={() => {
                        formMethods.setFocus('address')
                      }}
                    />
                  ) : (
                    <View className="flex w-full flex-col ">
                      <Card className="bg-secondary flex w-full flex-col gap-5 py-5">
                        <Typography className="text-secondary-foreground text-lg">
                          {`You will be the sole manager of ${firstName + "'s"} Circle.\n`}
                          {`If at any point ${firstName} wants to manage their Circle, you can add their email address in Circle settings.`}
                        </Typography>
                        <Divider className="bg-secondary-foreground/50" />
                        <View className="flex flex-row items-center gap-4">
                          <Checkbox
                            value={isAuthorizedCaregiver}
                            onValueChange={setIsAuthorizedCaregiver}
                          />
                          <Typography className="text-secondary-foreground text-lg">
                            {`I am an authorized caregiver for ${firstName}.`}
                          </Typography>
                        </View>
                      </Card>
                    </View>
                  )}
                </>
              )}
              {(email || isAuthorizedCaregiver) && (
                <>
                  <Divider className="bg-muted" />
                  <Typography variant="h4">
                    {`What is ${firstName}'s primary address?`}
                  </Typography>
                  <AddressFields className="w-full" />
                </>
              )}

              <Button
                disabled={!isValid}
                className="w-full"
                title={'Create Circle'}
                onPress={nextFormStep}
              />
            </View>
          </ScrollView>
        </View>
      </FormProvider>
    </AutocompleteDropdownContextProvider>
  )
}
