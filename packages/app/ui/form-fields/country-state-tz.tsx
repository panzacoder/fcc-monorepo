import { View } from 'react-native'
import { ControlledDropdown } from './controlled-dropdown'
import store from '../../redux/store'
import { useEffect, useState } from 'react'
import { fetchStateAndTimezoneData } from 'app/data/states'
import { useWatch } from 'react-hook-form'
import { Country, State, Timezone } from 'app/data/types'

export function CountryStateTimezone({ control }) {
  const staticData = store.getState().staticDataState.staticData
  const countries = staticData?.countries

  // const [country, setCountry] = useState<Country>()
  const [states, setStates] = useState<State[]>([])
  const [timezones, setTimezones] = useState<Timezone[]>([])

  const updateCountry = (country: Country) => {
    fetchStateAndTimezoneData(country).then((statesAndTimezoneForCountry) => {
      if (statesAndTimezoneForCountry) {
        setStates(statesAndTimezoneForCountry.stateList)
        setTimezones(statesAndTimezoneForCountry.timeZoneList)
      }
    })
  }

  return (
    <View>
      <ControlledDropdown
        control={control}
        name="country"
        label="Country*"
        maxHeight={300}
        list={countries}
        onChangeValue={updateCountry}
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
    </View>
  )
}
