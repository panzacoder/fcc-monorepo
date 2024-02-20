'use client'

import { useState, useEffect } from 'react'
import { View, Image, TouchableOpacity, Alert, ScrollView } from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import { Feather } from 'app/ui/icons'
import { COLORS } from 'app/utils/colors'
import store from 'app/redux/store'
import { CallPostService } from 'app/utils/fetchServerData'
import { consoleData, getFullDateForCalender } from 'app/ui/utils'
import { BASE_URL, GET_DOCTOR_DETAILS } from 'app/utils/urlConstants'
import { useParams } from 'solito/navigation'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'solito/navigation'
import { getAddressFromObject } from 'app/ui/utils'
import { Button } from 'app/ui/button'

export function DoctorDetailsScreen() {
  const header = store.getState().headerState.header
  const userDetails = store.getState().userProfileState.header
  const item = useParams<any>()
  const router = useRouter()
  let doctorInfo = JSON.parse(item.doctorDetails)
  // console.log('doctorDetails', '' + JSON.stringify(doctorDetails))
  const [isLoading, setLoading] = useState(false)
  const [doctorDetails, setDoctorDetails] = useState({})
  const [locationList, setLocationList] = useState([])
  const [appointmentList, setAppointmentList] = useState([])
  useEffect(() => {
    async function getDoctorDetails() {
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
            setDoctorDetails(data.data.doctor ? data.data.doctor : {})
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
    getDoctorDetails()
  }, [])
  return (
    <View className="flex-1 bg-white">
      <PtsLoader loading={isLoading} />
      <Image
        source={require('app/assets/header.png')}
        className="abosolute top-[-40]"
        resizeMode={'contain'}
        alt="logo"
      />

      <View className="absolute top-[0] h-full w-full flex-1 py-2 ">
        <PtsBackHeader
          title={doctorInfo.doctorName ? doctorInfo.doctorName : ''}
        />
        <ScrollView persistentScrollbar={true} className="flex-1">
          <View className="border-primary mt-[40] w-[90%] flex-1 self-center rounded-[10px] border-[1px] p-5">
            <View className=" w-full flex-row items-center">
              <View className="w-[80%] flex-row">
                <Typography className="font-400 text-[16px] text-[#86939e]">
                  {doctorInfo.specialist ? doctorInfo.specialist : ''}
                </Typography>
                <View className="ml-2 h-[25] w-[2px] bg-[#86939e]" />
                <Typography className="font-400 text-primary ml-2 text-[16px]">
                  {doctorInfo.status ? doctorInfo.status : ''}
                </Typography>
              </View>
              <Button
                className=""
                title="Edit"
                variant="border"
                onPress={() => {}}
              />
            </View>
            <View>
              <View className="mt-5 flex-row items-center">
                <Typography className="font-400 w-[25%] text-[12px] text-[#1A1A1A]">
                  {'Contact Info'}
                </Typography>
                <View className="bg-primary  ml-2 h-[1px] w-[75%]" />
              </View>
              <View className="mt-2 flex-row items-center">
                <View className="w-[90%] flex-row">
                  <Typography className="font-400 w-[20%] text-[16px] text-[#1A1A1A]">
                    {'Phone:'}
                  </Typography>
                  <Typography className="font-400 ml-2 w-[75%] text-[16px] font-bold text-[#1A1A1A]">
                    {doctorDetails.phone ? doctorDetails.phone : ''}
                  </Typography>
                </View>
                <Feather name={'phone'} size={20} color={'black'} />
              </View>
              <View className="mt-2 flex-row items-center">
                <View className="w-[90%] flex-row">
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
                <Typography className="font-400 w-[25%] text-[12px] text-[#1A1A1A]">
                  {'Portal details'}
                </Typography>
                <View className="bg-primary  ml-2 h-[1px] w-[75%]" />
              </View>
              <View className="mt-2 flex-row items-center">
                <View className="w-[90%] flex-row">
                  <Typography className="font-400 w-[30%] text-[16px] text-[#1A1A1A]">
                    {'Username:'}
                  </Typography>
                  <Typography className="font-400 ml-2 w-[65%] text-[16px] font-bold text-[#1A1A1A]">
                    {doctorDetails.websiteuser ? doctorDetails.websiteuser : ''}
                  </Typography>
                </View>
                <Feather name={'copy'} size={20} color={'black'} />
              </View>
              <View className="mt-2 flex-row items-center">
                <View className="w-[90%] flex-row">
                  <Typography className="font-400 w-[30%] text-[16px] text-[#1A1A1A]">
                    {'Website:'}
                  </Typography>
                  <Typography className="font-400 ml-2 w-[65%] text-[16px] font-bold text-[#1A1A1A]">
                    {doctorDetails.website ? doctorDetails.website : ''}
                  </Typography>
                </View>
                <Feather name={'external-link'} size={20} color={'black'} />
              </View>
            </View>
          </View>

          <View className="border-primary mt-[40] w-[90%] flex-1 self-center rounded-[10px] border-[1px] p-5">
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
                onPress={() => {}}
              />
            </View>
            <ScrollView className="">
              {locationList.map((data: any, index: number) => {
                return (
                  <View key={index}>
                    <View className="mt-5 flex-row items-center">
                      <View className=" flex-row">
                        <Typography className="font-400 mr-2 text-[12px] text-[#1A1A1A]">
                          {data.nickName ? data.nickName : ''}
                        </Typography>
                        <Feather
                          onPress={() => {}}
                          name={'settings'}
                          size={15}
                          color={'black'}
                        />
                      </View>
                      <View className="bg-primary  ml-2 h-[1px] w-full" />
                    </View>
                    <View className="mt-2 flex-row items-center">
                      <View className="w-[90%] flex-row">
                        <Typography className="font-400 ml-2 w-[80%] text-[16px] text-[#1A1A1A]">
                          {getAddressFromObject(
                            data.address ? data.address : {}
                          )}
                        </Typography>
                      </View>
                      <Feather name={'navigation'} size={20} color={'black'} />
                    </View>
                    <View className="ml-2 mt-2 flex-row items-center">
                      <View className="w-[90%] flex-row">
                        <Typography className="font-400 w-[20%] text-[16px] text-[#1A1A1A]">
                          {'Phone:'}
                        </Typography>
                        <Typography className="font-400 ml-2 w-[75%] text-[16px] font-bold text-[#1A1A1A]">
                          {data.phone ? data.phone : ''}
                        </Typography>
                      </View>
                      <Feather name={'phone'} size={20} color={'black'} />
                    </View>
                    <View className="ml-2 mt-2 flex-row items-center">
                      <View className="w-[90%] flex-row">
                        <Typography className="font-400 w-[20%] text-[16px] text-[#1A1A1A]">
                          {'Fax:'}
                        </Typography>
                        <Typography className="font-400 ml-2 w-[75%] text-[16px] font-bold text-[#1A1A1A]">
                          {data.fax ? data.fax : ''}
                        </Typography>
                      </View>
                      <Feather name={'copy'} size={20} color={'black'} />
                    </View>
                  </View>
                )
              })}
            </ScrollView>
          </View>

          <View className="border-primary mt-[40] w-[90%] flex-1 self-center rounded-[10px] border-[1px] p-5">
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
            <ScrollView className="h-[60%] flex-1">
              {appointmentList.map((data: any, index: number) => {
                return (
                  <View key={index}>
                    <View className="ml-2 mt-2 flex-row ">
                      <View className="ml-2 w-[2px] bg-[#184E4E]" />
                      <View className="w-[90%]">
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
                          <Typography className="font-400 w-[65%] text-[12px] text-[#103264]">
                            {data.appointment ? data.appointment : ''}
                          </Typography>
                        </View>
                      </View>
                    </View>
                  </View>
                )
              })}
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </View>
  )
}
