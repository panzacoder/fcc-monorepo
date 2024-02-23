'use client'

import { useState, useEffect } from 'react'
import {
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  Pressable
} from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { CircleCard } from 'app/ui/circle-card'
import { Feather } from 'app/ui/icons'
import store from 'app/redux/store'
import { CallPostService } from 'app/utils/fetchServerData'
import { BASE_URL, GET_MEMBER_DETAILS } from 'app/utils/urlConstants'
import { CreateCircle } from './create-circle'

export function CirclesListScreen() {
  const header = store.getState().headerState.header
  const [isLoading, setLoading] = useState(false)
  const [isCreateCircle, setCreateCircle] = useState(false)
  const [isDataReceived, setDataReceived] = useState(false)

  const [isCreateCircleClicked, setCreateCircleClicked] = useState(false)
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
    <View className="flex-1">
      <PtsLoader loading={isLoading} />
      <View className="z-50 mr-[30] mt-[30] flex-row justify-end">
        <Pressable
          className="h-[30px] w-[30px] items-center justify-center rounded-full bg-blue-100"
          onPress={() => {
            setCreateCircle(!isCreateCircle)
          }}
        >
          <Feather name={'plus'} size={25} className="color-primary" />
        </Pressable>

        {isCreateCircle ? (
          <View className="absolute right-[25px] top-[90%] flex-row">
            <View className="mt-[5] gap-5 rounded-[10px] bg-white p-5 shadow-lg">
              <Pressable
                className="flex-row gap-3"
                onPress={() => {
                  setCreateCircleClicked(!isCreateCircleClicked)
                  setCreateCircle(!isCreateCircle)
                }}
              >
                <View className="flex-row items-center justify-center rounded-[15px] border-[2px] border-black">
                  <Feather name={'plus'} size={25} />
                </View>
                <Typography className="font-400 self-center text-[16px]">
                  {'Create Circle'}
                </Typography>
              </Pressable>

              <Pressable className="flex-row gap-3">
                <View className="lex-row items-center justify-center rounded-[15px] border-[2px] border-black">
                  <Feather name={'check'} size={25} />
                </View>
                <Typography className="font-400 self-center text-[16px]">
                  {'Join Circle'}
                </Typography>
              </Pressable>
            </View>
            <View className="h-[20px] w-[20px] rounded-[10px] bg-white shadow-lg" />
            <View className="h-[10px] w-[10px] rounded-[5px] bg-white shadow-lg" />
          </View>
        ) : (
          <View />
        )}
      </View>
      {isCreateCircleClicked && (
        <CreateCircle onCancel={() => setCreateCircleClicked(false)} />
      )}

      <ScrollView className="z-10">
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
