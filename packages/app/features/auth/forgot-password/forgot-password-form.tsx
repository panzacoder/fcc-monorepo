import { Typography } from 'app/ui/typography'
import { Button } from 'app/ui/button'
import { Alert, View } from 'react-native'
import { useForm } from 'react-hook-form'
import { useRouter } from 'solito/navigation'
import { BASE_URL, FORGOT_PASSWORD } from 'app/utils/urlConstants'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { CallPostService } from 'app/utils/fetchServerData'
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

  const onSubmit = (formData: any) => {
    onLoadingChange(true)
    const url = `${BASE_URL}${FORGOT_PASSWORD}`
    const dataObject = {
      appuserVo: {
        emailOrPhone: formData.email
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        onLoadingChange(false)
        if (data.status === 'SUCCESS') {
          onEmailVerified(formData.email)
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        onLoadingChange(false)
        Alert.alert('', 'Unknown error occurred, please try again.')
        console.log(error)
      })
  }

  return (
    <View className="my-4 flex flex-wrap justify-end gap-y-4">
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
