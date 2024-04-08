'use client'

import { useState, useEffect } from 'react'
import { View, Pressable, Alert, ScrollView } from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { COLORS } from 'app/utils/colors'
import store from 'app/redux/store'
import { CallPostService } from 'app/utils/fetchServerData'
import { BASE_URL, GET_MEMBER_FACILITIES } from 'app/utils/urlConstants'
import { useParams } from 'solito/navigation'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'solito/navigation'

export function FacilitiesListScreen() {
  const [isLoading, setLoading] = useState(false)
  const [facilityList, setfacilityList] = useState([])
  const header = store.getState().headerState.header
  const item = useParams<any>()
  const router = useRouter()
  let memberData = JSON.parse(item.memberData)
  useEffect(() => {
    async function getFacilityDetails() {
      setLoading(true)
      let url = `${BASE_URL}${GET_MEMBER_FACILITIES}`
      let dataObject = {
        header: header,
        facility: {
          member: {
            id: memberData.member ? memberData.member : ''
          }
        }
      }
      CallPostService(url, dataObject)
        .then(async (data: any) => {
          if (data.status === 'SUCCESS') {
            setfacilityList(data.data.list ? data.data.list : [])
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
    getFacilityDetails()
  }, [])

  return (
    <View className="flex-1">
      <View className="">
        <PtsLoader loading={isLoading} />
        <View className="flex-row ">
          <Pressable className="w-[85%] flex-row">
            <Typography className=" ml-10 mt-7 text-[14px] font-bold text-black">
              {'Filter'}
            </Typography>

            <Feather
              className="ml-2 mt-6"
              name={'chevron-down'}
              size={25}
              color={'black'}
            />
          </Pressable>
          <View className=" mt-[20] self-center">
            <Pressable
              className=" h-[30px] w-[30px] items-center justify-center rounded-[15px] bg-[#c5dbfd]"
              onPress={() => {
                router.push(
                  formatUrl('/circles/addEditFacility', {
                    memberData: JSON.stringify(memberData)
                  })
                )
              }}
            >
              <Feather name={'plus'} size={25} color={COLORS.primary} />
            </Pressable>
          </View>
        </View>
      </View>
      <ScrollView className="m-2 w-full self-center">
        {facilityList.map((data: any, index: number) => {
          return (
            <Pressable
              onPress={() => {
                router.push(
                  formatUrl('/circles/facilityDetails', {
                    facilityDetails: JSON.stringify(data),
                    memberData: JSON.stringify(memberData)
                  })
                )
              }}
              key={index}
              className="border-primary my-[5px] w-full flex-1 self-center rounded-[15px] border-[2px] bg-white py-2"
            >
              <View className="my-2 flex-row">
                <Typography className="text-primary font-400 ml-5 w-[45%]">
                  {data.name ? data.name : ''}
                </Typography>

                <Typography className="ml-5 mr-5 w-[40%] text-right">
                  {data.type ? data.type : ''}
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
            </Pressable>
          )
        })}
      </ScrollView>
    </View>
  )
}
