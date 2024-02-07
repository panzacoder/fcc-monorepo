'use client'

import { useState } from 'react'
import { View, Image, TouchableOpacity } from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { useLocalSearchParams, router } from 'expo-router'
import store from 'app/redux/store'

export function HomeScreen() {
  const header = store.getState().headerState.header
  const user = store.getState().userProfileState.header
  console.log('header', header)
  console.log('user', user)
  // const item = useLocalSearchParams()
  const [isLoading, setLoading] = useState(false)

  return (
    <View className="flex-1 bg-white">
      <PtsLoader loading={isLoading} />
      <Image
        source={require('app/assets/header.png')}
        className="absolute top-[0]"
        resizeMode={'contain'}
        alt="logo"
      />
      <View>
        <Typography className="font-400 absolute top-[80] ml-[30] text-[16px]">
          {'Welcome Back,'}
        </Typography>
        <Typography className="absolute top-[110] ml-[30] text-[22px] font-bold text-black">
          {user.memberName ? user.memberName : ''}
        </Typography>
        <View className="border-primary absolute top-[200] mx-[10] h-[370px] w-[90%] self-center rounded-[15px] border-[2px]">
          <View className="ml-[20] flex-row items-center">
            <View>
              <Typography className="mt-[10] text-[20px] font-bold text-black">
                {'Your Week'}
              </Typography>
              <Typography className="font-400 text-[16px]">
                {'6 Appointments, 2 Events'}
              </Typography>
            </View>
            <TouchableOpacity
              className="absolute right-[20]"
              onPress={() => {}}
            >
              <Feather name={'settings'} size={20} color={'black'} />
            </TouchableOpacity>
          </View>

          <View className="ml-[20]">
            <Image
              source={require('app/assets/avatar.png')}
              className="mt-[10]"
              resizeMode={'cover'}
              alt="logo"
            />
          </View>
        </View>
      </View>
    </View>
  )
}
