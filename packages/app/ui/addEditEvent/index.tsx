import { View } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import store from 'app/redux/store'
import { Button } from 'app/ui/button'
import _ from 'lodash'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { FormProvider, useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { PtsDateTimePicker } from 'app/ui/PtsDateTimePicker'
import { addressSchema, AddressFields } from 'app/ui/form-fields/address-fields'
let selectedDate: any = new Date()
const schema = addressSchema.extend({
  description: z.string(),
  title: z.string().min(1, { message: 'Enter event title' })
})
// const schema = z.object({
//   description: z.string(),
//   title: z.string().min(1, { message: 'Enter event title' })
// })
export type Schema = z.infer<typeof schema>
export const AddEditEvent = ({
  component,
  createUpdateEvent,
  cancelClicked
}) => {
  const staticData = store.getState().staticDataState.staticData
  const onSelection = (date: any) => {
    selectedDate = date
  }
  // const { control, handleSubmit } = useForm({
  //   defaultValues: {
  //     description: '',
  //     title: ''
  //   },
  //   resolver: zodResolver(schema)
  // })
  const formMethods = useForm<Schema>({
    resolver: zodResolver(schema)
  })
  async function callCreateUpdateEvent(formData: Schema) {
    console.log('in callCreateUpdateEvent', JSON.stringify(formData))
    // createUpdateEvent(formData,selectedDate)
  }
  async function callFunction() {
    console.log('in callFunction')
  }
  return (
    <View className="my-2 mb-10 w-full rounded-[2px] border-[1px] border-gray-400 bg-white py-5">
      <FormProvider {...formMethods}>
        <ScrollView className="mx-2">
          <View className="w-full">
            <PtsDateTimePicker
              currentData={new Date()}
              onSelection={onSelection}
            />
          </View>
          <View className="my-2 w-full flex-row justify-center">
            <ControlledTextField
              // control={control}
              name="title"
              placeholder={'Title*'}
              className="w-[95%] bg-white"
              autoCapitalize="none"
              onSubmitEditing={() => {
                formMethods.setFocus('description')
              }}
            />
          </View>
          <View className="w-full flex-row justify-center">
            <ControlledTextField
              // control={control}
              name="description"
              placeholder={'Description'}
              className="w-[95%] bg-white"
              autoCapitalize="none"
            />
          </View>
          <View className="mt-2 w-[95%] self-center">
            <AddressFields />
          </View>

          <View className="my-2 mb-5 flex-row justify-center">
            <Button
              className="bg-[#86939e]"
              title={'Cancel'}
              leadingIcon="x"
              variant="default"
              onPress={cancelClicked}
            />
            <Button
              className="ml-5 bg-[#287CFA]"
              title={'Save'}
              leadingIcon="save"
              variant="default"
              onPress={formMethods.handleSubmit(callCreateUpdateEvent)}
            />
          </View>
        </ScrollView>
      </FormProvider>
    </View>
  )
}
