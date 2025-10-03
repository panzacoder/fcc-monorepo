'use client'

import { useState, useEffect, useCallback } from 'react'
import { View, Alert, TouchableOpacity } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import PtsLoader from 'app/ui/PtsLoader'
import { CircleCard } from 'app/ui/circleCard'
import { Feather } from 'app/ui/icons'
import store from 'app/redux/store'
import { Typography } from 'app/ui/typography'
import { Button } from 'app/ui/button'
import { convertTimeToUserLocalTime } from 'app/ui/utils'
import { CallPostService } from 'app/utils/fetchServerData'
import {
  BASE_URL,
  GET_MEMBER_DETAILS,
  ACCEPT_SHARED_INFO,
  REJECT_SHARED_INFO,
  REJECT_MEMBER_REQUEST,
  ACCEPT_MEMBER_REQUEST,
  GET_TRANSPORTATION_REQUESTS,
  EVENT_ACCEPT_TRANSPORTATION_REQUEST,
  APPROVE_TRANSPORT,
  EVENT_REJECT_TRANSPORTATION_REQUEST,
  REJECT_TRANSPORT
} from 'app/utils/urlConstants'
import { useRouter } from 'expo-router'
import { SharedContactList } from 'app/ui/sharedContactList'
import { NewCirclesList } from 'app/ui/newCirclesList'
import memberNamesAction from 'app/redux/memberNames/memberNamesAction'
import { PrivacyPolicy } from 'app/ui/privacyPolicy'
import { useForm } from 'react-hook-form'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import currentMemberAddressAction from 'app/redux/curenMemberAddress/currentMemberAddressAction'
const schema = z.object({
  rejectReason: z.string().min(1, { message: 'Enter reject reason' })
})
export type Schema = z.infer<typeof schema>
export function CirclesListScreen() {
  const router = useRouter()
  let memberNamesList: any = store.getState().memberNames.memberNamesList
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
  const [transportRequestData, setTransportRequestData] = useState({}) as any
  const [isRejectTransportRequest, setIsRejectTransportRequest] =
    useState(false)
  const [newCirclesList, setNewCirclesList] = useState([])
  const [isDataReceived, setDataReceived] = useState(true)
  const [transportationList, setTransportationList] = useState([])
  const [transportMemberName, setTransportMemberName] = useState('')
  const [isShowTransportationRequests, setIsShowTransportationRequests] =
    useState(false)
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      rejectReason: ''
    },
    resolver: zodResolver(schema)
  })
  const getMemberDetails = useCallback(async () => {
    let url = `${BASE_URL}${GET_MEMBER_DETAILS}`
    let dataObject = {
      header: header
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          let memberList = data.data.memberList ? data.data.memberList : []
          setMemberList(memberList)
          memberList.map((data: any) => {
            let fullName = data.firstname.trim() + ' ' + data.lastname.trim()
            if (memberNamesList.includes(fullName) === false) {
              memberNamesList.push(fullName)
            }
          })
          store.dispatch(memberNamesAction.setMemberNames(memberNamesList))
          setDataReceived(true)
        } else {
          Alert.alert('', data.message)
          setDataReceived(true)
        }
      })
      .catch((error) => {
        console.log(error)
        setDataReceived(true)
      })
  }, [])
  useEffect(() => {
    getMemberDetails()
    store.dispatch(currentMemberAddressAction.setMemberAddress({}))
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
  async function trasportationClicked(memberData: any) {
    // console.log('trasportationClicked', JSON.stringify(memberData))
    let fullName = ''
    if (memberData.firstname) {
      fullName += memberData.firstname.trim() + ' '
    }
    if (memberData.lastname) {
      fullName += memberData.lastname.trim()
    }
    setTransportMemberName(fullName)
    setLoading(true)
    let url = `${BASE_URL}${GET_TRANSPORTATION_REQUESTS}`
    let dataObject = {
      header: header,
      member: {
        id: memberData.member ? memberData.member : ''
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          setTransportationList(data.data ? data.data : [])
          setIsShowTransportationRequests(true)
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
  const hideCirclesView = (
    isHide: any,
    index: any,
    isSharedContact: any,
    isShowTransportRequests: any
  ) => {
    if (isShowTransportRequests) {
      let memberData = memberList[index]
      trasportationClicked(memberData)
    } else if (isSharedContact) {
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
  async function approveRejectTrasportRequest(transportData: any) {
    setLoading(true)
    let url = ''
    if (transportData.type === 'Event') {
      url = `${BASE_URL}${EVENT_ACCEPT_TRANSPORTATION_REQUEST}`
    } else {
      url = `${BASE_URL}${APPROVE_TRANSPORT}`
    }
    let dataObject = {
      header: header,
      transportationVo: {
        id: transportData.id ? transportData.id : '',
        reason: '',
        isApprove: true
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          setIsShowTransportationRequests(false)
          setIsHideCirclesView(false)
          getMemberDetails()
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
  async function rejectRequest(formData: Schema) {
    setLoading(true)
    let url = ''
    if (transportRequestData.type === 'Event') {
      url = `${BASE_URL}${EVENT_REJECT_TRANSPORTATION_REQUEST}`
    } else {
      url = `${BASE_URL}${REJECT_TRANSPORT}`
    }
    let dataObject = {
      header: header,
      transportationVo: {
        id: transportRequestData.id ? transportRequestData.id : '',
        reason: formData.rejectReason,
        isApprove: false
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          setIsRejectTransportRequest(false)
          setIsShowTransportationRequests(false)
          setIsHideCirclesView(false)
          getMemberDetails()
        } else {
          Alert.alert('', data.message)
          setLoading(false)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }
  const showRequestModal = () => {
    return (
      <View className="my-2 max-h-[90%] w-full self-center rounded-[15px] border-[1px] border-[#e0deda] bg-white ">
        <View className="bg-primary h-[50] w-full flex-row rounded-tl-[15px] rounded-tr-[15px]">
          <Typography className=" w-[85%] self-center text-center font-bold text-white">{`Transportation Requests`}</Typography>
          <View className="mr-[30] flex-row justify-end self-center">
            <TouchableOpacity
              className="h-[30px] w-[30px] items-center justify-center rounded-full bg-white"
              onPress={() => {
                setIsShowTransportationRequests(false)
                setIsHideCirclesView(false)
              }}
            >
              <Feather name={'x'} size={25} className="color-primary" />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView className="">
          {transportationList.map((data: any, index: number) => {
            return (
              <View className="p-2" key={index}>
                <Typography className="font-400 ml-2">
                  {data.type ? data.type + ':' : ''}
                </Typography>
                <Typography className="ml-2 w-full">
                  <Typography className="font-bold">
                    {data.createdbyname ? data.createdbyname : ''}
                  </Typography>
                  <Typography>{' has requested you to accompany '}</Typography>
                  <Typography className="font-bold">
                    {transportMemberName}
                  </Typography>
                  <Typography>{' while visiting '}</Typography>
                  <Typography className="text-primary font-bold">
                    {`${data.name ? data.name : ''}${data.location ? ' - ' + data.location : ''}`}
                  </Typography>
                  <Typography>{' on '}</Typography>
                  <Typography className="text-primary font-bold">
                    {`${data.date ? convertTimeToUserLocalTime(data.date) : ''}`}
                  </Typography>
                </Typography>
                <View className="my-2 flex-row justify-center">
                  <Button
                    className="bg-[#5ACC6C]"
                    title={'Accept'}
                    variant="default"
                    onPress={() => {
                      approveRejectTrasportRequest(data)
                    }}
                  />
                  <Button
                    className="ml-5 bg-[#c43416]"
                    title={'Reject'}
                    variant="default"
                    onPress={() => {
                      // approveRejectTrasportRequest(data, false)
                      setTransportRequestData(data)
                      setIsRejectTransportRequest(true)
                      setIsShowTransportationRequests(false)
                    }}
                  />
                </View>
              </View>
            )
          })}
        </ScrollView>
      </View>
    )
  }
  const shwoRejectModal = () => {
    return (
      <View className="my-2 max-h-[90%] w-full self-center rounded-[15px] border-[1px] border-[#e0deda] bg-white ">
        <View className="bg-primary h-[50] w-full flex-row rounded-tl-[15px] rounded-tr-[15px]">
          <Typography className=" w-[85%] self-center text-center font-bold text-white">{``}</Typography>
          <View className="mr-[30] flex-row justify-end self-center">
            <TouchableOpacity
              className="h-[30px] w-[30px] items-center justify-center rounded-full bg-white"
              onPress={() => {
                setIsRejectTransportRequest(false)
                setIsHideCirclesView(false)
              }}
            >
              <Feather name={'x'} size={25} className="color-primary" />
            </TouchableOpacity>
          </View>
        </View>
        <View className="my-2 w-[95%] self-center">
          <ControlledTextField
            control={control}
            name="rejectReason"
            placeholder={'Reject reason'}
            className=" bg-white"
            autoCapitalize="none"
          />
        </View>
        <View className="my-2 flex-row justify-center">
          <Button
            className="bg-[#5ACC6C]"
            title={'Reject'}
            variant="default"
            onPress={handleSubmit(rejectRequest)}
          />
          <Button
            className="ml-5 bg-[#c43416]"
            title={'Cancel'}
            variant="default"
            onPress={() => {
              setIsRejectTransportRequest(false)
              setIsHideCirclesView(false)
            }}
          />
        </View>
      </View>
    )
  }
  return (
    <View className="flex-1">
      <PtsLoader loading={isLoading} />
      <View className="z-50 mr-[30] mt-[30] flex-row justify-end">
        <TouchableOpacity
          className="h-[30px] w-[30px] items-center justify-center rounded-full bg-blue-100"
          onPress={() => {
            router.push('/circles/create')
          }}
        >
          <Feather name={'plus'} size={25} className="color-primary" />
        </TouchableOpacity>

      </View>
      {isDataReceived && !isHideCirclesView ? (
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
            address={{}}
            cancelClicked={cancelClicked}
            acceptClicked={acceptNewRequest}
            data={requestData}
            component={'Circles'}
          />
        </View>
      ) : (
        <View />
      )}
      {isShowTransportationRequests ? (
        <View className="absolute top-[100] h-[75%] w-[95%] self-center">
          {showRequestModal()}
        </View>
      ) : (
        <View />
      )}
      {isRejectTransportRequest ? (
        <View className="absolute top-[100] h-[75%] w-[95%] self-center">
          {shwoRejectModal()}
        </View>
      ) : (
        <View />
      )}
    </View>
  )
}
