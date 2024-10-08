import { View, Alert } from 'react-native'
import { useState, useEffect, useCallback } from 'react'
import _ from 'lodash'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import store from 'app/redux/store'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import PtsLoader from 'app/ui/PtsLoader'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'
import { CallPostService } from 'app/utils/fetchServerData'
import { BASE_URL, GET_STATES_AND_TIMEZONES } from 'app/utils/urlConstants'
import ct from 'countries-and-timezones'
import moment from 'moment-timezone'
const schema = z.object({
  locationName: z.string(),
  line: z.string(),
  city: z.string(),
  postalCode: z.string(),
  state: z.number().min(0, { message: 'State is required' }),
  country: z.number().min(0, { message: 'Country is required' }),
  timeZone: z.number().min(0, { message: 'Timezone is required' })
})
const schema1 = z.object({
  shortName: z.string()
})
export type Schema = z.infer<typeof schema>
export type Schema1 = z.infer<typeof schema1>
let statesListFull = []
let statesList: Array<{ id: number; title: string }> = []
let timezonesList: Array<{ id: number; title: string }> = []
let timeZoneListFull = []
let countryIndex = -1
let stateIndex = -1
let timeZoneIndex = -1
export const LocationDetails = ({ component, data, setAddressObject }) => {
  const [isLoading, setLoading] = useState(false)
  const [isDataReceived, setIsDataReceived] = useState(false)
  const staticData: any = store.getState().staticDataState.staticData
  const memberAddress: any =
    store.getState().currentMemberAddress.currentMemberAddress
  // console.log('memberAddress', JSON.stringify(memberAddress))
  const getStates = useCallback(async (countryId: any) => {
    setLoading(true)
    let url = `${BASE_URL}${GET_STATES_AND_TIMEZONES}`
    let dataObject = {
      country: {
        id: countryId
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          let stateList: Array<{ id: number; title: string }> =
            data.data.stateList.map(({ name, id }: Response, index: any) => {
              return {
                title: name,
                id: index + 1
              }
            })
          let timeZoneList: Array<{ id: number; title: string }> =
            data.data.timeZoneList.map(({ name, id }: Response, index: any) => {
              return {
                title: name,
                id: index + 1
              }
            })
          statesList = stateList
          timezonesList = timeZoneList
          statesListFull = data.data.stateList ? data.data.stateList : []
          timeZoneListFull = data.data.timeZoneList
            ? data.data.timeZoneList
            : []
          if (!_.isEmpty(locationData)) {
            let stateName = locationData.address.state.name
              ? locationData.address.state.name
              : ''
            data.data.stateList.map((data: any, index: any) => {
              if (data.name === stateName) {
                stateIndex = index + 1
              }
            })
            let timeZoneName = locationData.address.timezone.name
              ? locationData.address.timezone.name
              : ''
            data.data.timeZoneList.map((data: any, index: any) => {
              if (data.name === timeZoneName) {
                timeZoneIndex = index + 1
              }
            })
          } else if (!_.isEmpty(memberAddress)) {
            let stateName = memberAddress.state.name
              ? memberAddress.state.name
              : ''
            data.data.stateList.map((data: any, index: any) => {
              if (data.name === stateName) {
                stateIndex = index + 1
              }
            })

            let timeZoneName = memberAddress.timezone.name
              ? memberAddress.timezone.name
              : ''
            data.data.timeZoneList.map((data: any, index: any) => {
              if (data.name === timeZoneName) {
                timeZoneIndex = index + 1
              }
            })
          } else {
            if (component === 'SignUp') {
              let newTimeZone = moment.tz.guess()
              data.data.timeZoneList.map((data: any, index: any) => {
                if (data.name === newTimeZone) {
                  timeZoneIndex = index + 1
                }
              })
              setAddressObject(timeZoneListFull[timeZoneIndex - 1], 8)
            }
          }
          reset({
            state: stateIndex,
            timeZone: timeZoneIndex
          })
          setLoading(false)
          setIsDataReceived(true)

          // console.log('setStateslistFull', JSON.stringify(statesListFull))
        } else {
          Alert.alert('', data.message)
          setLoading(false)
        }
      })
      .catch((error) => {
        console.log(error)
        setLoading(false)
      })
  }, [])
  const setCountryState = useCallback(async () => {
    let countryName = ''
    if (!_.isEmpty(locationData)) {
      countryName = locationData.address.state.country.name
        ? locationData.address.state.country.name
        : ''
      let addressObject = {
        nickName: locationData.nickName ? locationData.nickName : '',
        shortDescription: locationData.shortDescription
          ? locationData.shortDescription
          : '',
        address: locationData.address ? locationData.address : {}
      }
      setAddressObject(addressObject, 6)
    } else if (!_.isEmpty(memberAddress)) {
      countryName = memberAddress.state.country.name
        ? memberAddress.state.country.name
        : ''
      memberAddress.line = ''
      memberAddress.city = ''
      memberAddress.zipCode = ''
      memberAddress.id = ''
      let addressObject = {
        nickName: '',
        shortDescription: '',
        address: memberAddress
      }
      setAddressObject(addressObject, 6)
    } else {
      let newTimeZone = moment.tz.guess()
      const countryObject = ct.getCountriesForTimezone(newTimeZone)
      countryName = countryObject[0]?.name ? countryObject[0].name : ''
      staticData.countryList.map(async (data: any, index: any) => {
        if (data.name === countryName) {
          setAddressObject(staticData.countryList[index], 4)
        }
      })
    }
    staticData.countryList.map(async (data: any, index: any) => {
      if (data.name === countryName) {
        countryIndex = index + 1
        reset({
          country: countryIndex
        })
      }
    })
    let countryId = staticData.countryList[countryIndex - 1].id
      ? staticData.countryList[countryIndex - 1].id
      : 101
    await getStates(countryId)
  }, [])
  useEffect(() => {
    setCountryState()
  }, [])
  let locationData = data ? data : {}
  // console.log('locationData', JSON.stringify(locationData))

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      locationName:
        !_.isEmpty(locationData) && locationData.nickName
          ? locationData.nickName
          : '',
      line:
        !_.isEmpty(locationData) && locationData.address.line
          ? locationData.address.line
          : '',
      city:
        !_.isEmpty(locationData) && locationData.address.city
          ? locationData.address.city
          : '',
      postalCode:
        !_.isEmpty(locationData) && locationData.address.zipCode
          ? locationData.address.zipCode
          : '',
      country:
        !_.isEmpty(locationData) || !_.isEmpty(memberAddress)
          ? countryIndex
          : -1,
      state: stateIndex,
      timeZone: timeZoneIndex
    },
    resolver: zodResolver(schema)
  })
  const { control: control1, reset: reset1 } = useForm({
    defaultValues: {
      shortName:
        !_.isEmpty(locationData) && locationData.shortDescription
          ? locationData.shortDescription
          : ''
    },
    resolver: zodResolver(schema1)
  })
  type Response = {
    id: number
    name: string
  }
  const countryList: Array<{ id: number; title: string }> =
    staticData.countryList.map(({ name, id }: Response, index: any) => {
      return {
        title: name,
        id: index + 1
      }
    })
  async function setSelectedCountryChange(value: any) {
    let countryId = ''
    if (value) {
      if (isDataReceived) {
        setAddressObject(staticData.countryList[value.id - 1], 4)
        countryId = staticData.countryList[value.id - 1].id
          ? staticData.countryList[value.id - 1].id
          : 101
        stateIndex = -1
        timeZoneIndex = -1
        await getStates(countryId)
      }
    } else {
      statesList = []
    }
  }
  async function setSelectedStateChange(value: any) {
    if (value) {
      setAddressObject(statesListFull[value.id - 1], 5)
    }
  }
  async function setSelectedTimeZoneChange(value: any) {
    // console.log('value', JSON.stringify(value))
    if (value) {
      setAddressObject(timeZoneListFull[value.id - 1], 8)
    }
  }

  return (
    <View className="w-full self-center py-2">
      <PtsLoader loading={isLoading} />
      <View className="w-full">
        {component !== 'Profile' &&
        component !== 'SignUp' &&
        component !== 'CreateCircle' ? (
          <View className="mt-2 w-full flex-row justify-center">
            <ControlledTextField
              control={control}
              name="locationName"
              placeholder={'Location Name'}
              className="w-full"
              onChangeText={(text) => {
                setAddressObject(text, 0)
                let shortName = text.substring(0, 10)
                reset1({
                  shortName: shortName
                })
                setAddressObject(shortName, 7)
              }}
            />
          </View>
        ) : (
          <View />
        )}
        {component !== 'Profile' &&
        component !== 'SignUp' &&
        component !== 'CreateCircle' ? (
          <View className="mt-2 w-full flex-row justify-center">
            <ControlledTextField
              control={control1}
              name="shortName"
              placeholder={'Short Name'}
              className="w-full"
              onChangeText={(text) => {
                // console.log('text', text)
                setAddressObject(text, 7)
              }}
            />
          </View>
        ) : (
          <View />
        )}

        <View className="my-2 w-full flex-row justify-center">
          <ControlledTextField
            control={control}
            name="line"
            placeholder={'Address'}
            className="w-full"
            onChangeText={(text) => {
              console.log('text', text)
              setAddressObject(text, 1)
            }}
          />
        </View>
        <View className=" w-full self-center">
          <ControlledDropdown
            control={control}
            name="country"
            label="Country*"
            maxHeight={300}
            list={countryList}
            onChangeValue={setSelectedCountryChange}
          />
        </View>
        <View className="my-2 w-full self-center">
          <ControlledDropdown
            control={control}
            name="state"
            label="State*"
            maxHeight={300}
            list={statesList}
            onChangeValue={setSelectedStateChange}
          />
        </View>

        <View className=" w-full flex-row justify-center">
          <ControlledTextField
            control={control}
            name="city"
            placeholder={'City'}
            className="w-full"
            onChangeText={(text) => {
              // console.log('text', text)
              setAddressObject(text, 2)
            }}
          />
        </View>
        <View className="my-2 w-full flex-row justify-center">
          <ControlledTextField
            control={control}
            name="postalCode"
            placeholder={'Postal Code'}
            className="w-full"
            keyboard="number-pad"
            onChangeText={(text) => {
              // console.log('text', text)
              setAddressObject(text, 3)
            }}
          />
        </View>
        {component === 'Profile' ||
        component === 'SignUp' ||
        component === 'CreateCircle' ? (
          <View className="w-full self-center">
            <ControlledDropdown
              control={control}
              name="timeZone"
              label="Timezone*"
              maxHeight={300}
              list={timezonesList}
              onChangeValue={setSelectedTimeZoneChange}
            />
          </View>
        ) : (
          <View />
        )}
      </View>
    </View>
  )
}
