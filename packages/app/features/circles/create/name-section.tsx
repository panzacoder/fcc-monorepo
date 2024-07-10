import { Feather } from 'app/ui/icons'
import { View } from 'react-native'
import { Typography } from 'app/ui/typography'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { useFormContext } from 'react-hook-form'

export function CircleNameSection() {
  const { setFocus } = useFormContext()
  return (
    <View className="flex items-start gap-2">
      <View className="flex-row items-center gap-2 pb-2">
        <Feather name={'info'} size={20} className="color-primary" />
        <Typography className="w-[95%]">
          {'Circles organize caregiving details for an individual.'}
        </Typography>
      </View>

      <Typography variant="h5">Who is this Circle for?</Typography>
      <View className="flex w-full flex-row gap-2">
        <ControlledTextField
          name="firstName"
          placeholder={'First Name'}
          className="flex-1"
          onSubmitEditing={() => {
            setFocus('lastName')
          }}
        />
        <ControlledTextField
          name="lastName"
          placeholder="Last Name"
          className="flex-1"
          onSubmitEditing={() => {
            setFocus('email')
          }}
        />
      </View>
    </View>
  )
}
