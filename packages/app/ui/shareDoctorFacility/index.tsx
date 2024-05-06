import { View } from 'react-native'
import { Button } from 'app/ui/button'
import _ from 'lodash'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Typography } from '../typography'
const schema = z.object({
  email: z.string().min(1, { message: 'Email is required' })
})
export type Schema = z.infer<typeof schema>
export const ShareDoctorFacility = ({ cancelClicked, shareDoctorFacility }) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      email: ''
    },
    resolver: zodResolver(schema)
  })

  async function callShareDoctorFacility(formData: Schema) {
    shareDoctorFacility(formData.email)
  }

  return (
    <View className="my-2 w-[90%] self-center rounded-[15px] bg-[#f0e1ea] py-5">
      <Typography className="self-center font-bold">{`Share Contact`}</Typography>
      <View className="my-5 w-full">
        <View className="w-full flex-row justify-center gap-2">
          <ControlledTextField
            control={control}
            name="email"
            placeholder={'Email*'}
            className="w-[95%] bg-white"
            autoCapitalize="none"
          />
        </View>

        <View className="mt-5 flex-row justify-center">
          <Button
            className="bg-[#86939e]"
            title="Cancel"
            variant="default"
            onPress={() => {
              cancelClicked()
            }}
          />
          <Button
            className="ml-5"
            title={'Share'}
            variant="default"
            onPress={handleSubmit(callShareDoctorFacility)}
          />
        </View>
      </View>
    </View>
  )
}
