'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { MemberActivity } from 'app/data/dashboard/types'
import { getFullDateForCalendar } from 'app/ui/utils'
import { logger } from 'app/utils/logger'

const weekDaysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function useWeekView() {
  const weekFirstLastDaysRef = useRef<string[]>([])
  const weekDayListDatesRef = useRef<string[]>([])
  const weekDayUtcDatesRef = useRef<Date[]>([])
  const weekDayListRef = useRef<string[]>([])
  const listDayOneRef = useRef<MemberActivity[]>([])
  const listDayTwoRef = useRef<MemberActivity[]>([])
  const listDayThreeRef = useRef<MemberActivity[]>([])
  const listDayFourRef = useRef<MemberActivity[]>([])
  const listDayFiveRef = useRef<MemberActivity[]>([])
  const listDaySixRef = useRef<MemberActivity[]>([])
  const listDaySevenRef = useRef<MemberActivity[]>([])

  const [fromDate, setFromDate] = useState<string>(
    getFullDateForCalendar(new Date(), 'yyyy-MM-dd')
  )
  const [toDate, setToDate] = useState<string>(
    getFullDateForCalendar(new Date(), 'yyyy-MM-dd')
  )
  const [currentDate, setCurrentDate] = useState<string>(
    getFullDateForCalendar(new Date(), 'dd MMM yyyy')
  )
  const [selectedDate, setSelectedDate] = useState(
    getFullDateForCalendar(new Date(), 'MMM dd, yyyy')
  )
  const [selectedDateUtc, setSelectedDateUtc] = useState<Date>(new Date())
  const [currentDateForDayView, setCurrentDateForDayView] = useState(
    getFullDateForCalendar(new Date(), 'dd MMM yyyy')
  )
  const currentDateUtc = new Date()
  const [dayCount, setDayCount] = useState(0)
  const [isDataReceived, setIsDataReceived] = useState(false)
  const [isDayView, setIsDayView] = useState(false)
  const [isWeekView, setIsWeekView] = useState(true)
  const [memberActivityList, setMemberActivityList] = useState<
    MemberActivity[]
  >([])
  const [queryFromDate, setQueryFromDate] = useState('')
  const [queryToDate, setQueryToDate] = useState('')

  const currentYear = currentDate.split(' ')[2]

  function clearLists() {
    listDayOneRef.current = []
    listDayTwoRef.current = []
    listDayThreeRef.current = []
    listDayFourRef.current = []
    listDayFiveRef.current = []
    listDaySixRef.current = []
    listDaySevenRef.current = []
  }

  function getWeekCurrentLastDays(currentDateParam: Date | string) {
    logger.debug('currentDate', currentDateParam)
    weekFirstLastDaysRef.current = []
    weekDayListDatesRef.current = []
    weekDayUtcDatesRef.current = []
    weekDayListRef.current = []
    var curr = new Date(currentDateParam)
    let day = curr.getDay()
    let firstday = new Date(curr.getTime() - 60 * 60 * 24 * day * 1000)

    let previouDayUtc = new Date(firstday.getTime() - 60 * 60 * 24 * 1 * 1000)
    weekDayUtcDatesRef.current.push(previouDayUtc)
    weekDayUtcDatesRef.current.push(firstday)
    let fullDate = getFullDateForCalendar(firstday, 'dd MMM')
    let firstDate = '   ' + weekDaysShort[0] + ' ' + fullDate
    weekDayListRef.current.push(firstDate)
    weekDayListDatesRef.current.push(fullDate)
    let weekFirstDate = getFullDateForCalendar(firstday, 'yyyy-MM-dd')
    weekFirstLastDaysRef.current.push(weekFirstDate)
    for (let i = 1; i <= 6; i++) {
      let nextDay = new Date(firstday.getTime() + 60 * 60 * 24 * i * 1000)

      let fullDate = getFullDateForCalendar(nextDay, 'dd MMM')
      let firstDate = '   ' + weekDaysShort[i] + ' ' + fullDate
      weekDayListRef.current.push(firstDate)
      weekDayListDatesRef.current.push(fullDate)

      let weekDate = getFullDateForCalendar(nextDay, 'yyyy-MM-dd')
      weekFirstLastDaysRef.current.push(weekDate)

      let nextDayUtc = new Date(firstday.getTime() + 60 * 60 * 24 * 7 * 1000)
      weekDayUtcDatesRef.current.push(nextDayUtc)
      if (i === 6) {
        let nextDayUtc = new Date(firstday.getTime() + 60 * 60 * 24 * 7 * 1000)
        weekDayUtcDatesRef.current.push(nextDayUtc)
      }
    }
  }

  function setMemberActivityWithDays(list: MemberActivity[]) {
    clearLists()
    list.forEach((data) => {
      const fullDate = getFullDateForCalendar(data.date, 'yyyy-MM-dd')
      switch (fullDate) {
        case weekFirstLastDaysRef.current[0]:
          listDayOneRef.current.push(data)
          break
        case weekFirstLastDaysRef.current[1]:
          listDayTwoRef.current.push(data)
          break
        case weekFirstLastDaysRef.current[2]:
          listDayThreeRef.current.push(data)
          break
        case weekFirstLastDaysRef.current[3]:
          listDayFourRef.current.push(data)
          break
        case weekFirstLastDaysRef.current[4]:
          listDayFiveRef.current.push(data)
          break
        case weekFirstLastDaysRef.current[5]:
          listDaySixRef.current.push(data)
          break
        case weekFirstLastDaysRef.current[6]:
          listDaySevenRef.current.push(data)
          break
      }
    })
  }

  useEffect(() => {
    getWeekCurrentLastDays(new Date())
    setQueryFromDate(weekFirstLastDaysRef.current[0] ?? '')
    setQueryToDate(weekFirstLastDaysRef.current[6] ?? '')
  }, [])

  function processActivityList(list: MemberActivity[]) {
    let filtered: MemberActivity[] = []
    if (isDayView) {
      list.forEach((option) => {
        if (
          currentDate === getFullDateForCalendar(option.date, 'dd MMM yyyy')
        ) {
          filtered.push(option)
        }
      })
    }
    setMemberActivityList(isDayView ? filtered : list)
    if (isWeekView) {
      setMemberActivityWithDays(list)
    }
    setIsDataReceived(true)
  }

  const getPreviousWeek = useCallback(() => {
    getWeekCurrentLastDays(weekDayUtcDatesRef.current[0]!)
    setIsDataReceived(false)
    setQueryFromDate(weekFirstLastDaysRef.current[0] ?? '')
    setQueryToDate(weekFirstLastDaysRef.current[6] ?? '')
  }, [])

  const getNextWeek = useCallback(() => {
    getWeekCurrentLastDays(weekDayUtcDatesRef.current[6]!)
    setIsDataReceived(false)
    setQueryFromDate(weekFirstLastDaysRef.current[0] ?? '')
    setQueryToDate(weekFirstLastDaysRef.current[6] ?? '')
  }, [])

  const getPreviousDate = useCallback(() => {
    setDayCount((prev) => prev - 1)
    let yesterday = new Date(currentDateUtc)
    yesterday.setUTCDate(yesterday.getDate() + dayCount)
    setCurrentDateForDayView(getFullDateForCalendar(yesterday, 'dd MMM yyyy'))
    setCurrentDate(getFullDateForCalendar(yesterday, 'dd MMM yyyy'))
    const newDate = getFullDateForCalendar(yesterday, 'yyyy-MM-dd')
    setToDate(newDate)
    setFromDate(newDate)
    setIsDataReceived(false)
    setQueryFromDate(newDate)
    setQueryToDate(newDate)
  }, [dayCount])

  const getNextDate = useCallback(() => {
    setDayCount((prev) => prev + 1)
    let tomorrow = new Date(currentDateUtc)
    tomorrow.setUTCDate(tomorrow.getDate() + dayCount)
    setCurrentDateForDayView(getFullDateForCalendar(tomorrow, 'dd MMM yyyy'))
    setCurrentDate(getFullDateForCalendar(tomorrow, 'dd MMM yyyy'))
    const newDate = getFullDateForCalendar(tomorrow, 'yyyy-MM-dd')
    setToDate(newDate)
    setFromDate(newDate)
    setIsDataReceived(false)
    setQueryFromDate(newDate)
    setQueryToDate(newDate)
  }, [dayCount])

  const handleDateChange = useCallback((date: Date) => {
    setFromDate(getFullDateForCalendar(date, 'yyyy-MM-dd'))
    setToDate(getFullDateForCalendar(date, 'yyyy-MM-dd'))
    setCurrentDate(getFullDateForCalendar(date, 'dd MMM yyyy'))
    setSelectedDate(getFullDateForCalendar(date, 'MMM dd, yyyy'))
    setSelectedDateUtc(date)
  }, [])

  const switchToDayView = useCallback(() => {
    setIsDayView(true)
    setIsWeekView(false)
    setIsDataReceived(false)
    setQueryFromDate(fromDate)
    setQueryToDate(toDate)
  }, [fromDate, toDate])

  const switchToWeekView = useCallback(() => {
    clearLists()
    setIsWeekView(true)
    setIsDayView(false)
    setIsDataReceived(false)
    setQueryFromDate(weekFirstLastDaysRef.current[0] ?? '')
    setQueryToDate(weekFirstLastDaysRef.current[6] ?? '')
  }, [])

  const handlePrev = useCallback(() => {
    if (isDayView) {
      getPreviousDate()
    } else {
      clearLists()
      getPreviousWeek()
    }
  }, [isDayView, getPreviousDate, getPreviousWeek])

  const handleNext = useCallback(() => {
    if (isDayView) {
      getNextDate()
    } else {
      clearLists()
      getNextWeek()
    }
  }, [isDayView, getNextDate, getNextWeek])

  const applyFilter = useCallback(() => {
    setIsDataReceived(false)
    if (isDayView) {
      setQueryFromDate(fromDate)
      setQueryToDate(toDate)
    } else {
      getWeekCurrentLastDays(selectedDateUtc)
      setQueryFromDate(weekFirstLastDaysRef.current[0] ?? '')
      setQueryToDate(weekFirstLastDaysRef.current[6] ?? '')
    }
  }, [isDayView, fromDate, toDate, selectedDateUtc])

  const resetView = useCallback(() => {
    setSelectedDate(getFullDateForCalendar(new Date(), 'MMM dd, yyyy'))
    setIsDataReceived(false)
    if (isDayView) {
      const resetDate = getFullDateForCalendar(new Date(), 'yyyy-MM-dd')
      setCurrentDateForDayView(
        getFullDateForCalendar(new Date(), 'dd MMM yyyy')
      )
      setQueryFromDate(resetDate)
      setQueryToDate(resetDate)
    } else {
      getWeekCurrentLastDays(new Date())
      setQueryFromDate(weekFirstLastDaysRef.current[0] ?? '')
      setQueryToDate(weekFirstLastDaysRef.current[6] ?? '')
    }
  }, [isDayView])

  const dayListRefs = [
    listDayOneRef,
    listDayTwoRef,
    listDayThreeRef,
    listDayFourRef,
    listDayFiveRef,
    listDaySixRef,
    listDaySevenRef
  ]

  const dateRangeLabel =
    weekDaysShort[0] +
    ', ' +
    weekDayListDatesRef.current[0] +
    ' - ' +
    weekDaysShort[6] +
    ', ' +
    weekDayListDatesRef.current[6] +
    ', ' +
    currentYear

  return {
    weekDayListRef,
    dayListRefs,
    selectedDate,
    currentDateForDayView,
    isDayView,
    isWeekView,
    isDataReceived,
    memberActivityList,
    queryFromDate,
    queryToDate,
    dateRangeLabel,
    processActivityList,
    setCurrentDateForDayView,
    handleDateChange,
    switchToDayView,
    switchToWeekView,
    handlePrev,
    handleNext,
    applyFilter,
    resetView
  }
}
