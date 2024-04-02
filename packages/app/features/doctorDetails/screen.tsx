'use client'

import { useState, useEffect, useCallback } from 'react'
import { View, TouchableOpacity, Alert, ScrollView } from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import store from 'app/redux/store'
import { CallPostService } from 'app/utils/fetchServerData'
import { getFullDateForCalender } from 'app/ui/utils'
import { BASE_URL, GET_DOCTOR_DETAILS } from 'app/utils/urlConstants'
import { useParams } from 'solito/navigation'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'solito/navigation'
import { Location } from 'app/ui/location'
import { Button } from 'app/ui/button'
export function DoctorDetailsScreen() {
  // console.log('in DoctorDetailsScreen')
  const header = store.getState().headerState.header
  const item = useParams<any>()
  let memberData = item.memberData ? JSON.parse(item.memberData) : {}
  const router = useRouter()
  let doctorInfo = item.doctorDetails ? JSON.parse(item.doctorDetails) : {}
  console.log('doctorDetails', '' + JSON.stringify(doctorInfo))
  const [isLoading, setLoading] = useState(false)
  const [doctorDetails, setDoctorDetails] = useState({}) as any
  const [locationList, setLocationList] = useState([])
  const [appointmentList, setAppointmentList] = useState([])

  const getDoctorDetails = useCallback(async () => {
    setLoading(true)
    let url = `${BASE_URL}${GET_DOCTOR_DETAILS}`
    let dataObject = {
      header: header,
      doctor: {
        id: doctorInfo.id ? doctorInfo.id : ''
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          setDoctorDetails(data.data.doctor || {})
          setLocationList(
            data.data.doctor && data.data.doctor.doctorLocationList
              ? data.data.doctor.doctorLocationList
              : []
          )
          setAppointmentList(
            data.data && data.data.doctorAppointmentList
              ? data.data.doctorAppointmentList
              : []
          )
          // console.log('appointmentList', JSON.stringify(appointmentList))
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
    getDoctorDetails()
  }, [])

  return (
    <View className="flex-1">
      <PtsLoader loading={isLoading} />

      <View className="absolute top-[0] h-full w-full flex-1 py-2 ">
        <ScrollView persistentScrollbar={true} className="flex-1">
          <View className="border-primary mt-[40] w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-5">
            <View className=" w-full flex-row items-center">
              <View className="w-[80%] flex-row">
                <Typography className=" font-400 w-[65%] text-[16px] text-[#86939e]">
                  {doctorInfo.specialist ? doctorInfo.specialist : ''}
                </Typography>
                <View className="ml-2 h-[25] w-[2px] bg-[#86939e]" />
              </View>
              <Button
                className=""
                title="Edit"
                variant="border"
                onPress={() => {
                  router.push(
                    formatUrl('/circles/addEditDoctor', {
                      memberData: JSON.stringify(memberData),
                      doctorDetails: JSON.stringify(doctorDetails),
                      component: 'Doctor'
                    })
                  )
                }}
              />
            </View>
            <View>
              <View className="mt-5 flex-row items-center">
                <Typography className="font-400 w-[25%] text-[12px] text-[#1A1A1A]">
                  {'Contact Info'}
                </Typography>
                <View className="bg-primary  ml-2 h-[1px] w-[75%]" />
              </View>
              <View className="mt-2 w-full flex-row items-center">
                <View className="w-[95%] flex-row">
                  <Typography className="font-400 w-[20%] text-[16px] text-[#1A1A1A]">
                    {'Phone:'}
                  </Typography>
                  <Typography className="font-400 ml-2 w-[70%] text-[16px] font-bold text-[#1A1A1A]">
                    {doctorDetails.phone ? doctorDetails.phone : ''}
                  </Typography>
                </View>
                <Feather name={'phone'} size={20} color={'black'} />
              </View>
              <View className="mt-2 w-full flex-row items-center">
                <View className="w-[95%] flex-row">
                  <Typography className="font-400 w-[20%] text-[16px] text-[#1A1A1A]">
                    {'Email:'}
                  </Typography>
                  <Typography className="font-400 ml-2 w-[75%] text-[16px] font-bold text-[#1A1A1A]">
                    {doctorDetails.email ? doctorDetails.email : ''}
                  </Typography>
                </View>
                <Feather name={'mail'} size={20} color={'black'} />
              </View>
            </View>

            <View>
              <View className="mt-5 flex-row items-center">
                <Typography className="font-400 w-[30%] text-[12px] text-[#1A1A1A]">
                  {'Portal details'}
                </Typography>
                <View className="bg-primary  ml-2 h-[1px] w-[70%]" />
              </View>
              <View className="mt-2 w-full flex-row items-center">
                <View className="w-[95%] flex-row">
                  <Typography className="font-400 w-[30%] text-[16px] text-[#1A1A1A]">
                    {'Username:'}
                  </Typography>
                  <Typography className="font-400 ml-2 w-[60%] text-[16px] font-bold text-[#1A1A1A]">
                    {doctorDetails.websiteuser ? doctorDetails.websiteuser : ''}
                  </Typography>
                </View>
                <Feather name={'copy'} size={20} color={'black'} />
              </View>
              <View className="mt-2 w-full flex-row items-center">
                <View className="w-[95%] flex-row">
                  <Typography className="font-400 w-[30%] text-[16px] text-[#1A1A1A]">
                    {'Website:'}
                  </Typography>
                  <Typography className="font-400 ml-2 w-[60%] text-[16px] font-bold text-[#1A1A1A]">
                    {doctorDetails.website ? doctorDetails.website : ''}
                  </Typography>
                </View>
                <Feather name={'external-link'} size={20} color={'black'} />
              </View>
            </View>
          </View>

          <View className="border-primary mt-[40] w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-5">
            <View className=" w-full flex-row items-center">
              <View className="w-[60%] flex-row">
                <Typography className="font-400 text-[16px] font-bold text-black">
                  {'Locations'}
                </Typography>
              </View>
              <Button
                className=""
                title="Add Location"
                variant="border"
                onPress={() => {
                  router.replace(
                    formatUrl('/circles/addEditLocation', {
                      memberData: JSON.stringify(memberData),
                      details: JSON.stringify(doctorInfo),
                      component: 'Doctor'
                    })
                  )
                }}
              />
            </View>
            {locationList.length > 0 ? (
              <ScrollView className="">
                {locationList.map((data: any, index: number) => {
                  data.component = 'Doctor'
                  data.doctorFacilityId = doctorInfo.id
                  return (
                    <View key={index}>
                      <Location data={data}></Location>
                    </View>
                  )
                })}
              </ScrollView>
            ) : (
              <View />
            )}
          </View>

          <View className="border-primary mt-[40] w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-5">
            <View className=" w-full flex-row items-center">
              <View className="w-[50%] flex-row">
                <Typography className="font-400 text-[16px] font-bold text-black">
                  {'Appointments'}
                </Typography>
              </View>
              <Button
                className=""
                title="Add Appointment"
                variant="default"
                onPress={() => {}}
              />
            </View>
            <View className="mt-5 flex-row items-center">
              <View className="w-[20%] flex-row">
                <Typography className="font-400 mr-2 text-[12px] text-[#1A1A1A] ">
                  {'All'}
                </Typography>
                <Feather
                  onPress={() => {}}
                  name={'chevron-down'}
                  size={15}
                  color={'black'}
                />
              </View>
              <View className="bg-primary h-[1px] w-[80%]" />
            </View>
            {appointmentList.length > 0 ? (
              <ScrollView className="h-[60%] flex-1">
                {appointmentList.map((data: any, index: number) => {
                  return (
                    <View key={index}>
                      <TouchableOpacity
                        onPress={() => {
                          router.push(
                            formatUrl('/circles/appointmentDetails', {
                              memberData: JSON.stringify(memberData),
                              appointmentDetails: JSON.stringify(data)
                            })
                          )
                        }}
                        className="border-primary my-[5px] w-full flex-1 self-center rounded-[15px] border-[2px] bg-white py-2"
                      >
                        <View className="ml-2 mt-2 flex-row ">
                          <View className="w-[95%]">
                            <Typography className="font-400 ml-2 w-[95%] text-[16px] text-[#103264]">
                              {data.purpose ? data.purpose : ''}
                            </Typography>
                            <View className="w-full flex-row">
                              <Typography className="font-400 ml-2 w-[35%] text-[12px] text-[#103264]">
                                {getFullDateForCalender(
                                  new Date(data.date),
                                  'MMMM DD '
                                ) + ' - '}
                              </Typography>
                              <Typography className="font-400 w-[70%] text-[12px] text-[#103264]">
                                {data.appointment ? data.appointment : ''}
                              </Typography>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )
                })}
              </ScrollView>
            ) : (
              <View />
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  )
}
