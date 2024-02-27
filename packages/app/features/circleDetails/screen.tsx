'use client'

import { useState } from 'react'
import { View, ScrollView, Pressable } from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { useRouter } from 'solito/navigation'
import { Feather } from 'app/ui/icons'
import store from 'app/redux/store'
import { useParams } from 'solito/navigation'
import { CircleSummaryCard } from './circle-summary-card'

export function CircleDetailsScreen() {
  const router = useRouter()
  const userDetails = store.getState().userProfileState.header
  const item = useParams<any>()
  let memberData = JSON.parse(item.memberData)
  const [isLoading, setLoading] = useState(false)

  let todayAppt = ''
  if (memberData.upcomingAppointment) {
    todayAppt =
      memberData.upcomingAppointment.purpose +
      ' with ' +
      memberData.upcomingAppointment.location
  }
  return (
    <View className="mt-14 flex-1">
      <PtsLoader loading={isLoading} />
      <CircleSummaryCard memberData={memberData} userDetails={userDetails} />
      <ScrollView className=" flex-1">
        <View className="  flex-1 items-center">
          <View className="mt-3  w-[95%] flex-1 flex-row rounded-[16px] border border-[#287CFA]">
            <View className="h-[100%] w-[10%] rounded-bl-[15px] rounded-tl-[15px] bg-[#287CFA] " />
            <View className="py-5">
              <Typography className=" ml-5 flex rounded text-[18px] font-bold text-black">
                {'Messages'}
              </Typography>
              {memberData.unreadMessages &&
                memberData.unreadMessages.length > 0 ? (
                <View className="flex-row">
                  <Typography className="ml-5 flex w-[80%] rounded text-[14px] text-black">
                    {'Show latest message'}
                  </Typography>
                  <Pressable
                    className=" ml-2"
                    onPress={() => {
                      router.push('/circles/messages')
                    }}
                  >
                    <Feather name={'chevron-right'} size={20} color={'black'} />
                  </Pressable>
                </View>
              ) : (
                <View className="flex-row">
                  <Typography className="ml-5 flex w-[80%] rounded text-[14px] text-black">
                    {'No new messages'}
                  </Typography>
                  <Pressable
                    className=" ml-2"
                    onPress={() => {
                      router.push('/circles/messages')
                    }}
                  >
                    <Feather name={'chevron-right'} size={20} color={'black'} />
                  </Pressable>
                </View>
              )}
            </View>
          </View>
          <View className=" mt-3 w-[95%] flex-1 flex-row rounded-[16px] border border-[#287CFA]">
            <View className="h-[100%] w-[10%] rounded-bl-[15px] rounded-tl-[15px] bg-[#287CFA] " />
            <View className="py-5">
              <Typography className="ml-5 flex rounded text-[18px] font-bold text-black">
                {'Appointments'}
              </Typography>
              <View className="flex-row">
                <Typography className=" ml-5 flex w-[70%] rounded text-[14px] text-black">
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
                  <View />
                )}
                <Pressable
                  className=" ml-2"
                  onPress={() => {
                    router.push('/circles/appointments')
                  }}
                >
                  <Feather name={'chevron-right'} size={20} color={'black'} />
                </Pressable>
                <View />
              </View>
            </View>
          </View>
          <View className=" mt-3 h-[15%] w-[95%] flex-1 flex-row rounded-[16px] border border-[#287CFA]">
            <View className="h-[100%] w-[10%] rounded-bl-[15px] rounded-tl-[15px] bg-[#287CFA] " />
            <View className="py-5">
              <Typography className="ml-5 flex rounded text-[18px] font-bold text-black">
                {'Incidents'}
              </Typography>
              {memberData.recentIncident ? (
                <View className="flex-row">
                  <Typography className=" ml-5 flex w-[70%] rounded text-[14px] text-black">
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
                    <View />
                  )}
                  <Pressable
                    className=" ml-2"
                    onPress={() => {
                      router.push('/circles/incidents')
                    }}
                  >
                    <Feather name={'chevron-right'} size={20} color={'black'} />
                  </Pressable>
                  <View />
                </View>
              ) : (
                <View className="flex-row">
                  <Typography className="ml-5 flex w-[80%] rounded text-[14px] text-black">
                    {'No recent incidents'}
                  </Typography>
                  <Pressable
                    className=" ml-2"
                    onPress={() => {
                      router.push('/circles/incidents')
                    }}
                  >
                    <Feather name={'chevron-right'} size={20} color={'black'} />
                  </Pressable>
                </View>
              )}
            </View>
          </View>
          <View className=" mt-3 h-[15%] w-[95%] flex-1 flex-row rounded-[16px] border border-[#287CFA]">
            <View className="h-[100%] w-[10%] rounded-bl-[15px] rounded-tl-[15px] bg-[#287CFA] " />
            <View className="py-5">
              <Typography className="ml-5 flex rounded text-[18px] font-bold text-black">
                {'Events'}
              </Typography>
              {memberData.upcomingEvent ? (
                <View className="flex-row">
                  <Typography className=" ml-5 flex w-[70%] rounded text-[14px] text-black">
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
                    <View />
                  )}
                  <Pressable
                    className=" ml-2"
                    onPress={() => {
                      router.push('/circles/events')
                    }}
                  >
                    <Feather name={'chevron-right'} size={20} color={'black'} />
                  </Pressable>
                  <View />
                </View>
              ) : (
                <View className="flex-row">
                  <Typography className="ml-5 flex w-[80%] rounded text-[14px] text-black">
                    {'No upcoming events'}
                  </Typography>
                  <Pressable
                    className=" ml-2"
                    onPress={() => {
                      router.push('/circles/events')
                    }}
                  >
                    <Feather name={'chevron-right'} size={20} color={'black'} />
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
