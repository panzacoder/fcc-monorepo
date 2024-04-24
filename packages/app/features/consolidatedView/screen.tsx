'use client'

import { useState, useEffect } from 'react'
import { View, Alert, ScrollView, Pressable } from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'
import { Button } from 'app/ui/button'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { CallPostService } from 'app/utils/fetchServerData'
import {
  BASE_URL,
  GET_CONSOLIDATED_FILTER_OPTIONS,
  GET_CONSOLIDATED_DETAILS
} from 'app/utils/urlConstants'
import store from 'app/redux/store'
import { getFullDateForCalender } from 'app/ui/utils'
import {
  CalendarView,
  CalendarViewInput
} from '../../ui/addEditPrescription/calendar-view'
const schema = z.object({
  typeIndex: z.number()
})
let selectedType = 'All'
let typesList: object[] = [] as any
export function ConsolidatedViewScreen() {
  const header = store.getState().headerState.header
  const [isLoading, setLoading] = useState(false)
  const [isShowCalender, setIsShowCalender] = useState(false)
  const [selectedDate, setSelectedDate] = useState(
    getFullDateForCalender(new Date(), 'MMM DD, YYYY')
  )
  const [fromDate, setFromDate] = useState(
    getFullDateForCalender(new Date(), 'DD MMM YYYY')
  )
  const [toDate, setToDate] = useState(
    getFullDateForCalender(new Date(), 'YYYY-MM-DD')
  )
  const [selectedDateUtc, setSelectedDateUtc] = useState('') as any
  const [isShowFilter, setIsShowFilter] = useState(false)
  const [isDayView, setIsDayView] = useState(false)
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      typeIndex: 0
    },
    resolver: zodResolver(schema)
  })
  useEffect(() => {
    setLoading(true)
    let url = `${BASE_URL}${GET_CONSOLIDATED_FILTER_OPTIONS}`
    let dataObject = {
      header: header
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          const list: object[] = [{ label: 'All', value: 0 }]
          data.data.filterOptionTypes.map((data: any, index: any) => {
            let object = {
              label: data,
              value: index + 1
            }
            list.push(object)
          })
          typesList = list
          console.log('list', JSON.stringify(list))
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
  const handleDateCleared = () => {}
  const handleDateChange = (date: Date) => {
    // console.log('date', date)
    setSelectedDate(getFullDateForCalender(date, 'MMM DD, YYYY'))
    setSelectedDateUtc(date)
    setIsShowCalender(false)
  }
  return (
    <View className="flex-1">
      <PtsLoader loading={isLoading} />

      <View className="mt-[50px] w-full flex-row">
        <Pressable
          onPress={() => {
            setIsDayView(true)
          }}
          className={`w-[40%] items-center justify-center ${isDayView ? 'bg-[#c2cad1]' : 'bg-white'} py-2`}
        >
          <View>
            <Feather className="" name={'calendar'} size={25} color={'black'} />
            <Typography className="mt-1 text-[14px] font-bold text-black">
              {'Day'}
            </Typography>
          </View>
        </Pressable>
        <Pressable
          onPress={() => {
            setIsDayView(false)
          }}
          className={`w-[40%] items-center justify-center ${!isDayView ? 'bg-[#c2cad1]' : 'bg-white'} py-2`}
        >
          <View>
            <Feather
              className="ml-1"
              name={'calendar'}
              size={25}
              color={'black'}
            />
            <Typography className=" mt-1 text-[14px] font-bold text-black">
              {'Week'}
            </Typography>
          </View>
        </Pressable>
        <Pressable
          onPress={() => {
            setIsShowFilter(!isShowFilter)
          }}
          className={`w-[20%] items-center justify-center bg-white py-2`}
        >
          <Feather className="ml-2" name={'filter'} size={25} color={'black'} />
        </Pressable>
      </View>
      {isShowFilter ? (
        <View className="my-2">
          <View className="mt-2 w-full justify-center rounded-[1px] shadow">
            <ControlledDropdown
              control={control}
              name="typeIndex"
              label="All"
              maxHeight={300}
              list={typesList}
              className=" w-[95%] self-center p-2"
            />
            <CalendarViewInput
              className="w-[90%] self-center"
              label="Select Date"
              value={selectedDate}
              onPress={() => {
                setIsShowCalender(true)
              }}
            />
            <View className="my-3 mb-2 flex-row self-center">
              <View className="flex-row justify-center ">
                <Button
                  className="bg-[#287CFA]"
                  title={'Filter'}
                  leadingIcon="filter"
                  variant="default"
                  // onPress={handleSubmit(filterAppointment)}
                />
                <Button
                  className="ml-5 bg-black"
                  title={'Reset'}
                  leadingIcon="rotate-ccw"
                  variant="default"
                  // onPress={handleSubmit(resetFilter)}
                />
              </View>
            </View>
          </View>
        </View>
      ) : (
        <View />
      )}
      <View className="bg-primary h-[60] w-full justify-center">
        <View className="flex-row">
          <View className="w-[20%]">
            <Pressable className="ml-5 h-[40] w-[40] items-center justify-center self-center rounded-[5px] bg-white">
              <Feather
                className=""
                name={'chevron-left'}
                size={25}
                color={'black'}
              />
            </Pressable>
          </View>
          <View className="w-[60%] justify-center">
            <Typography className="text-center font-bold text-white">
              {fromDate}
            </Typography>
          </View>
          <View className="w-[20%]">
            <Pressable className="mr-5 h-[40] w-[40] items-center justify-center self-center rounded-[5px] bg-white">
              <Feather
                className=""
                name={'chevron-right'}
                size={25}
                color={'black'}
              />
            </Pressable>
          </View>
        </View>
      </View>
      {isShowCalender && (
        <CalendarView
          component={'ConsolidatedView'}
          onCancel={() => setIsShowCalender(false)}
          onClear={handleDateCleared}
          calendarPickerProps={{ onDateChange: handleDateChange }}
        />
      )}
    </View>
  )
}
