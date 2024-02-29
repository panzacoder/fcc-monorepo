import { useState } from 'react'
import { View, Alert, Pressable } from 'react-native'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { useRouter } from 'solito/navigation'
import { CallPostService } from 'app/utils/fetchServerData'
import PtsLoader from 'app/ui/PtsLoader'
import { BASE_URL, DELETE_APPOINTMENT_NOTE } from 'app/utils/urlConstants'
import { convertTimeToUserLocalTime } from 'app/ui/utils'
import store from 'app/redux/store'
import { formatUrl } from 'app/utils/format-url'
export const Note = ({ data, refreshData, editNote }) => {
  const router = useRouter()
  const [isLoading, setLoading] = useState(false)
  const header = store.getState().headerState.header
  let noteData = data ? data : {}
  let creationDate = noteData.createdOn
    ? convertTimeToUserLocalTime(noteData.createdOn)
    : ''
  // console.log('noteData', JSON.stringify(data))
  async function deleteNote() {
    setLoading(true)
    let loginURL = `${BASE_URL}${DELETE_APPOINTMENT_NOTE}`
    let dataObject = {
      header: header,
      appointmentNote: {
        id: noteData.id
      }
    }
    // console.log('dataObject', JSON.stringify(dataObject))
    CallPostService(loginURL, dataObject)
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
    <View className="my-2 w-full self-center rounded-[5px] border-[1px] border-[#dbc672] bg-[#FCF3CF] py-2">
      <PtsLoader loading={isLoading} />
      <View className="w-full flex-row">
        <View className="w-[60%]">
          <Typography className="font-400 ml-2 text-[#1A1A1A]">
            {noteData.shortDescription ? noteData.shortDescription : ''}
          </Typography>
        </View>
        <View className="flex-row">
          <Pressable className="bg-primary mx-1 h-[30] w-[30] items-center justify-center rounded-[15px]">
            <Feather
              className="self-center"
              onPress={() => {
                Alert.alert(
                  'Are you sure about deleting Appointment Note?',
                  'It cannot be recovered once deleted.',
                  [
                    {
                      text: 'Ok',
                      onPress: () => deleteNote()
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
                editNote(noteData)
              }}
              name={'edit-2'}
              size={15}
              color={'white'}
            />
          </Pressable>
          <Pressable className="bg-primary mx-1 h-[30] w-[30] items-center justify-center rounded-[15px]">
            <Feather
              className="self-center"
              onPress={() => {}}
              name={'message-circle'}
              size={15}
              color={'white'}
            />
          </Pressable>
        </View>
      </View>
      <View>
        <Typography className=" font-400 ml-2 ml-2 text-[#1A1A1A]">
          {noteData.note ? noteData.note : ''}
        </Typography>
      </View>
      <View className="my-2 h-[1px] w-full bg-[#86939e]" />
      <View>
        <Typography className=" font-400 ml-2 text-[10px] text-[#1A1A1A]">
          {noteData.createdByName
            ? 'Created by ' + noteData.createdByName + ' on ' + creationDate
            : ''}
        </Typography>
      </View>
    </View>
  )
}
