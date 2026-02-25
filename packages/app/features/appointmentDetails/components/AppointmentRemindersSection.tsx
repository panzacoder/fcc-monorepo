import { isEmpty } from 'app/ui/utils'
import { useState } from 'react'
import { View, Alert, TouchableOpacity } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { Reminder } from 'app/ui/reminder'
import { AddEditReminder } from 'app/ui/addEditReminder'
import { Button } from 'app/ui/button'
import { useModal } from 'app/utils/useModal'
import { isAfter } from 'date-fns'
import type { ComponentProps } from 'react'
import type { AppointmentDetailsHookReturn } from '../hooks/useAppointmentDetailsData'

interface ReminderItem {
  id: number | string
  content?: string
  date?: string
  apointmentId?: number | string
}

interface AppointmentRemindersSectionProps {
  appointmentId: number | string
  appointmentDate: string | Date
  remindersList: ReminderItem[]
  createReminderMutation: AppointmentDetailsHookReturn['createReminder']
  updateReminderMutation: AppointmentDetailsHookReturn['updateReminder']
  deleteReminderMutation: AppointmentDetailsHookReturn['deleteReminder']
  onRefetch: () => void
}

export function AppointmentRemindersSection({
  appointmentId,
  appointmentDate,
  remindersList,
  createReminderMutation,
  updateReminderMutation,
  deleteReminderMutation,
  onRefetch
}: AppointmentRemindersSectionProps) {
  const reminderModal = useModal<Partial<ReminderItem>>()
  const [isShowReminder, setIsShowReminder] = useState(false)

  const cancelClicked = () => {
    reminderModal.close()
  }

  async function createUpdateReminder(
    title: string,
    date: Date,
    reminderData: {
      id?: number | string
      date?: Date
      content?: string
      note?: string
    }
  ) {
    const reminderPayload = {
      content: title,
      date: date as Date | string,
      appointment: {
        id: appointmentId ? appointmentId : ('' as number | string)
      }
    }

    if (isEmpty(reminderData)) {
      createReminderMutation.mutate(
        { reminder: reminderPayload },
        {
          onSuccess: () => {
            reminderModal.close()
            onRefetch()
          },
          onError: (error) => {
            Alert.alert('', error.message || 'Failed to create reminder')
          }
        }
      )
    } else {
      const updatePayload = { ...reminderPayload, id: reminderData.id }
      updateReminderMutation.mutate(
        { reminder: updatePayload },
        {
          onSuccess: () => {
            reminderModal.close()
            onRefetch()
          },
          onError: (error) => {
            Alert.alert('', error.message || 'Failed to update reminder')
          }
        }
      )
    }
  }

  async function deleteReminder(reminderData: ReminderItem) {
    deleteReminderMutation.mutate(
      {
        reminder: {
          id: reminderData.id ? reminderData.id : '',
          appointment: {
            id: reminderData.apointmentId ? reminderData.apointmentId : ''
          }
        }
      },
      {
        onSuccess: () => {
          onRefetch()
        },
        onError: (error) => {
          Alert.alert('', error.message || 'Failed to delete reminder')
        }
      }
    )
  }

  const editReminder = (reminderData: ReminderItem) => {
    reminderModal.open(reminderData)
  }

  return (
    <>
      <View className="border-primary mt-[10] w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-5">
        <View className=" w-full flex-row items-center">
          <TouchableOpacity
            onPress={() => {
              setIsShowReminder(!isShowReminder)
            }}
            className="w-[50%] flex-row"
          >
            <Typography className="font-400 text-[14px] font-bold text-black">
              {'Reminders'}
              {remindersList.length > 0
                ? ' (' + remindersList.length + ') '
                : ''}
            </Typography>
            {remindersList.length > 0 ? (
              <Feather
                className=""
                name={!isShowReminder ? 'chevron-down' : 'chevron-up'}
                size={20}
                color={'black'}
              />
            ) : (
              <View />
            )}
          </TouchableOpacity>
          {isAfter(
            new Date(appointmentDate ? appointmentDate : ''),
            new Date()
          ) ? (
            <Button
              className=""
              title="Add Reminder"
              leadingIcon="plus"
              variant="border"
              onPress={() => {
                reminderModal.open({})
              }}
            />
          ) : (
            <View />
          )}
        </View>

        {remindersList.length > 0 && isShowReminder ? (
          <ScrollView className="">
            {remindersList.map((data, index) => {
              data.apointmentId = appointmentId
              return (
                <View key={index}>
                  <Reminder
                    data={data}
                    editReminder={
                      editReminder as ComponentProps<
                        typeof Reminder
                      >['editReminder']
                    }
                    deleteReminder={
                      deleteReminder as ComponentProps<
                        typeof Reminder
                      >['deleteReminder']
                    }
                  />
                </View>
              )
            })}
          </ScrollView>
        ) : (
          <View />
        )}
      </View>

      {reminderModal.isOpen ? (
        <View className="mt-[20] h-full w-full">
          <AddEditReminder
            component={'Appointment'}
            reminderData={{
              ...reminderModal.data,
              date: reminderModal.data?.date
                ? new Date(reminderModal.data.date)
                : undefined
            }}
            cancelClicked={cancelClicked}
            createUpdateReminder={createUpdateReminder}
          />
        </View>
      ) : (
        <View />
      )}
    </>
  )
}
