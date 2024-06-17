'use client'

import { useState } from 'react'
import { View, Alert, ScrollView } from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { Image } from 'app/ui/image'
import store from 'app/redux/store'
import { Button } from 'app/ui/button'
import { CallPostService } from 'app/utils/fetchServerData'
import { BASE_URL, REFER_FRIEND } from 'app/utils/urlConstants'
import { Feather } from 'app/ui/icons'
import { useRouter } from 'expo-router'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
const schema = z.object({
  email: z.string().min(1, { message: 'Email is required' })
})
export type Schema = z.infer<typeof schema>
export function ReferFriendScreen() {
  const [isLoading, setLoading] = useState(false)
  const header = store.getState().headerState.header
  const router = useRouter()
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: ''
    },
    resolver: zodResolver(schema)
  })
  async function inviteFriend(formData: Schema) {
    setLoading(true)
    let url = `${BASE_URL}${REFER_FRIEND}`
    let dataObject = {
      header: header,
      email: formData.email
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          Alert.alert('', 'Thank You For Helping Us GROW')
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }
  return (
    <ScrollView className="flex-1">
      <PtsLoader loading={isLoading} />
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
        <Typography className=" flex-1 text-center text-lg font-bold">
          {'Refer A Friend'}
        </Typography>
      </View>
      <View className="mt-5 w-[95%] self-center rounded-[5px] border-[1px] border-gray-400">
        <Image
          className="self-center"
          src={require('app/assets/referFriend.png')}
          width={150}
          height={150}
          contentFit={'contain'}
          alt="logo"
        />
        <Typography className="text-primary text-center text-[18px] font-bold">
          {'Spread the word, Share the care.'}
        </Typography>
        <Typography className="m-3 w-[95%] text-[16px]">
          {`Invite your friends and relatives to the Family of caregivers who takes care of family members. While you enjoy and take benefits of this easy and helpful website, Why keep just for yourself, PASS US ON. Share FCC with the people in your life.\n\nWe have made it easy, just type email address or share through Facebook, Twitter, LinkedIn, Whatsapp.`}
        </Typography>
      </View>
      <ControlledTextField
        control={control}
        name="email"
        placeholder={'Email*'}
        className="my-5 w-[95%] self-center"
        autoCapitalize="none"
      />
      <Button
        className="w-[40%] self-center bg-[#ef6603]"
        title={'Invite'}
        variant="default"
        onPress={handleSubmit(inviteFriend)}
      />
    </ScrollView>
  )
}
