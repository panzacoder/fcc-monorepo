'use client'

import { useState, useEffect, useCallback } from 'react'
import { View, TouchableOpacity, Alert, Pressable } from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { COLORS } from 'app/utils/colors'
import store from 'app/redux/store'
import { CallPostService } from 'app/utils/fetchServerData'
import { BASE_URL, GET_CALENDER_ITEMS } from 'app/utils/urlConstants'
import { useParams } from 'solito/navigation'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'solito/navigation'
import { getUserPermission } from 'app/utils/getUserPemissions'
import { ExpandableCalendarView } from 'app/ui/expandableCalendarView'
import moment from 'moment'
let calendarPrivileges: any = {}
export function CalendarScreen() {
  const [isLoading, setLoading] = useState(false)
  const [isDataReceived, setIsDataReceived] = useState(false)
  const [calenderEvents, setCalenderEvents] = useState([])
  const header = store.getState().headerState.header
  const item = useParams<any>()
  const router = useRouter()
  let memberData = JSON.parse(item.memberData)
  let currentMonth = String(moment().format('MMM')).toUpperCase()
  let currentYear = String(moment().format('YYYY')).toUpperCase()
  const [currentCalendarMonthShown, setCurrentCalendarMonthShown] =
    useState(currentMonth)
  const [currentCalendarYearShown, setCurrentCalendarYearShown] =
    useState(currentYear)
  const getCalenderItemsFromServer = useCallback(
    async (currentMonth: any, currentYear: any) => {
      setLoading(true)
      let url = `${BASE_URL}${GET_CALENDER_ITEMS}`
      let dataObject = {
        header: header,
        member: {
          id: memberData.member ? memberData.member : ''
        },
        month: currentMonth,
        year: currentYear
      }
      CallPostService(url, dataObject)
        .then(async (data: any) => {
          if (data.status === 'SUCCESS') {
            if (data.data.domainObjectPrivileges) {
              calendarPrivileges = data.data.allowedDomainObjects
                ? data.data.allowedDomainObjects
                : {}
            }
            setCalenderEvents(
              data.data.calenderItemList ? data.data.calenderItemList : []
            )
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
    },
    []
  )
  useEffect(() => {
    getCalenderItemsFromServer(currentMonth, currentYear)
  }, [])
  async function handleCurrentMonthChange(currentMonth: any) {
    // console.log('in handleCurrentMonthChange', JSON.parse(currentMonth))
    let changedMonth = moment(currentMonth.dateString).format('MMM')
    let changedYear = moment(currentMonth.dateString).format('YYYY')
    getCalenderItemsFromServer(changedMonth, changedYear)
  }
  return (
    <View className="flex-1 bg-white">
      <View className="">
        <PtsLoader loading={isLoading} />
        <View className="flex-row ">
          <View className="w-[90%]" />
          {getUserPermission(calendarPrivileges.Appointment).createPermission ||
          getUserPermission(calendarPrivileges.Event).createPermission ||
          getUserPermission(calendarPrivileges.Incident).createPermission ? (
            <View className=" mt-[20] self-center">
              <TouchableOpacity
                className=" h-[30px] w-[30px] items-center justify-center rounded-[15px] bg-[#c5dbfd]"
                onPress={() => {}}
              >
                <Feather name={'plus'} size={25} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          ) : (
            <View /> 
          )}
        </View>
      </View>
      {isDataReceived ? ( 
        <ExpandableCalendarView
          calenderEvents={calenderEvents}
          handleChange={handleCurrentMonthChange}
        />
      ) : (
        <View />
      )}
    </View>
  )
}
