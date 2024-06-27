import { View } from 'react-native'
import { useState } from 'react'
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
  cancelClicked,
  createUpdateReminder
}) => {
  const [selectedDate, setSelectedDate] = useState(
    reminderData.date ? reminderData.date : new Date()
  )
  const [key, setKey] = useState(0)
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

  const onSelection = (date: any) => {
    setSelectedDate(date)
    setKey(Math.random())
  }
  function createUpdateReminderCall(formData: Schema) {
    createUpdateReminder(formData.title, selectedDate, reminderData)
  }
  return (
    <View
      key={key}
      className="my-2 w-[90%] self-center rounded-[15px] border-[0.5px] border-gray-400 bg-[#fbe2e3] py-5"
    >
      <Typography className="self-center font-bold">{`${_.isEmpty(reminderData) ? 'Add ' : 'Edit '} ${component} Reminder`}</Typography>
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
        <View className="w-[95%] self-center">
          <PtsDateTimePicker
            currentData={selectedDate}
            onSelection={onSelection}
          />
        </View>
        <View className="mt-5 flex-row justify-center">
          <Button
            className="bg-[#86939e]"
            title="Cancel"
            leadingIcon="x"
            variant="default"
            onPress={() => {
              cancelClicked()
            }}
          />
          <Button
            className="ml-5"
            title={_.isEmpty(reminderData) ? 'Create' : 'Save'}
            variant="default"
            leadingIcon="save"
            onPress={handleSubmit(createUpdateReminderCall)}
          />
        </View>
      </View>
    </View>
  )
}
