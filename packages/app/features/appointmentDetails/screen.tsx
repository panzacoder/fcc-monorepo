'use client'
import _ from 'lodash'
import { useState, useEffect, useCallback } from 'react'
import { View, TouchableOpacity, Alert, ScrollView } from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import store from 'app/redux/store'
import { CallPostService } from 'app/utils/fetchServerData'
import { BASE_URL, GET_APPOINTMENT_DETAILS } from 'app/utils/urlConstants'
import { useParams } from 'solito/navigation'
import { formatTimeToUserLocalTime } from 'app/ui/utils'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'solito/navigation'
import { Location } from 'app/ui/location'
import { Note } from 'app/ui/appointmentNote'
import { Reminder } from 'app/ui/appointmentReminder'
import { Transportation } from 'app/ui/transportation'
import { AddEditNote } from 'app/ui/addEditNote'
import { AddEditReminder } from 'app/ui/addEditReminder'
import { AddEditTransport } from 'app/ui/addEditTransport'
import { Button } from 'app/ui/button'

export function AppointmentDetailsScreen() {
  const header = store.getState().headerState.header
  const item = useParams<any>()
  const router = useRouter()
  let appointmentInfo = item.appointmentDetails
    ? JSON.parse(item.appointmentDetails)
    : {}
  // console.log('appointmentInfo', '' + JSON.stringify(appointmentInfo))
  const [isLoading, setLoading] = useState(false)
  const [isAddNote, setIsAddNote] = useState(false)
  const [isAddRemider, setIsAddReminder] = useState(false)
  const [isAddTransportation, setIsAddTransportation] = useState(false)
  const [isRender, setIsRender] = useState(false)
  const [noteData, setNoteData] = useState({})
  const [reminderData, setReminderData] = useState({})
  const [transportationData, setTransportationData] = useState({})
  const [isDataReceived, setIsDataReceived] = useState(false)
  const [notesList, setNotesList] = useState([])
  const [remindersList, setRemindersList] = useState([])
  const [transportationList, setTransportationList] = useState([])
  const [appointmentDetails, setAppointmentDetails] = useState({}) as any
  const getAppointmentDetails = useCallback(async () => {
    setLoading(true)
    let url = `${BASE_URL}${GET_APPOINTMENT_DETAILS}`
    let dataObject = {
      header: header,
      appointment: {
        id: appointmentInfo.id ? appointmentInfo.id : ''
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          // console.log(
          //   'appointmentInfo',
          //   '' +
          //     JSON.stringify(
          //       data.data.appointmentWithPreviousAppointment.appointment
          //     )
          // )
          if (
            data.data.appointmentWithPreviousAppointment &&
            data.data.appointmentWithPreviousAppointment.appointment
          ) {
            setAppointmentDetails(
              data.data.appointmentWithPreviousAppointment.appointment
            )
            if (
              data.data.appointmentWithPreviousAppointment.appointment.noteList
            ) {
              setNotesList(
                data.data.appointmentWithPreviousAppointment.appointment
                  .noteList
              )
            }
            if (
              data.data.appointmentWithPreviousAppointment.appointment
                .reminderList
            ) {
              setRemindersList(
                data.data.appointmentWithPreviousAppointment.appointment
                  .reminderList
              )
            }
            if (
              data.data.appointmentWithPreviousAppointment.appointment
                .transportationList
            ) {
              setTransportationList(
                data.data.appointmentWithPreviousAppointment.appointment
                  .transportationList
              )
            }
          }
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
  }, [])
  useEffect(() => {
    if (!isAddNote) {
      getAppointmentDetails()
    }
  }, [])
  let doctorName = '',
    specialist = '',
    phone = '',
    email = '',
    website = '',
    websiteUser = '',
    apptDate = '',
    status = '',
    purpose = '',
    description = ''
  let doctorAddress = {}
  if (!_.isEmpty(appointmentDetails)) {
    if (appointmentDetails.date) {
      apptDate = formatTimeToUserLocalTime(appointmentDetails.date)
    }
    if (appointmentDetails.status && appointmentDetails.status.status) {
      status = appointmentDetails.status.status
    }
    if (appointmentDetails.purpose) {
      purpose = appointmentDetails.purpose
    }
    if (appointmentDetails.description) {
      description = appointmentDetails.description
    }
    if (appointmentDetails.doctorLocation) {
      doctorAddress = appointmentDetails.doctorLocation
      doctorAddress.component = 'Appointment'
    }
    if (
      appointmentDetails.doctorLocation &&
      appointmentDetails.doctorLocation.doctor
    ) {
      if (appointmentDetails.doctorLocation.doctor.firstName) {
        doctorName += appointmentDetails.doctorLocation.doctor.firstName
      }
      if (appointmentDetails.doctorLocation.doctor.lastName) {
        doctorName += ' ' + appointmentDetails.doctorLocation.doctor.lastName
      }
      if (appointmentDetails.doctorLocation.doctor.specialist) {
        specialist = appointmentDetails.doctorLocation.doctor.specialist
      }
      if (appointmentDetails.doctorLocation.doctor.phone) {
        phone = appointmentDetails.doctorLocation.doctor.phone
      }
      if (appointmentDetails.doctorLocation.doctor.email) {
        email = appointmentDetails.doctorLocation.doctor.email
      }
      if (appointmentDetails.doctorLocation.doctor.website) {
        website = appointmentDetails.doctorLocation.doctor.website
      }
      if (appointmentDetails.doctorLocation.doctor.websiteuser) {
        websiteUser = appointmentDetails.doctorLocation.doctor.websiteuser
      }
    }
  }
  let titleStyle = 'font-400 w-[30%] text-[15px] text-[#1A1A1A]'
  let valueStyle = 'font-400 ml-2 w-[65%] text-[15px] font-bold text-[#1A1A1A]'
  const refreshData = (isCancel: boolean) => {
    // console.log('in refreshData')
    if (!isCancel) {
      getAppointmentDetails()
      setIsRender(!isRender)
    }
    setIsAddNote(false)
    setIsAddReminder(false)
    setIsAddTransportation(false)
  }
  const editNote = (noteData: any) => {
    // console.log('noteData', JSON.stringify(noteData))
    setNoteData(noteData)
    setIsAddNote(true)
  }
  const editReminder = (remiderData: any) => {
    console.log('remiderData', JSON.stringify(remiderData))
    setReminderData(remiderData)
    setIsAddReminder(true)
  }
  const editTransportation = (transportationData: any) => {
    // console.log('remiderData', JSON.stringify(transportationData))
    setTransportationData(transportationData)
    setIsAddTransportation(true)
  }
  function getDetailsView(
    title: string,
    value: string,
    isIcon: boolean,
    iconValue: any
  ) {
    return (
      <View className="mt-2 w-full flex-row items-center">
        <View className="w-full flex-row">
          <Typography className={titleStyle}>{title}</Typography>
          <Typography className={valueStyle}>{value}</Typography>
        </View>
        {isIcon ? (
          <Feather
            className="ml-[-10px]"
            name={iconValue}
            size={20}
            color={'black'}
          />
        ) : (
          <View />
        )}
      </View>
    )
  }
  return (
    <View className="flex-1 ">
      <PtsLoader loading={isLoading} />
      {isDataReceived ? (
        <View className="absolute top-[0] h-full w-full flex-1 py-2 ">
          <ScrollView persistentScrollbar={true} className="flex-1">
            <View className="border-primary mt-[40] w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-5">
              <View className=" w-full flex-row items-center">
                <View className="w-[80%] flex-row">
                  <Typography className=" font-400 w-[50%] text-[15px] text-[#86939e]">
                    {doctorName}
                  </Typography>
                  <View className="ml-2 h-[25] w-[2px] bg-[#86939e]" />
                  <Typography className="font-400 text-primary ml-2 text-[15px]">
                    {specialist}
                  </Typography>
                </View>
                <Button
                  className=""
                  title="Edit"
                  variant="border"
                  onPress={() => {
                    // router.push(
                    //   formatUrl('/(authenticated)/circles/addEditDoctor', {
                    //     memberData: JSON.stringify(memberData),
                    //     appointmentDetails: JSON.stringify(appointmentDetails),
                    //     component: 'Doctor'
                    //   })
                    // )
                  }}
                />
              </View>
              {getDetailsView('Phone:', phone, true, 'phone')}
              {getDetailsView('Email:', email, true, 'mail')}
              {getDetailsView('Website:', website, true, 'globe')}
              {getDetailsView('Username:', websiteUser, true, 'copy')}
              <View className="my-3 h-[1px] w-full self-center bg-[##86939e]" />
              {getDetailsView('Date:', apptDate, false, '')}
              {getDetailsView('Purpose:', status, false, '')}
              {getDetailsView('Status:', purpose, false, '')}
              {getDetailsView('Description:', description, false, '')}
            </View>
            <View className="border-primary mt-[10] w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-5">
              <Typography className="font-[15px] font-bold text-[#287CFA]">
                {'Location Details'}
              </Typography>
              <View className="w-full">
                <Location data={doctorAddress}></Location>
              </View>
            </View>

            <View className="border-primary mt-[10] w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-5">
              <View className=" w-full flex-row items-center">
                <View className="w-[60%] flex-row">
                  <Typography className="font-400 text-[16px] font-bold text-black">
                    {'Notes'}
                  </Typography>
                </View>
                <Button
                  className=""
                  title="Add Note"
                  leadingIcon="plus"
                  variant="border"
                  onPress={() => {
                    setNoteData({})
                    setIsAddNote(true)
                  }}
                />
              </View>

              {notesList.length > 0 ? (
                <ScrollView className="">
                  {notesList.map((data: any, index: number) => {
                    return (
                      <View key={index}>
                        <Note
                          data={data}
                          refreshData={refreshData}
                          editNote={editNote}
                        />
                      </View>
                    )
                  })}
                </ScrollView>
              ) : (
                <View />
              )}
            </View>

            <View className="border-primary mt-[10] w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-5">
              <View className=" w-full flex-row items-center">
                <View className="w-[50%] flex-row">
                  <Typography className="font-400 text-[16px] font-bold text-black">
                    {'Reminders'}
                  </Typography>
                </View>
                <Button
                  className=""
                  title="Add Reminder"
                  leadingIcon="plus"
                  variant="border"
                  onPress={() => {
                    setReminderData({})
                    setIsAddReminder(true)
                  }}
                />
              </View>

              {remindersList.length > 0 ? (
                <ScrollView className="">
                  {remindersList.map((data: any, index: number) => {
                    data.apointmentId = appointmentDetails.id
                    return (
                      <View key={index}>
                        <Reminder
                          data={data}
                          refreshData={refreshData}
                          editReminder={editReminder}
                        />
                      </View>
                    )
                  })}
                </ScrollView>
              ) : (
                <View />
              )}
            </View>

            <View className="border-primary mt-[10] w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-5">
              <View className=" w-full flex-row items-center">
                <View className="w-[50%] flex-row">
                  <Typography className="font-400 text-[16px] font-bold text-black">
                    {'Transportation'}
                  </Typography>
                </View>
                <Button
                  className=""
                  title="Transportation"
                  leadingIcon="plus"
                  variant="border"
                  onPress={() => {
                    setTransportationData({})
                    setIsAddTransportation(true)
                  }}
                />
              </View>
              {transportationList.length > 0 ? (
                <ScrollView className="">
                  {transportationList.map((data: any, index: number) => {
                    data.apointmentId = appointmentDetails.id
                    return (
                      <View key={index}>
                        <Transportation
                          data={data}
                          refreshData={refreshData}
                          editTransportation={editTransportation}
                        />
                      </View>
                    )
                  })}
                </ScrollView>
              ) : (
                <View />
              )}
            </View>
          </ScrollView>
        </View>
      ) : (
        <View />
      )}
      {isAddNote ? (
        <View className="h-full w-full justify-center self-center">
          <AddEditNote
            noteData={noteData}
            appointmentId={appointmentDetails.id}
            refreshData={refreshData}
          />
        </View>
      ) : (
        <View />
      )}
      {isAddRemider ? (
        <View className="h-full w-full justify-center self-center">
          <AddEditReminder
            reminderData={reminderData}
            appointmentId={appointmentDetails.id}
            refreshData={refreshData}
          />
        </View>
      ) : (
        <View />
      )}
      {isAddTransportation ? (
        <View className="h-full w-full justify-center self-center">
          <AddEditTransport
            transportData={transportationData}
            appointmentId={appointmentDetails.id}
            refreshData={refreshData}
          />
        </View>
      ) : (
        <View />
      )}
    </View>
  )
}
