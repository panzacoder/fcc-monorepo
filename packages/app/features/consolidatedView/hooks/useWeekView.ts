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
    getFullDateForCalendar(new Date(), 'YYYY-MM-DD')
  )
  const [toDate, setToDate] = useState<string>(
    getFullDateForCalendar(new Date(), 'YYYY-MM-DD')
  )
  const [currentDate, setCurrentDate] = useState<string>(
    getFullDateForCalendar(new Date(), 'DD MMM YYYY')
  )
  const [selectedDate, setSelectedDate] = useState(
    getFullDateForCalendar(new Date(), 'MMM DD, YYYY')
  )
  const [selectedDateUtc, setSelectedDateUtc] = useState<Date>(new Date())
  const [currentDateForDayView, setCurrentDateForDayView] = useState(
    getFullDateForCalendar(new Date(), 'DD MMM YYYY')
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
    let fullDate = getFullDateForCalendar(firstday, 'DD MMM')
    let firstDate = '   ' + weekDaysShort[0] + ' ' + fullDate
    weekDayListRef.current.push(firstDate)
    weekDayListDatesRef.current.push(fullDate)
    let weekFirstDate = getFullDateForCalendar(firstday, 'YYYY-MM-DD')
    weekFirstLastDaysRef.current.push(weekFirstDate)
    for (let i = 1; i <= 6; i++) {
      let nextDay = new Date(firstday.getTime() + 60 * 60 * 24 * i * 1000)

      let fullDate = getFullDateForCalendar(nextDay, 'DD MMM')
      let firstDate = '   ' + weekDaysShort[i] + ' ' + fullDate
      weekDayListRef.current.push(firstDate)
      weekDayListDatesRef.current.push(fullDate)

      let weekDate = getFullDateForCalendar(nextDay, 'YYYY-MM-DD')
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
      const fullDate = getFullDateForCalendar(data.date, 'YYYY-MM-DD')
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
    setCurrentDateForDayView(getFullDateForCalendar(yesterday, 'DD MMM YYYY'))
    setCurrentDate(getFullDateForCalendar(yesterday, 'DD MMM YYYY'))
    const newDate = getFullDateForCalendar(yesterday, 'YYYY-MM-DD')
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
    setCurrentDateForDayView(getFullDateForCalendar(tomorrow, 'DD MMM YYYY'))
    setCurrentDate(getFullDateForCalendar(tomorrow, 'DD MMM YYYY'))
    const newDate = getFullDateForCalendar(tomorrow, 'YYYY-MM-DD')
    setToDate(newDate)
    setFromDate(newDate)
    setIsDataReceived(false)
    setQueryFromDate(newDate)
    setQueryToDate(newDate)
  }, [dayCount])

  const handleDateChange = useCallback((date: Date) => {
    setFromDate(getFullDateForCalendar(date, 'YYYY-MM-DD'))
    setToDate(getFullDateForCalendar(date, 'YYYY-MM-DD'))
    setCurrentDate(getFullDateForCalendar(date, 'DD MMM YYYY'))
    setSelectedDate(getFullDateForCalendar(date, 'MMM DD, YYYY'))
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

  const dayListRefs = [
    listDayOneRef,
    listDayTwoRef,
    listDayThreeRef,
    listDayFourRef,
    listDayFiveRef,
    listDaySixRef,
    listDaySevenRef
  ]

  return {
    weekDaysShort,
    weekFirstLastDaysRef,
    weekDayListDatesRef,
    weekDayListRef,
    dayListRefs,
    fromDate,
    toDate,
    currentDate,
    currentYear,
    selectedDate,
    setSelectedDate,
    selectedDateUtc,
    currentDateForDayView,
    setCurrentDateForDayView,
    isDayView,
    isWeekView,
    isDataReceived,
    setIsDataReceived,
    memberActivityList,
    setMemberActivityList,
    queryFromDate,
    setQueryFromDate,
    queryToDate,
    setQueryToDate,
    clearLists,
    getWeekCurrentLastDays,
    setMemberActivityWithDays,
    getPreviousWeek,
    getNextWeek,
    getPreviousDate,
    getNextDate,
    handleDateChange,
    switchToDayView,
    switchToWeekView
  }
}
