'use client'

import { View, Alert, Text } from 'react-native'
import { useVerifyAccount, useResendOtp } from 'app/data/auth'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { Button } from 'app/ui/button'
import { useRouter, useLocalSearchParams } from 'expo-router'
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

type Schema = z.infer<typeof schema>

export function VerificationScreen() {
  const router = useRouter()
  const item = useLocalSearchParams()
  const email = item.email ? item.email : ''
  const verifyMutation = useVerifyAccount({})
  const resendMutation = useResendOtp({})

  const { control, handleSubmit } = useForm({
    defaultValues: {
      authCode: ''
    },
    resolver: zodResolver(schema)
  })

  const isLoading = verifyMutation.isPending || resendMutation.isPending

  async function verifyAuthCode(formData: Schema) {
    verifyMutation.mutate(
      {
        registrationVo: {
          emailOrPhone: email as string,
          varificationCode: formData.authCode
        }
      },
      {
        onSuccess: (data) => {
          if (data) {
            router.replace(formatUrl('/login', {}))
          }
        }
      }
    )
  }
  async function resendAuthCode() {
    resendMutation.mutate(
      {
        registration: {
          email: email as string
        }
      },
      {
        onSuccess: () => {
          Alert.alert('', 'Verification code has been resent')
        }
      }
    )
  }
  return (
    <CardView>
      <PtsLoader loading={isLoading} />
      <CardHeader />
      <View className="mb-3 mt-5 flex flex-wrap justify-end gap-y-4">
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
