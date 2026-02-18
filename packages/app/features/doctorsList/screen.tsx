'use client'

import { useState, useEffect } from 'react'
import { View, TouchableOpacity, Alert } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import PtsLoader from 'app/ui/PtsLoader'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { COLORS } from 'app/utils/colors'
import store from 'app/redux/store'
import { CallPostService } from 'app/utils/fetchServerData'
import { BASE_URL, GET_MEMBER_DOCTORS } from 'app/utils/urlConstants'
import { useLocalSearchParams } from 'expo-router'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'expo-router'
import { logger } from 'app/utils/logger'
import { getUserPermission } from 'app/utils/getUserPemissions'
let doctorPrivileges = {}
export function DoctorsListScreen() {
  const [isLoading, setLoading] = useState(false)
  const [isDataReceived, setIsDataReceived] = useState(false)
  const [doctorList, setDoctorList] = useState([]) as any
  const [doctorListFull, setDoctorListFull] = useState([]) as any
  const [currentFilter, setCurrentFilter] = useState('Active')
  const [isShowFilter, setIsShowFilter] = useState(false)
  const header = store.getState().headerState.header
  const item = useLocalSearchParams<any>()
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
            if (data.data.domainObjectPrivileges) {
              doctorPrivileges = data.data.domainObjectPrivileges.Doctor
                ? data.data.domainObjectPrivileges.Doctor
                : {}
            }
            let list = data.data.list ? data.data.list : []
            setDoctorList(list)
            setDoctorListFull(list)
            getFilteredList(list, currentFilter)
            setIsDataReceived(true)
          } else {
            Alert.alert('', data.message)
          }
          setLoading(false)
        })
        .catch((error) => {
          setLoading(false)
          logger.debug('error', error)
        })
    }
    getDoctorDetails()
  }, [])
  function setFilteredList(filter: any) {
    setIsShowFilter(false)
    setCurrentFilter(filter)
    getFilteredList(doctorListFull, filter)
  }
  async function getFilteredList(list: any, filter: any) {
    let filteredList: any[] = []
    list.map((data: any, index: any) => {
      let type = data.type && data.type.type ? data.type.type : ''
      if (filter === 'All') {
        filteredList = list
      } else if (filter === data.status) {
        filteredList.push(data)
      }
    })
    setDoctorList(filteredList)
  }
  return (
    <View className="flex-1">
      <View className="">
        <PtsLoader loading={isLoading} />
        <PtsBackHeader title="Doctors" memberData={memberData} />
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
          {getUserPermission(doctorPrivileges).createPermission ? (
            <View className=" mt-[20] self-center">
              <TouchableOpacity
                className=" h-[30px] w-[30px] items-center justify-center rounded-[15px] bg-[#c5dbfd]"
                onPress={() => {
                  router.push(
                    formatUrl('/circles/addEditDoctor', {
                      memberData: JSON.stringify(memberData)
                    })
                  )
                }}
              >
                <Feather name={'plus'} size={25} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          ) : (
            <View />
          )}
        </View>
      </View>
      {isShowFilter ? (
        <View className="ml-5 w-[40%]">
          <TouchableOpacity
            className={`${currentFilter === 'Active' ? 'bg-[#c9e6b1]' : 'bg-white'}`}
            onPress={() => {
              setFilteredList('Active')
            }}
          >
            <Typography className="border-b-[1px] border-l-[1px] border-r-[1px] border-t-[1px] border-gray-400 p-1 text-center font-normal">
              {'Active'}
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            className={`${currentFilter === 'InActive' ? 'bg-[#c9e6b1]' : 'bg-white'}`}
            onPress={() => {
              setFilteredList('InActive')
            }}
          >
            <Typography className="border-b-[1px] border-l-[1px] border-r-[1px] border-gray-400 p-1 text-center font-normal">
              {'InActive'}
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            className={`${currentFilter === 'All' ? 'bg-[#c9e6b1]' : 'bg-white'}`}
            onPress={() => {
              setFilteredList('All')
            }}
          >
            <Typography className="border-b-[1px] border-l-[1px] border-r-[1px] border-gray-400 p-1 text-center font-normal">
              {'All'}
            </Typography>
          </TouchableOpacity>
        </View>
      ) : (
        <View />
      )}
      {isDataReceived && doctorList.length === 0 ? (
        <View className="flex-1 items-center justify-center self-center">
          <Typography className="font-bold">{`No ${currentFilter !== 'All' ? currentFilter : ''} doctors`}</Typography>
        </View>
      ) : (
        <View />
      )}
      {isDataReceived ? (
        <ScrollView className="m-2 mx-5 w-full self-center">
          {doctorList.map((data: any, index: number) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  router.push(
                    formatUrl('/circles/doctorDetails', {
                      doctorDetails: JSON.stringify(data),
                      memberData: JSON.stringify(memberData)
                    })
                  )
                }}
                key={index}
                className="border-primary my-[5px] w-full flex-1 self-center rounded-[15px] border-[2px] bg-white py-2"
              >
                <View className="w-[95%] flex-row">
                  <View>
                    <View className="my-2 flex-row">
                      <Typography className="text-primary font-400 ml-5 w-[45%]">
                        {data.doctorName ? data.doctorName : ''}
                      </Typography>

                      <Typography className="ml-5 mr-5 w-[40%] text-right">
                        {data.specialist ? data.specialist : ''}
                      </Typography>
                    </View>
                    <View className="flex-row">
                      <View className="w-[70%]">
                        <Typography className="ml-5 ">
                          {data.locations ? data.locations : ''}
                        </Typography>
                      </View>
                      <View className="self-center text-center">
                        <Typography
                          className={`ml-2 rounded-[20px] px-5 py-1 text-right ${data.status.toLowerCase() === 'active' ? "bg-['#83D991']" : "bg-['#ffcccb']"}`}
                        >
                          {data.status ? data.status : ''}
                        </Typography>
                      </View>
                    </View>
                  </View>
                  <View className=" ml-[-10] self-center">
                    <Feather name={'chevron-right'} size={20} color={'black'} />
                  </View>
                </View>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      ) : (
        <View />
      )}
    </View>
  )
}
