import { View } from 'react-native'
import { ControlledDropdown } from './controlled-dropdown'
import { useCallback, useMemo, useState } from 'react'
import { fetchStateAndTimezoneData } from 'app/data/states'
import { Country, State, Timezone } from 'app/data/types'
import { useCountries } from 'app/redux/staticData/hooks'
import { cn } from '../utils'

export function CountryStateTimezone({ control, className }) {
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
        className="basis-full"
        control={control}
        name="country"
        label="Country*"
        list={countries}
        onChangeValue={updateCountry}
      />
      <ControlledDropdown
        className="flex-1"
        control={control}
        name="state"
        label="State*"
        list={states}
      />
      <ControlledDropdown
        className="flex-1"
        control={control}
        name="timezone"
        label="Time Zone*"
        list={timezones}
      />
    </View>
  )
}
