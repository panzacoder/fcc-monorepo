'use client'

import { useState } from 'react'
import { View, Alert } from 'react-native'
import { CallPostService } from 'app/utils/fetchServerData'
import { Button } from 'app/ui/button'
import { BASE_URL, CREATE_ACCOUNT } from 'app/utils/urlConstants'
import { Typography } from 'app/ui/typography'
import PtsLoader from 'app/ui/PtsLoader'
import { useRouter } from 'solito/navigation'
import { CardHeader } from '../card-header'
import { CardView } from 'app/ui/layouts/card-view'
import { CheckBox } from 'react-native-elements'
import { formatUrl } from 'app/utils/format-url'

import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { ControlledSecureField } from 'app/ui/form-fields/controlled-secure-field'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { addressSchema, AddressFields } from 'app/ui/form-fields/address-fields'
import { ScrollView } from 'app/ui/scroll-view'

const schema = addressSchema
  .extend({
    firstName: z.string().min(1, { message: 'First Name is required' }),
    lastName: z.string().min(1, { message: 'Last Name is required' }),
    phone: z.string(),
    email: z.string().min(1, { message: 'Email is required' }).email(),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .max(20, { message: 'Password can be max 20 characters' })
      .regex(/[0-9]/g, { message: 'Password must contain a number' })
      .regex(/[!,@,#,$,%,^,&,*]/g, {
        message: 'Password must contain a special character !@#$%^&*'
      }),
    confirmPassword: z.string().min(1, { message: 'Confirm new password' }),
    acceptTc: z.boolean()
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords must match',
        path: ['confirmPassword']
      })
    }
  })

type Schema = z.infer<typeof schema>

export function SignUpScreen() {
  const [isLoading, setLoading] = useState(false)

  const formMethods = useForm<Schema>({
    resolver: zodResolver(schema)
  })

  const router = useRouter()

  async function submitRegistration(formData: Schema) {
    console.log('formData', formData)
    const url = `${BASE_URL}${CREATE_ACCOUNT}`
    const dataObject = {
      registration: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        credential: formData.password,
        userTimezone: formData.timezone,
        referralCode: '',
        address: {
          state: {
            id: formData.state
          }
        }
      }
    }
    setLoading(true)
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          router.push(formatUrl('/verification', { email: formData.email }))
        } else if (data.errorCode === 'RVF_101') {
          Alert.alert('', 'Please check your email for verification code')
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        Alert.alert('', error)
        console.log(error)
      })
  }

  return (
    <CardView className="max-h-[90%]">
      <CardHeader
        actionSlot={
          <View className="flex flex-1 flex-col items-end">
            <Typography className="text-right">
              {'Already a member?'}
            </Typography>
            <Button
              title="Log in"
              variant="link"
              onPress={() => {
                router.push('/login')
              }}
              className="p-0"
            />
          </View>
        }
      />

      <PtsLoader loading={isLoading} />
      <ScrollView>
        <FormProvider {...formMethods}>
          <View className="mb-2 mt-5 flex flex-wrap justify-end gap-y-4">
            <View className="flex w-full gap-2">
              <View className="flex w-full flex-row justify-between gap-2">
                <ControlledTextField
                  name="firstName"
                  className="flex-1"
                  placeholder={'First Name*'}
                  onSubmitEditing={() => {
                    formMethods.setFocus('lastName')
                  }}
                />
                <ControlledTextField
                  name="lastName"
                  className="flex-1"
                  placeholder={'Last Name*'}
                  onSubmitEditing={() => {
                    formMethods.setFocus('email')
                  }}
                />
              </View>
              <ControlledTextField
                name="email"
                placeholder={'Email Address*'}
                autoCapitalize="none"
                onSubmitEditing={() => {
                  formMethods.setFocus('phone')
                }}
              />
              <ControlledTextField
                name="phone"
                placeholder={'Phone'}
                keyboard={'numeric'}
                onSubmitEditing={() => {
                  formMethods.setFocus('password')
                }}
              />
              <ControlledSecureField
                name="password"
                placeholder="Password*"
                onSubmitEditing={() => {
                  formMethods.setFocus('confirmPassword')
                }}
              />
              <ControlledSecureField
                name="confirmPassword"
                placeholder="Confirm Password*"
                onSubmitEditing={() => {
                  formMethods.setFocus('address')
                }}
              />

              <AddressFields
                onSubmitEditing={() => {
                  formMethods.setFocus('acceptTc')
                }}
              />
            </View>
            <View className="flex flex-row items-center justify-center ">
              <Controller
                name="acceptTc"
                render={({ field: { onChange, value }, fieldState }) => (
                  <CheckBox
                    checked={value}
                    checkedColor={fieldState.invalid ? 'red' : '#6493d9'}
                    onPress={() => {
                      onChange(!value)
                    }}
                    className="flex-shrink"
                  />
                )}
              />
              <Typography className="ml-[-10px] flex-1">
                {'I accept the '}
                <Typography
                  onPress={() => {
                    router.push(
                      formatUrl('/(termsAndPolicy)/termsAndConditions', {})
                    )
                  }}
                  className="text-primary  font-bold"
                >
                  {' Terms and Conditions '}
                </Typography>
                <Typography>{' and '}</Typography>
                <Typography className="text-primary font-bold">
                  {' Privacy Policy '}
                </Typography>
              </Typography>
            </View>
            <Button
              onPress={formMethods.handleSubmit(submitRegistration)}
              className="w-full"
              title="Sign Up"
            />
          </View>
        </FormProvider>
      </ScrollView>
    </CardView>
  )
}
