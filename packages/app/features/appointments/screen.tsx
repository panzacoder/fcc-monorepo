'use client'

import { useState, useEffect } from 'react'
import { View, Alert, ScrollView, Pressable } from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { COLORS } from 'app/utils/colors'
import moment from 'moment'
import store from 'app/redux/store'
import { CallPostService } from 'app/utils/fetchServerData'
import { BASE_URL, GET_APPOINTMENTS } from 'app/utils/urlConstants'
import { useParams } from 'solito/navigation'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'solito/navigation'
import { formatTimeToUserLocalTime } from 'app/ui/utils'
import { getUserPermission } from 'app/utils/getUserPemissions'
let appointmentPrivileges = {}
export function AppointmentsScreen() {
  const router = useRouter()
  const [isLoading, setLoading] = useState(false)
  const [isShowFilter, setIsShowFilter] = useState(false)
  const [currentFilter, setCurrentFilter] = useState('Upcoming')
  const [appointmentsList, setAppointmentsList] = useState([]) as any
  const [appointmentsListFull, setAppointmentsListFull] = useState([]) as any
  const header = store.getState().headerState.header
  const item = useParams<any>()
  let memberData =
    item.memberData && item.memberData !== undefined
      ? JSON.parse(item.memberData)
      : {}

  useEffect(() => {
    async function getAppointmentDetails() {
      setLoading(true)
      let url = `${BASE_URL}${GET_APPOINTMENTS}`
      let dataObject = {
        header: header,
        memberDetails: {
          id: memberData.member ? memberData.member : '',
          month: 'All',
          year: 'All',
          type: 'All',
          doctorId: 'All',
          facilityId: 'All'
        }
      }
      CallPostService(url, dataObject)
        .then(async (data: any) => {
          if (data.status === 'SUCCESS') {
            if (data.data.domainObjectPrivileges) {
              appointmentPrivileges = data.data.domainObjectPrivileges
                .Appointment
                ? data.data.domainObjectPrivileges.Appointment
                : {}
            }
            setAppointmentsListFull(data.data.list ? data.data.list : [])
            getFilteredList(data.data.list ? data.data.list : [], currentFilter)
            // console.log('setAppointments', data.data)
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
    getAppointmentDetails()
  }, [])

  async function getFilteredList(list: any, filter: any) {
    let filteredList: any[] = []
    console.log('filter', filter)
    list.map((data: any, index: any) => {
      if (
        filter === 'Upcoming' &&
        moment(data.date).utc().isAfter(moment().utc()) &&
        data.status === 'Scheduled'
      ) {
        filteredList.push(data)
      } else if (data.status === filter) {
        filteredList.push(data)
      } else if (filter === 'All') {
        filteredList = list
      }
    })
    setAppointmentsList(filteredList)
  }
  function setFilteredList(filter: any) {
    setIsShowFilter(false)
    setCurrentFilter(filter)
    getFilteredList(appointmentsListFull, filter)
  }
  return (
    <View className="flex-1">
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
        {getUserPermission(appointmentPrivileges).createPermission ? (
          <View className=" mt-[20] self-center">
            <Pressable
              className=" h-[30px] w-[30px] items-center justify-center rounded-[15px] bg-[#c5dbfd]"
              onPress={() => {
                router.push(
                  formatUrl('/(authenticated)/circles/addEditAppointment', {
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

      {isShowFilter ? (
        <View className="ml-5 w-[40%]">
          <Pressable
            onPress={() => {
              setFilteredList('Upcoming')
            }}
          >
            <Typography className="border-b-[1px] border-l-[1px] border-r-[1px] border-t-[1px] border-gray-400 p-1 text-center font-normal">
              {'Upcoming'}
            </Typography>
          </Pressable>
          <Pressable
            onPress={() => {
              setFilteredList('Completed')
            }}
          >
            <Typography className="border-b-[1px] border-l-[1px] border-r-[1px] border-gray-400 p-1 text-center font-normal">
              {'Completed'}
            </Typography>
          </Pressable>
          <Pressable
            onPress={() => {
              setFilteredList('Cancelled')
            }}
          >
            <Typography className="border-b-[1px] border-l-[1px] border-r-[1px] border-gray-400 p-1 text-center font-normal">
              {'Cancelled'}
            </Typography>
          </Pressable>
          <Pressable
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
      <ScrollView className="m-2 mx-5 w-[95%] self-center">
        {appointmentsList.map((data: any, index: number) => {
          return (
            <Pressable
              onPress={() => {
                router.replace(
                  formatUrl('/(authenticated)/circles/appointmentDetails', {
                    appointmentDetails: JSON.stringify(data),
                    memberData: JSON.stringify(memberData)
                  })
                )
              }}
              key={index}
              className="border-primary my-[5px] w-full flex-1 self-center rounded-[15px] border-[2px] bg-white py-2"
            >
              <View className="my-2 flex-row">
                <Typography className="text-primary font-400 ml-5 mr-5 w-[60%] text-[16px]">
                  {data.appointment ? data.appointment : ''}
                </Typography>
                <View className="ml-[-5px] self-center">
                  <Typography
                    className={
                      data.status.toLowerCase() === 'scheduled'
                        ? "rounded-[20px] bg-['#5ACC6C'] px-3 py-2 text-right text-white"
                        : data.status.toLowerCase() === 'cancelled'
                          ? "rounded-[20px] bg-['#E43A39'] px-3 py-2 text-right text-white"
                          : 'rounded-[20px] bg-[#1A1A1A] px-3 py-2 text-right text-white'
                    }
                  >
                    {data.status ? data.status : ''}
                  </Typography>
                </View>
              </View>
              <View className="flex-row">
                <Typography className="font-400 ml-5 w-full text-black">
                  {data.purpose ? data.purpose : ''}
                </Typography>
              </View>
              <View className="flex-row">
                <Typography className="font-400 ml-5 w-[74%] text-black">
                  {data.date ? formatTimeToUserLocalTime(data.date) : ''}
                </Typography>
                <Typography className="font-400 ml-5 text-black">
                  {data.type.toLowerCase() === 'doctor appointment'
                    ? 'Doctor'
                    : 'Facility'}
                </Typography>
              </View>
            </Pressable>
          )
        })}
      </ScrollView>
    </View>
  )
}
