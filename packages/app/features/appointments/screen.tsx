'use client'

import { useState, useEffect } from 'react'
import { View, TouchableOpacity, Alert, ScrollView } from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { COLORS } from 'app/utils/colors'
import store from 'app/redux/store'
import { CallPostService } from 'app/utils/fetchServerData'
import { BASE_URL, GET_APPOINTMENTS } from 'app/utils/urlConstants'
import { useParams } from 'solito/navigation'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'solito/navigation'
import { formatTimeToUserLocalTime } from 'app/ui/utils'
export function AppointmentsScreen() {
  const router = useRouter()
  const [isLoading, setLoading] = useState(false)
  const [appointmentsList, setAppointmentsList] = useState([])
  const header = store.getState().headerState.header
  const item = useParams<any>()
  let memberData =
    item.memberData && item.memberData !== undefined
      ? JSON.parse(item.memberData)
      : {}

  useEffect(() => {
    async function getDoctorDetails() {
      setLoading(true)
      let url = `${BASE_URL}${GET_APPOINTMENTS}`
      let dataObject = {
        header: header,
        memberDetails: {
          id: memberData.member ? memberData.member : '',
          month: 'All',
          year: 'All',
          type: 'All',
          doctorId: 'All',
          facilityId: 'All'
        }
      }
      CallPostService(url, dataObject)
        .then(async (data: any) => {
          if (data.status === 'SUCCESS') {
            setAppointmentsList(data.data.list ? data.data.list : [])
            // console.log('setAppointmentsList', appointmentsList)
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
    getDoctorDetails()
  }, [])
  return (
    <View className="flex-1">
      <PtsLoader loading={isLoading} />
      <View className="flex-row ">
        <TouchableOpacity className="w-[85%] flex-row">
          <Typography className=" ml-10 mt-7 text-[14px] font-bold text-black">
            {'Filter'}
          </Typography>

          <Feather
            className="ml-2 mt-6"
            name={'chevron-down'}
            size={25}
            color={'black'}
          />
        </TouchableOpacity>
        <View className=" mt-[20] self-center">
          <TouchableOpacity
            className=" h-[30px] w-[30px] items-center justify-center rounded-[15px] bg-[#c5dbfd]"
            onPress={() => {
              // router.push(
              //   formatUrl('/(authenticated)/circles/addEditDoctor', {
              //     memberData: JSON.stringify(memberData)
              //   })
              // )
            }}
          >
            <Feather name={'plus'} size={25} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView className="m-2 mx-5 w-[95%] self-center">
        {appointmentsList.map((data: any, index: number) => {
          return (
            <TouchableOpacity
              onPress={() => {
                router.replace(
                  formatUrl('/(authenticated)/circles/appointmentDetails', {
                    appointmentDetails: JSON.stringify(data),
                    memberData: JSON.stringify(memberData)
                  })
                )
              }}
              key={index}
              className="border-primary my-[5px] w-full flex-1 self-center rounded-[15px] border-[2px] bg-white py-2"
            >
              <View className="my-2 flex-row">
                <Typography className="text-primary font-400 ml-5 mr-5 w-[60%] text-[16px]">
                  {data.appointment ? data.appointment : ''}
                </Typography>
                <View className="ml-[-5px] self-center">
                  <Typography
                    className={
                      data.status.toLowerCase() === 'scheduled'
                        ? "rounded-[20px] bg-['#5ACC6C'] px-3 py-2 text-right text-white"
                        : data.status.toLowerCase() === 'cancelled'
                          ? "rounded-[20px] bg-['#E43A39'] px-3 py-2 text-right text-white"
                          : 'rounded-[20px] bg-[#1A1A1A] px-3 py-2 text-right text-white'
                    }
                  >
                    {data.status ? data.status : ''}
                  </Typography>
                </View>
              </View>
              <View className="flex-row">
                <Typography className="font-400 ml-5 w-full text-black">
                  {data.purpose ? data.purpose : ''}
                </Typography>
              </View>
              <View className="flex-row">
                <Typography className="font-400 ml-5 w-[74%] text-black">
                  {data.date ? formatTimeToUserLocalTime(data.date) : ''}
                </Typography>
                <Typography className="font-400 ml-5 text-black">
                  {data.type.toLowerCase() === 'doctor appointment'
                    ? 'Doctor'
                    : 'Facility'}
                </Typography>
              </View>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )
}
