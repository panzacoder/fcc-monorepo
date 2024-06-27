'use client'

import { useState, useEffect, useCallback } from 'react'
import { View, Alert } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import store from 'app/redux/store' 
import { CallPostService } from 'app/utils/fetchServerData' 
import { BASE_URL, GET_WEEK_DETAILS } from 'app/utils/urlConstants'
import { CardView } from 'app/ui/cardview'
import { TabsHeader } from 'app/ui/tabs-header'
export function HomeScreen() {
  const header = store.getState().headerState.header
  const user = store.getState().userProfileState.header
  const [isLoading, setLoading] = useState(false)
  const [upcomingSentence, setUpcomingSentence] = useState('')
  const [isDataReceived, setDataReceived] = useState(false)
  const [memberList, setMemberList] = useState([])
  const getMemberDetails = useCallback(async () => {
    setLoading(true)
    let url = `${BASE_URL}${GET_WEEK_DETAILS}`
    let dataObject = {
      header: header
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          setMemberList(data.data.memberList ? data.data.memberList : [])
          let sentence = ''
          sentence +=
            data.data.upcomingAppointmentCount &&
            data.data.upcomingAppointmentCount > 0
              ? data.data.upcomingAppointmentCount + ' Appointments, '
              : ''
          sentence +=
            data.data.upcomingEventCount && data.data.upcomingEventCount > 0
              ? data.data.upcomingEventCount + ' Events'
              : ''
          setUpcomingSentence(sentence)
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
  }, [])
  useEffect(() => {
    getMemberDetails()
  }, [])

  return (
    <View className="flex-1">
      <PtsLoader loading={isLoading} />
      <View className="">
        <TabsHeader />
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
            className={`border-primary bg-card mx-[10px] mt-[30] h-[85%] w-full self-center rounded-[15px] border-[2px]`}
          >
            <View className="ml-[20] flex-row items-center">
              <View>
                <Typography className="mt-[10] text-[20px] font-bold text-black">
                  {'Your Week'}
                </Typography>
                <Typography className="font-400 text-[16px]">
                  {upcomingSentence}
                </Typography>
              </View>
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
