'use client'

import { useState, useEffect, useCallback } from 'react'
import { View, ScrollView } from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import type { MemberActivity } from 'app/data/dashboard/types'
import { useRouter } from 'expo-router'
import { formatUrl } from 'app/utils/format-url'
import { CalendarView } from '../../features/addEditPrescription/calendar-view'
import { useConsolidatedViewData } from './hooks/useConsolidatedViewData'
import { useWeekView } from './hooks/useWeekView'
import { ActivityFilterForm } from './components/ActivityFilterForm'
import { ActivityCard } from './components/ActivityCard'
import { ViewNavigationBar } from './components/ViewNavigationBar'

export function ConsolidatedViewScreen() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState('All')
  const [isShowCalender, setIsShowCalender] = useState(false)
  const [isShowFilter, setIsShowFilter] = useState(false)
  const [isFilterActive, setIsFilterActive] = useState(false)
  const week = useWeekView()
  const viewData = useConsolidatedViewData(
    week.queryFromDate,
    week.queryToDate,
    selectedType,
    isFilterActive
  )

  useEffect(() => {
    if (!isFilterActive && viewData.detailsData) {
      week.processActivityList(viewData.detailsData.memberActivityList)
    }
  }, [viewData.detailsData, isFilterActive])

  useEffect(() => {
    if (isFilterActive && viewData.filteredDetailsData) {
      week.processActivityList(viewData.filteredDetailsData.memberActivityList)
      if (!week.isWeekView) week.setCurrentDateForDayView(week.selectedDate)
      setIsShowFilter(false)
    }
  }, [viewData.filteredDetailsData, isFilterActive])

  const handleCardPress = useCallback(
    (data: MemberActivity) => {
      const md = JSON.stringify(viewData.memberData)
      if (
        data.type === 'Doctor Appointment' ||
        data.type === 'Facility Appointment'
      ) {
        router.push(
          formatUrl('/circles/appointmentDetails', {
            appointmentDetails: JSON.stringify(data),
            memberData: md
          })
        )
      } else if (data.type === 'Incident') {
        router.replace(
          formatUrl('/circles/incidentDetails', {
            incidentDetails: JSON.stringify(data),
            memberData: md
          })
        )
      } else if (data.type === 'Event') {
        router.replace(
          formatUrl('/circles/eventDetails', {
            eventDetails: JSON.stringify(data),
            memberData: md
          })
        )
      }
    },
    [viewData.memberData]
  )

  const renderCard = (data: MemberActivity, index: number) => (
    <ActivityCard
      key={index}
      data={data}
      userAddress={viewData.userAddress}
      memberAddress={viewData.memberAddress}
      onPress={handleCardPress}
    />
  )

  const weekView = week.weekDayListRef.current.map((dayLabel, dayIndex) => (
    <View key={dayIndex}>
      <View className="my-4 flex-row">
        <ScrollView className="w-full">
          <Typography className="font-bold">{dayLabel}</Typography>
          {week.dayListRefs[dayIndex]!.current.map((activity, i) => (
            <View key={i}>{renderCard(activity, i)}</View>
          ))}
        </ScrollView>
      </View>
      <View className="h-[1px] w-full bg-black" />
    </View>
  ))

  const dateLabel = week.isDayView
    ? week.currentDateForDayView
    : week.dateRangeLabel

  return (
    <View className="flex-1">
      <PtsLoader loading={viewData.isLoading} />

      <ViewNavigationBar
        isDayView={week.isDayView}
        isWeekView={week.isWeekView}
        dateLabel={dateLabel}
        onDayPress={() => {
          week.switchToDayView()
          setIsFilterActive(false)
        }}
        onWeekPress={() => {
          week.switchToWeekView()
          setIsFilterActive(false)
        }}
        onFilterPress={() => setIsShowFilter(!isShowFilter)}
        onPrev={() => {
          week.handlePrev()
          setIsFilterActive(false)
        }}
        onNext={() => {
          week.handleNext()
          setIsFilterActive(false)
        }}
      />

      {isShowFilter ? (
        <ActivityFilterForm
          typesList={viewData.typesList}
          selectedDate={week.selectedDate}
          onTypeChange={(value) => setSelectedType(value?.title ?? 'All')}
          onSelectDate={() => setIsShowCalender(true)}
          onFilter={() => {
            setIsFilterActive(true)
            week.applyFilter()
          }}
          onReset={() => {
            setIsFilterActive(false)
            setIsShowFilter(false)
            week.resetView()
          }}
        />
      ) : (
        <View />
      )}

      {week.isDataReceived && week.memberActivityList.length > 0 ? (
        <ScrollView className="h-full">
          {week.isDayView
            ? week.memberActivityList.map((d, i) => renderCard(d, i))
            : null}
          {week.isWeekView ? weekView : null}
        </ScrollView>
      ) : (
        <View className="flex-1">
          {week.isDataReceived && week.isDayView ? (
            <Typography className="mt-[50] text-center text-lg font-bold">
              {'No Data'}
            </Typography>
          ) : week.isWeekView ? (
            weekView
          ) : null}
        </View>
      )}

      {isShowCalender && (
        <CalendarView
          component={'ConsolidatedView'}
          onCancel={() => setIsShowCalender(false)}
          onClear={() => {}}
          calendarPickerProps={{
            onDateChange: (date: Date) => {
              week.handleDateChange(date)
              setIsShowCalender(false)
            }
          }}
        />
      )}
    </View>
  )
}
