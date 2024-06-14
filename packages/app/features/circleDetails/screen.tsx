'use client'

import { useState, useEffect } from 'react'
import { Alert, View, TouchableOpacity } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { useRouter } from 'expo-router'
import { Feather } from 'app/ui/icons'
import store from 'app/redux/store'
import { useLocalSearchParams } from 'expo-router'
import { formatUrl } from 'app/utils/format-url'
import { CircleSummaryCard } from './circle-summary-card'
import { CallPostService } from 'app/utils/fetchServerData'
import currentMemberAddressAction from 'app/redux/curenMemberAddress/currentMemberAddressAction'
import { BASE_URL, GET_MEMBER_MENUS } from 'app/utils/urlConstants'
export function CircleDetailsScreen() {
  const header = store.getState().headerState.header
  const router = useRouter()
  const userDetails = store.getState().userProfileState.header
  const item = useLocalSearchParams<any>()
  let memberData = JSON.parse(item.memberData)
  const [isLoading, setLoading] = useState(false)

  let todayAppt = ''
  if (memberData.upcomingAppointment) {
    todayAppt =
      memberData.upcomingAppointment.purpose +
      ' with ' +
      memberData.upcomingAppointment.location
  }
  useEffect(() => {
    async function getMemberMenus() {
      setLoading(true)
      let url = `${BASE_URL}${GET_MEMBER_MENUS}`
      let dataObject = {
        header: header,
        member: {
          id: memberData.member ? memberData.member : ''
        }
      }
      CallPostService(url, dataObject)
        .then(async (data: any) => {
          if (data.status === 'SUCCESS') {
            if (data.member && data.member.address) {
              store.dispatch(
                currentMemberAddressAction.setMemberAddress(data.member.address)
              )
            }
          } else {
            Alert.alert('', data.message)
          }
          setLoading(false)
        })
        .catch((error) => {
          setLoading(false)
          console.log('error', error)
        })
    }
    getMemberMenus()
  }, [])
  return (
    <View className="mt-14 flex-1">
      <PtsLoader loading={isLoading} />
      <CircleSummaryCard memberData={memberData} userDetails={userDetails} />
      <ScrollView className=" flex-1">
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
              <View className="w-[35%] self-center" />
              {memberData.unreadMessages &&
              memberData.unreadMessages.length > 0 ? (
                <View className="bg-primary ml-2 h-[24px] w-[24px] rounded-[12px]">
                  <Typography className="self-center text-center font-bold text-white">
                    {memberData.unreadMessages.length}
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
                <Typography className="ml-2 flex w-[75%] self-center rounded text-[14px] text-black">
                  {memberData.recentIncident.title
                    ? memberData.recentIncident.title
                    : ''}
                </Typography>
                {memberData.recentIncident.incidentcount > 0 ? (
                  <View className="bg-primary ml-2 h-[24px] w-[24px] rounded-[12px]">
                    <Typography className="self-center text-center font-bold text-white">
                      {memberData.recentIncident.incidentcount}
                    </Typography>
                  </View>
                ) : (
                  <View className="w-[10%]" />
                )}

                <View />
              </View>
            ) : (
              <View className="flex-row">
                <Typography className="ml-5 flex w-[80%] rounded text-[14px] text-black">
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
      </ScrollView>
    </View>
  )
}
