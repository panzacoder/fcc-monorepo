'use client'
import _ from 'lodash'
import { useState, useEffect, useCallback } from 'react'
import { View, TouchableOpacity, Alert, ScrollView } from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import store from 'app/redux/store'
import { CallPostService } from 'app/utils/fetchServerData'
import { getFullDateForCalender } from 'app/ui/utils'
import { BASE_URL, GET_APPOINTMENT_DETAILS } from 'app/utils/urlConstants'
import { useParams } from 'solito/navigation'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'solito/navigation'
import { Location } from 'app/ui/location'
import { Button } from 'app/ui/button'

export function AppointmentDetailsScreen() {
  const header = store.getState().headerState.header
  const item = useParams<any>()
  let memberData = item.memberData ? JSON.parse(item.memberData) : {}
  const router = useRouter()
  let appointmentInfo = item.appointmentDetails
    ? JSON.parse(item.appointmentDetails)
    : {}
  // console.log('appointmentInfo', '' + JSON.stringify(appointmentInfo))
  const [isLoading, setLoading] = useState(false)
  const [isDataReceived, setIsDataReceived] = useState(false)
  const [appointmentDetails, setAppointmentDetails] = useState({}) as any
  const getAppointmentDetails = useCallback(async () => {
    setLoading(true)
    let url = `${BASE_URL}${GET_APPOINTMENT_DETAILS}`
    let dataObject = {
      header: header,
      appointment: {
        id: appointmentInfo.id ? appointmentInfo.id : ''
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          // console.log(
          //   'appointmentInfo',
          //   '' +
          //     JSON.stringify(
          //       data.data.appointmentWithPreviousAppointment.appointment
          //     )
          // )
          if (
            data.data.appointmentWithPreviousAppointment &&
            data.data.appointmentWithPreviousAppointment.appointment
          ) {
            setAppointmentDetails(
              data.data.appointmentWithPreviousAppointment.appointment
            )
          }
          setIsDataReceived(true)
        } else {
          Alert.alert('', data.message)
        }
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        console.log('error', error)
      })
  }, [])
  useEffect(() => {
    getAppointmentDetails()
  }, [])
  let doctorName = ''
  let specialist = ''
  let phone = ''
  let email = ''
  let website = ''
  let websiteUser = ''
  if (!_.isEmpty(appointmentDetails)) {
    if (
      appointmentDetails.doctorLocation &&
      appointmentDetails.doctorLocation.doctor
    ) {
      if (appointmentDetails.doctorLocation.doctor.firstName) {
        doctorName += appointmentDetails.doctorLocation.doctor.firstName
      }
      if (appointmentDetails.doctorLocation.doctor.lastName) {
        doctorName += ' ' + appointmentDetails.doctorLocation.doctor.lastName
      }
      if (appointmentDetails.doctorLocation.doctor.specialist) {
        specialist = appointmentDetails.doctorLocation.doctor.specialist
      }
      if (appointmentDetails.doctorLocation.doctor.phone) {
        phone = appointmentDetails.doctorLocation.doctor.phone
      }
      if (appointmentDetails.doctorLocation.doctor.email) {
        email = appointmentDetails.doctorLocation.doctor.email
      }
      if (appointmentDetails.doctorLocation.doctor.website) {
        website = appointmentDetails.doctorLocation.doctor.website
      }
      if (appointmentDetails.doctorLocation.doctor.websiteuser) {
        websiteUser = appointmentDetails.doctorLocation.doctor.websiteuser
      }
    }
  }
  return (
    <View className="flex-1 ">
      <PtsLoader loading={isLoading} />
      {isDataReceived ? (
        <View className="absolute top-[0] h-full w-full flex-1 py-2 ">
          <ScrollView persistentScrollbar={true} className="flex-1">
            <View className="border-primary mt-[40] w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-5">
              <View className=" w-full flex-row items-center">
                <View className="w-[80%] flex-row">
                  <Typography className=" font-400 w-[50%] text-[16px] text-[#86939e]">
                    {doctorName}
                  </Typography>
                  <View className="ml-2 h-[25] w-[2px] bg-[#86939e]" />
                  <Typography className="font-400 text-primary ml-2 text-[16px]">
                    {specialist}
                  </Typography>
                </View>
                <Button
                  className=""
                  title="Edit"
                  variant="border"
                  onPress={() => {
                    // router.push(
                    //   formatUrl('/(authenticated)/circles/addEditDoctor', {
                    //     memberData: JSON.stringify(memberData),
                    //     appointmentDetails: JSON.stringify(appointmentDetails),
                    //     component: 'Doctor'
                    //   })
                    // )
                  }}
                />
              </View>
              <View className="mt-2 w-full flex-row items-center">
                <View className="w-[95%] flex-row">
                  <Typography className="font-400  w-[30%] text-[16px] text-[#1A1A1A]">
                    {'Phone:'}
                  </Typography>
                  <Typography className="font-400 ml-2 w-[65%] text-[16px] font-bold text-[#1A1A1A]">
                    {phone}
                  </Typography>
                </View>
                <Feather name={'phone'} size={20} color={'black'} />
              </View>
              <View className="mt-2 w-full flex-row items-center">
                <View className="w-[95%] flex-row">
                  <Typography className="font-400  w-[30%] text-[16px] text-[#1A1A1A]">
                    {'Email:'}
                  </Typography>
                  <Typography className="font-400 ml-2 w-[65%] text-[16px] font-bold text-[#1A1A1A]">
                    {email}
                  </Typography>
                </View>
                <Feather name={'mail'} size={20} color={'black'} />
              </View>
              <View className="mt-2 w-full flex-row items-center">
                <View className="w-[95%] flex-row">
                  <Typography className="font-400  w-[30%] text-[16px] text-[#1A1A1A]">
                    {'Website:'}
                  </Typography>
                  <Typography className="font-400 ml-2 w-[65%] text-[16px] font-bold text-[#1A1A1A]">
                    {website}
                  </Typography>
                </View>
                <Feather name={'globe'} size={20} color={'black'} />
              </View>
              <View className="mt-2 w-full flex-row items-center">
                <View className="w-[95%] flex-row">
                  <Typography className="font-400 w-[30%] text-[16px] text-[#1A1A1A]">
                    {'Username:'}
                  </Typography>
                  <Typography className="font-400 ml-2 w-[65%] text-[16px] font-bold text-[#1A1A1A]">
                    {websiteUser}
                  </Typography>
                </View>
                <Feather name={'copy'} size={20} color={'black'} />
              </View>
            </View>
          </ScrollView>
        </View>
      ) : (
        <View />
      )}
    </View>
  )
}
