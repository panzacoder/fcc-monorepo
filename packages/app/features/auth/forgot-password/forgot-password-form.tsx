import { useEffect } from 'react'
import { Typography } from 'app/ui/typography'
import { Button } from 'app/ui/button'
import { Alert, View } from 'react-native'
import { useForm } from 'react-hook-form'
import { useRouter } from 'expo-router'
import { useForgotPassword } from 'app/data/auth'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

export type ForgotPasswordFormProps = {
  onLoadingChange: (loading: boolean) => void
  onEmailVerified: (email: string) => void
}
export function ForgotPasswordForm({
  onLoadingChange,
  onEmailVerified
}: ForgotPasswordFormProps) {
  const schema = z
    .object({
      email: z.string().min(1, { message: 'Email is required' }).email()
    })
    .required()

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: ''
    },
    resolver: zodResolver(schema)
  })

  const router = useRouter()
  const forgotPasswordMutation = useForgotPassword({})

  useEffect(() => {
    onLoadingChange(forgotPasswordMutation.isPending)
  }, [forgotPasswordMutation.isPending])

  const onSubmit = (formData: any) => {
    forgotPasswordMutation.mutate(
      {
        appuserVo: {
          emailOrPhone: formData.email
        }
      },
      {
        onSuccess: (data) => {
          if (data) {
            onEmailVerified(formData.email)
          }
        },
        onError: () => {
          Alert.alert('', 'Unknown error occurred, please try again.')
        }
      }
    )
  }

  return (
    <View className="mb-2 mt-4 flex flex-wrap justify-end gap-y-4">
      <Typography variant="h5" as="h1" className="w-full">
        {'Enter your email to reset your account password'}
      </Typography>
      <ControlledTextField
        name="email"
        control={control}
        placeholder={'Email Address*'}
        autoCapitalize="none"
      />
      <View className="flex flex-row justify-end gap-4">
        <Button
          variant="link"
          className=""
          onPress={() => {
            router.push('/login')
          }}
          title="Back to Log in"
          leadingIcon="arrow-left"
        />

        <Button onPress={handleSubmit(onSubmit)} title="Reset" />
      </View>
    </View>
  )
}
