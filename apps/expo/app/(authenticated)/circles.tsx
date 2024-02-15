'use client'

import { useState, useEffect } from 'react'
import { View, Image, TouchableOpacity, Alert, ScrollView } from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
// import PtsCard from 'app/ui/PtsCard'
import { Typography } from 'app/ui/typography'
import { CircleCard } from 'app/ui/circle-card'
import { Feather } from 'app/ui/icons'
import store from 'app/redux/store'
import { Button } from 'app/ui/button'
import PtsNameInitials from 'app/ui/PtsNameInitials'
import { CallPostService } from 'app/utils/fetchServerData'
import { BASE_URL, GET_MEMBER_DETAILS } from 'app/utils/urlConstants'
import { consoleData } from 'app/ui/utils'
import { COLORS } from 'app/utils/colors'

export default function CirclesTab() {
  const header = store.getState().headerState.header
  const user = store.getState().userProfileState.header
  const [isLoading, setLoading] = useState(false)
  const [isCreateCircle, setCreateCircle] = useState(false)
  const [isDataReceived, setDataReceived] = useState(false)
  const [memberList, setMemberList] = useState([])
  useEffect(() => {
    async function getMemberDetails() {
      setLoading(true)
      let url = `${BASE_URL}${GET_MEMBER_DETAILS}`
      let dataObject = {
        header: header
      }
      CallPostService(url, dataObject)
        .then(async (data: any) => {
          if (data.status === 'SUCCESS') {
            // consoleData('getMemberDetails', data.data.memberList)
            setMemberList(data.data.memberList ? data.data.memberList : [])
            setDataReceived(true)
          } else {
            Alert.alert('', data.message)
          }
          setLoading(false)
        })
        .catch((error) => {
          setLoading(false)
          console.log(error)
        })
    }
    getMemberDetails()
  }, [])
  return (
    <View className="flex-1 bg-white">
      <PtsLoader loading={isLoading} />
      <Image
        source={require('app/assets/header.png')}
        className="mt-[-10px]"
        resizeMode={'contain'}
        alt="logo"
      />
      <View className="absolute top-[60] w-[100%]">
        <View className="flex-row items-center">
          <Typography className="ml-[20] text-[22px] font-bold">
            {'Your Circles'}
          </Typography>
          <PtsNameInitials
            className="absolute right-[5]"
            fullName={user.memberName}
          />
        </View>
        <View className="flex-row">
          <TouchableOpacity className="border-primary ml-[20] mt-5 w-[40%] flex-row items-center justify-center rounded-[20px] border-[2px] bg-white py-2">
            <View className="bg-primary mr-2 h-[24px] w-[24px] items-center rounded-[12px]">
              <Typography className=" text-white">{'2'}</Typography>
            </View>
            <Typography>{'Appointments'}</Typography>
          </TouchableOpacity>
          <TouchableOpacity className="border-primary ml-[10] mt-5 w-[35%] flex-row items-center justify-center rounded-[20px] border-[2px] bg-white py-2">
            <View className="bg-primary mr-2 h-[24px] w-[24px] items-center rounded-[12px]">
              <Typography className=" text-white">{'2'}</Typography>
            </View>
            <Typography>{'Messages'}</Typography>
          </TouchableOpacity>
        </View>
        <View className=" ml-[30] mt-5 h-[20%] flex-row">
          <View className="w-[70%] flex-row">
            <Typography className="mr-3 font-bold">{'Sort by'}</Typography>
            <TouchableOpacity className="" onPress={() => {}}>
              <Feather name={'chevron-down'} size={25} color={'black'} />
            </TouchableOpacity>
          </View>

          <View className="flex-row">
            <TouchableOpacity
              className="h-[30px] w-[30px] items-center justify-center rounded-[15px] bg-[#c5dbfd]"
              onPress={() => {
                setCreateCircle(!isCreateCircle)
              }}
            >
              <Feather name={'plus'} size={25} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              className="mx-3 h-[30px] w-[30px] items-center justify-center rounded-[15px] bg-[#c5dbfd]"
              onPress={() => {}}
            >
              <Feather name={'menu'} size={25} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {isCreateCircle ? (
        <View className="mt-[-5] flex-row">
          <Typography className="w-[22%]" />
          <View className="mt-[5] w-[45%] rounded-[10px] bg-white py-5 shadow-lg">
            <View className="flex-row">
              <TouchableOpacity
                className="mx-3 h-[30px] w-[30px] items-center justify-center rounded-[15px] border-[2px] border-black"
                onPress={() => {}}
              >
                <Feather name={'plus'} size={25} color={'black'} />
              </TouchableOpacity>
              <Typography className="font-400 self-center text-[16px]">
                {'Create Circle'}
              </Typography>
            </View>
            <View className="mt-3 flex-row">
              <TouchableOpacity
                className="mx-3 h-[30px] w-[30px] items-center justify-center rounded-[15px] border-[2px] border-black"
                onPress={() => {}}
              >
                <Feather name={'check'} size={25} color={'black'} />
              </TouchableOpacity>
              <Typography className="font-400 self-center text-[16px]">
                {'Join Circle'}
              </Typography>
            </View>
          </View>
          <View className="h-[20px] w-[20px] rounded-[10px] bg-white shadow-lg" />
          <View className="h-[10px] w-[10px] rounded-[5px] bg-white shadow-lg" />
        </View>
      ) : (
        <View />
      )}

      <ScrollView persistentScrollbar={true} className=" m-2 flex-1">
        {memberList.map((data: any, index: number) => {
          return (
            <View key={index}>
              <CircleCard data={data}></CircleCard>
            </View>
          )
        })}
      </ScrollView>
    </View>
  )
}
