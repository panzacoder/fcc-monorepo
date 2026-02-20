'use client'

import { useState, useEffect } from 'react'
import { View, TouchableOpacity, BackHandler } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import PtsLoader from 'app/ui/PtsLoader'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import { Typography } from 'app/ui/typography'
import { useRouter } from 'expo-router'
import { Feather } from 'app/ui/icons'
import { useAppSelector, useAppDispatch } from 'app/redux/hooks'
import { useLocalSearchParams } from 'expo-router'
import { formatUrl } from 'app/utils/format-url'
import { logger } from 'app/utils/logger'
import { CircleSummaryCard } from './circle-summary-card'
import { useMemberDetails, useMemberMenus } from 'app/data/circle'
import currentMemberAddressAction from 'app/redux/curenMemberAddress/currentMemberAddressAction'

export function CircleDetailsScreen() {
  const header = useAppSelector((state) => state.headerState.header)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const userDetails = useAppSelector((state) => state.userProfileState.header)
  const [isMessages, setIsMessages] = useState(false)
  const [isAppointments, setIsAppointments] = useState(false)
  const [isIncidents, setIsIncidents] = useState(false)
  const [isEvents, setIsEvents] = useState(false)
  const item = useLocalSearchParams<any>()
  const [menuList, setMenuList] = useState(null)
  const [memberData, setMemberData] = useState(
    item.memberData ? JSON.parse(item.memberData) : {}
  )

  if (item.component) {
    memberData.component = item.component
  } else {
    memberData.component = ''
  }
  logger.debug('memberData', JSON.stringify(memberData))
  let unreadMessages = 0
  memberData.unreadMessages.map((data: any) => {
    unreadMessages += data.unreadMessageCount
  })
  let todayAppt = ''
  if (memberData.upcomingAppointment) {
    todayAppt =
      memberData.upcomingAppointment.purpose +
      ' with ' +
      memberData.upcomingAppointment.location
  }

  const memberId = memberData.member ? memberData.member : ''

  const { data: memberDetailsData, isLoading: isDetailsLoading } =
    useMemberDetails(header, memberId)

  const { data: memberMenusData, isLoading: isMenusLoading } = useMemberMenus(
    header,
    memberId
  )

  useEffect(() => {
    if (memberDetailsData) {
      const data = memberDetailsData as any
      if (data.memberList) {
        data.memberList.map((entry: any) => {
          if (memberData.member === entry.member) {
            setMemberData(entry)
            logger.debug('memberData', JSON.stringify(memberData))
          }
        })
      }
    }
  }, [memberDetailsData])

  useEffect(() => {
    if (memberMenusData) {
      const data = memberMenusData as any
      if (data.member && data.member.address) {
        dispatch(
          currentMemberAddressAction.setMemberAddress(data.member.address)
        )
        let list = data.member.menuList ? data.member.menuList : []
        list.map((entry: any) => {
          if (entry.menuid === 'MyAppointments') {
            setIsAppointments(true)
          } else if (entry.menuid === 'MyCommunications') {
            setIsMessages(true)
          } else if (entry.menuid === 'MyEvents') {
            setIsEvents(true)
          } else if (entry.menuid === 'MyIncidents') {
            logger.debug('MyIncidents')
            setIsIncidents(true)
          }
        })
        logger.debug('menuList', JSON.stringify(list))
        setMenuList(list)
      }
    }
  }, [memberMenusData])

  const isLoading = isDetailsLoading || isMenusLoading
  const isDataReceived = !isLoading && !!memberDetailsData

  function handleBackButtonClick() {
    router.dismissAll()
    router.push('/home')
    return true
  }
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick)
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick
      )
    }
  }, [])
  return (
    <View className=" flex-1">
      <PtsLoader loading={isLoading} />
      <PtsBackHeader title="Circle Details" memberData={memberData} />
      {menuList && isDataReceived ? (
        <View className="mt-5">
          <CircleSummaryCard
            menuList={menuList}
            memberData={memberData}
            userDetails={userDetails}
          />
        </View>
      ) : (
        <View />
      )}
      {isDataReceived ? (
        <ScrollView className=" flex-1">
          {isMessages ? (
            <TouchableOpacity
              onPress={() => {
                router.push(
                  formatUrl('/circles/messages', {
                    memberData: JSON.stringify(memberData)
                  })
                )
              }}
              className="mt-3 w-[95%] flex-1 flex-row rounded-[16px] border border-[#287CFA]"
            >
              <View className="h-[100%] w-[10%] rounded-bl-[15px] rounded-tl-[15px] bg-[#287CFA] " />
              <View className="py-5">
                <View className="w-full flex-row">
                  <Typography className=" ml-2 flex w-[75%] rounded text-[18px] font-bold text-black">
                    {'Messages'}
                  </Typography>
                  {unreadMessages > 0 ? (
                    <View className="bg-primary ml-2 h-[24px] w-[24px] rounded-[12px]">
                      <Typography className="self-center text-center font-bold text-white">
                        {unreadMessages}
                      </Typography>
                    </View>
                  ) : (
                    <View />
                  )}
                </View>
              </View>
              <View
                style={{ position: 'absolute', right: 5 }}
                className=" self-center"
              >
                <Feather name={'chevron-right'} size={20} color={'black'} />
              </View>
            </TouchableOpacity>
          ) : (
            <View />
          )}
          {isAppointments ? (
            <TouchableOpacity
              onPress={() => {
                router.push(
                  formatUrl('/circles/appointmentsList', {
                    memberData: JSON.stringify(memberData)
                  })
                )
              }}
              className="mt-3 w-[95%] flex-1 flex-row rounded-[16px] border border-[#287CFA]"
            >
              <View className="h-[100%] w-[10%] rounded-bl-[15px] rounded-tl-[15px] bg-[#287CFA] " />
              <View className="py-5">
                <Typography className=" ml-2 flex rounded text-[18px] font-bold text-black">
                  {'Appointments'}
                </Typography>
                <View className="flex-row">
                  <Typography className=" ml-2 flex w-[75%] min-w-[75%] rounded text-[14px] text-black">
                    {memberData.upcomingAppointment
                      ? todayAppt
                      : 'No upcoming appointments'}
                  </Typography>
                  {memberData.upcomingAppointment?.upcomingCount > 0 ? (
                    <View className="bg-primary ml-2 h-[24px] w-[24px] rounded-[12px]">
                      <Typography className="self-center text-center font-bold text-white">
                        {memberData.upcomingAppointment.upcomingCount}
                      </Typography>
                    </View>
                  ) : (
                    <View className="w-[10%]" />
                  )}
                  <View />
                </View>
              </View>
              <View
                style={{ position: 'absolute', right: 5 }}
                className=" self-center"
              >
                <Feather name={'chevron-right'} size={20} color={'black'} />
              </View>
            </TouchableOpacity>
          ) : (
            <View />
          )}
          {isIncidents ? (
            <TouchableOpacity
              onPress={() => {
                router.push(
                  formatUrl('/circles/incidentsList', {
                    memberData: JSON.stringify(memberData)
                  })
                )
              }}
              className="mt-3 w-[95%] flex-1 flex-row rounded-[16px] border border-[#287CFA]"
            >
              <View className="h-[100%] w-[10%] rounded-bl-[15px] rounded-tl-[15px] bg-[#287CFA] " />
              <View className="py-5">
                <Typography className=" ml-2 flex rounded text-[18px] font-bold text-black">
                  {'Incidents'}
                </Typography>
                {memberData.recentIncident ? (
                  <View className="flex-row">
                    <Typography className="ml-2 flex w-[85%] self-center rounded text-[14px] text-black">
                      {memberData.recentIncident.title
                        ? memberData.recentIncident.title
                        : ''}
                    </Typography>

                    <View />
                  </View>
                ) : (
                  <View className="flex-row">
                    <Typography className="ml-2 flex w-[80%] rounded text-[14px] text-black">
                      {'No recent incidents'}
                    </Typography>
                  </View>
                )}
              </View>
              <View
                style={{ position: 'absolute', right: 5 }}
                className=" self-center"
              >
                <Feather name={'chevron-right'} size={20} color={'black'} />
              </View>
            </TouchableOpacity>
          ) : (
            <View />
          )}
          {isEvents ? (
            <TouchableOpacity
              onPress={() => {
                router.push(
                  formatUrl('/circles/eventsList', {
                    memberData: JSON.stringify(memberData)
                  })
                )
              }}
              className="mt-3 w-[95%] flex-1 flex-row rounded-[16px] border border-[#287CFA]"
            >
              <View className="h-[100%] w-[10%] rounded-bl-[15px] rounded-tl-[15px] bg-[#287CFA] " />
              <View className="py-5">
                <Typography className=" ml-2 flex rounded text-[18px] font-bold text-black">
                  {'Events'}
                </Typography>
                {memberData.upcomingEvent ? (
                  <View className="flex-row">
                    <Typography className="ml-2 flex w-[75%] self-center rounded text-[14px] text-black">
                      {memberData.upcomingEvent.title
                        ? memberData.upcomingEvent.title
                        : ''}
                    </Typography>
                    {memberData.upcomingEvent.upcomingCount > 0 ? (
                      <View className="bg-primary ml-2 h-[24px] w-[24px] rounded-[12px]">
                        <Typography className="self-center text-center font-bold text-white">
                          {memberData.upcomingEvent.upcomingCount}
                        </Typography>
                      </View>
                    ) : (
                      <View className="w-[10%]" />
                    )}

                    <View />
                  </View>
                ) : (
                  <View className="flex-row">
                    <Typography className="ml-2 flex w-[80%] rounded text-[14px] text-black">
                      {'No recent events'}
                    </Typography>
                  </View>
                )}
              </View>
              <View
                style={{ position: 'absolute', right: 5 }}
                className=" self-center"
              >
                <Feather name={'chevron-right'} size={20} color={'black'} />
              </View>
            </TouchableOpacity>
          ) : (
            <View />
          )}
        </ScrollView>
      ) : (
        <View />
      )}
    </View>
  )
}
