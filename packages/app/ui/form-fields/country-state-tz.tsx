import { View } from 'react-native'
import { ControlledDropdown } from './controlled-dropdown'
import { useCallback, useMemo, useState } from 'react'
import { fetchStateAndTimezoneData } from 'app/data/states'
import { Country, State, Timezone } from 'app/data/types'
import { useCountries } from 'app/redux/staticData/hooks'
import { cn } from '../utils'
import { useFormContext } from 'react-hook-form'
import { DropdownItem } from '../PtsDropdown'

export type CountryStateTimezoneProps = {
  control?: any
  className?: string
  onSubmitEditing?: () => void
}
export function CountryStateTimezone({
  control,
  className,
  onSubmitEditing
}: CountryStateTimezoneProps) {
  const countries = useCountries()
  const [states, setStates] = useState<State[]>([])
  const [timezones, setTimezones] = useState<Timezone[]>([])

  const updateCountry = useCallback(
    (item?: DropdownItem) => {
      if (!item) return
      var itemId = item.id
      if (typeof itemId === 'string') {
        itemId = parseInt(itemId)
      }

      console.log('updateCountry', item)
      fetchStateAndTimezoneData(itemId).then((statesAndTimezoneForCountry) => {
        if (statesAndTimezoneForCountry) {
          setStates(statesAndTimezoneForCountry.stateList)
          setTimezones(statesAndTimezoneForCountry.timeZoneList)
        }
      })
    },
    [setStates, setTimezones]
  )

  const { setFocus } = useFormContext()

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
        onSubmitEditing={() => {
          setFocus('state')
        }}
      />
      <ControlledDropdown
        emptyResultText="Please select a country first."
        className="flex-1"
        control={control}
        name="state"
        label="State*"
        list={states}
        onSubmitEditing={() => {
          setFocus('timezone')
        }}
      />
      <ControlledDropdown
        emptyResultText="Please select a country first."
        className="flex-1"
        control={control}
        name="timezone"
        label="Time Zone*"
        list={timezones}
        onSubmitEditing={onSubmitEditing}
      />
    </View>
  )
}
