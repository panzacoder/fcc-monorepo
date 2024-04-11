import { View } from 'react-native'
import { Button } from 'app/ui/button'
import _ from 'lodash'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { PtsDateTimePicker } from 'app/ui/PtsDateTimePicker'
import { Typography } from '../typography'
const schema = z.object({
  title: z.string().min(1, { message: 'Reminder title is required' })
})
export type Schema = z.infer<typeof schema>

export const AddEditReminder = ({
  component,
  reminderData,
  // appointmentId,
  cancelClicked,
  createUpdateReminder
}) => {
  let selectedDate: any = ''
  // console.log('reminderData', JSON.stringify(reminderData))
  const { control, handleSubmit } = useForm({
    defaultValues: {
      title:
        !_.isEmpty(reminderData) && reminderData.content
          ? reminderData.content
          : '',
      dateTime:
        !_.isEmpty(reminderData) && reminderData.note ? reminderData.note : ''
    },
    resolver: zodResolver(schema)
  })
  selectedDate = reminderData.date ? reminderData.date : new Date()

  const onSelection = (date: any) => {
    selectedDate = date
  }
  function createUpdateReminderCall(formData: Schema) {
    createUpdateReminder(formData.title, selectedDate, reminderData)
  }
  return (
    <View className="my-2 w-[90%] self-center rounded-[15px] bg-[#fbe2e3] py-5">
      <Typography className="font-bold self-center">{`${component} Reminder`}</Typography>
      <View className="my-5 w-full">
        <View className="w-full flex-row justify-center gap-2">
          <ControlledTextField
            control={control}
            name="title"
            placeholder={'Title*'}
            className="w-[95%] bg-white"
            autoCapitalize="none"
          />
        </View>
        <PtsDateTimePicker
          currentData={reminderData.date ? reminderData.date : new Date()}
          onSelection={onSelection}
        />

        <View className="mt-5 flex-row justify-center">
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
            title={_.isEmpty(reminderData) ? 'Save' : 'Update'}
            variant="default"
            onPress={handleSubmit(createUpdateReminderCall)}
          />
        </View>
      </View>
    </View>
  )
}