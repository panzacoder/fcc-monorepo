'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import {
  View,
  Alert,
  Linking,
  TouchableOpacity,
  BackHandler
} from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import PtsLoader from 'app/ui/PtsLoader'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import { Typography } from 'app/ui/typography'
import {
  formatTimeToUserLocalTime,
  convertPhoneNumberToUsaPhoneNumberFormat
} from 'app/ui/utils'
import { useAppSelector } from 'app/redux/hooks'
import { Feather } from 'app/ui/icons'
import { CallPostService } from 'app/utils/fetchServerData'
import {
  BASE_URL,
  GET_DOCTOR_DETAILS,
  DELETE_DOCTOR,
  SHARE_CONTACT_INFO
} from 'app/utils/urlConstants'
import { useLocalSearchParams } from 'expo-router'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'expo-router'
import { logger } from 'app/utils/logger'
import { ShareDoctorFacility } from 'app/ui/shareDoctorFacility'
import { Location } from 'app/ui/location'
import { Button } from 'app/ui/button'
import { getUserPermission } from 'app/utils/getUserPemissions'
import * as Clipboard from 'expo-clipboard'
export function DoctorDetailsScreen() {
  const doctorPrivilegesRef = useRef<any>({})
  const header = useAppSelector((state) => state.headerState.header)
  const userAddress = useAppSelector(
    (state) => state.userProfileState.header.address
  )
  const memberAddress = useAppSelector(
    (state) => state.currentMemberAddress.currentMemberAddress
  )
  const item = useLocalSearchParams<any>()
  let memberData = item.memberData ? JSON.parse(item.memberData) : {}
  const router = useRouter()
  let doctorInfo = item.doctorDetails ? JSON.parse(item.doctorDetails) : {}
  const [isLoading, setLoading] = useState(false)
  const [isShowLocations, setIsShowLocations] = useState(false)
  const [isShowAppointments, setIsShowAppointments] = useState(false)
  const [doctorDetails, setDoctorDetails] = useState({}) as any
  const [doctorName, setDoctorName] = useState('')
  const [locationList, setLocationList] = useState([])
  const [appointmentList, setAppointmentList] = useState([])
  const [isShareDoctor, setIsShareDoctor] = useState(false)

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
          if (data.data.domainObjectPrivileges) {
            doctorPrivilegesRef.current = data.data.domainObjectPrivileges
              .Doctor
              ? data.data.domainObjectPrivileges.Doctor
              : {}
          }
          setDoctorDetails(data.data.doctor || {})
          if (data.data.doctor) {
            let details = data.data.doctor
            let fullName = ''
            fullName += details.salutation ? details.salutation + '. ' : ''
            fullName += details.firstName ? details.firstName + ' ' : ''
            fullName += details.lastName ? details.lastName + ' ' : ''
            setDoctorName(fullName)
          }
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
        logger.debug('error', error)
      })
  }, [])
  function handleBackButtonClick() {
    router.dismiss(2)
    router.push(
      formatUrl('/circles/doctorsList', {
        memberData: JSON.stringify(memberData)
      })
    )
    return true
  }
  useEffect(() => {
    getDoctorDetails()
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick)
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick
      )
    }
  }, [])
  function getWebsite(url: string) {
    let newUrl = String(url).replace(/(^\w+:|^)\/\//, '')
    return newUrl
  }

  let titleStyle = 'font-400 w-[30%] text-[16px] text-[#1A1A1A]'
  let valueStyle = 'font-400 ml-2 text-[16px] font-bold text-[#1A1A1A]'
  async function iconPressed(title: any, value: any) {
    if (title === 'Phone' && value !== '') {
      Linking.openURL(`tel:${value}`)
    } else if (title === 'Email' && value !== '') {
      Linking.openURL(`mailto:${value}`)
    } else if (title === 'Website' && value !== '') {
      Linking.openURL(`http://${getWebsite(value)}`)
    } else if (title === 'Username' && value !== '') {
      await Clipboard.setStringAsync(value)
      Alert.alert('', 'Username copied to clipborad')
    }
  }
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
          {title !== 'Status' ? (
            <TouchableOpacity
              className="w-[65%]"
              onPress={() => {
                iconPressed(title, value)
              }}
            >
              <Typography className={valueStyle}>{value}</Typography>
            </TouchableOpacity>
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
          <TouchableOpacity
            className="w-[65%]"
            onPress={() => {
              iconPressed(title, value)
            }}
          >
            <Feather className="" name={iconValue} size={20} color={'black'} />
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>
    )
  }
  async function deleteDoctor() {
    setLoading(true)
    let url = `${BASE_URL}${DELETE_DOCTOR}`
    let dataObject = {
      header: header,
      doctor: {
        id: doctorDetails.id
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          router.dismiss(2)
          router.push(
            formatUrl('/circles/doctorsList', {
              memberData: JSON.stringify(memberData)
            })
          )
          // router.back()
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(false)
        logger.debug(error)
      })
  }
  const cancelClicked = () => {
    setIsShareDoctor(false)
  }
  async function shareDoctor(email: any) {
    setLoading(true)
    let url = `${BASE_URL}${SHARE_CONTACT_INFO}`
    let dataObject = {
      header: header,
      doctorSharingInfo: {
        doctorid: doctorDetails.id ? doctorDetails.id : '',
        targetemail: email
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          setIsShareDoctor(false)
        }
        Alert.alert('', data.message)
      })
      .catch((error) => {
        setLoading(false)
        logger.debug(error)
      })
  }
  return (
    <View className="flex-1">
      <PtsLoader loading={isLoading} />
      <PtsBackHeader title="Doctor Details" memberData={memberData} />
      <View className="h-full w-full flex-1 py-2 ">
        <ScrollView persistentScrollbar={true} className="flex-1">
          <View className="border-primary mt-[5] w-full flex-1 self-center rounded-[10px] border-[1px] p-2">
            <View className=" w-full flex-row items-center">
              <View className="w-[80%] flex-row">
                <Typography className=" font-400 max-w-[80%] text-[16px] text-black">
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
                <Typography className="font-400 w-[30%] text-[12px] text-[#1A1A1A]">
                  {'Contact Info'}
                </Typography>
                <View className="bg-primary h-[1px] w-[70%]" />
              </View>

              {getDetailsView('Name', doctorName, true, 'user')}
              {doctorDetails.phone && doctorDetails.phone !== '' ? (
                getDetailsView(
                  'Phone',
                  convertPhoneNumberToUsaPhoneNumberFormat(doctorDetails.phone),
                  true,
                  'phone'
                )
              ) : (
                <View />
              )}
              {doctorDetails.email && doctorDetails.email !== '' ? (
                getDetailsView('Email', doctorDetails.email, true, 'mail')
              ) : (
                <View />
              )}
            </View>

            <View>
              <View className="mt-5 flex-row items-center">
                <Typography className="font-400 w-[30%] text-[12px] text-[#1A1A1A]">
                  {'Portal details'}
                </Typography>
                <View className="bg-primary  h-[1px] w-[70%]" />
              </View>

              {doctorDetails.websiteuser && doctorDetails.websiteuser !== '' ? (
                getDetailsView(
                  'Username',
                  doctorDetails.websiteuser,
                  true,
                  'copy'
                )
              ) : (
                <View />
              )}
              {doctorDetails.website && doctorDetails.website !== '' ? (
                getDetailsView('Website', doctorDetails.website, true, 'globe')
              ) : (
                <View />
              )}
              {getDetailsView(
                'Status',
                doctorDetails.status && doctorDetails.status.status
                  ? doctorDetails.status.status
                  : '',
                false,
                ''
              )}
            </View>
          </View>

          <View className="border-primary mt-[10px] w-full flex-1 self-center rounded-[10px] border-[1px] p-2">
            <View className=" w-full flex-row items-center">
              <TouchableOpacity
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
              </TouchableOpacity>
              <Button
                className=""
                title="Add Location"
                variant="border"
                onPress={() => {
                  router.push(
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
                  data.memberData = memberData
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

          <View className="border-primary mt-[10px] w-full flex-1 self-center rounded-[10px] border-[1px] p-2">
            <View className=" w-full flex-row items-center">
              <TouchableOpacity
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
              </TouchableOpacity>
              <Button
                className="ml-2"
                title="Add Appointment"
                variant="default"
                onPress={() => {
                  router.push(
                    formatUrl('/circles/addEditAppointment', {
                      memberData: JSON.stringify(memberData),
                      doctorFacilityDetails: JSON.stringify(doctorDetails),
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
                    <TouchableOpacity
                      onPress={() => {
                        router.push(
                          formatUrl('/circles/appointmentDetails', {
                            appointmentDetails: JSON.stringify(data),
                            memberData: JSON.stringify(memberData)
                          })
                        )
                      }}
                      key={index}
                      className="border-primary my-[5px] w-full flex-1 self-center rounded-[15px] border-[2px] bg-white py-2"
                    >
                      <View className=" flex-row">
                        <Typography className="font-400 ml-5 w-[70%] max-w-[70%] text-sm text-black">
                          {data.date
                            ? formatTimeToUserLocalTime(
                                data.date,
                                userAddress,
                                memberAddress
                              )
                            : ''}
                        </Typography>
                        <View className="">
                          <Typography className="text-sm font-bold text-black">
                            {data.status ? data.status : ''}
                          </Typography>
                        </View>
                      </View>
                      <View className="flex-row">
                        <Typography className="font-400 ml-5 w-[55%] text-sm text-black">
                          {data.purpose ? data.purpose : ''}
                        </Typography>
                        {data.markCompleteCancel ? (
                          <Typography className="font-400 ml-5 w-[40%] text-sm text-[#FF0000]">
                            {'Mark Complete/Cancel'}
                          </Typography>
                        ) : (
                          <View />
                        )}
                      </View>
                      <View className="flex-row">
                        <Typography className="text-primary font-400 ml-5 mr-5 w-[65%] max-w-[65%] text-[16px] text-sm">
                          {data.appointment ? data.appointment : ''}
                        </Typography>
                        <Typography className="font-400 ml-[10px] text-sm text-black">
                          {data.type.toLowerCase() === 'doctor appointment'
                            ? 'Doctor'
                            : 'Facility'}
                        </Typography>
                      </View>
                      {data.hasNotes ||
                      data.hasReminders ||
                      data.hasTransportation ? (
                        <View className="my-2 h-[1px] w-[95%] self-center bg-[#86939e]" />
                      ) : (
                        <View />
                      )}

                      <View className="ml-5 flex-row self-center">
                        <View className="w-[30%]">
                          {data.hasNotes ? (
                            <View className="flex-row">
                              <Feather
                                className="ml-5 mt-1"
                                name={'message-circle'}
                                size={25}
                                color={'green'}
                              />
                              {data.unreadMessageCount > 0 ? (
                                <Typography className="bg-primary ml-[-5px] h-[20px] w-[20px] rounded-[10px] text-center font-bold text-white">
                                  {data.unreadMessageCount}
                                </Typography>
                              ) : (
                                <View />
                              )}
                            </View>
                          ) : (
                            <View />
                          )}
                        </View>
                        <View className="w-[30%]">
                          {data.hasReminders ? (
                            <View className="flex-row">
                              <Feather
                                className="ml-5 mt-1"
                                name={'clock'}
                                size={25}
                                color={'red'}
                              />
                              {data.activeReminderCount > 0 ? (
                                <Typography className="bg-primary ml-[-5px] h-[20px] w-[20px] rounded-[10px] text-center font-bold text-white">
                                  {data.activeReminderCount}
                                </Typography>
                              ) : (
                                <View />
                              )}
                            </View>
                          ) : (
                            <View />
                          )}
                        </View>
                        {data.hasTransportation ? (
                          <View className="w-[30%]">
                            <Feather
                              className="ml-5 mt-1"
                              name={'truck'}
                              size={25}
                              color={
                                data.transportationStatus === 'Requested'
                                  ? '#cf8442'
                                  : data.transportationStatus === 'Rejected'
                                    ? 'red'
                                    : '#4DA529'
                              }
                            />
                          </View>
                        ) : (
                          <View />
                        )}
                      </View>
                    </TouchableOpacity>
                  )
                })}
              </ScrollView>
            ) : (
              <View />
            )}
          </View>
          {getUserPermission(doctorPrivilegesRef.current).deletePermission ? (
            <View className="mx-5 my-5 flex-row self-center">
              <Button
                className="w-[50%]"
                title="Share Doctor"
                variant="outline"
                leadingIcon="share-2"
                onPress={() => {
                  setIsShareDoctor(true)
                }}
              />
              <Button
                className="ml-5 w-[50%]"
                title="Delete"
                variant="borderRed"
                onPress={() => {
                  Alert.alert(
                    'Are you sure about deleting Doctor?',
                    'It cannot be recovered once deleted.',
                    [
                      {
                        text: 'Ok',
                        onPress: () => deleteDoctor()
                      },
                      { text: 'Cancel', onPress: () => {} }
                    ]
                  )
                }}
              />
            </View>
          ) : (
            <View />
          )}
        </ScrollView>
      </View>
      {isShareDoctor ? (
        <View className="mt-[20px] h-full w-full">
          <ShareDoctorFacility
            cancelClicked={cancelClicked}
            shareDoctorFacility={shareDoctor}
          />
        </View>
      ) : (
        <View />
      )}
    </View>
  )
}
