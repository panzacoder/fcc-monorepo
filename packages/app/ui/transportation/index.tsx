import { useState } from 'react'
import { View, Alert, TouchableOpacity } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import _ from 'lodash'
import { convertTimeToUserLocalTime, getAddressFromObject } from 'app/ui/utils'
import { useAppSelector } from 'app/redux/hooks'
import { Button } from 'app/ui/button'
import PtsLoader from 'app/ui/PtsLoader'
import { AddEditReminder } from 'app/ui/addEditReminder'
import { Reminder } from 'app/ui/reminder'
import { logger } from 'app/utils/logger'
import {
  useCreateTransportationReminder,
  useUpdateTransportationReminder,
  useDeleteTransportationReminder,
  useCreateTransportationReminderEvent,
  useUpdateTransportationReminderEvent,
  useDeleteTransportationReminderEvent
} from 'app/data/transportation'
export const Transportation = ({
  component,
  data,
  editTransportation,
  deleteResendCancelTransportation
}) => {
  const [isAddReminder, setIsAddReminder] = useState(false)

  const [remindersData, setReminderData] = useState({})
  const [transportationData, setTransportationData] = useState(data ? data : {})
  const [isRender, setIsRender] = useState(false)
  const header = useAppSelector((state) => state.headerState.header)
  const userAddress = useAppSelector(
    (state) => state.userProfileState.header.address
  )
  const memberAddress = useAppSelector(
    (state) => state.currentMemberAddress.currentMemberAddress
  )
  let list: object[] = []
  if (transportationData.reminderList) {
    list = transportationData.reminderList
  }
  const [remindersList, setRemindersList] = useState(list)
  let creationDate = transportationData.createdOn
    ? convertTimeToUserLocalTime(
        transportationData.createdOn,
        userAddress,
        memberAddress
      )
    : ''
  let acompanyName = transportationData.accompanyName
    ? transportationData.accompanyName
    : ''
  let transportationDate = transportationData.date
    ? convertTimeToUserLocalTime(
        transportationData.date,
        userAddress,
        memberAddress
      )
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

  const createReminderMutation = useCreateTransportationReminder(header)
  const updateReminderMutation = useUpdateTransportationReminder(header)
  const deleteReminderMutation = useDeleteTransportationReminder(header)
  const createReminderEventMutation =
    useCreateTransportationReminderEvent(header)
  const updateReminderEventMutation =
    useUpdateTransportationReminderEvent(header)
  const deleteReminderEventMutation =
    useDeleteTransportationReminderEvent(header)

  const isLoading =
    createReminderMutation.isPending ||
    updateReminderMutation.isPending ||
    deleteReminderMutation.isPending ||
    createReminderEventMutation.isPending ||
    updateReminderEventMutation.isPending ||
    deleteReminderEventMutation.isPending

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
    let reminderPayload: any = {
      id: reminderData.id ? reminderData.id : ''
    }
    if (component === 'Appointment') {
      reminderPayload.appointmentTransportation = {
        id: transportationData.id ? transportationData.id : ''
      }
      deleteReminderMutation.mutate(
        { reminder: reminderPayload },
        {
          onSuccess: (data: any) => {
            setTransportationData(data ? data : {})
            setRemindersList(data?.reminderList ? data.reminderList : [])
            setIsRender(!isRender)
          },
          onError: (error) => {
            Alert.alert('', error.message || 'Failed to delete reminder')
          }
        }
      )
    } else {
      reminderPayload.eventTransportation = {
        id: transportationData.id ? transportationData.id : ''
      }
      deleteReminderEventMutation.mutate(
        { reminder: reminderPayload },
        {
          onSuccess: (data: any) => {
            setTransportationData(data ? data : {})
            setRemindersList(data?.reminderList ? data.reminderList : [])
            setIsRender(!isRender)
          },
          onError: (error) => {
            Alert.alert('', error.message || 'Failed to delete reminder')
          }
        }
      )
    }
  }
  async function createUpdateReminder(
    title: string,
    date: any,
    reminderData: any
  ) {
    let reminderPayload: any = {
      content: title,
      date: date
    }
    if (!_.isEmpty(reminderData)) {
      reminderPayload.id = reminderData.id
    }
    if (component === 'Appointment') {
      reminderPayload.appointmentTransportation = {
        id: transportationData.id ? transportationData.id : ''
      }
      if (_.isEmpty(reminderData)) {
        createReminderMutation.mutate(
          { reminder: reminderPayload },
          {
            onSuccess: (data: any) => {
              setTransportationData(data ? data : {})
              setIsAddReminder(false)
              setRemindersList(data?.reminderList ? data.reminderList : [])
            },
            onError: (error) => {
              Alert.alert('', error.message || 'Failed to create reminder')
            }
          }
        )
      } else {
        updateReminderMutation.mutate(
          { reminder: reminderPayload },
          {
            onSuccess: (data: any) => {
              setTransportationData(data ? data : {})
              setIsAddReminder(false)
              setRemindersList(data?.reminderList ? data.reminderList : [])
            },
            onError: (error) => {
              Alert.alert('', error.message || 'Failed to update reminder')
            }
          }
        )
      }
    } else {
      reminderPayload.eventTransportation = {
        id: transportationData.id ? transportationData.id : ''
      }
      if (_.isEmpty(reminderData)) {
        createReminderEventMutation.mutate(
          { reminder: reminderPayload },
          {
            onSuccess: (data: any) => {
              setTransportationData(data ? data : {})
              setIsAddReminder(false)
              setRemindersList(data?.reminderList ? data.reminderList : [])
            },
            onError: (error) => {
              Alert.alert('', error.message || 'Failed to create reminder')
            }
          }
        )
      } else {
        updateReminderEventMutation.mutate(
          { reminder: reminderPayload },
          {
            onSuccess: (data: any) => {
              setTransportationData(data ? data : {})
              setIsAddReminder(false)
              setRemindersList(data?.reminderList ? data.reminderList : [])
            },
            onError: (error) => {
              Alert.alert('', error.message || 'Failed to update reminder')
            }
          }
        )
      }
    }
  }
  const editReminder = (remiderData: any) => {
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
