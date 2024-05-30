'use client'

import { View } from 'react-native'
import { useRouter } from 'solito/navigation'
import { Feather } from 'app/ui/icons'
import { Typography } from 'app/ui/typography'
export function HelpScreen() {
  const router = useRouter()
  return (
    <View className="flex-1">
      <View className="ml-5 mt-[40px] flex-row">
        <Feather
          className="mt-1"
          name={'arrow-left'}
          size={20}
          color={'black'}
          onPress={() => {
            router.back()
          }}
        />
        <Typography className="ml-[5px] flex-1 text-[18px] font-bold">
          {'Help'}
        </Typography>
      </View>
    </View>
  )
}
