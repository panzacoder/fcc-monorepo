'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  Linking,
  Pressable
} from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { convertPhoneNumberToUsaPhoneNumberFormat } from 'app/ui/utils'
import { Feather } from 'app/ui/icons'
import store from 'app/redux/store'
import { CallPostService } from 'app/utils/fetchServerData'
import { getFullDateForCalendar } from 'app/ui/utils'
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
  // console.log('doctorDetails', '' + JSON.stringify(doctorInfo))
  const [isLoading, setLoading] = useState(false)
  const [isShowLocations, setIsShowLocations] = useState(false)
  const [isShowAppointments, setIsShowAppointments] = useState(false)
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
  function getWebsite(url: string) {
    let newUrl = String(url).replace(/(^\w+:|^)\/\//, '')
    return newUrl
  }
  let titleStyle = 'font-400 w-[30%] text-[16px] text-[#1A1A1A]'
  let valueStyle = 'font-400 ml-2 w-[65%] text-[16px] font-bold text-[#1A1A1A]'
  function getDetailsView(
    title: string,
    value: string,
    isIcon: boolean,
    iconValue: any
  ) {
    return (
      <View className="mt-2 w-full flex-row items-center">
        <View className="w-[95%] flex-row">
          <Typography className={titleStyle}>{title}</Typography>
          {title !== 'Status:' ? (
            <Typography className={valueStyle}>{value}</Typography>
          ) : (
            <View>
              <Typography
                className={`ml-2 mr-5 rounded-[5px] px-5 py-1 text-right font-bold ${value.toLowerCase() === 'active' ? "bg-['#27ae60'] text-white" : "bg-['#d5d8dc'] text-black"}`}
              >
                {value}
              </Typography>
            </View>
          )}
        </View>
        {isIcon ? (
          <Feather
            onPress={() => {
              if (title === 'Phone:' && value !== '') {
                Linking.openURL(`tel:${value}`)
              } else if (title === 'Email:' && value !== '') {
                Linking.openURL(`mailto:${value}`)
              } else if (title === 'Website:' && value !== '') {
                Linking.openURL(`http://${getWebsite(value)}`)
              }
            }}
            className=""
            name={iconValue}
            size={20}
            color={'black'}
          />
        ) : (
          <View />
        )}
      </View>
    )
  }
  return (
    <View className="flex-1">
      <PtsLoader loading={isLoading} />

      <View className="absolute top-[0] h-full w-full flex-1 py-2 ">
        <ScrollView persistentScrollbar={true} className="flex-1">
          <View className="border-primary mt-[40] w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-5">
            <View className=" w-full flex-row items-center">
              <View className="w-[80%] flex-row">
                <Typography className=" font-400 max-w-[80%] text-[16px] text-[#86939e]">
                  {doctorInfo.specialist ? doctorInfo.specialist : ''}
                </Typography>
                {/* <View className="ml-2 h-[25] w-[2px] bg-[#86939e]" /> */}
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
              <View className="mt-2 flex-row items-center">
                <Typography className="font-400 w-[25%] text-[12px] text-[#1A1A1A]">
                  {'Contact Info'}
                </Typography>
                <View className="bg-primary  ml-2 h-[1px] w-[75%]" />
              </View>

              {getDetailsView(
                'Name:',
                doctorInfo.doctorName ? doctorInfo.doctorName : '',
                true,
                'user'
              )}
              {doctorDetails.phone && doctorDetails.phone !== '' ? (
                getDetailsView(
                  'Phone:',
                  convertPhoneNumberToUsaPhoneNumberFormat(doctorDetails.phone),
                  true,
                  'phone'
                )
              ) : (
                <View />
              )}
              {doctorDetails.email && doctorDetails.email !== '' ? (
                getDetailsView('Email:', doctorDetails.email, true, 'mail')
              ) : (
                <View />
              )}
            </View>

            <View>
              <View className="mt-5 flex-row items-center">
                <Typography className="font-400 w-[30%] text-[12px] text-[#1A1A1A]">
                  {'Portal details'}
                </Typography>
                <View className="bg-primary  ml-2 h-[1px] w-[70%]" />
              </View>

              {doctorDetails.websiteuser && doctorDetails.websiteuser !== '' ? (
                getDetailsView(
                  'Username:',
                  doctorDetails.websiteuser,
                  true,
                  'copy'
                )
              ) : (
                <View />
              )}
              {doctorDetails.website && doctorDetails.website !== '' ? (
                getDetailsView('Website:', doctorDetails.website, true, 'globe')
              ) : (
                <View />
              )}
              {getDetailsView(
                'Status:',
                doctorDetails.status && doctorDetails.status.status
                  ? doctorDetails.status.status
                  : '',
                false,
                ''
              )}
            </View>
          </View>

          <View className="border-primary mt-[10px] w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-5">
            <View className=" w-full flex-row items-center">
              <Pressable
                onPress={() => {
                  setIsShowLocations(!isShowLocations)
                }}
                className="w-[60%] flex-row"
              >
                <Typography className="font-400 text-[14px] font-bold text-black">
                  {'Locations'}
                  {locationList.length > 0
                    ? ' (' + locationList.length + ') '
                    : ''}
                </Typography>
                {locationList.length > 0 ? (
                  <Feather
                    className=""
                    name={!isShowLocations ? 'chevron-down' : 'chevron-up'}
                    size={20}
                    color={'black'}
                  />
                ) : (
                  <View />
                )}
              </Pressable>
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
            {locationList.length > 0 && isShowLocations ? (
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

          <View className="border-primary mt-[10px] w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-5">
            <View className=" w-full flex-row items-center">
              <Pressable
                onPress={() => {
                  setIsShowAppointments(!isShowAppointments)
                }}
                className="w-[50%] flex-row"
              >
                <Typography className="font-400 text-[14px] font-bold text-black">
                  {'Appointments'}
                  {appointmentList.length > 0
                    ? ' (' + appointmentList.length + ') '
                    : ''}
                </Typography>
                {appointmentList.length > 0 ? (
                  <Feather
                    className=""
                    name={!isShowAppointments ? 'chevron-down' : 'chevron-up'}
                    size={20}
                    color={'black'}
                  />
                ) : (
                  <View />
                )}
              </Pressable>
              <Button
                className="ml-2"
                title="Add Appointment"
                variant="default"
                onPress={() => {
                  router.push(
                    formatUrl('/circles/addEditAppointment', {
                      memberData: JSON.stringify(memberData),
                      component: 'Doctor'
                    })
                  )
                }}
              />
            </View>
            {appointmentList.length > 0 && isShowAppointments ? (
              <ScrollView className="mt-2 h-[60%] flex-1">
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
                                {getFullDateForCalendar(
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
