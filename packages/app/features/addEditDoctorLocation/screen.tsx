'use client'
import _ from 'lodash'
import { useState, useEffect, useCallback } from 'react'
import { View, Image, TouchableOpacity, Alert, ScrollView } from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import { Button } from 'app/ui/button'
import { CallPostService } from 'app/utils/fetchServerData'
import {
  BASE_URL,
  CREATE_DOCTOR,
  GET_STATES_AND_TIMEZONES
} from 'app/utils/urlConstants'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from 'solito/navigation'
import ToggleSwitch from 'toggle-switch-react-native'
import store from 'app/redux/store'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'

const schema = z.object({
  locationDesc: z
    .string()
    .min(1, { message: 'Location description is required' }),
  locationShortName: z
    .string()
    .min(1, { message: 'Location short name is required' }),
  address: z.string(),
  city: z.string(),
  postalCode: z.string(),
  phone: z.string(),
  fax: z.string(),
  state: z.number().min(1, { message: 'State is required' }),
  country: z.number().min(1, { message: 'Country is required' })
})
export type Schema = z.infer<typeof schema>
export function AddEditDoctorLocationScreen() {
  const staticData = store.getState().staticDataState.staticData
  // console.log('header', JSON.stringify(header))
  const header = store.getState().headerState.header
  const item = useParams<any>()
  let memberData = JSON.parse(item.memberData)
  let doctorDetails = item.doctorDetails ? JSON.parse(item.doctorDetails) : {}
  const [isLoading, setLoading] = useState(false)
  const { control, handleSubmit } = useForm({
    defaultValues: {
      locationDesc: '',
      locationShortName: '',
      address: '',
      city: '',
      postalCode: '',
      phone: '',
      fax: '',
      country: -1,
      state: -1
    },
    resolver: zodResolver(schema)
  })
  let statesList = []
  const countryList = staticData.countryList.map((data: any, index: any) => {
    return {
      label: data.name,
      value: index
    }
  })
  const getStates = useCallback(async (countryId: any) => {
    setLoading(true)
    let url = `${BASE_URL}${GET_STATES_AND_TIMEZONES}`
    let dataObject = {
      country: {
        id: countryId || 101
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        console.log('data', data)
        setLoading(false)
        if (data.status === 'SUCCESS') {
          // set available states
          statesList = data.data.stateList.map((data: any) => {
            return {
              label: data.name,
              value: data.id
            }
          })
          console.log('statesList', statesList)
        } else {
          Alert.alert('', data.message)
        }
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }, [])
  async function setSelectedCountryChange(value: any) {
    await getStates(value)
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
          title={
            doctorDetails.doctorName ? doctorDetails.doctorName : 'Add Location'
          }
        />
        <ScrollView persistentScrollbar={true} className="flex-1">
          <View className="border-primary mt-[40] w-[90%] flex-1  self-center rounded-[10px] border-[1px] p-5">
            <View className="flex-row">
              <View className="w-[50%] flex-row items-center">
                <Typography className="font-400 text-[16px]">
                  {'Add Location'}
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
                  // onPress={handleSubmit(createDoctor)}
                />
              </View>
            </View>
            <View className="my-5 w-full">
              <View className="flex w-full gap-2">
                <ControlledTextField
                  control={control}
                  name="locationDesc"
                  placeholder={'Location Description'}
                  className="w-full"
                  autoCapitalize="none"
                />
                <ControlledTextField
                  control={control}
                  name="locationShortName"
                  placeholder="Short Name"
                  className="w-full"
                />
                <ControlledTextField
                  control={control}
                  name="address"
                  placeholder="Address"
                  className="w-full"
                />
                <ControlledDropdown
                  control={control}
                  name="country"
                  label="Country"
                  maxHeight={300}
                  list={countryList}
                  onChangeValue={setSelectedCountryChange}
                />
                <ControlledDropdown
                  control={control}
                  name="state"
                  label="State*"
                  maxHeight={300}
                  list={statesList}
                />
                <View className="w-full flex-row gap-2">
                  <ControlledTextField
                    control={control}
                    name="address"
                    placeholder={'City'}
                    className="w-[50%]"
                    autoCapitalize="none"
                  />
                  <ControlledTextField
                    control={control}
                    name="address"
                    placeholder="Postal Code"
                    className="w-[48%]"
                  />
                </View>
                <ControlledTextField
                  control={control}
                  name="phone"
                  placeholder={'Phone'}
                  className="w-full"
                  autoCapitalize="none"
                />
                <ControlledTextField
                  control={control}
                  name="fax"
                  placeholder={'Fax'}
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
