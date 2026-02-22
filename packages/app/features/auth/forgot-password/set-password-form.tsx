import { useEffect } from 'react'
import { Typography } from 'app/ui/typography'
import { Button } from 'app/ui/button'
import { Alert, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useResetPassword } from 'app/data/auth'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { ControlledSecureField } from 'app/ui/form-fields/controlled-secure-field'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

export type ResetPasswordFormProps = {
  email: string
  onLoadingChange: (loading: boolean) => void
}

const schema = z
  .object({
    email: z.string().min(1, { message: 'Email is required' }).email(),
    authCode: z
      .string()
      .min(1, { message: 'Please enter code sent to your email provided' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .max(20, { message: 'Password can be max 20 characters' })
      .regex(/[0-9]/g, { message: 'Password must contain a number' })
      .regex(/[!,@,#,$,%,^,&,*]/g, {
        message: 'Password must contain a special character !@#$%^&*'
      }),
    confirmPassword: z.string().min(1, { message: 'Confirm new password' })
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

export type Schema = z.infer<typeof schema>

export function SetPasswordForm({
  email,
  onLoadingChange
}: ResetPasswordFormProps) {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email,
      authCode: '',
      password: '',
      confirmPassword: ''
    },
    resolver: zodResolver(schema)
  })

  const router = useRouter()
  const resetPasswordMutation = useResetPassword({})

  useEffect(() => {
    onLoadingChange(resetPasswordMutation.isPending)
  }, [resetPasswordMutation.isPending])

  const onSubmit = (formData: any) => {
    resetPasswordMutation.mutate(
      {
        appuserVo: {
          emailOrPhone: formData.email,
          tempPassword: formData.authCode,
          credential: formData.password
        }
      },
      {
        onSuccess: (data) => {
          if (data) {
            router.push('/login')
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
      <Typography variant="h5" as="h1" className="w-full ">
        {'Enter the code sent to your email and set a new password'}
      </Typography>
      <View className="flex w-full gap-2">
        <ControlledTextField
          editable={false}
          name="email"
          control={control}
          placeholder={'Email Address*'}
          autoCapitalize="none"
        />
        <ControlledTextField
          name="authCode"
          control={control}
          placeholder={'Authentication Code*'}
          keyboard={'numeric'}
        />
        <ControlledSecureField
          name="password"
          control={control}
          placeholder="Password*"
          textContentType="newPassword"
        />

        <ControlledSecureField
          name="confirmPassword"
          control={control}
          placeholder="Confirm Password*"
          textContentType="password"
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

          <Button
            className="web:max-w-fit basis-1/3"
            onPress={handleSubmit(onSubmit)}
            title="Reset"
          />
        </View>
      </View>
    </View>
  )
}
