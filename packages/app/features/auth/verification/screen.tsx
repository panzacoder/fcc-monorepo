'use client'

import { useState } from 'react'
import { View, Alert, Text } from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { Button } from 'app/ui/button'
import { useRouter, useSearchParams } from 'solito/navigation'
import { CallPostService } from 'app/utils/fetchServerData'
import { BASE_URL, VERIFY_ACCOUNT, RESEND_OTP } from 'app/utils/urlConstants'
import { CardView } from 'app/ui/layouts/card-view'
import { CardHeader } from '../card-header'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { formatUrl } from 'app/utils/format-url'

const schema = z.object({
  authCode: z.string().length(6, { message: 'Enter 6 digit code from email' })
})

export type Schema = z.infer<typeof schema>

export function VerificationScreen() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams?.get('email') || '\n(email not found)'
  const [isLoading, setLoading] = useState(false)

  const { control, handleSubmit } = useForm({
    defaultValues: {
      authCode: ''
    },
    resolver: zodResolver(schema)
  })

  async function verifyAuthCode(formData: Schema) {
    setLoading(true)

    const loginURL = `${BASE_URL}${VERIFY_ACCOUNT}`
    const dataObject = {
      registrationVo: {
        emailOrPhone: email,
        varificationCode: formData.authCode
      }
    }
    CallPostService(loginURL, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          router.replace(formatUrl('/login', { email }))
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }
  async function resendAuthCode() {
    setLoading(true)
    let loginURL = `${BASE_URL}${RESEND_OTP}`
    let dataObject = {
      registration: {
        email: email
      }
    }
    CallPostService(loginURL, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        Alert.alert('', data.message)
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }
  return (
    <CardView>
      <PtsLoader loading={isLoading} />
      <CardHeader />
      <View className="my-5 flex flex-wrap justify-end gap-y-4">
        <Typography variant="h3" className="text-center">
          {'Almost There! 🎉'}
        </Typography>
        <Typography variant="h5" className="text-center">
          {'We sent a verification code to '}
          <Text className="underline">{email}</Text>
        </Typography>
        <Typography className="text-center text-sm">
          Please check your email to find the code or find an alternative link
          to verify your account.
        </Typography>

        <ControlledTextField
          name="authCode"
          control={control}
          placeholder={'Enter Verification Code'}
          keyboard={'numeric'}
          trailingSlot={
            <Button
              title="Resend"
              variant="link-secondary"
              trailingIcon="refresh-cw"
              onPress={resendAuthCode}
              size="sm"
            />
          }
        />

        <View className="flex flex-row justify-end gap-4">
          <Button
            variant="link"
            onPress={() => {
              router.push('/login')
            }}
            title="Back to Log in"
            leadingIcon="arrow-left"
          />

          <Button
            title="Verify"
            onPress={handleSubmit(verifyAuthCode)}
            trailingIcon="arrow-right"
          />
        </View>
      </View>
    </CardView>
  )
}
