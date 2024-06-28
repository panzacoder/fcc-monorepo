'use client'

import { useState, useEffect, useCallback } from 'react'
import { View, Alert, TouchableOpacity } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import store from 'app/redux/store'
import { Button } from 'app/ui/button'
import { convertTimeToUserLocalTime } from 'app/ui/utils'
import { CallPostService } from 'app/utils/fetchServerData'
import {
  BASE_URL,
  GET_WEEK_DETAILS,
  GET_TRANSPORTATION_REQUESTS,
  REJECT_TRANSPORT,
  APPROVE_TRANSPORT,
  EVENT_ACCEPT_TRANSPORTATION_REQUEST,
  EVENT_REJECT_TRANSPORTATION_REQUEST
} from 'app/utils/urlConstants'
import { CardView } from 'app/ui/cardViews'
import { Feather } from 'app/ui/icons'
import { TabsHeader } from 'app/ui/tabs-header'
export function HomeScreen() {
  const header = store.getState().headerState.header
  const user = store.getState().userProfileState.header
  const [isLoading, setLoading] = useState(false)
  const [transportMemberName, setTransportMemberName] = useState('')
  const [isShowTransportationRequests, setIsShowTransportationRequests] =
    useState(false)
  const [upcomingSentence, setUpcomingSentence] = useState('')
  const [isDataReceived, setDataReceived] = useState(false)
  const [memberList, setMemberList] = useState([])
  const [transportationList, setTransportationList] = useState([])
  const getMemberDetails = useCallback(async () => {
    setLoading(true)
    let url = `${BASE_URL}${GET_WEEK_DETAILS}`
    let dataObject = {
      header: header
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          let memberList = data.data.memberList ? data.data.memberList : []
          setMemberList(memberList)
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
  async function trasportationClicked(memberData: any) {
    // console.log('trasportationClicked', JSON.stringify(memberData))
    let fullName = ''
    if (memberData.firstname) {
      fullName += memberData.firstname.trim() + ' '
    }
    if (memberData.lastname) {
      fullName += memberData.lastname.trim()
    }
    setTransportMemberName(fullName)
    setLoading(true)
    let url = `${BASE_URL}${GET_TRANSPORTATION_REQUESTS}`
    let dataObject = {
      header: header,
      member: {
        id: memberData.member ? memberData.member : ''
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          setTransportationList(data.data ? data.data : [])
          setIsShowTransportationRequests(true)
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
  async function approveRejectTrasportRequest(
    transportData: any,
    isApprove: any
  ) {
    setLoading(true)
    let url = ''
    if (transportData.type === 'Event') {
      url = isApprove
        ? `${BASE_URL}${EVENT_ACCEPT_TRANSPORTATION_REQUEST}`
        : `${BASE_URL}${EVENT_REJECT_TRANSPORTATION_REQUEST}`
    } else {
      url = isApprove
        ? `${BASE_URL}${APPROVE_TRANSPORT}`
        : `${BASE_URL}${REJECT_TRANSPORT}`
    }
    let dataObject = {
      header: header,
      transportationVo: {
        id: transportData.id ? transportData.id : '',
        reason: '',
        isApprove: isApprove
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          setIsShowTransportationRequests(false)
          getMemberDetails()
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
  const showRequestModal = () => {
    return (
      <View className="my-2 max-h-[90%] w-full self-center rounded-[15px] border-[1px] border-[#e0deda] bg-white ">
        <View className="bg-primary h-[50] w-full flex-row rounded-tl-[15px] rounded-tr-[15px]">
          <Typography className=" w-[85%] self-center text-center font-bold text-white">{`Transportation Requests`}</Typography>
          <View className="mr-[30] flex-row justify-end self-center">
            <TouchableOpacity
              className="h-[30px] w-[30px] items-center justify-center rounded-full bg-white"
              onPress={() => {
                setIsShowTransportationRequests(false)
              }}
            >
              <Feather name={'x'} size={25} className="color-primary" />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView className="">
          {transportationList.map((data: any, index: number) => {
            return (
              <View className="p-2" key={index}>
                <Typography className="font-400 ml-2">
                  {data.type ? data.type + ':' : ''}
                </Typography>
                <Typography className="ml-2 w-full">
                  <Typography className="font-bold">
                    {data.createdbyname ? data.createdbyname : ''}
                  </Typography>
                  <Typography>{' has requested you to accompany '}</Typography>
                  <Typography className="font-bold">
                    {transportMemberName}
                  </Typography>
                  <Typography>{' while visiting '}</Typography>
                  <Typography className="text-primary font-bold">
                    {`${data.name ? data.name : ''}${data.location ? ' - ' + data.location : ''}`}
                  </Typography>
                  <Typography>{' on '}</Typography>
                  <Typography className="text-primary font-bold">
                    {`${data.date ? convertTimeToUserLocalTime(data.date) : ''}`}
                  </Typography>
                </Typography>
                <View className="my-2 flex-row justify-center">
                  <Button
                    className="bg-[#5ACC6C]"
                    title={'Accept'}
                    variant="default"
                    onPress={() => {
                      // approveRejectTrasportRequest(data, true)
                    }}
                  />
                  <Button
                    className="ml-5 bg-[#c43416]"
                    title={'Reject'}
                    variant="default"
                    onPress={() => {
                      // approveRejectTrasportRequest(data, false)
                    }}
                  />
                </View>
              </View>
            )
          })}
        </ScrollView>
      </View>
    )
  }
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
                    <CardView
                      data={JSON.stringify(data)}
                      trasportationClicked={trasportationClicked}
                    ></CardView>
                  </View>
                )
              })}
            </ScrollView>
          </View>
        ) : (
          <View />
        )}
      </View>
      {isShowTransportationRequests ? (
        <View className="absolute top-[100] w-[95%] self-center">
          {showRequestModal()}
        </View>
      ) : (
        <View />
      )}
    </View>
  )
}
