'use client'
import { useState } from 'react'
import { View } from 'react-native'
import { Typography } from 'app/ui/typography'
import PtsLoader from 'app/ui/PtsLoader'
import { Button } from 'app/ui/button'
import { useRouter } from 'solito/navigation'
import { CardView } from 'app/ui/layouts/card-view'
import { CardHeader } from '../card-header'
import { EmailForm } from './email-form'
import { SetPasswordForm } from './set-password-form'

export function ForgotPasswordScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isLoading, setLoading] = useState(false)

  return (
    <CardView>
      <CardHeader
        actionSlot={
          <View className="flex flex-col justify-end">
            <Typography>{'New here?'}</Typography>
            <Button
              title="Sign up"
              variant="link"
              onPress={() => {
                router.push('/login')
              }}
              className="py-0"
            />
          </View>
        }
      />
      <PtsLoader loading={isLoading} />

      {email ? (
        <SetPasswordForm email={email} onLoadingChange={setLoading} />
      ) : (
        <EmailForm
          onLoadingChange={setLoading}
          onEmailVerified={(verifiedEmail) => setEmail(verifiedEmail)}
        />
      )}
    </CardView>
  )
}
