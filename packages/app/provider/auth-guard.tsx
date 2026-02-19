import { useEffect } from 'react'
import { Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { onSessionExpired } from 'app/utils/auth-events'
import { clearCredentials } from 'app/utils/secure-storage'
import { useAppDispatch } from 'app/redux/hooks'
import { resetStore } from 'app/redux/storeAction'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const unsubscribe = onSessionExpired(async () => {
      await clearCredentials()
      dispatch(resetStore())
      Alert.alert('Session Expired', 'Please log in again.', [
        {
          text: 'Ok',
          onPress: () => {
            router.dismissAll()
            router.replace('/login')
          }
        }
      ])
    })

    return unsubscribe
  }, [router, dispatch])

  return <>{children}</>
}
