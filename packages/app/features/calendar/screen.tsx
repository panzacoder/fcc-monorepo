'use client'

import { useState, useEffect, useRef } from 'react'
import { View, TouchableOpacity } from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import { Typography } from 'app/ui/typography'
import { Button } from 'app/ui/button'
import { Feather } from 'app/ui/icons'
import { COLORS } from 'app/utils/colors'
import { useCalendarItems } from 'app/data/dashboard'
import { useLocalSearchParams } from 'expo-router'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'expo-router'
import { getUserPermission } from 'app/utils/getUserPemissions'
import { ExpandableCalendarView } from 'app/ui/expandableCalendarView'
import moment from 'moment'
import { useAppSelector } from 'app/redux/hooks'
export function CalendarScreen() {
  const calendarPrivilegesRef = useRef<any>({})
  const [isDataReceived, setIsDataReceived] = useState(false)
  const [isShowAddModal, setIsShowAddModal] = useState(false)
  const [calenderEvents, setCalenderEvents] = useState([])
  const [currentMonth, setCurrentMonth] = useState(
    String(moment().format('MMM')).toUpperCase()
  )
  const [currentYear, setCurrentYear] = useState(
    String(moment().format('YYYY')).toUpperCase()
  )
  const header = useAppSelector((state) => state.headerState.header)
  const item = useLocalSearchParams<any>()
  const router = useRouter()
  let memberData = JSON.parse(item.memberData)

  const { data: calendarData, isLoading } = useCalendarItems(header, {
    memberId: memberData.member ? memberData.member : '',
    month: currentMonth,
    year: currentYear
  })

  useEffect(() => {
    if (calendarData) {
      if (calendarData.domainObjectPrivileges) {
        calendarPrivilegesRef.current = calendarData.allowedDomainObjects
          ? calendarData.allowedDomainObjects
          : {}
      }
      setCalenderEvents(
        calendarData.calenderItemList ? calendarData.calenderItemList : []
      )
      setIsDataReceived(true)
    }
  }, [calendarData])

  function handleCurrentMonthChange(currentMonth: any) {
    let changedMonth = moment(currentMonth.dateString).format('MMM')
    let changedYear = moment(currentMonth.dateString).format('YYYY')
    setCurrentMonth(changedMonth)
    setCurrentYear(changedYear)
  }
  const showAddModal = () => {
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
            <TouchableOpacity
              className="h-[30px] w-[30px] items-center justify-center rounded-full bg-white"
              onPress={() => {
                setIsShowAddModal(false)
              }}
            >
              <Feather name={'x'} size={25} className="color-primary" />
            </TouchableOpacity>
          </View>
        </View>
        <View className="my-5 self-center">
          <Button
            className="my-1 bg-[#066f72]"
            title={'Add Appointment'}
            variant="default"
            onPress={() => {
              setIsShowAddModal(false)
              router.push(
                formatUrl('/circles/addEditAppointment', {
                  memberData: JSON.stringify(memberData),
                  component: 'Calendar'
                })
              )
            }}
          />
          <Button
            className="my-1 bg-[#066f72]"
            title={'Add Incident'}
            variant="default"
            onPress={() => {
              setIsShowAddModal(false)
              router.push(
                formatUrl('/circles/addEditIncident', {
                  memberData: JSON.stringify(memberData)
                })
              )
            }}
          />
          <Button
            className="my-1 bg-[#066f72]"
            title={'Add Event'}
            variant="default"
            onPress={() => {
              setIsShowAddModal(false)
              router.push(
                formatUrl('/circles/addEditEvent', {
                  memberData: JSON.stringify(memberData)
                })
              )
            }}
          />
        </View>
      </View>
    )
  }
  return (
    <View className="flex-1">
      <View className="">
        <PtsLoader loading={isLoading} />
        <PtsBackHeader title="Calendar" memberData={memberData} />
        <View className="flex-row ">
          <View className="w-[90%]" />
          {getUserPermission(calendarPrivilegesRef.current.Appointment)
            .createPermission ||
          getUserPermission(calendarPrivilegesRef.current.Event)
            .createPermission ||
          getUserPermission(calendarPrivilegesRef.current.Incident)
            .createPermission ? (
            <View className=" mt-[20] self-center">
              <TouchableOpacity
                className=" h-[30px] w-[30px] items-center justify-center rounded-[15px] bg-[#c5dbfd]"
                onPress={() => {
                  setIsShowAddModal(true)
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

      {isDataReceived ? (
        <ExpandableCalendarView
          memberData={memberData}
          calenderEvents={calenderEvents}
          handleChange={handleCurrentMonthChange}
        />
      ) : (
        <View />
      )}

      {isShowAddModal ? (
        <View className="absolute top-[100] self-center">{showAddModal()}</View>
      ) : (
        <View />
      )}
    </View>
  )
}
