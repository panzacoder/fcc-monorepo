import { AccentLink } from 'app/ui/accent-button'
import { View, Text } from 'react-native'
import { Typography } from 'app/ui/typography'

export function SplashScreen() {
  return (
    <View className="mx-4 flex h-full flex-col justify-between gap-40 pb-40 pt-80">
      <Typography variant="h2" className="text-center font-bold text-white">
        Caregiving can be <Text className="italic">heavy</Text>.
        {"\n\nLet's lighten the load."}
      </Typography>

      <View className="flex flex-col items-end gap-6">
        <AccentLink title="Log in" href="/login" />
        <AccentLink title="Sign up" href="/" />
      </View>
    </View>
  )
}
