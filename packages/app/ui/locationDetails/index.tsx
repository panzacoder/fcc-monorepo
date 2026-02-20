import { View } from 'react-native'
import { useState, useEffect, useCallback, useRef } from 'react'
import _ from 'lodash'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { useAppSelector } from 'app/redux/hooks'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import PtsLoader from 'app/ui/PtsLoader'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'
import { useStatesAndTimezones } from 'app/data/locations'
import ct from 'countries-and-timezones'
import moment from 'moment-timezone'
import { logger } from 'app/utils/logger'
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
export const LocationDetails = ({ component, data, setAddressObject }) => {
  const [isDataReceived, setIsDataReceived] = useState(false)
  const staticData: any = useAppSelector(
    (state) => state.staticDataState.staticData
  )
  const header = useAppSelector((state) => state.headerState.header)
  const memberAddress: any = useAppSelector(
    (state) => state.currentMemberAddress.currentMemberAddress
  )
  const statesListFullRef = useRef<any>([])
  const statesListRef = useRef<Array<{ id: number; title: string }>>([])
  const timezonesListRef = useRef<Array<{ id: number; title: string }>>([])
  const timeZoneListFullRef = useRef<any>([])
  const countryIndexRef = useRef(-1)
  const stateIndexRef = useRef(-1)
  const timeZoneIndexRef = useRef(-1)

  let locationData = data ? data : {}

  const getInitialCountryId = useCallback(() => {
    let countryName = ''
    if (!_.isEmpty(locationData)) {
      countryName = locationData.address.state.country.name
        ? locationData.address.state.country.name
        : ''
    } else if (!_.isEmpty(memberAddress)) {
      countryName = memberAddress.state.country.name
        ? memberAddress.state.country.name
        : ''
    } else {
      let newTimeZone = moment.tz.guess()
      const countryObject = ct.getCountriesForTimezone(newTimeZone)
      countryName = countryObject[0]?.name ? countryObject[0].name : ''
    }
    let countryId = 101
    staticData.countryList.map((data: any, index: any) => {
      if (data.name === countryName) {
        countryIndexRef.current = index + 1
        countryId = staticData.countryList[index].id
          ? staticData.countryList[index].id
          : 101
      }
    })
    return countryId
  }, [])

  const [selectedCountryId, setSelectedCountryId] =
    useState(getInitialCountryId)

  const statesQuery = useStatesAndTimezones(header, {
    countryId: selectedCountryId
  })

  useEffect(() => {
    if (!_.isEmpty(locationData)) {
      let addressObject = {
        nickName: locationData.nickName ? locationData.nickName : '',
        shortDescription: locationData.shortDescription
          ? locationData.shortDescription
          : '',
        address: locationData.address ? locationData.address : {}
      }
      setAddressObject(addressObject, 6)
    } else if (!_.isEmpty(memberAddress)) {
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
      let countryName = countryObject[0]?.name ? countryObject[0].name : ''
      staticData.countryList.map(async (data: any, index: any) => {
        if (data.name === countryName) {
          setAddressObject(staticData.countryList[index], 4)
        }
      })
    }
    reset({
      country: countryIndexRef.current
    })
  }, [])

  useEffect(() => {
    if (!statesQuery.data) return
    let stateList: Array<{ id: number; title: string }> =
      statesQuery.data.stateList.map(({ name, id }: Response, index: any) => {
        return {
          title: name,
          id: index + 1
        }
      })
    let timeZoneList: Array<{ id: number; title: string }> =
      statesQuery.data.timeZoneList.map(
        ({ name, id }: Response, index: any) => {
          return {
            title: name,
            id: index + 1
          }
        }
      )
    statesListRef.current = stateList
    timezonesListRef.current = timeZoneList
    statesListFullRef.current = statesQuery.data.stateList
      ? statesQuery.data.stateList
      : []
    timeZoneListFullRef.current = statesQuery.data.timeZoneList
      ? statesQuery.data.timeZoneList
      : []
    if (component === 'SignUp') {
      let newTimeZone = moment.tz.guess()
      statesQuery.data.timeZoneList.map((data: any, index: any) => {
        if (data.name === newTimeZone) {
          timeZoneIndexRef.current = index + 1
        }
      })
      setAddressObject(
        timeZoneListFullRef.current[timeZoneIndexRef.current - 1],
        8
      )
    } else if (!_.isEmpty(locationData)) {
      let stateName = locationData.address.state.name
        ? locationData.address.state.name
        : ''
      statesQuery.data.stateList.map((data: any, index: any) => {
        if (data.name === stateName) {
          stateIndexRef.current = index + 1
        }
      })
      let timeZoneName = locationData.address.timezone.name
        ? locationData.address.timezone.name
        : ''
      statesQuery.data.timeZoneList.map((data: any, index: any) => {
        if (data.name === timeZoneName) {
          timeZoneIndexRef.current = index + 1
        }
      })
    } else if (!_.isEmpty(memberAddress)) {
      let stateName = memberAddress.state.name ? memberAddress.state.name : ''
      statesQuery.data.stateList.map((data: any, index: any) => {
        if (data.name === stateName) {
          stateIndexRef.current = index + 1
        }
      })

      let timeZoneName = memberAddress.timezone.name
        ? memberAddress.timezone.name
        : ''
      statesQuery.data.timeZoneList.map((data: any, index: any) => {
        if (data.name === timeZoneName) {
          timeZoneIndexRef.current = index + 1
        }
      })
    }
    reset({
      state: stateIndexRef.current,
      timeZone: timeZoneIndexRef.current
    })
    setIsDataReceived(true)
  }, [statesQuery.data])

  const isLoading = statesQuery.isLoading

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
          ? countryIndexRef.current
          : -1,
      state: stateIndexRef.current,
      timeZone: timeZoneIndexRef.current
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
    if (value) {
      if (isDataReceived) {
        setAddressObject(staticData.countryList[value.id - 1], 4)
        let countryId = staticData.countryList[value.id - 1].id
          ? staticData.countryList[value.id - 1].id
          : 101
        setSelectedCountryId(countryId)
      }
    }
  }
  async function setSelectedStateChange(value: any) {
    if (value) {
      setAddressObject(statesListFullRef.current[value.id - 1], 5)
    }
  }
  async function setSelectedTimeZoneChange(value: any) {
    if (value) {
      setAddressObject(timeZoneListFullRef.current[value.id - 1], 8)
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
              logger.debug('text', text)
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
            list={statesListRef.current}
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
              list={timezonesListRef.current}
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
