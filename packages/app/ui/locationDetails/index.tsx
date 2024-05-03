import { View, Alert } from 'react-native'
import { useState, useEffect, useCallback } from 'react'
import { Typography } from 'app/ui/typography'
import _ from 'lodash'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import store from 'app/redux/store'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
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
  country: z.number().min(0, { message: 'Country is required' })
})
export type Schema = z.infer<typeof schema>
let statesListFull = []
let countryIndex = -1
let stateIndex = -1
export const LocationDetails = ({ data, setAddressObject }) => {
  const [statesList, setStateslist] = useState([]) as any
  const [isRender, setIsRender] = useState(false)
  const [isDataReceived, setIsDataReceived] = useState(false)

  const getStates = useCallback(async (countryId: any) => {
    let url = `${BASE_URL}${GET_STATES_AND_TIMEZONES}`
    let dataObject = {
      country: {
        id: countryId
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          let statesList: Array<{ id: number; title: string }> =
            data.data.stateList.map(({ name, id }: Response, index: any) => {
              return {
                title: name,
                id: index + 1
              }
            })
          setStateslist(statesList)
          statesListFull = data.data.stateList ? data.data.stateList : []
          if (!_.isEmpty(locationData)) {
            let stateName = locationData.address.state.name
              ? locationData.address.state.name
              : ''
            data.data.stateList.map((data: any, index: any) => {
              if (data.name === stateName) {
                stateIndex = index + 1
              }
            })
          }
          setIsDataReceived(true)
          // console.log('setStateslistFull', JSON.stringify(statesListFull))
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])
  useEffect(() => {
    async function setCountryState() {
      let countryName = ''
      if (!_.isEmpty(locationData)) {
        countryName = locationData.address.state.country.name
          ? locationData.address.state.country.name
          : ''
        setAddressObject(locationData, 6)
      } else {
        let newTimeZone = moment.tz.guess()
        const countryObject = ct.getCountriesForTimezone(newTimeZone)
        countryName = countryObject[0]?.name ? countryObject[0].name : ''
      }
      staticData.countryList.map(async (data: any, index: any) => {
        if (data.name === countryName) {
          countryIndex = index + 1
          setIsRender(!isRender)
        }
      })
      let countryId = staticData.countryList[countryIndex - 1].id
        ? staticData.countryList[countryIndex - 1].id
        : 101
      await getStates(countryId)
    }
    setCountryState()
  }, [])
  const staticData: any = store.getState().staticDataState.staticData
  let locationData = data ? data : {}
  console.log('locationData', JSON.stringify(locationData))
  const { control, handleSubmit } = useForm({
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
      country: !_.isEmpty(locationData) ? countryIndex : 97,
      state: !_.isEmpty(locationData) ? stateIndex : -1
    },
    resolver: zodResolver(schema)
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
      setAddressObject(staticData.countryList[value.id - 1], 4)
    }

    let countryId =
      value && staticData.countryList[value.id - 1]?.id
        ? staticData.countryList[value.id - 1].id
        : 101
    await getStates(countryId)
  }
  async function setSelectedStateChange(value: any) {
    console.log('value', JSON.stringify(value))
    setAddressObject(statesListFull[value], 5)
  }
  return (
    <View className="w-full self-center py-2">
      <View className="w-full">
        <Typography className="font-400 ml-[10px] text-[#1A1A1A]">
          {'Location'}
        </Typography>
        <View className="mt-2 w-full flex-row justify-center">
          <ControlledTextField
            control={control}
            name="locationName"
            placeholder={'Location Name'}
            className="w-[95%] bg-white"
            autoCapitalize="none"
            onChangeText={(text) => {
              // console.log('text', text)
              setAddressObject(text, 0)
            }}
          />
        </View>
        <View className="my-2 w-full flex-row justify-center">
          <ControlledTextField
            control={control}
            name="line"
            placeholder={'Address'}
            className="w-[95%] bg-white"
            autoCapitalize="none"
            onChangeText={(text) => {
              // console.log('text', text)
              setAddressObject(text, 1)
            }}
          />
        </View>
        <View className=" w-[95%] self-center">
          <ControlledDropdown
            control={control}
            name="country"
            label="Country*"
            maxHeight={300}
            defaultValue={
              countryIndex !== -1 ? countryList[countryIndex]?.title : ''
            }
            list={countryList}
            onChangeValue={setSelectedCountryChange}
          />
        </View>
        {isDataReceived ? (
          <View className="my-2 w-[95%] self-center">
            <ControlledDropdown
              control={control}
              name="state"
              label="State*"
              defaultValue={
                stateIndex !== -1 ? statesList[stateIndex].title : ''
              }
              maxHeight={300}
              list={statesList}
              onChangeValue={setSelectedStateChange}
            />
          </View>
        ) : (
          <View />
        )}

        <View className=" w-full flex-row justify-center">
          <ControlledTextField
            control={control}
            name="city"
            placeholder={'City'}
            className="w-[95%] bg-white"
            autoCapitalize="none"
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
            className="w-[95%] bg-white"
            autoCapitalize="none"
            onChangeText={(text) => {
              // console.log('text', text)
              setAddressObject(text, 3)
            }}
          />
        </View>
      </View>
    </View>
  )
}
