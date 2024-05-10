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
  REJECT_SHARED_INFO,
  REJECT_MEMBER_REQUEST,
  ACCEPT_MEMBER_REQUEST
} from 'app/utils/urlConstants'
import { useRouter } from 'solito/navigation'
import { SharedContactList } from 'app/ui/sharedContactList'
import { NewCirclesList } from 'app/ui/newCirclesList'
import { PrivacyPolicy } from 'app/ui/privacyPolicy'

export function CirclesListScreen() {
  const router = useRouter()
  const header = store.getState().headerState.header
  const [isLoading, setLoading] = useState(false)
  const [isShowSharedContacts, setIsShowSharedContacts] = useState(false)
  const [isShowNewCircles, setIsShowNewCircles] = useState(false)
  const [isShowPrivacyPolicy, setIsShowPrivacyPolicy] = useState(false)
  const [roleUid, setRoleUid] = useState('')
  const [requestData, setRequestData] = useState({})
  const [isHideCirclesView, setIsHideCirclesView] = useState(false)

  const [memberList, setMemberList] = useState([]) as any
  const [sharedContactsList, setSharedContactsList] = useState([])
  const [newCirclesList, setNewCirclesList] = useState([])
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
          console.log(
            'data.data.memberList',
            JSON.stringify(data.data.memberList)
          )
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
  async function acceptNewRequest(data: any) {
    acceptRejectMemberRequest(data, true)
  }
  async function acceptRejectClickedNewCircles(data: any, isAccept: any) {
    // console.log('acceptRejectClickedNewCircles')
    if (isAccept) {
      setIsShowNewCircles(false)
      setRequestData(data)
      setIsShowPrivacyPolicy(true)
    } else {
      acceptRejectMemberRequest(data, false)
    }
  }
  async function acceptRejectMemberRequest(data: any, isAccept: any) {
    setLoading(true)
    let url = ''
    url = isAccept
      ? `${BASE_URL}${ACCEPT_MEMBER_REQUEST}`
      : `${BASE_URL}${REJECT_MEMBER_REQUEST}`
    let dataObject = {
      header: header,
      memberVo: {
        familyMemberMemberId: data.id ? data.id : '',
        isActive: false
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          getMemberDetails()
        }
        setIsHideCirclesView(false)
        setIsShowNewCircles(false)
        setIsShowPrivacyPolicy(false)
        Alert.alert('', data.message)
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }
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
    setIsShowNewCircles(false)
    setIsShowPrivacyPolicy(false)
  }
  const hideCirclesView = (isHide: any, index: any, isSharedContact: any) => {
    if (isSharedContact) {
      let list = memberList[index].sharingInfoRequests
        ? memberList[index].sharingInfoRequests
        : []
      setSharedContactsList(list)
      setIsShowSharedContacts(true)
    } else {
      let list = memberList[index].requestsForMember
        ? memberList[index].requestsForMember
        : []
      setNewCirclesList(list)
      setRoleUid(memberList[index].roleuid)
      setIsShowNewCircles(true)
    }
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
      {isShowNewCircles ? (
        <View className="w-full ">
          <NewCirclesList
            cancelClicked={cancelClicked}
            newCirclesList={newCirclesList}
            acceptRejectClicked={acceptRejectClickedNewCircles}
            roleUid={roleUid}
          />
        </View>
      ) : (
        <View />
      )}
      {isShowPrivacyPolicy ? (
        <View className="w-full ">
          <PrivacyPolicy
            cancelClicked={cancelClicked}
            acceptClicked={acceptNewRequest}
            data={requestData}
          />
        </View>
      ) : (
        <View />
      )}
    </View>
  )
}
