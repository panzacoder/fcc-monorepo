'use client'

import { useState, useEffect, useCallback } from 'react'
import { View, Alert, Pressable, TouchableOpacity } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { COLORS } from 'app/utils/colors'
import _ from 'lodash'
import moment from 'moment'
import store from 'app/redux/store'
import { CallPostService } from 'app/utils/fetchServerData'
import {
  BASE_URL,
  GET_APPOINTMENTS,
  GET_DOCTOR_FACILITIES
} from 'app/utils/urlConstants'
import { useParams } from 'solito/navigation'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'solito/navigation'
import { formatTimeToUserLocalTime, getMonthsList } from 'app/ui/utils'
import { getUserPermission } from 'app/utils/getUserPemissions'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'
import { Button } from 'app/ui/button'
import { AddEditAppointment } from 'app/ui/addEditAppointment'
let appointmentPrivileges = {}
let selectedMonth = 'All'
let selectedYear = 'All'
let selectedType = 'All'
let doctorId = 'All'
let facilityId = 'All'
const schema = z.object({
  monthIndex: z.number(),
  yearIndex: z.number(),
  typeIndex: z.number(),
  doctorFacilityIndex: z.number()
})

const typesList: Array<{ id: number; title: string }> = [
  { id: 1, title: 'All' },
  { id: 2, title: 'Doctor' },
  { id: 3, title: 'Facility' }
]

const monthsList = getMonthsList() as any
export type Schema = z.infer<typeof schema>
export function AppointmentsListScreen() {
  const router = useRouter()
  const [isLoading, setLoading] = useState(false)
  const [currentFilter, setCurrentFilter] = useState('Upcoming')
  const [isDataReceived, setIsDataReceived] = useState(false)
  const [isAddAppointment, setIsAddAppointment] = useState(false)
  const [isShowFilter, setIsShowFilter] = useState(false)
  const [isFilter, setIsFilter] = useState(false)
  const [appointmentsList, setAppointmentsList] = useState([]) as any
  const [doctorFacilityList, setDoctorFacilityList] = useState([]) as any
  const [doctorFacilityListFull, setDoctorFacilityListFull] = useState(
    []
  ) as any
  const [appointmentsListFull, setAppointmentsListFull] = useState([]) as any
  const header = store.getState().headerState.header
  const item = useParams<any>()
  const staticData: any = store.getState().staticDataState.staticData
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      monthIndex: 1,
      yearIndex: 1,
      typeIndex: 1,
      doctorFacilityIndex: 1
    },
    resolver: zodResolver(schema)
  })
  let memberData =
    item.memberData && item.memberData !== undefined
      ? JSON.parse(item.memberData)
      : {}

  type Response = {
    id: number
    name: string
  }
  let yearList: Array<{ id: number; title: string }> = [{ id: 1, title: 'All' }]
  staticData.yearList.map(({ name, id }: Response, index: any) => {
    yearList.push({
      id: index + 2,
      title: name
    })
  })
  const getDoctorFacilities = useCallback(async () => {
    setLoading(true)
    let url = `${BASE_URL}${GET_DOCTOR_FACILITIES}`
    let dataObject = {
      header: header,
      doctor: {
        member: {
          id: memberData.member ? memberData.member : ''
        }
      },
      appointmentType: selectedType
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          const list: Array<{ id: number; title: string }> = [
            { title: 'All', id: 1 }
          ]
          data.data.map((data: any, index: any) => {
            let object = {
              title: data.name,
              id: index + 2
            }
            list.push(object)
          })
          setDoctorFacilityList(list)
          setDoctorFacilityListFull(data.data ? data.data : [])
        } else {
          Alert.alert('', data.message)
          setLoading(false)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log('error', error)
      })
  }, [])
  const getAppointmentDetails = useCallback(async () => {
    setLoading(true)
    let url = `${BASE_URL}${GET_APPOINTMENTS}`
    let dataObject = {
      header: header,
      memberDetails: {
        id: memberData.member ? memberData.member : '',
        month: selectedMonth,
        year: selectedYear,
        type: selectedType,
        doctorId: doctorId,
        facilityId: facilityId
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          if (data.data.domainObjectPrivileges) {
            appointmentPrivileges = data.data.domainObjectPrivileges.Appointment
              ? data.data.domainObjectPrivileges.Appointment
              : {}
          }
          setAppointmentsListFull(data.data.list ? data.data.list : [])
          getFilteredList(data.data.list ? data.data.list : [], currentFilter)
          // console.log('setAppointments', data.data)
          setIsDataReceived(true)
          setIsFilter(false)
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
    getDoctorFacilities()
    getAppointmentDetails()
  }, [])

  async function getFilteredList(list: any, filter: any) {
    let filteredList: any[] = []
    // console.log('filter', filter)
    if (filter === 'Open Items') {
      list = _.orderBy(list, (x) => x.date, 'asc')
    } else {
      list = _.orderBy(list, (x) => x.date, 'desc')
    }
    list.map((data: any, index: any) => {
      if (filter === 'Upcoming') {
        if (
          moment(data.date).utc().isAfter(moment().utc()) &&
          (String(data.status).toLocaleLowerCase() ===
            String('Scheduled').toLowerCase() ||
            String(data.status).toLocaleLowerCase() ===
              String('rescheduled').toLowerCase())
        ) {
          filteredList.push(data)
        }
      } else if (filter === 'Open Items') {
        if (
          moment(data.date).utc().isBefore(moment().utc()) &&
          (String(data.status).toLocaleLowerCase() ===
            String('Scheduled').toLowerCase() ||
            String(data.status).toLocaleLowerCase() ===
              String('rescheduled').toLowerCase())
        ) {
          filteredList.push(data)
        }
      } else if (filter === 'Completed') {
        if (data.status === 'Completed') {
          filteredList.push(data)
        }
      } else if (filter === 'Cancelled') {
        if (data.status === 'Cancelled') {
          filteredList.push(data)
        }
      } else if (filter === 'All') {
        filteredList = list
      }
    })
    // console.log('filteredList', JSON.stringify(filteredList))
    setAppointmentsList(filteredList)
  }
  async function setFilteredList(filter: any) {
    setIsShowFilter(false)
    setCurrentFilter(filter)
    getFilteredList(appointmentsListFull, filter)
  }
  function filterAppointment(formData: Schema) {
    selectedMonth =
      formData.monthIndex !== -1
        ? monthsList[formData.monthIndex - 1].title
        : 'All'
    selectedYear =
      formData.yearIndex !== -1 ? yearList[formData.yearIndex - 1].title : 'All'
    doctorId =
      formData.doctorFacilityIndex !== 1 && formData.doctorFacilityIndex !== -1
        ? doctorFacilityListFull[formData.doctorFacilityIndex - 1].doctorId
        : 'All'
    facilityId =
      formData.doctorFacilityIndex !== 1 && formData.doctorFacilityIndex !== -1
        ? doctorFacilityListFull[formData.doctorFacilityIndex - 1].facilityId
        : 'All'
    getAppointmentDetails()
  }
  function resetFilter() {
    selectedMonth = 'All'
    selectedYear = 'All'
    selectedType = 'All'
    doctorId = 'All'
    facilityId = 'All'
    getAppointmentDetails()
    reset({
      monthIndex: 1,
      yearIndex: 1,
      doctorFacilityIndex: 1,
      typeIndex: 1
    })
  }
  async function setDoctorFacilityChange(value: any) {
    if (value === null) {
      reset({
        doctorFacilityIndex: -1
      })
    }
  }
  async function setYearChange(value: any) {
    if (value === null) {
      reset({
        yearIndex: -1
      })
    }
  }
  async function setMonthChange(value: any) {
    if (value === null) {
      reset({
        monthIndex: -1
      })
    }
  }
  async function setSelectedTypeChange(value: any) {
    if (value) {
      if (value === 0) {
        selectedType = 'All'
      } else if (value === 1) {
        selectedType = 'Doctor Appointment'
      } else {
        selectedType = 'Facility Appointment'
      }
      getDoctorFacilities()
    } else {
      selectedType = 'All'
      reset({
        typeIndex: -1
      })
    }
  }
  async function cancelClicked() {
    setIsAddAppointment(false)
  }
  async function createUpdateAppointment() {
    console.log('in createUpdateAppointment')
  }
  return (
    <View className="flex-1">
      <PtsLoader loading={isLoading} />
      <View className="flex-row ">
        <Pressable
          onPress={() => {
            setIsFilter(false)
            setIsShowFilter(!isShowFilter)
          }}
          className="w-[75%] flex-row"
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
                  formatUrl('/circles/addEditAppointment', {
                    memberData: JSON.stringify(memberData),
                    component: 'Appointment'
                  })
                )
                // setIsAddAppointment(true)
              }}
            >
              <Feather name={'plus'} size={25} color={COLORS.primary} />
            </Pressable>
          </View>
        ) : (
          <View />
        )}
        <Pressable
          onPress={() => {
            setIsShowFilter(false)
            setIsFilter(!isFilter)
          }}
          className=""
        >
          <Feather
            className="ml-5 mt-6 rounded-[5px] bg-[#c5dbfd] p-[3px]"
            name={'filter'}
            size={25}
            color={COLORS.primary}
          />
        </Pressable>
      </View>
      {isFilter ? (
        <View className="mt-2 rounded-[5px] border-[1px] border-gray-400 p-2">
          <View className="mt-2 w-full justify-center">
            <ControlledDropdown
              control={control}
              name="typeIndex"
              label="All"
              maxHeight={300}
              list={typesList}
              className="w-[95%] self-center"
              onChangeValue={setSelectedTypeChange}
            />
            <ControlledDropdown
              control={control}
              name="doctorFacilityIndex"
              label="All"
              maxHeight={300}
              list={doctorFacilityList}
              className="mt-2 w-[95%] self-center"
              onChangeValue={setDoctorFacilityChange}
            />
          </View>
          <View className="mt-2 w-full flex-row justify-center">
            <ControlledDropdown
              control={control}
              name="monthIndex"
              label="All"
              maxHeight={300}
              list={monthsList}
              className="w-[45%]"
              onChangeValue={setMonthChange}
            />
            <ControlledDropdown
              control={control}
              name="yearIndex"
              label="All"
              maxHeight={300}
              list={yearList}
              className="ml-5 w-[45%]"
              onChangeValue={setYearChange}
            />
          </View>
          <View className="flex-row self-center">
            <View className="mt-5 flex-row justify-center ">
              <Button
                className="bg-[#287CFA]"
                title={''}
                leadingIcon="filter"
                variant="default"
                onPress={handleSubmit(filterAppointment)}
              />
              <Button
                className="ml-5 bg-[#287CFA]"
                title={''}
                leadingIcon="rotate-ccw"
                variant="default"
                onPress={handleSubmit(resetFilter)}
              />
              <Button
                className="ml-5 bg-[#287CFA]"
                title={''}
                leadingIcon="x"
                variant="default"
                onPress={() => {
                  setIsFilter(!isFilter)
                }}
              />
            </View>
          </View>
        </View>
      ) : (
        <View />
      )}
      {isShowFilter ? (
        <View className="ml-5 w-[40%]">
          <TouchableOpacity
            className={`${currentFilter === 'Upcoming' ? 'bg-[#c9e6b1]' : 'bg-white'}`}
            onPress={() => {
              setFilteredList('Upcoming')
            }}
          >
            <Typography
              onPress={() => {
                setFilteredList('Upcoming')
              }}
              className="border-b-[1px] border-l-[1px] border-r-[1px] border-t-[1px] border-gray-400 p-1 text-center font-normal"
            >
              {'Upcoming'}
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            className={`${currentFilter === 'Open Items' ? 'bg-[#c9e6b1]' : 'bg-white'}`}
            onPress={() => {
              setFilteredList('Open Items')
            }}
          >
            <Typography
              onPress={() => {
                setFilteredList('Open Items')
              }}
              className="border-b-[1px] border-l-[1px] border-r-[1px] border-gray-400 p-1 text-center font-normal"
            >
              {'Open Items'}
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            className={`${currentFilter === 'Completed' ? 'bg-[#c9e6b1]' : 'bg-white'}`}
            onPress={() => {
              setFilteredList('Completed')
            }}
          >
            <Typography
              onPress={() => {
                setFilteredList('Completed')
              }}
              className="border-b-[1px] border-l-[1px] border-r-[1px] border-gray-400 p-1 text-center font-normal"
            >
              {'Completed'}
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            className={`${currentFilter === 'Cancelled' ? 'bg-[#c9e6b1]' : 'bg-white'}`}
            onPress={() => {
              setFilteredList('Cancelled')
            }}
          >
            <Typography
              onPress={() => {
                setFilteredList('Cancelled')
              }}
              className="border-b-[1px] border-l-[1px] border-r-[1px] border-gray-400 p-1 text-center font-normal"
            >
              {'Cancelled'}
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            className={`${currentFilter === 'All' ? 'bg-[#c9e6b1]' : 'bg-white'}`}
            onPress={() => {
              setFilteredList('All')
            }}
          >
            <Typography
              onPress={() => {
                setFilteredList('All')
              }}
              className="border-b-[1px] border-l-[1px] border-r-[1px] border-gray-400 p-1 text-center font-normal"
            >
              {'All'}
            </Typography>
          </TouchableOpacity>
        </View>
      ) : (
        <View />
      )}
      {appointmentsList.length > 0 ? (
        <ScrollView className="m-2 mx-5 w-full self-center">
          {appointmentsList.map((data: any, index: number) => {
            return (
              <Pressable
                onPress={() => {
                  router.replace(
                    formatUrl('/circles/appointmentDetails', {
                      appointmentDetails: JSON.stringify(data),
                      memberData: JSON.stringify(memberData)
                    })
                  )
                }}
                key={index}
                className="border-primary my-[5px] w-full flex-1 self-center rounded-[15px] border-[2px] bg-white py-2"
              >
                <View className=" flex-row">
                  <Typography className="font-400 ml-5 w-[70%] max-w-[70%] text-black">
                    {data.date ? formatTimeToUserLocalTime(data.date) : ''}
                  </Typography>
                  <View className="">
                    <Typography className="font-bold text-black">
                      {data.status ? data.status : ''}
                    </Typography>
                  </View>
                </View>
                <View className="flex-row">
                  <Typography className="font-400 ml-5 w-[55%] text-black">
                    {data.purpose ? data.purpose : ''}
                  </Typography>
                  {data.markCompleteCancel ? (
                    <Typography className="font-400 ml-5 w-[40%] text-[#FF0000]">
                      {'Mark Complete/Cancel'}
                    </Typography>
                  ) : (
                    <View />
                  )}
                </View>
                <View className="flex-row">
                  <Typography className="text-primary font-400 ml-5 mr-5 w-[65%] max-w-[65%] text-[16px]">
                    {data.appointment ? data.appointment : ''}
                  </Typography>
                  <Typography className="font-400 ml-[10px] text-black">
                    {data.type.toLowerCase() === 'doctor appointment'
                      ? 'Doctor'
                      : 'Facility'}
                  </Typography>
                </View>
                {data.hasNotes ||
                data.hasReminders ||
                data.hasTransportation ? (
                  <View className="my-2 h-[1px] w-[95%] self-center bg-[#86939e]" />
                ) : (
                  <View />
                )}

                <View className="ml-5 flex-row self-center">
                  <View className="w-[30%]">
                    {data.hasNotes ? (
                      <View className="flex-row">
                        <Feather
                          className="ml-5 mt-1"
                          name={'message-circle'}
                          size={25}
                          color={'green'}
                        />
                        {data.unreadMessageCount > 0 ? (
                          <Typography className="bg-primary ml-[-5px] h-[20px] w-[20px] rounded-[10px] text-center font-bold text-white">
                            {data.unreadMessageCount}
                          </Typography>
                        ) : (
                          <View />
                        )}
                      </View>
                    ) : (
                      <View />
                    )}
                  </View>
                  <View className="w-[30%]">
                    {data.hasReminders ? (
                      <View className="flex-row">
                        <Feather
                          className="ml-5 mt-1"
                          name={'clock'}
                          size={25}
                          color={'red'}
                        />
                        {data.activeReminderCount > 0 ? (
                          <Typography className="bg-primary ml-[-5px] h-[20px] w-[20px] rounded-[10px] text-center font-bold text-white">
                            {data.activeReminderCount}
                          </Typography>
                        ) : (
                          <View />
                        )}
                      </View>
                    ) : (
                      <View />
                    )}
                  </View>
                  {data.hasTransportation ? (
                    <View className="w-[30%]">
                      <Feather
                        className="ml-5 mt-1"
                        name={'truck'}
                        size={25}
                        color={
                          data.transportationStatus === 'Requested'
                            ? '#cf8442'
                            : data.transportationStatus === 'Rejected'
                              ? 'red'
                              : 'black'
                        }
                      />
                    </View>
                  ) : (
                    <View />
                  )}
                </View>
              </Pressable>
            )
          })}
        </ScrollView>
      ) : (
        <View />
      )}
      {isDataReceived && appointmentsList.length === 0 ? (
        <View className="flex-1 items-center justify-center self-center">
          <Typography className="font-bold">{`No ${currentFilter !== 'All' ? currentFilter : ''} appointments`}</Typography>
        </View>
      ) : (
        <View />
      )}
      {isAddAppointment ? (
        <View className="mt-2 h-full w-full items-center self-center">
          <AddEditAppointment
            createUpdateAppointment={createUpdateAppointment}
            cancelClicked={cancelClicked}
          />
        </View>
      ) : (
        <View />
      )}
    </View>
  )
}
