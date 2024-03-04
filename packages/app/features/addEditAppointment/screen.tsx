'use client'
import _ from 'lodash'
import { useState, useEffect, useCallback } from 'react'
import { View, Image, TouchableOpacity, Alert, ScrollView } from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { Button } from 'app/ui/button'
import { CallPostService } from 'app/utils/fetchServerData'
import { BASE_URL } from 'app/utils/urlConstants'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from 'solito/navigation'
import { useRouter } from 'solito/navigation'
import { formatUrl } from 'app/utils/format-url'
import store from 'app/redux/store'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'
import { PtsDateTimePicker } from 'app/ui/PtsDateTimePicker'
const schema = z.object({
  description: z.string(),
  type: z.number().min(0, { message: 'Type is required' })
})
let selectedDate: any = new Date()
export type Schema = z.infer<typeof schema>
export function AddEditAppointmentScreen() {
  const staticData = store.getState().staticDataState.staticData
  const item = useParams<any>()
  let memberData = item.memberData ? JSON.parse(item.memberData) : {}
  let appointmentData = item.appointmentData
    ? JSON.parse(item.appointmentData)
    : {}
  const [isLoading, setLoading] = useState(false)
  const { control, handleSubmit } = useForm({
    defaultValues: {
      description: '',
      type: -1
    },
    resolver: zodResolver(schema)
  })
  const typesList = staticData.appointmentTypeList.map(
    (data: any, index: any) => {
      return {
        label: data.type,
        value: index
      }
    }
  )
  const onSelection = (date: any) => {
    selectedDate = date
  }
  return (
    <View className="w-full flex-1">
      <PtsLoader loading={isLoading} />
      <View className="absolute top-[0] h-full w-full py-2 ">
        <ScrollView persistentScrollbar={true} className="w-full flex-1">
          <View className="mt-5 w-full items-center">
            <ControlledDropdown
              control={control}
              name="type"
              label="Appointment Type*"
              maxHeight={300}
              list={typesList}
              className="w-[95%]"
              // onChangeValue={setSelectedCountryChange}
            />
          </View>
          <View className="w-full">
            <PtsDateTimePicker
              currentData={
                appointmentData.date ? appointmentData.date : new Date()
              }
              onSelection={onSelection}
            />
          </View>
          <View className="my-2 w-full flex-row justify-center gap-2">
            <ControlledTextField
              control={control}
              name="description"
              placeholder={'Description'}
              className="w-[95%] bg-white"
              autoCapitalize="none"
            />
          </View>
          <View className="mt-5 flex-row justify-center">
            <Button
              className="bg-[#287CFA]"
              title="Save"
              leadingIcon="save"
              variant="default"
              onPress={() => {}}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  )
}
