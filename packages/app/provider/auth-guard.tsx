import { useEffect } from 'react'
import { Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { onSessionExpired } from 'app/utils/auth-events'
import { clearCredentials } from 'app/utils/secure-storage'
import store from 'app/redux/store'
import { resetStore } from 'app/redux/storeAction'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onSessionExpired(async () => {
      await clearCredentials()
      store.dispatch(resetStore())
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
  }, [router])

  return <>{children}</>
}
