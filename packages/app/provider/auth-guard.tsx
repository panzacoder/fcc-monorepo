import { useEffect } from 'react'
import { Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { onSessionExpired } from 'app/utils/auth-events'
import { clearCredentials } from 'app/utils/secure-storage'
import { useStore } from 'app/store'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const resetStore = useStore((state) => state.resetStore)

  useEffect(() => {
    const unsubscribe = onSessionExpired(async () => {
      await clearCredentials()
      resetStore()
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
  }, [router, resetStore])

  return <>{children}</>
}
