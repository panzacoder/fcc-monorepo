'use client'

import { useState, useEffect, useCallback } from 'react'
import { View, Alert, Pressable } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import PtsLoader from 'app/ui/PtsLoader'
import { CircleCard } from 'app/ui/circleCard'
import { Feather } from 'app/ui/icons'
import store from 'app/redux/store'
import { CallPostService } from 'app/utils/fetchServerData'
import {
  BASE_URL,
  GET_MEMBER_DETAILS,
  ACCEPT_SHARED_INFO,
  REJECT_SHARED_INFO
} from 'app/utils/urlConstants'
import { useRouter } from 'solito/navigation'
import { SharedContactList } from 'app/ui/sharedContactList'

export function CirclesListScreen() {
  const router = useRouter()
  const header = store.getState().headerState.header
  const [isLoading, setLoading] = useState(false)
  const [isShowSharedContacts, setIsShowSharedContacts] = useState(false)
  const [isHideCirclesView, setIsHideCirclesView] = useState(false)

  const [memberList, setMemberList] = useState([]) as any
  const [sharedContactsList, setSharedContactsList] = useState([])
  const getMemberDetails = useCallback(async () => {
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
  }, [])
  useEffect(() => {
    getMemberDetails()
  }, [])
  async function acceptRejectClicked(data: any, isAccept: any) {
    setLoading(true)
    let url = ''
    url = isAccept
      ? `${BASE_URL}${ACCEPT_SHARED_INFO}`
      : `${BASE_URL}${REJECT_SHARED_INFO}`
    let dataObject = {
      header: header,
      doctorSharingInfo: {
        id: data.id ? data.id : ''
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setIsHideCirclesView(false)
        setIsShowSharedContacts(false)
        Alert.alert('', data.message)
        setLoading(false)
        if (data.status === 'SUCCESS') {
          getMemberDetails()
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }
  const cancelClicked = () => {
    setIsHideCirclesView(false)
    setIsShowSharedContacts(false)
  }
  const hideCirclesView = (isHide: any, index: any) => {
    let list = memberList[index].sharingInfoRequests
      ? memberList[index].sharingInfoRequests
      : []
    setSharedContactsList(list)
    setIsShowSharedContacts(true)
    setIsHideCirclesView(isHide)
  }

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
      {!isHideCirclesView ? (
        <ScrollView className="z-10">
          {memberList.map((data: any, index: number) => {
            return (
              <View key={index}>
                {/* <CircleCard data={data} refreshPage={refreshPage}></CircleCard> */}
                <CircleCard
                  data={data}
                  index={index}
                  hideCirclesView={hideCirclesView}
                ></CircleCard>
              </View>
            )
          })}
        </ScrollView>
      ) : (
        <View />
      )}

      {isShowSharedContacts ? (
        <View className="w-full ">
          <SharedContactList
            cancelClicked={cancelClicked}
            sharedContactsList={sharedContactsList}
            acceptRejectClicked={acceptRejectClicked}
          />
        </View>
      ) : (
        <View />
      )}
    </View>
  )
}
