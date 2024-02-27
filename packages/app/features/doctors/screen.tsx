'use client'

import { useState, useEffect } from 'react'
import { View, TouchableOpacity, Alert, ScrollView } from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { COLORS } from 'app/utils/colors'
import store from 'app/redux/store'
import { CallPostService } from 'app/utils/fetchServerData'
import { BASE_URL, GET_MEMBER_DOCTORS } from 'app/utils/urlConstants'
import { useParams } from 'solito/navigation'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'solito/navigation'

export function DoctorsScreen() {
  const [isLoading, setLoading] = useState(false)
  const [doctorList, setDoctorList] = useState([])
  const header = store.getState().headerState.header
  const item = useParams<any>()
  const router = useRouter()
  let memberData = JSON.parse(item.memberData)
  useEffect(() => {
    async function getDoctorDetails() {
      setLoading(true)
      let url = `${BASE_URL}${GET_MEMBER_DOCTORS}`
      let dataObject = {
        header: header,
        doctor: {
          member: {
            id: memberData.member ? memberData.member : ''
          }
        }
      }
      CallPostService(url, dataObject)
        .then(async (data: any) => {
          if (data.status === 'SUCCESS') {
            setDoctorList(data.data.list ? data.data.list : [])
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
    <View className="flex-1  bg-white">
      <View className="">
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
                router.push(
                  formatUrl('/(authenticated)/circles/addEditDoctor', {
                    memberData: JSON.stringify(memberData)
                  })
                )
              }}
            >
              <Feather name={'plus'} size={25} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ScrollView className="m-2 mx-5 w-[95%] self-center">
        {doctorList.map((data: any, index: number) => {
          return (
            <TouchableOpacity
              onPress={() => {
                router.push(
                  formatUrl('/(authenticated)/circles/doctorDetails', {
                    doctorDetails: JSON.stringify(data),
                    memberData: JSON.stringify(memberData)
                  })
                )
              }}
              key={index}
              className="border-primary my-[5px] w-[95%] flex-1 self-center rounded-[15px] border-[2px] bg-white py-2"
            >
              <View className="my-2 flex-row">
                <Typography className="text-primary font-400 ml-5 w-[45%]">
                  {data.doctorName ? data.doctorName : ''}
                </Typography>

                <Typography className="ml-5 mr-5 w-[40%] text-right">
                  {data.specialist ? data.specialist : ''}
                </Typography>
              </View>
              <View className="flex-row">
                <Typography className="ml-5 w-[60%]">
                  {data.locations ? data.locations : ''}
                </Typography>

                <Typography
                  className={
                    data.status.toLowerCase() === 'active'
                      ? "ml-5 mr-5 rounded-[20px] bg-['#83D991'] px-5 text-right"
                      : "ml-5 mr-5 rounded-[20px] bg-['#ffcccb'] px-5 text-right"
                  }
                >
                  {data.status ? data.status : ''}
                </Typography>
              </View>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )
}
