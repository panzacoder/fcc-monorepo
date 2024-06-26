import { useState } from 'react'
import { View, Alert, TouchableOpacity } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import _ from 'lodash'
import { CallPostService } from 'app/utils/fetchServerData'
import {
  BASE_URL,
  CREATE_TRANSPORTATION_REMINDER,
  UPDATE_TRANSPORTATION_REMINDER,
  DELETE_TRANSPORTATION_REMINDER,
  CREATE_TRANSPORTATION_REMINDER_EVENT,
  UPDATE_TRANSPORTATION_REMINDER_EVENT,
  DELETE_TRANSPORTATION_REMINDER_EVENT
} from 'app/utils/urlConstants'
import { convertTimeToUserLocalTime, getAddressFromObject } from 'app/ui/utils'
import store from 'app/redux/store'
import { Button } from 'app/ui/button'
import PtsLoader from 'app/ui/PtsLoader'
import { AddEditReminder } from 'app/ui/addEditReminder'
import { Reminder } from 'app/ui/reminder'
export const Transportation = ({
  component,
  data,
  editTransportation,
  deleteResendCancelTransportation
}) => {
  const [isAddReminder, setIsAddReminder] = useState(false)

  const [remindersData, setReminderData] = useState({})
  const [transportationData, setTransportationData] = useState(data ? data : {})
  const [isLoading, setLoading] = useState(false)
  const [isRender, setIsRender] = useState(false)
  const header = store.getState().headerState.header
  // console.log('transportationData', JSON.stringify(data))
  let list: object[] = []
  if (transportationData.reminderList) {
    // reminderList = transportationData.reminderList
    list = transportationData.reminderList
  }
  const [remindersList, setRemindersList] = useState(list)
  let creationDate = transportationData.createdOn
    ? convertTimeToUserLocalTime(transportationData.createdOn)
    : ''
  let acompanyName = transportationData.accompanyName
    ? transportationData.accompanyName
    : ''
  let transportationDate = transportationData.date
    ? convertTimeToUserLocalTime(transportationData.date)
    : ''
  let description = transportationData.description
    ? transportationData.description
    : ''
  let status =
    transportationData.status && transportationData.status.status
      ? transportationData.status.status
      : ''
  let address = transportationData.address
    ? getAddressFromObject(transportationData.address)
    : ''
  async function callDeleteResendCancelTransportation(count: any) {
    deleteResendCancelTransportation(count, transportationData)
  }

  let titleStyle = 'font-400 w-[30%] text-[15px] text-[#1A1A1A] ml-2'
  let valueStyle = 'font-400 ml-2 w-[65%] text-[15px] font-bold text-[#1A1A1A]'
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
  function cancelClicked() {
    setIsAddReminder(false)
  }
  async function deleteReminder(reminderData: any) {
    setLoading(true)
    let url = ''
    if (component === 'Appointment') {
      url = `${BASE_URL}${DELETE_TRANSPORTATION_REMINDER}`
    } else {
      url = `${BASE_URL}${DELETE_TRANSPORTATION_REMINDER_EVENT}`
    }

    let dataObject: any = {
      header: header,
      reminder: {
        id: reminderData.id ? reminderData.id : ''
      }
    }
    if (component === 'Appointment') {
      dataObject.reminder.appointmentTransportation = {
        id: transportationData.id ? transportationData.id : ''
      }
    } else {
      dataObject.reminder.eventTransportation = {
        id: transportationData.id ? transportationData.id : ''
      }
    }
    // console.log('dataObject', JSON.stringify(dataObject))
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          setTransportationData(data.data ? data.data : {})
          setRemindersList(data.data.reminderList ? data.data.reminderList : [])
          setIsRender(!isRender)
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }
  async function createUpdateReminder(
    title: string,
    date: any,
    reminderData: any
  ) {
    setLoading(true)
    let url = ''
    let dataObject: any = {
      header: header,
      reminder: {
        content: title,
        date: date
      }
    }
    if (_.isEmpty(reminderData)) {
      if (component === 'Appointment') {
        url = `${BASE_URL}${CREATE_TRANSPORTATION_REMINDER}`
      } else {
        url = `${BASE_URL}${CREATE_TRANSPORTATION_REMINDER_EVENT}`
      }
    } else {
      if (component === 'Appointment') {
        url = `${BASE_URL}${UPDATE_TRANSPORTATION_REMINDER}`
      } else {
        url = `${BASE_URL}${UPDATE_TRANSPORTATION_REMINDER_EVENT}`
      }
      dataObject.reminder.id = reminderData.id
    }
    if (component === 'Appointment') {
      dataObject.reminder.appointmentTransportation = {
        id: transportationData.id ? transportationData.id : ''
      }
    } else {
      dataObject.reminder.eventTransportation = {
        id: transportationData.id ? transportationData.id : ''
      }
    }
    // console.log('dataObject', JSON.stringify(dataObject))
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          setTransportationData(data.data ? data.data : {})
          setIsAddReminder(false)
          setRemindersList(data.data.reminderList ? data.data.reminderList : [])
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }
  const editReminder = (remiderData: any) => {
    // console.log('remiderData', JSON.stringify(remiderData))
    setReminderData(remiderData)
    setIsAddReminder(true)
  }
  return (
    <View className="my-2 w-full self-center rounded-[5px] border-[1px] border-[#d2b1de] bg-[#f4ecf7] py-2">
      <PtsLoader loading={isLoading} />
      <View className="w-full flex-row">
        <View className="w-[70%]">
          <Typography className="text-primary ml-2 ">
            {'Transportation Details'}
          </Typography>
        </View>
        <View className="flex-row">
          <TouchableOpacity className="bg-primary mx-1 h-[30] w-[30] items-center justify-center rounded-[15px]">
            <Feather
              className="self-center"
              onPress={() => {
                Alert.alert(
                  'Are you sure about deleting Transportation?',
                  'It cannot be recovered once deleted.',
                  [
                    {
                      text: 'Ok',
                      onPress: () => callDeleteResendCancelTransportation(0)
                    },
                    { text: 'Cancel', onPress: () => {} }
                  ]
                )
              }}
              name={'trash'}
              size={15}
              color={'white'}
            />
          </TouchableOpacity>
          <TouchableOpacity className="bg-primary mx-1 h-[30] w-[30] items-center justify-center rounded-[15px]">
            <Feather
              className="self-center"
              onPress={() => {
                editTransportation(transportationData)
              }}
              name={'edit-2'}
              size={15}
              color={'white'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {getDetailsView('Acompany', acompanyName, false, '')}
      {getDetailsView('Date', transportationDate, false, '')}
      {getDetailsView('Description', description, false, '')}
      {getDetailsView('Status', status, false, '')}
      {getDetailsView('Address', address, false, '')}
      <View className="f-full ml-2 flex-row">
        <Typography className="w-[85%]">{'Reminder'}</Typography>
        <TouchableOpacity className="bg-primary mx-1 h-[30] w-[30] items-center justify-center rounded-[15px]">
          <Feather
            className="self-center"
            onPress={() => {
              setIsAddReminder(true)
            }}
            name={'plus'}
            size={15}
            color={'white'}
          />
        </TouchableOpacity>
      </View>
      {isAddReminder ? (
        <View className="">
          <AddEditReminder
            component={'Transportation'}
            reminderData={remindersData}
            cancelClicked={cancelClicked}
            createUpdateReminder={createUpdateReminder}
          />
        </View>
      ) : (
        <View />
      )}
      {remindersList.length > 0 ? (
        <ScrollView className="w-[95%]">
          {remindersList.map((data: any, index: number) => {
            return (
              <View key={index} className="ml-4">
                <Reminder
                  data={data}
                  editReminder={editReminder}
                  deleteReminder={deleteReminder}
                />
              </View>
            )
          })}
        </ScrollView>
      ) : (
        <View />
      )}
      {transportationData.showResendButton ||
      transportationData.showCancelButton ? (
        <View className=" mt-5 items-center">
          {transportationData.showResendButton ? (
            <Button
              className="w-[50%] bg-[#066f72]"
              title="Resend Request"
              variant="default"
              onPress={() => {
                callDeleteResendCancelTransportation(1)
              }}
            />
          ) : (
            <View />
          )}
          {transportationData.showCancelButton ? (
            <Button
              className="mt-2 w-[50%] bg-[#3498db]"
              title={'Cancel Request'}
              variant="default"
              onPress={() => {
                callDeleteResendCancelTransportation(2)
              }}
            />
          ) : (
            <View />
          )}
        </View>
      ) : (
        <View />
      )}

      <View className="mt-2 h-[1px] w-full bg-[#86939e]" />
      <View>
        <Typography className=" font-400 ml-2 text-[10px] text-[#1A1A1A]">
          {transportationData.createdByName
            ? 'Created by ' +
              transportationData.createdByName +
              ' on ' +
              creationDate
            : ''}
        </Typography>
      </View>
    </View>
  )
}
