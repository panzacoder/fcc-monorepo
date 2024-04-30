'use client'

import { useState, useEffect } from 'react'
import { View, Pressable, Alert } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { COLORS } from 'app/utils/colors'
import store from 'app/redux/store'
import { CallPostService } from 'app/utils/fetchServerData'
import { BASE_URL, GET_MEMBER_FACILITIES } from 'app/utils/urlConstants'
import { useParams } from 'solito/navigation'
import { formatUrl } from 'app/utils/format-url'
import { getUserPermission } from 'app/utils/getUserPemissions'
import { useRouter } from 'solito/navigation'
let facilityPrivileges = {}
export function FacilitiesListScreen() {
  const [isLoading, setLoading] = useState(false)
  const [isDataReceived, setIsDataReceived] = useState(false)
  const [facilityList, setFacilityList] = useState([]) as any
  const [facilityListFull, setFacilityListFull] = useState([]) as any
  const [currentFilter, setCurrentFilter] = useState('Active')
  const [isShowFilter, setIsShowFilter] = useState(false)
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
            if (data.data.domainObjectPrivileges) {
              facilityPrivileges = data.data.domainObjectPrivileges.Facility
                ? data.data.domainObjectPrivileges.Facility
                : {}
            }
            let list = data.data.list ? data.data.list : []
            setFacilityList(list)
            setFacilityListFull(list)
            getFilteredList(list, currentFilter)
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
    }
    getFacilityDetails()
  }, [])
  function setFilteredList(filter: any) {
    setIsShowFilter(false)
    setCurrentFilter(filter)
    getFilteredList(facilityListFull, filter)
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
    setFacilityList(filteredList)
  }
  return (
    <View className="flex-1">
      <View className="">
        <PtsLoader loading={isLoading} />
        <View className="flex-row ">
          <Pressable
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
          </Pressable>
          {getUserPermission(facilityPrivileges).createPermission ? (
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
          ) : (
            <View />
          )}
        </View>
      </View>
      {isShowFilter ? (
        <View className="ml-5 w-[40%]">
          <Pressable
            className={`${currentFilter === 'Active' ? 'bg-[#c9e6b1]' : 'bg-white'}`}
            onPress={() => {
              setFilteredList('Active')
            }}
          >
            <Typography className="border-b-[1px] border-l-[1px] border-r-[1px] border-t-[1px] border-gray-400 p-1 text-center font-normal">
              {'Active'}
            </Typography>
          </Pressable>
          <Pressable
            className={`${currentFilter === 'InActive' ? 'bg-[#c9e6b1]' : 'bg-white'}`}
            onPress={() => {
              setFilteredList('InActive')
            }}
          >
            <Typography className="border-b-[1px] border-l-[1px] border-r-[1px] border-gray-400 p-1 text-center font-normal">
              {'InActive'}
            </Typography>
          </Pressable>
          <Pressable
            className={`${currentFilter === 'All' ? 'bg-[#c9e6b1]' : 'bg-white'}`}
            onPress={() => {
              setFilteredList('All')
            }}
          >
            <Typography className="border-b-[1px] border-l-[1px] border-r-[1px] border-gray-400 p-1 text-center font-normal">
              {'All'}
            </Typography>
          </Pressable>
        </View>
      ) : (
        <View />
      )}
      {isDataReceived && facilityList.length === 0 ? (
        <View className="flex-1 items-center justify-center self-center">
          <Typography className="font-bold">{`No ${currentFilter !== 'All' ? currentFilter : ''} facilities`}</Typography>
        </View>
      ) : (
        <View />
      )}
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
            </Pressable>
          )
        })}
      </ScrollView>
    </View>
  )
}
