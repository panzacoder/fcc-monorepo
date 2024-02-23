'use client'

import { useState } from 'react'
import { View, Alert, TouchableOpacity, ScrollView } from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { Button } from 'app/ui/button'
import { useRouter } from 'solito/navigation'
import PtsNameInitials from 'app/ui/PtsNameInitials'
import { Feather } from 'app/ui/icons'
import { CallPostService } from 'app/utils/fetchServerData'
import store from 'app/redux/store'
import { BASE_URL } from 'app/utils/urlConstants'
import { useParams } from 'solito/navigation'
import { COLORS } from 'app/utils/colors'
import { formatUrl } from 'app/utils/format-url'
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
  const userDetails = store.getState().userProfileState.header
  console.log('userDetails', userDetails)
  const item = useParams<any>()
  let memberData = JSON.parse(item.memberData)
  // console.log('email', item ? item.memberData : '')
  const [isLoading, setLoading] = useState(false)
  const [isSeeMore, setSeeMore] = useState(false)

  let d = new Date()
  let datestring =
    month[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear() + ' '

  let todayDate =
    d.getFullYear() +
    '-' +
    (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1) +
    '-' +
    d.getDate() +
    ' '
  let apptDate = ''
  let eventDate = ''
  let todayAppt = ''
  let todayEvent = ''
  if (memberData.upcomingAppointment) {
    apptDate = memberData.upcomingAppointment.date.split('T')[0]
    todayAppt =
      memberData.upcomingAppointment.purpose +
      ' with ' +
      memberData.upcomingAppointment.location
  }
  if (memberData.upcomingEvent) {
    eventDate = memberData.upcomingEvent.date.split('T')[0]
    todayEvent = memberData.upcomingEvent.title
  }
  let userName = ''
  if (userDetails.firstName) {
    userName += userDetails.firstName.trim() + ' '
  }
  if (userDetails.lastName) {
    userName += userDetails.lastName.trim()
  }

  return (
    <View className="flex-1  bg-white">
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
        className="mt-5 w-full self-center py-5"
      >
        <View className="ml-2 flex-row">
          <PtsNameInitials fullName={item.fullName} />
          <Typography className="ml-2 self-center text-center text-[18px] font-bold text-white">
            {item.fullName}
          </Typography>
          {/* <TouchableOpacity
            className="absolute right-[15] self-center"
            onPress={() => {}}
          >
            <Feather name={'menu'} size={20} color={'#5ACC6C'} />
          </TouchableOpacity> */}
        </View>
        <View className="mt-2 flex w-[95%] self-center rounded-[16px] bg-white py-5 ">
          <View className="flex-row">
            <View>
              <Typography className="ml-5 text-[16px] font-bold">
                {'Today'}
              </Typography>
              <Typography className="ml-5 text-[12px]">{datestring}</Typography>
              {apptDate && todayDate.includes(apptDate) ? (
                <View className="my-2 ml-5 flex-row">
                  <View className="mr-2 w-[2px] bg-[#319D9D]" />
                  <Typography className="w-[90%] text-[12px]">
                    {todayAppt}
                  </Typography>
                </View>
              ) : (
                <View />
              )}
              {eventDate && todayDate.includes(eventDate) ? (
                <View className="ml-5 flex-row">
                  <View className="mr-2 w-[2px] bg-[#319D9D]" />
                  <Typography className="w-[90%] text-[12px]">
                    {todayEvent}
                  </Typography>
                </View>
              ) : (
                <View />
              )}
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
              name={isSeeMore ? 'chevron-up' : 'chevron-down'}
              size={25}
              color={'#5ACC6C'}
            />
          </TouchableOpacity>
          <Typography className="ml-2 mt-5 w-[20%] text-white">
            {isSeeMore ? 'See less' : 'See more'}
          </Typography>
          <View className=" mt-8 h-[1] w-[60%] bg-[#5ACC6C]" />
        </View>
        {isSeeMore ? (
          <View>
            <View className="mt-5 flex-row self-center">
              <Button
                className="px-3"
                title="Caregivers"
                leadingIcon="arrow-right"
                onPress={() => {
                  router.push(formatUrl('/home', {}))
                }}
              />
              <Button
                className="ml-2 px-3"
                title="Doctors"
                leadingIcon="arrow-right"
                onPress={() => {
                  router.push(
                    formatUrl('/(authenticated)/circles/doctors', {
                      memberData: JSON.stringify(memberData)
                    })
                  )
                }}
              />
              <Button
                className="ml-2 px-3"
                title="Facilities"
                leadingIcon="home"
                onPress={() => {
                  router.push(
                    formatUrl('/(authenticated)/circles/facilities', {
                      memberData: JSON.stringify(memberData)
                    })
                  )
                }}
              />
            </View>

            <View className="mt-5 flex-row self-center">
              <Button
                className="px-3"
                title="Prescriptions"
                leadingIcon="arrow-right"
                onPress={() => {
                  // router.push(formatUrl('/home', {}))
                }}
              />
              <Button
                className="ml-2 px-3"
                title="Medical Devices"
                leadingIcon="watch"
                onPress={() => {
                  // router.push(formatUrl('/home', {}))
                }}
              />
            </View>
          </View>
        ) : (
          <View />
        )}
      </LinearGradient>
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
                  <TouchableOpacity
                    className=" ml-2"
                    onPress={() => {
                      router.push('/messages')
                    }}
                  >
                    <Feather name={'chevron-right'} size={20} color={'black'} />
                  </TouchableOpacity>
                </View>
              ) : (
                <View className="flex-row">
                  <Typography className="ml-5 flex w-[80%] rounded text-[14px] text-black">
                    {'No new messages'}
                  </Typography>
                  <TouchableOpacity
                    className=" ml-2"
                    onPress={() => {
                      router.push('/messages')
                    }}
                  >
                    <Feather name={'chevron-right'} size={20} color={'black'} />
                  </TouchableOpacity>
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
              {memberData.upcomingAppointment ? (
                <View className="flex-row">
                  <Typography className=" ml-5 flex w-[70%] rounded text-[14px] text-black">
                    {todayAppt}
                  </Typography>
                  {memberData.upcomingAppointment.upcomingCount > 0 ? (
                    <View className="bg-primary ml-2 h-[24px] w-[24px] rounded-[12px]">
                      <Typography className="self-center text-center font-bold text-white">
                        {memberData.upcomingAppointment.upcomingCount}
                      </Typography>
                    </View>
                  ) : (
                    <View />
                  )}
                  <TouchableOpacity
                    className=" ml-2"
                    onPress={() => {
                      router.push('/appointments')
                    }}
                  >
                    <Feather name={'chevron-right'} size={20} color={'black'} />
                  </TouchableOpacity>
                  <View />
                </View>
              ) : (
                <View className="flex-row">
                  <Typography className="ml-5 flex w-[80%] rounded text-[14px] text-black">
                    {'No upcoming appointments'}
                  </Typography>
                  <TouchableOpacity
                    className=" ml-2"
                    onPress={() => {
                      router.push('/appointments')
                    }}
                  >
                    <Feather name={'chevron-right'} size={20} color={'black'} />
                  </TouchableOpacity>
                </View>
              )}
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
                  <TouchableOpacity
                    className=" ml-2"
                    onPress={() => {
                      router.push('/incidents')
                    }}
                  >
                    <Feather name={'chevron-right'} size={20} color={'black'} />
                  </TouchableOpacity>
                  <View />
                </View>
              ) : (
                <View className="flex-row">
                  <Typography className="ml-5 flex w-[80%] rounded text-[14px] text-black">
                    {'No recent incidents'}
                  </Typography>
                  <TouchableOpacity
                    className=" ml-2"
                    onPress={() => {
                      router.push('/incidents')
                    }}
                  >
                    <Feather name={'chevron-right'} size={20} color={'black'} />
                  </TouchableOpacity>
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
                  <TouchableOpacity
                    className=" ml-2"
                    onPress={() => {
                      router.push('/events')
                    }}
                  >
                    <Feather name={'chevron-right'} size={20} color={'black'} />
                  </TouchableOpacity>
                  <View />
                </View>
              ) : (
                <View className="flex-row">
                  <Typography className="ml-5 flex w-[80%] rounded text-[14px] text-black">
                    {'No upcoming events'}
                  </Typography>
                  <TouchableOpacity
                    className=" ml-2"
                    onPress={() => {
                      router.push('/events')
                    }}
                  >
                    <Feather name={'chevron-right'} size={20} color={'black'} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
