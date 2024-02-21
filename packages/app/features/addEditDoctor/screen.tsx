'use client'
import _ from 'lodash'
import { useState, useEffect } from 'react'
import { View, Image, TouchableOpacity, Alert, ScrollView } from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import { Button } from 'app/ui/button'
import { CallPostService } from 'app/utils/fetchServerData'
import { BASE_URL, CREATE_DOCTOR } from 'app/utils/urlConstants'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from 'solito/navigation'
import ToggleSwitch from 'toggle-switch-react-native'
import store from 'app/redux/store'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'
const schema = z.object({
  firstName: z.string(),
  phone: z.string(),
  website: z.string(),
  username: z.string(),
  portalWebsite: z.string(),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  specialization: z.number().min(0, { message: 'Specialization is required' })
})
export type Schema = z.infer<typeof schema>
export function AddEditDoctorScreen() {
  const staticData = store.getState().staticDataState.staticData
  // console.log('header', JSON.stringify(header))
  const header = store.getState().headerState.header
  const item = useParams<any>()
  let memberData = JSON.parse(item.memberData)
  let doctorDetails = item.doctorDetails ? JSON.parse(item.doctorDetails) : {}
  console.log('doctorDetails', JSON.stringify(doctorDetails))
  const { control, handleSubmit } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      specialization: -1,
      phone: '',
      website: '',
      username: '',
      portalWebsite: ''
    },
    resolver: zodResolver(schema)
  })
  const [isLoading, setLoading] = useState(false)
  const [isActive, setIsActive] = useState(true)
  const specializationList = staticData.specializationList.map(
    (data: any, index: any) => {
      return {
        label: data.specialization,
        value: index
      }
    }
  )
  
  async function createDoctor(formData: Schema) {
    setLoading(true)
    let loginURL = `${BASE_URL}${CREATE_DOCTOR}`
    let dataObject = {
      header: header,
      doctor: {
        member: {
          id: memberData.member
        },
        salutation: 'Dr',
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: '',
        phone: formData.phone,
        website: formData.website,
        websiteuser: formData.username,
        specialist: specializationList[formData.specialization].label
      }
    }

    CallPostService(loginURL, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          console.log('createDoctor')
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
    <View className="flex-1 bg-white">
      <PtsLoader loading={isLoading} />
      <Image
        source={require('app/assets/header.png')}
        className="abosolute top-[-40]"
        resizeMode={'contain'}
        alt="logo"
      />
      <View className="absolute top-[0] h-full w-full flex-1 py-2 ">
        <PtsBackHeader
          title={!_.isEmpty(doctorDetails) ? doctorDetails.doctorName : 'New Doctor'}
        />
        <ScrollView persistentScrollbar={true} className="flex-1">
          <View className="border-primary mt-[40] w-[90%] flex-1  self-center rounded-[10px] border-[1px] p-5">
            <View className="flex-row">
              <View className="w-[50%] flex-row">
                <ToggleSwitch
                  isOn={isActive}
                  onColor="#2884F9"
                  offColor="#2884F9"
                  size="medium"
                  onToggle={(isOn) => setIsActive(!isActive)}
                />
                <Typography className="font-400 ml-2 self-center">
                  {isActive ? 'Active' : 'InActive'}
                </Typography>
              </View>
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
                  onPress={handleSubmit(createDoctor)}
                />
              </View>
            </View>
            <View className="my-5 w-full">
              <View className="w-full flex-row gap-2">
                <ControlledTextField
                  control={control}
                  name="firstName"
                  placeholder={'First Name'}
                  className="w-[50%]"
                  autoCapitalize="none"
                />
                <ControlledTextField
                  control={control}
                  name="lastName"
                  placeholder="Last Name"
                  className="w-[50%]"
                />
              </View>
              <View className="mt-5">
                <ControlledDropdown
                  control={control}
                  name="specialization"
                  label="Specialization"
                  maxHeight={300}
                  list={specializationList}
                  // onChangeValue={setSelectedCountryChange}
                />
              </View>
            </View>
            <View>
              <View className="mb-5 flex-row items-center">
                <Typography className="w-[30%]">{'Contact Info'}</Typography>
                <View className="bg-primary  ml-2 h-[1px] w-[70%]" />
              </View>
              <View className="flex w-full gap-2">
                <ControlledTextField
                  control={control}
                  name="phone"
                  placeholder={'Phone'}
                  className="w-full"
                  autoCapitalize="none"
                />
                <ControlledTextField
                  control={control}
                  name="website"
                  placeholder={'Website'}
                  className="w-full"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View className="mt-2">
              <View className="mb-2 flex-row items-center">
                <Typography className="w-[30%]">{'Portal Details'}</Typography>
                <View className="bg-primary  ml-2 h-[1px] w-[70%]" />
              </View>
              <View className="flex w-full gap-2">
                <ControlledTextField
                  control={control}
                  name="username"
                  placeholder={'Username'}
                  className="w-full"
                  autoCapitalize="none"
                />
                <ControlledTextField
                  control={control}
                  name="portalWebsite"
                  placeholder={'Website'}
                  className="w-full"
                  autoCapitalize="none"
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  )
}
