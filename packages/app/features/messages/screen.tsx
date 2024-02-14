'use client'

import { useState } from 'react'
import { View } from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'

export function MessagesScreen() {
  const [isLoading, setLoading] = useState(false)
  return (
    <View className="flex-1  bg-white">
      <PtsLoader loading={isLoading} />
      <Typography className="mt-[150px] flex-1 items-center justify-center self-center text-[20px] font-bold">
        {'Messages'}
      </Typography>
    </View>
  )
}
