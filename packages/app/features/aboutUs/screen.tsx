'use client'
import { View, ScrollView, Linking } from 'react-native'
import { Image } from 'app/ui/image'
import { Typography } from 'app/ui/typography'
import { useRouter } from 'expo-router'
import { Feather } from 'app/ui/icons'
export function AboutUsScreen() {
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
            router.replace('/home')
          }}
        />
        <Typography className=" flex-1 text-center text-lg font-bold">
          {'About Us'}
        </Typography>
      </View>
      <ScrollView>
        <View className="my-2 w-[95%] self-center rounded-[5px] border-[0.5px] border-gray-400">
          <Typography className="text-primary mt-5 text-center text-[18px] font-bold underline">
            {'Family Care Circle'}
          </Typography>
          <Image
            className="self-center"
            src={require('app/assets/logoNew.png')}
            width={100}
            height={100}
            contentFit={'contain'}
            alt="logo"
          />
          <Typography
            onPress={() => {
              Linking.openURL(`http://www.familycarecircle.com`)
            }}
            className="text-center text-[#1d61c4] underline"
          >
            {'www.familycarecircle.com'}
          </Typography>
          <Typography className="mt-5 self-center text-[18px]">
            {'Caregiving Made Simple.'}
          </Typography>
          <Typography className="mb-2 mt-2 w-[90%] self-center text-center text-[18px]">
            {
              'Everything you need to stay organized and focused on giving the best care of your loved one.'
            }
          </Typography>
        </View>
        <View className="my-2 w-[95%] self-center rounded-[5px] border-[0.5px] border-gray-400">
          <Typography className="mt-5 text-center text-[16px] font-bold text-[#5ACC6C]">
            {'Powered By'}
          </Typography>
          <Typography className=" mt-2 text-center text-[16px] font-bold text-[#ef6603]">
            {'Proto Technology Solutions Pvt Ltd'}
          </Typography>
          <Image
            className="self-center"
            src={require('app/assets/protoNew.png')}
            width={100}
            height={100}
            contentFit={'contain'}
            alt="logo"
          />
          <Typography
            onPress={() => {
              Linking.openURL(`http://www.prototsolutions.com`)
            }}
            className="mb-2 mt-2 text-center text-[#1d61c4] underline"
          >
            {'www.prototsolutions.com'}
          </Typography>
        </View>
      </ScrollView>
    </View>
  )
}
