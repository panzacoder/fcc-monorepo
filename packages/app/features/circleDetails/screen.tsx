'use client'

import { useState } from 'react'
import { View, Alert, TouchableOpacity } from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { Button } from 'app/ui/button'
import { useRouter } from 'solito/navigation'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import PtsNameInitials from 'app/ui/PtsNameInitials'
import { Feather } from 'app/ui/icons'
import { CallPostService } from 'app/utils/fetchServerData'
import store from 'app/redux/store'
import { BASE_URL } from 'app/utils/urlConstants'
import { useParams } from 'solito/navigation'
import { COLORS } from 'app/utils/colors'
import { LinearGradient } from 'expo-linear-gradient'

export function CircleDetailsScreen() {
  let month = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
  const router = useRouter()
  const header = store.getState().headerState.header
  // console.log('header', header)
  const item = useParams<any>()
  // console.log('email', item ? item.memberData : '')
  const [isLoading, setLoading] = useState(false)
  const [isSeeMore, setSeeMore] = useState(false)

  function buttonPressed() {}
  let d = new Date()
  let datestring =
    month[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear() + ' '
  // console.log('datestring', datestring)
  return (
    <View className="flex-1 items-center bg-white">
      <PtsBackHeader title={item.fullName} />
      <PtsLoader loading={isLoading} />
      <LinearGradient
        colors={['#103264', '#113263', '#319D9D']}
        end={{ x: 0.3, y: 0 }}
        start={{ x: 0.65, y: 0.4 }}
        style={{
          borderColor: '#3DC4C4',
          borderWidth: 1,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20
        }}
        className="mt-5 w-[95%] self-center py-5"
      >
        <View className="flex-row">
          <PtsNameInitials fullName={item.fullName} />
          <Typography className="mt-7 text-center text-[18px] font-bold text-white">
            {item.fullName}
          </Typography>
          <TouchableOpacity
            className="absolute right-[15] self-center"
            onPress={() => {}}
          >
            <Feather name={'menu'} size={20} color={'#5ACC6C'} />
          </TouchableOpacity>
        </View>
        <View className=" flex w-[95%] self-center rounded-[16px] bg-white py-5 ">
          <View className="flex-row">
            <View>
              <Typography className="ml-5 text-[16px] font-bold">
                {'Today'}
              </Typography>
              <Typography className="ml-5 text-[12px]">{datestring}</Typography>
            </View>
            <Feather
              className="absolute right-[10] self-center"
              name={'calendar'}
              size={20}
              color={'black'}
            />
          </View>
        </View>
        <View className="flex-row">
          <TouchableOpacity
            className=" ml-5 mt-5"
            onPress={() => {
              setSeeMore(!isSeeMore)
            }}
          >
            <Feather
              name={!isSeeMore ? 'chevron-up' : 'chevron-down'}
              size={25}
              color={'#5ACC6C'}
            />
          </TouchableOpacity>
          <Typography className="ml-4 mt-5 w-[20%] text-white">
            {isSeeMore ? 'See less' : 'See more'}
          </Typography>
          <View className="ml-4 mt-8 h-[1] w-[55%] bg-[#5ACC6C]" />
        </View>
        {isSeeMore ? (
          <View>
            <View className="mt-5 flex-row self-center">
              <Button
                className="px-3"
                title="Members"
                leadingIcon="arrow-right"
                onPress={buttonPressed}
              />
              <Button
                className="ml-2 px-3"
                title="Doctors"
                leadingIcon="arrow-right"
                onPress={buttonPressed}
              />
              <Button
                className="ml-2 px-3"
                title="Facilities"
                leadingIcon="home"
                onPress={buttonPressed}
              />
            </View>

            <View className="mt-5 flex-row self-center">
              <Button
                className="px-3"
                title="Prescriptions"
                leadingIcon="arrow-right"
                onPress={buttonPressed}
              />
              <Button
                className="ml-2 px-3"
                title="Medical Devices"
                leadingIcon="watch"
                onPress={buttonPressed}
              />
            </View>
          </View>
        ) : (
          <View />
        )}
      </LinearGradient>

      <View className="mt-3 h-[15%] w-[95%] flex-row rounded-[16px] border border-[#287CFA]">
        <View className="h-[100%] w-[10%] rounded-bl-[15px] rounded-tl-[15px] bg-[#287CFA] " />
        <View>
          <Typography className=" ml-5 mt-5 flex rounded text-base font-bold text-black">
            {'Messages'}
          </Typography>
        </View>
      </View>
      <View className="mt-3 h-[15%] w-[95%] flex-row rounded-[16px] border border-[#287CFA]">
        <View className="h-[100%] w-[10%] rounded-bl-[15px] rounded-tl-[15px] bg-[#287CFA] " />
        <View>
          <Typography className="ml-5 mt-5 flex rounded text-base font-bold text-black">
            {'Appointments'}
          </Typography>
        </View>
      </View>
    </View>
  )
}
