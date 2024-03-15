import { View } from 'react-native'
import { ControlledDropdown } from './controlled-dropdown'
import { useCallback, useMemo, useState } from 'react'
import { fetchStateAndTimezoneData } from 'app/data/states'
import { Country, State, Timezone } from 'app/data/types'
import { useCountries } from 'app/redux/staticData/hooks'
import { cn } from '../utils'

export type CountryStateTimezoneProps = {
  control: any
  className?: string
}
export function CountryStateTimezone({
  control,
  className
}: CountryStateTimezoneProps) {
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
      <ControlledDropdown
        emptyResultText="No countries found, something went wrong."
        className="basis-full"
        control={control}
        name="country"
        label="Country*"
        list={countries}
        onChangeValue={updateCountry}
      />
      <ControlledDropdown
        emptyResultText="Please select a country first."
        className="flex-1"
        control={control}
        name="state"
        label="State*"
        list={states}
      />
      <ControlledDropdown
        emptyResultText="Please select a country first."
        className="flex-1"
        control={control}
        name="timezone"
        label="Time Zone*"
        list={timezones}
      />
    </View>
  )
}
