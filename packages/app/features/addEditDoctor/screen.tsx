'use client'

import { useState, useEffect } from 'react'
import { View, Image, TouchableOpacity, Alert, ScrollView } from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import { Button } from 'app/ui/button'

import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' })
})
export function AddEditDoctorScreen() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      firstName: '',
      lastName: ''
    },
    resolver: zodResolver(schema)
  })
  const [isLoading, setLoading] = useState(false)
  return (
    <View className="flex-1 bg-white">
      <PtsLoader loading={isLoading} />
      <Image
        source={require('app/assets/header.png')}
        className="abosolute top-[-40]"
        resizeMode={'contain'}
        alt="logo"
      />
      <View className="absolute top-[0] h-full w-full flex-1 py-2 ">
        <PtsBackHeader title={'New Doctor'} />
        <ScrollView persistentScrollbar={true} className="flex-1">
          <View className="border-primary mt-[40] w-[90%] flex-1  self-center rounded-[10px] border-[1px] p-5">
            <View className="flex-row">
              <View className="w-[50%]"></View>
              <View className="flex-row">
                <Button
                  className=""
                  title="Cancel"
                  variant="link"
                  onPress={() => {}}
                />
                <Button
                  className=""
                  title="Save"
                  variant="default"
                  onPress={() => {}}
                />
              </View>
            </View>
            <View className="my-5 w-full">
              <View className="flex w-full gap-2">
                <ControlledTextField
                  control={control}
                  name="firstName"
                  placeholder={'First Name'}
                  className="w-full"
                  autoCapitalize="none"
                />
                <ControlledTextField
                  control={control}
                  name="lastName"
                  placeholder="Last Name"
                  className="w-full"
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  )
}
