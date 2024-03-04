import { Alert, View } from 'react-native'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { cn } from 'app/ui/utils'
import { useCallback, useState } from 'react'
import { BASE_URL, GET_STATES_AND_TIMEZONES } from 'app/utils/urlConstants'
import { CallPostService } from 'app/utils/fetchServerData'
import { useWatch } from 'react-hook-form'

export function AddressFields({
  className,
  control
  // countries,
  // states,
  // timezones,
  // setSelectedCountryChange
}) {
  const [selectedCountryValue, setSelectedCountry] = useState(-1)
  const [countries, setCountries] = useState<any>([])
  const [states, setStates] = useState<any>([])
  const [timezones, setTimezones] = useState<any>([])

  const country = useWatch({ control, name: 'country', defaultValue: -1 })

  const getStates = useCallback(async (countryId: any) => {
    let url = `${BASE_URL}${GET_STATES_AND_TIMEZONES}`
    let dataObject = {
      country: {
        id: countryId || 101
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        console.log('data', data)
        // setLoading(false)
        if (data.status === 'SUCCESS') {
          // set available states
          const statesList = data.data.stateList.map((data: any) => {
            return {
              label: data.name,
              value: data.id
            }
          })
          setStates(statesList)

          // set available timezones
          const timeZones = data.data.timeZoneList.map((data: any) => {
            return {
              label: data.name,
              value: data.name
            }
          })
          setTimezones(timeZones)
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  async function setSelectedCountryChange(value: any) {
    setSelectedCountry(value)
    await getStates(value)
  }

  return (
    <View className={cn('flex items-center justify-center gap-2', className)}>
      <ControlledDropdown
        control={control}
        name="country"
        label="Country*"
        maxHeight={300}
        list={countries}
        onChangeValue={setSelectedCountryChange}
      />
      <ControlledDropdown
        control={control}
        name="state"
        label="State*"
        maxHeight={300}
        list={states}
      />
      <ControlledDropdown
        control={control}
        name="timezone"
        label="Time Zone*"
        maxHeight={300}
        list={timezones}
      />
      <ControlledTextField
        control={control}
        name="address"
        placeholder={'Address'}
        className="w-full"
        autoCapitalize="none"
      />
      <ControlledTextField
        control={control}
        name="city"
        placeholder={'City'}
        className="w-full"
        autoCapitalize="none"
      />
      <ControlledTextField
        control={control}
        name="postalCode"
        placeholder={'Postal Code'}
        className="w-full"
        autoCapitalize="none"
      />
    </View>
  )
}
