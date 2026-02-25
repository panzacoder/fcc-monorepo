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
import type { EventReminder } from 'app/data/events/types'
import type { EventDetailsHookReturn } from '../hooks/useEventDetailsData'

type ReminderData = ComponentProps<typeof AddEditReminder>['reminderData'] & {
  id?: number
}

interface EventRemindersSectionProps {
  eventId: number | string
  eventDate: string | Date
  remindersList: EventReminder[]
  createReminderMutation: EventDetailsHookReturn['createReminder']
  updateReminderMutation: EventDetailsHookReturn['updateReminder']
  deleteReminderMutation: EventDetailsHookReturn['deleteReminder']
  onRefetch: () => void
}

export function EventRemindersSection({
  eventId,
  eventDate,
  remindersList,
  createReminderMutation,
  updateReminderMutation,
  deleteReminderMutation,
  onRefetch
}: EventRemindersSectionProps) {
  const reminderModal = useModal<Partial<ReminderData>>()
  const [isShowReminder, setIsShowReminder] = useState(false)

  const cancelClicked = () => {
    reminderModal.close()
  }

  async function createUpdateReminder(
    title: string,
    date: Date,
    reminderData: ReminderData
  ) {
    const reminderPayload = {
      content: title,
      date: String(date),
      event: {
        id: eventId ? eventId : ('' as number | string)
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
      updateReminderMutation.mutate(
        { reminder: { ...reminderPayload, id: reminderData.id } },
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

  async function deleteReminder(reminderData: {
    id?: number | string
    apointmentId?: number | string
  }) {
    deleteReminderMutation.mutate(
      {
        reminder: {
          id: Number(reminderData.id),
          event: {
            id: Number(reminderData.apointmentId ?? 0)
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

  const editReminder = (reminderData: ReminderData) => {
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
          {isAfter(new Date(eventDate ? eventDate : ''), new Date()) ? (
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
        <View className="h-full w-full">
          <AddEditReminder
            component={'Event'}
            reminderData={reminderModal.data ?? {}}
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
