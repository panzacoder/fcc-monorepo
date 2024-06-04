import { View, Alert, Pressable } from 'react-native'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { convertTimeToUserLocalTime } from 'app/ui/utils'
import { getUserPermission } from 'app/utils/getUserPemissions'
export const Note = ({
  component,
  data,
  editNote,
  deleteNote,
  messageThreadClicked,
  notePrivileges
}) => {
  let noteData = data ? data : {}
  let creationDate = noteData.createdOn
    ? convertTimeToUserLocalTime(noteData.createdOn)
    : ''
  // console.log('noteData', JSON.stringify(data))
  async function callDeletNote() {
    deleteNote(noteData.id)
  }
  return (
    <View className="my-2 w-full self-center rounded-[5px] border-[1px] border-[#dbc672] bg-[#FCF3CF] py-2">
      <View className="w-full flex-row">
        <View className="max-w-[60%]">
          <Typography className="font-400 ml-2 text-[#1A1A1A]">
            {noteData.shortDescription ? noteData.shortDescription : ''}
          </Typography>
        </View>
        <View className="absolute right-0 flex-row">
          {!noteData.hasMsgThread &&
          getUserPermission(notePrivileges).deletePermission ? (
            <Pressable className="bg-primary mx-1 h-[30] w-[30] items-center justify-center rounded-[15px]">
              <Feather
                className="self-center"
                onPress={() => {
                  Alert.alert(
                    `Are you sure about deleting ${component} Note?`,
                    'It cannot be recovered once deleted.',
                    [
                      {
                        text: 'Ok',
                        onPress: () => callDeletNote()
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
          ) : (
            <View />
          )}
          {getUserPermission(notePrivileges).updatePermission ? (
            <Pressable className="bg-primary mx-1 h-[30] w-[30] items-center justify-center rounded-[15px]">
              <Feather
                className=""
                onPress={() => {
                  editNote(noteData)
                }}
                name={'edit-2'}
                size={15}
                color={'white'}
              />
            </Pressable>
          ) : (
            <View />
          )}

          <Pressable className="bg-primary mx-1 h-[30] w-[30] items-center justify-center rounded-[15px]">
            <Feather
              className=""
              onPress={() => {
                messageThreadClicked(noteData)
              }}
              name={noteData.hasMsgThread ? 'message-circle' : 'plus-square'}
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
      <View className="flex-row">
        <Typography className="font-400 ml-2 w-[65%] text-[10px] text-[#1A1A1A]">
          {noteData.createdByName
            ? 'Created by ' + noteData.createdByName + ' on ' + creationDate
            : ''}
        </Typography>
        <Typography className="font-400 mr-5 text-right text-[10px] text-[#1A1A1A]">
          {noteData.occurance && noteData.occurance.occurance
            ? noteData.occurance.occurance
            : ''}
        </Typography>
      </View>
    </View>
  )
}
