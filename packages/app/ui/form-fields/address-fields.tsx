import { View } from 'react-native'
import { ControlledDropdown } from './controlled-dropdown'
import { useCallback, useState } from 'react'
import { fetchStateAndTimezoneData } from 'app/data/states'
import { State, Timezone } from 'app/data/types'
import { useCountries } from 'app/redux/staticData/hooks'
import { cn } from '../utils'
import { useFormContext } from 'react-hook-form'
import { DropdownItem } from '../PtsDropdown'
import { ControlledTextField } from './controlled-field'
import * as z from 'zod'

export const addressSchema = z.object({
  address: z.string().min(1, { message: 'Address is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  country: z.number().min(1, { message: 'Country is required' }),
  state: z.number().min(1, { message: 'State is required' }),
  timezone: z.string().min(1, { message: 'Timezone is required' }),
  postalCode: z.string().min(1, { message: 'Postal Code is required' })
})

export type AddressFieldsProps = {
  control?: any
  className?: string
  onSubmitEditing?: () => void
}
export function AddressFields({
  control,
  className,
  onSubmitEditing
}: AddressFieldsProps) {
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
    <View
      className={cn(
        'flex flex-row flex-wrap items-center justify-center gap-2',
        className
      )}
    >
      <ControlledTextField
        control={control}
        name="address"
        placeholder={'Address'}
        className="basis-full"
        inputClassName="text-primary"
        autoCapitalize="none"
        onSubmitEditing={() => {
          setFocus('city')
        }}
      />
      <ControlledTextField
        control={control}
        name="city"
        placeholder={'City'}
        className="flex-1 basis-1/2"
        autoCapitalize="none"
        onSubmitEditing={() => {
          setFocus('country')
        }}
      />
      <View className={cn('flex flex-row flex-wrap gap-2', className)}>
        <ControlledDropdown
          emptyResultText="No countries found, something went wrong."
          className="flex-1"
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
      </View>
      <View className={cn('flex flex-row flex-wrap gap-2', className)}>
        <ControlledDropdown
          emptyResultText="Please select a country first."
          className="flex-1"
          control={control}
          name="timezone"
          label="Time Zone*"
          list={timezones}
          onSubmitEditing={() => {
            setFocus('postalCode')
          }}
        />
        <ControlledTextField
          control={control}
          name="postalCode"
          placeholder={'Postal Code'}
          className="flex-1"
          autoCapitalize="none"
          returnKeyType="done"
          onSubmitEditing={onSubmitEditing}
        />
      </View>
    </View>
  )
}
