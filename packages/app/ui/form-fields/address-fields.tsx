import { View } from 'react-native'
import { ControlledDropdown } from './controlled-dropdown'
import { useCallback, useState } from 'react'
import { fetchStateAndTimezoneData } from 'app/data/states'
import { Country, State, Timezone } from 'app/data/types'
import { useCountries } from 'app/redux/staticData/hooks'
import { cn } from '../utils'
import { ControlledTextField } from './controlled-field'

export type AddressFieldsProps = {
  control: any
  className?: string
}
export function AddressFields({ control, className }: AddressFieldsProps) {
  const countries = useCountries()
  const [states, setStates] = useState<State[]>([])
  const [timezones, setTimezones] = useState<Timezone[]>([])

  const updateCountry = useCallback(
    (country: Country) => {
      console.log('updateCountry', country)
      fetchStateAndTimezoneData(country).then((statesAndTimezoneForCountry) => {
        if (statesAndTimezoneForCountry) {
          setStates(statesAndTimezoneForCountry.stateList)
          setTimezones(statesAndTimezoneForCountry.timeZoneList)
        }
      })
    },
    [setStates, setTimezones]
  )

  return (
    <View className={cn('flex flex-row flex-wrap gap-2', className)}>
      <ControlledTextField
        control={control}
        name="address"
        placeholder={'Address'}
        className="basis-full"
        inputClassName="text-primary"
        autoCapitalize="none"
      />
      <ControlledTextField
        control={control}
        name="city"
        placeholder={'City'}
        className="flex-1 basis-1/3"
        autoCapitalize="none"
      />

      <ControlledDropdown
        className="flex-1 basis-1/3"
        control={control}
        name="state"
        label="State*"
        list={states}
      />
      <ControlledDropdown
        className="flex-1 basis-1/3"
        control={control}
        name="country"
        label="Country*"
        list={countries}
        onChangeValue={updateCountry}
      />

      <ControlledTextField
        control={control}
        name="postalCode"
        placeholder={'Postal Code'}
        className="flex-1 basis-1/3"
        autoCapitalize="none"
      />
      <ControlledDropdown
        className="flex-1 basis-full"
        control={control}
        name="timezone"
        label="Time Zone*"
        list={timezones}
      />
    </View>
  )
}
