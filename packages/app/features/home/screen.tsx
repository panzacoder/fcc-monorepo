'use client'

import { useState, useEffect } from 'react'
import { View, Image, TouchableOpacity, Alert, ScrollView } from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import store from 'app/redux/store'
import { CallPostService } from 'app/utils/fetchServerData'
import { BASE_URL, GET_MEMBER_DETAILS } from 'app/utils/urlConstants'
import { consoleData } from 'app/ui/utils'
import { COLORS } from 'app/utils/colors'
import { CardView } from 'app/ui/cardview'

export function HomeScreen() {
  const header = store.getState().headerState.header
  const user = store.getState().userProfileState.header
  // const isDrawerOpen = useDrawerStatus() === 'open'
  // console.log('isDrawerOpen', isDrawerOpen)
  // console.log('user', user)
  const [isLoading, setLoading] = useState(false)
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
            consoleData('getMemberDetails', data.data.memberList)
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
      <View className="">
        <View className="flex-row">
          <View>
            <Typography className="font-400 ml-[30] text-[16px]">
              {'Welcome Back,'}
            </Typography>
            <Typography className=" ml-[30] text-[22px] font-bold text-black">
              {user.memberName ? user.memberName : ''}
            </Typography>
          </View>
        </View>
        {isDataReceived ? (
          <View
            className={`border-primary bg-card mx-[10px] mt-[50] h-[80%] w-[94%] self-center rounded-[15px] border-[2px]`}
          >
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
                onPress={() => { }}
              >
                <Feather name={'settings'} size={20} color={'black'} />
              </TouchableOpacity>
            </View>
            <ScrollView persistentScrollbar={true} className="m-2 flex-1">
              {memberList.map((data: any, index: number) => {
                return (
                  <View key={index}>
                    <CardView data={data}></CardView>
                  </View>
                )
              })}
            </ScrollView>
          </View>
        ) : (
          <View />
        )}
      </View>
    </View>
  )
}
