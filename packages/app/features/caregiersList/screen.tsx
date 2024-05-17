'use client'

import { useState, useEffect, useCallback } from 'react'
import { View, TouchableOpacity, Alert, Pressable } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { COLORS } from 'app/utils/colors'
import store from 'app/redux/store'
import { Button } from 'app/ui/button'
import { CallPostService } from 'app/utils/fetchServerData'
import {
  BASE_URL,
  GET_MEMBER_CAREGIVERS,
  CREATE_CAREGIVER,
  RESEND_CAREGIVER_REQEST
} from 'app/utils/urlConstants'
import { useParams } from 'solito/navigation'
import { AddEditCaregiver } from 'app/ui/addEditCaregiver'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'solito/navigation'
import { getUserPermission } from 'app/utils/getUserPemissions'
import { CaregiverProfileInfo } from 'app/ui/caregiverProfileInfo'
let caregiverPrivileges = {}
export function CaregiversListScreen() {
  const [isLoading, setLoading] = useState(false)
  const [isShowFilter, setIsShowFilter] = useState(false)
  const [isAddCaregiver, setIsAddCaregiver] = useState(false)
  const [isDataReceived, setIsDataReceived] = useState(false)
  const [isShowProfileInfo, setIsShowProfileInfo] = useState(false)
  const [currentFilter, setCurrentFilter] = useState('All')
  const [caregiversList, setCaregiversList] = useState([]) as any
  const [caregiversListFull, setCaregiversListFull] = useState([])
  const header = store.getState().headerState.header
  const item = useParams<any>()
  const router = useRouter()
  let memberData = JSON.parse(item.memberData)
  const getCaregiversList = useCallback(async () => {
    setLoading(true)
    let url = `${BASE_URL}${GET_MEMBER_CAREGIVERS}`
    let dataObject = {
      header: header,
      familyMember: {
        memberId: memberData.member ? memberData.member : ''
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          if (data.data.domainObjectPrivileges) {
            caregiverPrivileges = data.data.domainObjectPrivileges.Caregiver
              ? data.data.domainObjectPrivileges.Caregiver
              : {}
          }
          let list = data.data.familyMemberList
            ? data.data.familyMemberList
            : []
          getFilteredList(list, currentFilter)
          setCaregiversListFull(list)
          setIsDataReceived(true)
        } else {
          Alert.alert('', data.message)
        }
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        console.log('error', error)
      })
  }, [])
  useEffect(() => {
    getCaregiversList()
  }, [])
  function setFilteredList(filter: any) {
    setIsShowFilter(false)
    setCurrentFilter(filter)
    getFilteredList(caregiversListFull, filter)
  }
  async function getFilteredList(list: any, filter: any) {
    let filteredList: any[] = []
    // console.log('filter', filter)
    list.map((data: any, index: any) => {
      if (data.registrationStatus === filter) {
        filteredList.push(data)
      } else if (filter === 'All') {
        filteredList = list
      }
    })
    setCaregiversList(filteredList)
  }
  const cancelClicked = () => {
    setIsAddCaregiver(false)
    setIsShowProfileInfo(false)
  }
  const infoClicked = () => {
    setIsAddCaregiver(false)
    setIsShowProfileInfo(true)
  }
  async function createUpdateCaregiver(object: any) {
    setLoading(true)
    let url = `${BASE_URL}${CREATE_CAREGIVER}`
    let dataObject = {
      header: header,
      familyMember: object
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          getCaregiversList()
          setIsAddCaregiver(false)
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
  async function resendRequest(object: any) {
    setLoading(true)
    let url = `${BASE_URL}${RESEND_CAREGIVER_REQEST}`
    let dataObject = {
      header: header,
      memberVo: {
        id: object.member ? object.member : '',
        familyMemberMemberId: object.id ? object.id : ''
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        Alert.alert('', data.message)
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        console.log('error', error)
      })
  }
  return (
    <View className="flex-1">
      <View className="">
        <PtsLoader loading={isLoading} />
        <View className="flex-row ">
          <TouchableOpacity
            onPress={() => {
              setIsShowFilter(!isShowFilter)
            }}
            className="w-[85%] flex-row"
          >
            <Typography className=" ml-10 mt-7 text-[14px] font-bold text-black">
              {currentFilter}
            </Typography>
            <Feather
              className="ml-2 mt-6"
              name={!isShowFilter ? 'chevron-down' : 'chevron-up'}
              size={25}
              color={'black'}
            />
          </TouchableOpacity>
          {getUserPermission(caregiverPrivileges).createPermission ? (
            <View className=" mt-[20] self-center">
              <TouchableOpacity
                className=" h-[30px] w-[30px] items-center justify-center rounded-[15px] bg-[#c5dbfd]"
                onPress={() => {
                  setIsAddCaregiver(true)
                }}
              >
                <Feather name={'plus'} size={25} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          ) : (
            <View />
          )}
        </View>
        {isShowFilter ? (
          <View className="ml-5 w-[40%]">
            <Pressable
              className={`${currentFilter === 'All' ? 'bg-[#c9e6b1]' : 'bg-white'}`}
              onPress={() => {
                setFilteredList('All')
              }}
            >
              <Typography className="border-b-[1px] border-l-[1px] border-r-[1px] border-t-[1px] border-gray-400 p-1 text-center font-normal">
                {'All'}
              </Typography>
            </Pressable>
            <Pressable
              className={`${currentFilter === 'Accepted' ? 'bg-[#c9e6b1]' : 'bg-white'}`}
              onPress={() => {
                setFilteredList('Accepted')
              }}
            >
              <Typography className="border-b-[1px] border-l-[1px] border-r-[1px] border-gray-400 p-1 text-center font-normal">
                {'Accepted'}
              </Typography>
            </Pressable>
            <Pressable
              className={`${currentFilter === 'Requested' ? 'bg-[#c9e6b1]' : 'bg-white'}`}
              onPress={() => {
                setFilteredList('Requested')
              }}
            >
              <Typography className="border-b-[1px] border-l-[1px] border-r-[1px] border-gray-400 p-1 text-center font-normal">
                {'Requested'}
              </Typography>
            </Pressable>
            <Pressable
              className={`${currentFilter === 'Rejected' ? 'bg-[#c9e6b1]' : 'bg-white'}`}
              onPress={() => {
                setFilteredList('Rejected')
              }}
            >
              <Typography className="border-b-[1px] border-l-[1px] border-r-[1px] border-gray-400 p-1 text-center font-normal">
                {'Rejected'}
              </Typography>
            </Pressable>
            <Pressable
              className={`${currentFilter === 'Not Yet Registered' ? 'bg-[#c9e6b1]' : 'bg-white'}`}
              onPress={() => {
                setFilteredList('Not Yet Registered')
              }}
            >
              <Typography className="border-b-[1px] border-l-[1px] border-r-[1px] border-gray-400 p-1 text-center font-normal">
                {'Not Yet Registered'}
              </Typography>
            </Pressable>
          </View>
        ) : (
          <View />
        )}
      </View>
      <ScrollView className="m-2 mx-5 w-full self-center">
        {caregiversList.map((data: any, index: number) => {
          return (
            <TouchableOpacity
              onPress={() => {
                router.push(
                  formatUrl('/circles/caregiverDetails', {
                    caregiverDetails: JSON.stringify(data),
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
                  {data.role ? data.role : ''}
                </Typography>
              </View>

              <View className=" flex-row">
                <Typography className="font-400 ml-5 w-[65%] text-black">
                  {data.email ? data.email : ''}
                </Typography>
                <View className="self-center text-center">
                  <Typography
                    className={`ml-2 rounded-[20px] px-5 py-1 text-right ${data.memberStatus.toLowerCase() === 'active' ? "bg-['#83D991']" : "bg-['#ffcccb']"}`}
                  >
                    {data.memberStatus ? data.memberStatus : ''}
                  </Typography>
                </View>
              </View>
              {data.phone && data.phone !== '' ? (
                <View className="flex-row">
                  <View className="w-[90%]">
                    <Typography className="ml-5 ">{data.phone}</Typography>
                  </View>
                </View>
              ) : (
                <View />
              )}
              {data.showResendRequest ? (
                <View className="flex-row justify-center">
                  <Button
                    className="bg-[#1a7088]"
                    title={'Resend Request'}
                    variant="default"
                    onPress={() => {
                      resendRequest(data)
                    }}
                  />
                </View>
              ) : (
                <View />
              )}
            </TouchableOpacity>
          )
        })}
        {isDataReceived && caregiversList.length === 0 ? (
          <View className="mt-[50] flex-1 items-center justify-center self-center">
            <Typography className="text-center font-bold">{`No caregivers`}</Typography>
          </View>
        ) : (
          <View />
        )}
      </ScrollView>

      {isAddCaregiver ? (
        <View className="h-full w-full ">
          <AddEditCaregiver
            caregiverDetails={{}}
            cancelClicked={cancelClicked}
            createUpdateCaregiver={createUpdateCaregiver}
            memberData={memberData}
            infoClicked={infoClicked}
          />
        </View>
      ) : (
        <View />
      )}
      {isShowProfileInfo ? (
        <View className="h-full w-full ">
          <CaregiverProfileInfo cancelClicked={cancelClicked} />
        </View>
      ) : (
        <View />
      )}
    </View>
  )
}
