import { View, Image, Text, Dimensions, TouchableOpacity } from 'react-native'
import { useEffect, useState } from 'react'
import { MotiLink } from 'solito/moti'
// import { useRouter } from 'solito/navigation'

import { router } from 'expo-router'
import { Typography, A, TextLink } from 'app/ui/typography'
import Button from 'app/ui/button'
import { Row } from 'app/ui/layout'

export function SplashScreen() {
  // const router = useRouter()
  const height = Dimensions.get('window').height
  return (
    <View className="flex-1 bg-[#6493d9]">
      <View className="">
        <Text className="absolute top-[220] z-[1] self-center text-center text-[38px] font-bold text-white">
          {"Caregiving isn't \neasy.\n\n Let's lighten the load a bit."}
        </Text>
      </View>

      <Image
        source={require('../../../../assets/logo.png')}
        className="absolute top-[40] z-[-1] h-[178] w-[223] self-center"
        resizeMode={'contain'}
        alt="logo"
      />
      <Image
        source={require('../../../../assets/shapes.png')}
        className=" mr-[-20] mt-[140] self-center"
        resizeMode={'contain'}
        alt="shapes"
      />

      <View>
        <TouchableOpacity
          className="flex-row"
          onPress={() => {
            // console.log('in login ')
            router.push('/login')
          }}
        >
          <Text className="absolute bottom-[65] right-[65] self-center text-center text-[28px] font-bold text-white">
            {'Login'}
          </Text>
          <Image
            source={require('../../../../assets/arrow_right.png')}
            className="absolute bottom-[60] right-[10] "
            resizeMode={'contain'}
            alt="arrow_right"
          />
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row"
          onPress={() => {
            // console.log('in sign up ')
            router.push('/signUp')
          }}
        >
          <Text className="absolute bottom-[5] right-[65] self-center text-center text-[28px] font-bold text-white ">
            {'Sign Up'}
          </Text>
          <Image
            source={require('../../../../assets/arrow_right.png')}
            className="absolute bottom-[0] right-[10] "
            resizeMode={'contain'}
            alt="arrow_right"
          />
        </TouchableOpacity>
      </View>

      {/* <Image
                source={require('../../../../assets/splash.png')}
                className=" self-center mt-[140]"
                resizeMode={'cover'}

            /> */}
    </View>
  )
}
