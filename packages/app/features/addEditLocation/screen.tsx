'use client'
import _ from 'lodash'
import { useState, useCallback, useEffect } from 'react'
import { View, Alert, ScrollView } from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { Button } from 'app/ui/button'
import { CallPostService } from 'app/utils/fetchServerData'
import {
  BASE_URL,
  GET_STATES_AND_TIMEZONES,
  CREATE_DOCTOR_LOCATION,
  DELETE_DOCTOR_LOCATION,
  CREATE_FACILITY_LOCATION,
  DELETE_FACILITY_LOCATION,
  UPDATE_FACILITY_LOCATION,
  UPDATE_DOCTOR_LOCATION
} from 'app/utils/urlConstants'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from 'solito/navigation'
import store from 'app/redux/store'
import { formatUrl } from 'app/utils/format-url'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'
import { useRouter } from 'solito/navigation'
import ct from 'countries-and-timezones'
import moment from 'moment-timezone'
const schema = z.object({
  locationShortName: z
    .string()
    .min(1, { message: 'Location short name is required' }),
  address: z.string(),
  city: z.string(),
  postalCode: z.string(),
  phone: z.string(),
  fax: z.string(),
  website: z.string(),
  state: z.number().min(0, { message: 'State is required' }),
  country: z.number().min(0, { message: 'Country is required' })
})
export type Schema = z.infer<typeof schema>
// let statesList = []
let countryIndex = -1
let stateIndex = -1
export function AddEditLocationScreen() {
  const staticData: any = store.getState().staticDataState.staticData
  // console.log('header', JSON.stringify(header))
  const header = store.getState().headerState.header
  const item = useParams<any>()
  const router = useRouter()
  let memberData = item.memberData ? JSON.parse(item.memberData) : {}
  let locationDetails = item.locationDetails
    ? JSON.parse(item.locationDetails)
    : {}

  // console.log('locationDetails', JSON.stringify(locationDetails))
  let details = item.details ? JSON.parse(item.details) : {}
  // console.log('details', JSON.stringify(details))
  const [isLoading, setLoading] = useState(false)
  const [statesList, setStatesList] = useState([])
  const [statesListFull, setStatesListFull] = useState([])

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
        setLoading(false)
        if (data.status === 'SUCCESS') {
          let list = data.data.stateList.map((data: any, index: any) => {
            return {
              label: data.name,
              value: index
            }
          })
          // setCountriesList(countryList)
          setStatesList(list)
          setStatesListFull(data.data.stateList || [])
          if (!_.isEmpty(locationDetails)) {
            let stateName = locationDetails.address.state.name
              ? locationDetails.address.state.name
              : ''
            data.data.stateList.map((data: any, index: any) => {
              if (data.name === stateName) {
                stateIndex = index
              }
            })
          }
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

  useEffect(() => {
    async function setCountryState() {
      let countryName = ''
      if (!_.isEmpty(locationDetails)) {
        countryName = locationDetails.address.state.country.name
          ? locationDetails.address.state.country.name
          : ''
      } else {
        let newTimeZone = moment.tz.guess()
        const countryObject = ct.getCountriesForTimezone(newTimeZone)
        countryName = countryObject[0]?.name ? countryObject[0].name : ''
      }
      staticData.countryList.map(async (data: any, index: any) => {
        if (data.name === countryName) {
          countryIndex = index
        }
      })
      let countryId = staticData.countryList[countryIndex].id
        ? staticData.countryList[countryIndex].id
        : 101
      await getStates(countryId)
    }
    setCountryState()
  }, [])
  const { control, handleSubmit } = useForm({
    defaultValues: {
      locationShortName: !_.isEmpty(locationDetails)
        ? locationDetails.nickName
        : '',
      address: !_.isEmpty(locationDetails) ? locationDetails.address.line : '',
      city: !_.isEmpty(locationDetails) ? locationDetails.address.city : '',
      postalCode: !_.isEmpty(locationDetails)
        ? locationDetails.address.zipCode
        : '',
      phone:
        !_.isEmpty(locationDetails) && locationDetails.phone
          ? locationDetails.phone
          : '',
      fax:
        !_.isEmpty(locationDetails) && locationDetails.fax
          ? locationDetails.fax
          : '',
      website:
        !_.isEmpty(locationDetails) && locationDetails.website
          ? locationDetails.website
          : '',
      country: !_.isEmpty(locationDetails) ? countryIndex : 96,
      state: !_.isEmpty(locationDetails) ? stateIndex : -1
    },
    resolver: zodResolver(schema)
  })
  async function setSelectedCountryChange(value: any) {
    let countryId = staticData.countryList[value.id]?.id
      ? staticData.countryList[value.id].id
      : 101
    await getStates(countryId)
  }
  async function deleteLocation() {
    setLoading(true)
    let url = ''
    let dataObject = {}
    if (item.component === 'Doctor') {
      url = `${BASE_URL}${DELETE_DOCTOR_LOCATION}`
      dataObject = {
        header: header,
        doctorLocation: {
          id: locationDetails.id ? locationDetails.id : '',
          doctor: {
            id: locationDetails.doctorFacilityId
              ? locationDetails.doctorFacilityId
              : ''
          }
        }
      }
    } else {
      url = `${BASE_URL}${DELETE_FACILITY_LOCATION}`
      dataObject = {
        header: header,
        facilityLocation: {
          id: locationDetails.id ? locationDetails.id : '',
          facility: {
            id: locationDetails.doctorFacilityId
              ? locationDetails.doctorFacilityId
              : ''
          }
        }
      }
    }

    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          let details: any = data.data ? JSON.stringify(data.data) : {}
          if (item.component === 'Doctor') {
            router.replace(
              formatUrl('/circles/doctorDetails', {
                doctorDetails: details,
                memberData: JSON.stringify(memberData)
              })
            )
          } else {
            router.back()
          }
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }
  async function addUpdateLocation(formData: Schema) {
    setLoading(true)
    let stateObject = statesListFull[formData.state]
    let countryObject: object = staticData.countryList[formData.country]
    let dataObject = {} as any
    let addressObject = {
      operation: 'add',
      shortDescription: formData.locationShortName,
      nickName: formData.locationShortName,
      fax: formData.fax,
      website: formData.website,
      phone: formData.phone,
      address: {
        id: '',
        line: formData.address,
        city: formData.city,
        zipCode: formData.postalCode,
        state: stateObject
      }
    }
    if (item.component === 'Doctor') {
      dataObject = {
        header: header,
        doctorLocation: addressObject
      }

      if (_.isEmpty(locationDetails)) {
        dataObject.doctorLocation.doctor = {
          id: details.id ? details.id : '',
          member: {
            id: memberData.member ? memberData.member : ''
          }
        }
      } else {
        dataObject.doctorLocation.doctor = {
          id: locationDetails.doctorFacilityId
            ? locationDetails.doctorFacilityId
            : ''
        }
      }
      dataObject.doctorLocation.address.state.country = countryObject
    } else {
      dataObject = {
        header: header,
        facilityLocation: addressObject
      }
      if (_.isEmpty(locationDetails)) {
        dataObject.facilityLocation.facility = {
          id: details.id ? details.id : '',
          member: {
            id: memberData.member ? memberData.member : ''
          }
        }
      } else {
        dataObject.facilityLocation.facility = {
          id: locationDetails.doctorFacilityId
            ? locationDetails.doctorFacilityId
            : ''
        }
      }

      dataObject.facilityLocation.address.state.country = countryObject
    }

    if (!_.isEmpty(locationDetails)) {
      if (item.component === 'Doctor') {
        dataObject.doctorLocation.id = locationDetails.id
      } else {
        dataObject.facilityLocation.id = locationDetails.id
      }
    }

    let url = ''
    if (item.component === 'Doctor') {
      url = _.isEmpty(locationDetails)
        ? `${BASE_URL}${CREATE_DOCTOR_LOCATION}`
        : `${BASE_URL}${UPDATE_DOCTOR_LOCATION}`
    } else {
      url = _.isEmpty(locationDetails)
        ? `${BASE_URL}${CREATE_FACILITY_LOCATION}`
        : `${BASE_URL}${UPDATE_FACILITY_LOCATION}`
    }

    CallPostService(url, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          if (item.component === 'Doctor') {
            let details: any = data.data.doctor
              ? JSON.stringify(data.data.doctor)
              : {}
            router.replace(
              formatUrl('/circles/doctorDetails', {
                doctorDetails: details,
                memberData: JSON.stringify(memberData)
              })
            )
          } else {
            router.back()
          }
        } else {
          Alert.alert('', data.message)
        }
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }
  return (
    <View className="flex-1 bg-white">
      <PtsLoader loading={isLoading} />

      <View className="absolute top-[0] h-full w-full flex-1 py-2 ">
        <ScrollView persistentScrollbar={true} className="flex-1">
          <View className="border-primary mt-[40] w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-5">
            <View className="flex-row">
              <View className="w-[45%] flex-row items-center">
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
                  title={_.isEmpty(locationDetails) ? 'Save' : 'Update'}
                  variant="default"
                  onPress={handleSubmit(addUpdateLocation)}
                />
              </View>
            </View>
            <View className="my-5 w-full">
              <View className="flex w-full gap-2">
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
                    name="city"
                    placeholder={'City'}
                    className="w-[50%]"
                    autoCapitalize="none"
                  />
                  <ControlledTextField
                    control={control}
                    name="postalCode"
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
                <ControlledTextField
                  control={control}
                  name="website"
                  placeholder={'Website'}
                  className="w-full"
                  autoCapitalize="none"
                />
              </View>
            </View>
          </View>
          {!_.isEmpty(locationDetails) ? (
            <View className="mx-5 my-5">
              <Button
                className=""
                title="Delete"
                variant="borderRed"
                onPress={() => {
                  Alert.alert(
                    'Are you sure about deleting Location?',
                    'It cannot be recovered once deleted.',
                    [
                      {
                        text: 'Ok',
                        onPress: () => deleteLocation()
                      },
                      { text: 'Cancel', onPress: () => {} }
                    ]
                  )
                }}
              />
            </View>
          ) : (
            <View />
          )}
        </ScrollView>
      </View>
    </View>
  )
}
