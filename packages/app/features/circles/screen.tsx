'use client'

import { useState, useEffect } from 'react'
import { View, Alert, Pressable } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import PtsLoader from 'app/ui/PtsLoader'
import { CircleCard } from 'app/ui/circle-card'
import { Feather } from 'app/ui/icons'
import store from 'app/redux/store'
import { CallPostService } from 'app/utils/fetchServerData'
import { BASE_URL, GET_MEMBER_DETAILS } from 'app/utils/urlConstants'
import { useRouter } from 'solito/navigation'

export function CirclesListScreen() {
  const header = store.getState().headerState.header
  const [isLoading, setLoading] = useState(false)

  const [memberList, setMemberList] = useState([])
  useEffect(() => {
    async function getMemberDetails() {
      setLoading(true)
      let url = `${BASE_URL}${GET_MEMBER_DETAILS}`
      let dataObject = {
        header: header
      }
      CallPostService(url, dataObject)
        .then(async (data: any) => {
          if (data.status === 'SUCCESS') {
            setMemberList(data.data.memberList ? data.data.memberList : [])
          } else {
            Alert.alert('', data.message)
          }
          setLoading(false)
        })
        .catch((error) => {
          setLoading(false)
          console.log(error)
        })
    }
    getMemberDetails()
  }, [])

  const router = useRouter()

  return (
    <View className="flex-1">
      <PtsLoader loading={isLoading} />
      <View className="z-50 mr-[30] mt-[30] flex-row justify-end">
        <Pressable
          className="h-[30px] w-[30px] items-center justify-center rounded-full bg-blue-100"
          onPress={() => {
            router.push('/circles/create')
          }}
        >
          <Feather name={'plus'} size={25} className="color-primary" />
        </Pressable>
      </View>
      <ScrollView className="z-10">
        {memberList.map((data: any, index: number) => {
          return (
            <View key={index}>
              <CircleCard data={data}></CircleCard>
            </View>
          )
        })}
      </ScrollView>
    </View>
  )
}
