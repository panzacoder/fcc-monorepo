'use client'

import { AccentButton } from 'app/ui/accent-button'
import { View, Text } from 'react-native'
import { Typography } from 'app/ui/typography'
import { useRouter } from 'solito/navigation'
import { formatUrl } from 'app/utils/format-url'

export function SplashScreen() {
  const router = useRouter()
  return (
    <View className="native:pt-60 web:pt-40 flex h-full w-full flex-1 px-4 md:justify-center md:pt-0">
      <Typography
        variant="h3"
        as="h1"
        className="text-center font-bold text-white"
      >
        Caregiving can be <Text className="italic">heavy</Text>.
        {"\n\nLet's lighten the load."}
      </Typography>

      <View className="absolute bottom-20 right-4 flex flex-col items-end gap-4 ">
        <AccentButton title="Log in" onPress={() => router.push('/login')} />
        <AccentButton title="Sign up" onPress={() => router.push('/sign-up')} />
        <AccentButton
          title="Verify"
          onPress={() =>
            router.push(
              formatUrl('/verification', { email: 'jake@plfx.studio' })
            )
          }
        />
      </View>
    </View>
  )
}
