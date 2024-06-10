'use client'

import { useState, useEffect } from 'react'
import { View, Pressable, Alert } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import store from 'app/redux/store'
import { CallPostService } from 'app/utils/fetchServerData'
import { BASE_URL, GET_MEMBER_DETAILS } from 'app/utils/urlConstants'
import { consoleData } from 'app/ui/utils'
import { CardView } from 'app/ui/cardview'
// import messaging from '@react-native-firebase/messaging'
import { TabsHeader } from 'app/ui/tabs-header'
export function HomeScreen() {
  const header = store.getState().headerState.header
  const user = store.getState().userProfileState.header
  const [isLoading, setLoading] = useState(false)
  const [isDataReceived, setDataReceived] = useState(false)
  const [isShowPDFModal, setIsShowPDFModal] = useState(false)
  const [memberList, setMemberList] = useState([])
  // const requestUserPermission = async () => {
  //   const authStatus = await messaging().requestPermission()
  //   const enabled =
  //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //     authStatus === messaging.AuthorizationStatus.PROVISIONAL
  //
  //   if (enabled) {
  //     console.log('Authorization status:', authStatus)
  //   }
  // }
  useEffect(() => {
    //this below code is giving error as we have installed firebase libraries in the expo directory.

    // if (requestUserPermission()) {
    //   messaging()
    //     .getToken()
    //     .then((token) => console.log('token', token))
    // }
    async function getMemberDetails() {
      setLoading(true)
      let url = `${BASE_URL}${GET_MEMBER_DETAILS}`
      let dataObject = {
        header: header
      }
      CallPostService(url, dataObject)
        .then(async (data: any) => {
          if (data.status === 'SUCCESS') {
            consoleData('getMemberDetails', data.data.memberList)
            setMemberList(data.data.memberList ? data.data.memberList : [])
            setDataReceived(true)
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
  async function helpClicked() {
    // console.log('helpClicked')
    setIsShowPDFModal(true)
  }
  const showPdfModal = () => {
    return (
      <View
        style={{
          backgroundColor: 'white'
        }}
        className="my-2 max-h-[90%] w-[95%] self-center rounded-[15px] border-[1px] border-[#e0deda] "
      >
        <View className="bg-primary h-[50] w-full flex-row rounded-tl-[15px] rounded-tr-[15px]">
          <Typography className=" w-[85%] self-center text-center font-bold text-white">{``}</Typography>
          <View className="mr-[30] flex-row justify-end self-center">
            <Pressable
              className="h-[30px] w-[30px] items-center justify-center rounded-full bg-white"
              onPress={() => {
                setIsShowPDFModal(false)
              }}
            >
              <Feather name={'x'} size={25} className="color-primary" />
            </Pressable>
          </View>
        </View>
      </View>
    )
  }
  return (
    <View className="flex-1">
      <PtsLoader loading={isLoading} />
      <View className="">
        <TabsHeader helpClicked={helpClicked} />
        <View className="flex-row">
          <View>
            <Typography className="font-400 ml-[30] text-[16px]">
              {'Welcome Back,'}
            </Typography>
            <Typography className=" ml-[30] text-[22px] font-bold text-black">
              {user.memberName ? user.memberName : ''}
            </Typography>
          </View>
        </View>
        {isDataReceived ? (
          <View
            className={`border-primary bg-card mx-[10px] mt-[50] h-[80%] w-[94%] self-center rounded-[15px] border-[2px]`}
          >
            <View className="ml-[20] flex-row items-center">
              <View>
                <Typography className="mt-[10] text-[20px] font-bold text-black">
                  {'Your Week'}
                </Typography>
                <Typography className="font-400 text-[16px]">
                  {'6 Appointments, 2 Events'}
                </Typography>
              </View>
              <Pressable className="absolute right-[20]" onPress={() => {}}>
                <Feather name={'settings'} size={20} color={'black'} />
              </Pressable>
            </View>
            <ScrollView persistentScrollbar={true} className="m-2 flex-1">
              {memberList.map((data: any, index: number) => {
                return (
                  <View key={index}>
                    <CardView data={data}></CardView>
                  </View>
                )
              })}
            </ScrollView>
          </View>
        ) : (
          <View />
        )}
      </View>
      {/* {isShowPDFModal ? (
        <View className="absolute top-[50] self-center">{showPdfModal()}</View>
      ) : (
        <View />
      )} */}
    </View>
  )
}
