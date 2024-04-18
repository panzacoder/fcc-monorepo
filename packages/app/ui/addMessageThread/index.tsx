import { View, ScrollView } from 'react-native'
import { Button } from 'app/ui/button'
import _ from 'lodash'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { CheckBox } from 'react-native-elements'
import { zodResolver } from '@hookform/resolvers/zod'
import { Typography } from '../typography'
const schema = z.object({
  subject: z.string().min(1, { message: 'Subject is required' })
})
export type Schema = z.infer<typeof schema>
export const AddMessageThread = ({
  participantsList,
  noteData,
  cancelClicked,
  isParticipantSelected,
  createMessageThread,
  isUpdateParticipants
}) => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      subject:
        !_.isEmpty(noteData) && noteData.shortDescription
          ? noteData.shortDescription
          : ''
    },
    resolver: zodResolver(schema)
  })
  function callCreateMessageThread(formData: Schema) {
    createMessageThread(formData.subject, noteData)
  }
  return (
    <View className="h-[75%] w-[90%] self-center rounded-[15px] bg-[#dfedcc]">
      <Typography className="py-2 text-center font-bold">
        {'New Communication Thread'}
      </Typography>
      <View className="w-full">
        {!isUpdateParticipants ? (
          <View className="w-full flex-row justify-center gap-2">
            <ControlledTextField
              control={control}
              name="subject"
              placeholder={'Subject*'}
              className="w-[95%] bg-white"
              autoCapitalize="none"
            />
          </View>
        ) : (
          <View />
        )}

        <Typography className="ml-3 mt-2 font-bold">
          {"Caregivers' List"}
        </Typography>
        <View className="mt-1 h-[1px] w-full bg-gray-400" />
        <ScrollView className="h-[65%] max-h-[65%]">
          {participantsList.map((data: any, index: number) => {
            return (
              <View className=" w-full items-center" key={index}>
                <View className="ml-4 flex-row items-center">
                  <Typography className="w-[80%]">
                    {data.name ? data.name : ''}
                  </Typography>

                  <CheckBox
                    checked={data.isSelected ? data.isSelected : false}
                    checkedColor={'#6493d9'}
                    onPress={() => {
                      isParticipantSelected(index)
                    }}
                    className="my-0"
                  />
                </View>
                <View className="mt-1 h-[1px] w-full bg-gray-400" />
              </View>
            )
          })}
        </ScrollView>
        <View className="mb-4 mt-1 flex-row justify-center">
          <Button
            className="bg-[#86939e]"
            title="Cancel"
            variant="default"
            onPress={() => {
              cancelClicked()
            }}
          />
          <Button
            className="ml-5"
            title={
              isUpdateParticipants ? 'Update Participant' : 'Start Messaging'
            }
            variant="default"
            onPress={handleSubmit(callCreateMessageThread)}
          />
        </View>
      </View>
    </View>
  )
}
