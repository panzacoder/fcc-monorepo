import { Typography } from 'app/ui/typography'
import { Button } from 'app/ui/button'
import { Alert, View } from 'react-native'
import { useRouter } from 'solito/navigation'
import { BASE_URL, RESET_PASSWORD } from 'app/utils/urlConstants'
import { CallPostService } from 'app/utils/fetchServerData'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { ControlledSecureField } from 'app/ui/form-fields/controlled-secure-field'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

export type ResetPasswordFormProps = {
  email: string
  onLoadingChange: (loading: boolean) => void
}

export function SetPasswordForm({
  email,
  onLoadingChange
}: ResetPasswordFormProps) {
  const schema = z.object({
    email: z.string().min(1, { message: 'Email is required' }).email(),
    authCode: z
      .string()
      .min(1, { message: 'Please enter code sent to your email provided' }),
    password: z.string().min(1, { message: 'Enter new password' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Confirm new password' })
      .refine((val) => val === schema.password, {
        message: 'Passwords must match'
      })
  })

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

  const onSubmit = (formData: any) => {
    onLoadingChange(true)
    const loginURL = `${BASE_URL}${RESET_PASSWORD}`
    const dataObject = {
      appuserVo: {
        emailOrPhone: formData.email,
        tempPassword: formData.authCode,
        credential: formData.password
      }
    }
    CallPostService(loginURL, dataObject)
      .then(async (data: any) => {
        onLoadingChange(false)
        if (data.status === 'SUCCESS') {
          router.push('/login')
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        onLoadingChange(true)
        Alert.alert('', 'Unknown error occurred, please try again.')
        console.log(error)
      })
  }

  return (
    <View className="my-4 flex flex-wrap justify-end gap-y-4">
      <Typography variant="h5" as="h1" className="text-accent">
        {'Enter the code sent to your email and set a new password'}
      </Typography>
      <View className="flex w-full gap-2">
        <ControlledTextField
          editable={false}
          name="email"
          control={control}
          placeholder={'Email Address*'}
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
        />

        <ControlledSecureField
          name="confirmPassword"
          control={control}
          placeholder="Confirm Password*"
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
