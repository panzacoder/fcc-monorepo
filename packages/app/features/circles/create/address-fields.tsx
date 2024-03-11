import { View } from 'react-native'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { cn } from 'app/ui/utils'
import { CountryStateTimezone } from 'app/ui/form-fields/country-state-tz'

export function AddressFields({ className, control }) {
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
      />
      <ControlledTextField
        control={control}
        name="city"
        placeholder={'City'}
        className="flex-1 basis-1/2"
        autoCapitalize="none"
      />

      <CountryStateTimezone control={control} className="basis-full" />
      <ControlledTextField
        control={control}
        name="postalCode"
        placeholder={'Postal Code'}
        className="flex-1 basis-1/3"
        autoCapitalize="none"
      />
    </View>
  )
}
