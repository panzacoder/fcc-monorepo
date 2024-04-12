import { useState } from 'react'
import { Alert, View, ScrollView } from 'react-native'
import store from 'app/redux/store'
import { Button } from 'app/ui/button'
import _ from 'lodash'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
let profile = ''
const schema = z.object({
  profileIndex: z.number().min(0, { message: 'Profile is required' }),
  email: z.string().min(1, { message: 'Required' }),
  phone: z.string(),
  firstName: z.string().min(1, { message: 'First name is required ' }),
  latstName: z.string().min(1, { message: 'Last name is required ' })
})
export type Schema = z.infer<typeof schema>

export const AddEditCaregiver = ({
  caregiverDetails,
  cancelClicked,
  createUpdateCaregiver
}) => {
  const staticData: any = store.getState().staticDataState.staticData

  // console.log('caregiverDetails', JSON.stringify(caregiverDetails))

  const profileList = staticData.profileList.map((data: any, index: any) => {
    return {
      title: data.name,
      id: index + 1
    }
  })
  const { control, handleSubmit } = useForm({
    defaultValues: {
      profileIndex: -1,
      email:
        !_.isEmpty(caregiverDetails) && caregiverDetails.email
          ? caregiverDetails.email
          : '',
      phone: '',
      firstName: '',
      latstName: ''
    },
    resolver: zodResolver(schema)
  })
  async function callCreateUpdateDevice(formData: Schema) {}
  return (
    <ScrollView className=" my-2 max-h-[80%] w-full self-center rounded-[15px] border-[1px] border-gray-400 bg-white py-2 ">
      <View className="my-2 w-full">
        <View className="my-2 w-full justify-center">
          <ControlledTextField
            control={control}
            name="email"
            placeholder={'Email*'}
            className="mt-2 w-[95%] self-center bg-white"
            autoCapitalize="none"
          />
          <ControlledTextField
            control={control}
            name="phone"
            placeholder={'Phone'}
            className="mt-2 w-[95%] self-center bg-white"
            autoCapitalize="none"
          />
          <ControlledTextField
            control={control}
            name="firstName"
            placeholder={'First Name*'}
            className="mt-2 w-[95%] self-center bg-white"
            autoCapitalize="none"
          />
          <ControlledTextField
            control={control}
            name="latstName"
            placeholder={'Last Name*'}
            className="mt-2 w-[95%] self-center bg-white"
            autoCapitalize="none"
          />
          <ControlledDropdown
            control={control}
            name="profileIndex"
            label="Profile*"
            maxHeight={300}
            list={profileList}
            className="w-[95%] self-center mt-2"
            defaultValue={!_.isEmpty(caregiverDetails) ? profile : ''}
          />
        </View>

        <View className="my-2 mt-5 flex-row justify-center">
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
            title={'Save'}
            variant="default"
            onPress={handleSubmit(callCreateUpdateDevice)}
          />
        </View>
      </View>
    </ScrollView>
  )
}
