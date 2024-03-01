import { useState } from 'react'
import { View, Alert, Pressable } from 'react-native'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { CallPostService } from 'app/utils/fetchServerData'
import PtsLoader from 'app/ui/PtsLoader'
import { BASE_URL, DELETE_APPOINTMENT_REMINDER } from 'app/utils/urlConstants'
import { convertTimeToUserLocalTime, convertUserTimeToUTC } from 'app/ui/utils'
import store from 'app/redux/store'
import { Timer } from 'app/utils/timer'

export const Reminder = ({ data, refreshData, editReminder }) => {
  const [isLoading, setLoading] = useState(false)
  const header = store.getState().headerState.header
  let reminderData = data ? data : {}
  let creationDate = reminderData.createdOn
    ? convertTimeToUserLocalTime(reminderData.createdOn)
    : ''
  let reminderDate = reminderData.date
    ? convertTimeToUserLocalTime(reminderData.date)
    : ''
  // console.log('reminderData', JSON.stringify(data))
  async function deleteReminder() {
    setLoading(true)
    let url = `${BASE_URL}${DELETE_APPOINTMENT_REMINDER}`
    let dataObject = {
      header: header,
      reminder: {
        id: reminderData.id ? reminderData.id : '',
        appointment: {
          id: reminderData.apointmentId ? reminderData.apointmentId : ''
        }
      }
    }
    // console.log('dataObject', JSON.stringify(dataObject))
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          // console.log('createDoctor', JSON.stringify(data))
          // router.push(
          //   formatUrl('/(authenticated)/circles/doctors', {
          //     memberData: JSON.stringify(memberData)
          //   })
          // )
          // router.back()
          refreshData()
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }
  return (
    <View className="my-2 w-full self-center rounded-[5px] border-[1px] border-[#e09093] bg-[#fbe2e3] py-2">
      <PtsLoader loading={isLoading} />
      <View className="w-full flex-row">
        <View className="w-[70%] self-center">
          <Typography className="font-400 ml-5 self-center text-[#1A1A1A]">
            {reminderData.content ? reminderData.content : ''}
          </Typography>
        </View>
        <View className="flex-row">
          <Pressable className="bg-primary mx-1 h-[30] w-[30] items-center justify-center rounded-[15px]">
            <Feather
              className="self-center"
              onPress={() => {
                Alert.alert(
                  'Are you sure about deleting Reminder?',
                  'It cannot be recovered once deleted.',
                  [
                    {
                      text: 'Ok',
                      onPress: () => deleteReminder()
                    },
                    { text: 'Cancel', onPress: () => {} }
                  ]
                )
              }}
              name={'trash'}
              size={15}
              color={'white'}
            />
          </Pressable>
          <Pressable className="bg-primary mx-1 h-[30] w-[30] items-center justify-center rounded-[15px]">
            <Feather
              className="self-center"
              onPress={() => {
                editReminder(reminderData)
              }}
              name={'edit-2'}
              size={15}
              color={'white'}
            />
          </Pressable>
        </View>
      </View>
      <View>
        <Typography className="font-400 my-2 self-center font-bold text-[#1A1A1A]">
          {reminderDate}
        </Typography>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Timer startDate={convertUserTimeToUTC(reminderData.date)} />
        </View>
      </View>
      <View className="mt-2 h-[1px] w-full bg-[#86939e]" />
      <View>
        <Typography className=" font-400 ml-2 text-[10px] text-[#1A1A1A]">
          {reminderData.createdByName
            ? 'Created by ' + reminderData.createdByName + ' on ' + creationDate
            : ''}
        </Typography>
      </View>
    </View>
  )
}
