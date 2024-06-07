'use client'

import { useState, useEffect } from 'react'
import { View, Alert, TouchableOpacity } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import store from 'app/redux/store'
import { CallPostService } from 'app/utils/fetchServerData'
import { ShareDoctorFacility } from 'app/ui/shareDoctorFacility'
import { formatTimeToUserLocalTime } from 'app/ui/utils'
import {
  BASE_URL,
  GET_FACILITY_DETAILS,
  DELETE_FACILITY,
  SHARE_CONTACT_INFO
} from 'app/utils/urlConstants'
import { useParams } from 'solito/navigation'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'solito/navigation'
import { Button } from 'app/ui/button'
import { Location } from 'app/ui/location'
import { getUserPermission } from 'app/utils/getUserPemissions'
let facilityPrivileges = {}
export function FacilityDetailsScreen() {
  const [facilityDetails, setFacilityDetails] = useState<any>({})
  const [isShowLocations, setIsShowLocations] = useState(false)
  const [isShowAppointments, setIsShowAppointments] = useState(false)
  const header = store.getState().headerState.header
  const item = useParams<any>()
  let memberData = item.memberData ? JSON.parse(item.memberData) : {}
  const router = useRouter()
  let facilityInfo = item.facilityDetails
    ? JSON.parse(item.facilityDetails)
    : {}
  const [isLoading, setLoading] = useState(false)
  const [isShareFacility, setIsShareFacility] = useState(false)
  const [locationList, setLocationList] = useState([])
  const [appointmentList, setAppointmentList] = useState([])
  useEffect(() => {
    async function getfacilityDetails() {
      setLoading(true)
      let url = `${BASE_URL}${GET_FACILITY_DETAILS}`
      let dataObject = {
        header: header,
        facility: {
          id: facilityInfo.id ? facilityInfo.id : ''
        }
      }
      CallPostService(url, dataObject)
        .then(async (data: any) => {
          if (data.status === 'SUCCESS') {
            if (data.data.domainObjectPrivileges) {
              facilityPrivileges = data.data.domainObjectPrivileges.Facility
                ? data.data.domainObjectPrivileges.Facility
                : {}
            }
            setFacilityDetails(data.data.facilityWithAppointment.facility || {})

            setLocationList(
              data.data.facilityWithAppointment &&
                data.data.facilityWithAppointment.facility.facilityLocationList
                ? data.data.facilityWithAppointment.facility
                    .facilityLocationList
                : []
            )
            setAppointmentList(
              data.data.facilityWithAppointment &&
                data.data.facilityWithAppointment.facilityAppointmentList
                ? data.data.facilityWithAppointment.facilityAppointmentList
                : []
            )
            console.log('appointmentList', JSON.stringify(appointmentList))
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
    getfacilityDetails()
  }, [])
  async function deleteFacilityLocation(locationData: any) {
    console.log('deleteFacilityLocation', JSON.stringify(locationData))
  }
  async function deleteFacility() {
    setLoading(true)
    let url = `${BASE_URL}${DELETE_FACILITY}`
    let dataObject = {
      header: header,
      facility: {
        id: facilityDetails.id ? facilityDetails.id : ''
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          router.push(
            formatUrl('/circles/facilitiesList', {
              memberData: JSON.stringify(memberData)
            })
          )
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }
  const cancelClicked = () => {
    setIsShareFacility(false)
  }
  async function shareFacility(email: any) {
    setLoading(true)
    let url = `${BASE_URL}${SHARE_CONTACT_INFO}`
    let dataObject = {
      header: header,
      doctorSharingInfo: {
        facilityid: facilityDetails.id ? facilityDetails.id : '',
        targetemail: email
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          setIsShareFacility(false)
        }
        Alert.alert('', data.message)
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }
  return (
    <View className="flex-1">
      <PtsLoader loading={isLoading} />

      <View className="absolute top-[0] h-full w-full flex-1 py-2 ">
        <ScrollView persistentScrollbar={true} className="flex-1">
          <View className="border-primary mt-[10px] w-full flex-1 self-center rounded-[10px] border-[1px] p-2">
            <View className=" w-full flex-row items-center">
              <View className="w-[80%] flex-row">
                <Typography className="font-400 max-w-[65%] text-[16px] text-[#86939e]">
                  {facilityInfo.type ? facilityInfo.type : ''}
                </Typography>
                <View className="ml-2 h-[25] w-[2px] bg-[#86939e]" />
                <Typography className="font-400 text-primary ml-2 text-[16px]">
                  {facilityInfo.status ? facilityInfo.status : ''}
                </Typography>
              </View>
              <Button
                className=""
                title="Edit"
                variant="border"
                onPress={() => {
                  router.push(
                    formatUrl('/circles/addEditFacility', {
                      facilityDetails: JSON.stringify(facilityDetails),
                      memberData: JSON.stringify(memberData)
                    })
                  )
                }}
              />
            </View>
            <View>
              <View className="mt-2 flex-row items-center">
                <Typography className="font-400 w-[30%] text-[12px] text-[#1A1A1A]">
                  {'Facility Details'}
                </Typography>
                <View className="bg-primary  ml-2 h-[1px] w-[70%]" />
              </View>

              <View className="mt-2 w-[90%] flex-row">
                <Typography className="font-400 w-[20%] text-[16px] text-[#1A1A1A]">
                  {'Name:'}
                </Typography>
                <Typography className="font-400 ml-2 w-[75%] text-[16px] font-bold text-[#1A1A1A]">
                  {facilityDetails.name ? facilityDetails.name : ''}
                </Typography>
              </View>
              <View className="mt-2 w-[90%] flex-row">
                <Typography className="font-400 w-[20%] text-[16px] text-[#1A1A1A]">
                  {'Status:'}
                </Typography>
                {facilityDetails.status && facilityDetails.status.status ? (
                  <Typography
                    className={`ml-2 mr-5 rounded-[5px] px-5 py-1 text-right font-bold ${facilityDetails.status.status.toLowerCase() === 'active' ? "bg-['#27ae60'] text-white" : "bg-['#d5d8dc'] text-black"}`}
                  >
                    {facilityDetails.status.status}
                  </Typography>
                ) : (
                  <View />
                )}
              </View>
              <View className="mt-2 w-[90%] flex-row">
                <Typography className="font-400 w-[60%] text-[16px] text-[#1A1A1A]">
                  {'Is this Pharmacy ?'}
                </Typography>
                <Typography className="font-400 ml-2 w-[30%] text-[16px] font-bold text-[#1A1A1A]">
                  {facilityDetails.ispharmacy ? 'Yes' : 'No'}
                </Typography>
              </View>
            </View>
          </View>

          <View className="border-primary mt-[10px] w-full flex-1 self-center rounded-[10px] border-[1px] p-2">
            <View className=" w-full flex-row items-center">
              <TouchableOpacity
                onPress={() => {
                  setIsShowLocations(!isShowLocations)
                }}
                className="w-[60%] min-w-[60%] flex-row"
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
                  router.replace(
                    formatUrl('/circles/addEditLocation', {
                      memberData: JSON.stringify(memberData),
                      details: JSON.stringify(facilityInfo),
                      component: 'Facility'
                    })
                  )
                }}
              />
            </View>
            {locationList.length > 0 && isShowLocations ? (
              <ScrollView className="">
                {locationList.map((data: any, index: number) => {
                  data.component = 'Facility'
                  data.doctorFacilityId = facilityInfo.id
                  return (
                    <View key={index}>
                      <Location data={data} />
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
                className="w-[55%] min-w-[55%] flex-row"
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
                className=""
                title="Add Appointment"
                variant="default"
                onPress={() => {
                  router.push(
                    formatUrl('/circles/addEditAppointment', {
                      memberData: JSON.stringify(memberData),
                      component: 'Facility'
                    })
                  )
                }}
              />
            </View>
            {appointmentList.length > 0 && isShowAppointments ? (
              <ScrollView className="h-[60%] flex-1">
                {appointmentList.map((data: any, index: number) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        router.replace(
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
                            ? formatTimeToUserLocalTime(data.date)
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
                                    : 'black'
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
          {getUserPermission(facilityPrivileges).deletePermission ? (
            <View className="mx-5 my-5 flex-row self-center">
              <Button
                className="w-[50%]"
                title="Share Facility"
                variant="outline"
                leadingIcon="share-2"
                onPress={() => {
                  setIsShareFacility(true)
                }}
              />
              <Button
                className="ml-5 w-[50%]"
                title="Delete"
                variant="borderRed"
                onPress={() => {
                  Alert.alert(
                    'Are you sure about deleting Facility?',
                    'It cannot be recovered once deleted.',
                    [
                      {
                        text: 'Ok',
                        onPress: () => deleteFacility()
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
      {isShareFacility ? (
        <View className="h-full w-full justify-center self-center">
          <ShareDoctorFacility
            cancelClicked={cancelClicked}
            shareDoctorFacility={shareFacility}
          />
        </View>
      ) : (
        <View />
      )}
    </View>
  )
}
