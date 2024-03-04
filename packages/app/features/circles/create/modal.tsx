import { Button } from 'app/ui/button'
import { Feather } from 'app/ui/icons'
import { Typography } from 'app/ui/typography'
import { useCallback, useState } from 'react'
import { Alert, Pressable, View } from 'react-native'

import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'
import { ScrollView } from 'app/ui/scroll-view'
import store from 'app/redux/store'
import { CallPostService } from 'app/utils/fetchServerData'
import { BASE_URL, GET_STATES_AND_TIMEZONES } from 'app/utils/urlConstants'
import { Image } from 'app/ui/image'
import { Divider } from 'app/ui/divider'
import { Card } from '../../../ui/card'
import { AddressFields } from './address-fields'

const schema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email(),
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  country: z.number().min(1, { message: 'Country is required' }),
  state: z.number().min(1, { message: 'State is required' }),
  timezone: z.string().min(1, { message: 'Timezone is required' })
})

export type Schema = z.infer<typeof schema>

export type CreateCircleProps = {
  onCancel: () => void
  formData?: Schema
}
export function CreateCircle({ onCancel, formData }: CreateCircleProps) {
  const [formStep, setFormStep] = useState(0)
  const [isManageCircle, setManageCircle] = useState(-1)

  const [isCreateCircleClicked, setCreateCircleClicked] = useState(false)

  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      timezone: '',
      country: -1,
      state: -1,
      address: '',
      city: '',
      postalCode: ''
    },
    resolver: zodResolver(schema)
  })

  const firstName = watch('firstName')

  return (
    <View className="flex h-full items-center">
      <Typography
        variant="h1"
        className="bg-muted text-secondary w-full py-4 text-center"
      >
        Create a Circle
      </Typography>
      <Divider className="bg-primary" />
      <ScrollView className="w-full bg-white p-4">
        <View className="flex items-center gap-4">
          <Typography variant="h3">Who is this Circle for?</Typography>
          <View className="my-5 flex w-full gap-2">
            <ControlledTextField
              control={control}
              name="firstName"
              placeholder={'First Name'}
              className="w-full"
            />
            <ControlledTextField
              control={control}
              name="lastName"
              placeholder="Last Name"
              className="w-full"
            />
            <View className="flex-row items-center gap-2">
              <Feather name={'info'} size={20} className="color-primary" />
              <Typography className="">
                {'Circles organize caregiving details for an individual.'}
              </Typography>
            </View>
          </View>

          <Divider />

          <Typography variant="h3">{`Do you want to invite ${firstName} to manage their Circle?`}</Typography>
          <View className="bg-muted rounded-[25px] px-2 py-2 ">
            <View className="flex-row">
              <Pressable
                onPress={() => {
                  setManageCircle(0)
                }}
                className={`bg-[${isManageCircle === 0 ? 'primary' : 'transparent'}] rounded-[25px] px-10 py-2`}
              >
                <Typography
                  className={`text- black items-center self-center font-bold`}
                >
                  {'Yes'}
                </Typography>
              </Pressable>
              <Pressable
                onPress={() => {
                  setManageCircle(1)
                }}
                className={`bg-[${isManageCircle === 1 ? 'primary' : 'transparent'}] rounded-[25px] px-10 py-2`}
              >
                <Typography
                  className={`items-center self-center font-bold text-black`}
                >
                  {'No'}
                </Typography>
              </Pressable>
            </View>
          </View>

          <Divider />

          <ControlledTextField
            control={control}
            name="email"
            placeholder={'Email Address'}
            className="w-full"
            autoCapitalize="none"
          />
          <Card className="bg-secondary w-full py-5">
            <Typography className="text-secondary-foreground text-lg">
              {`You will be the sole manager of ${firstName + "'s"} Circle.\n`}
              {`If at any point ${firstName} wants to manage their Circle, you can add their email address in Circle settings.`}
            </Typography>
          </Card>
          <Typography variant="h4">
            {`What is ${firstName}'s default timezone?`}
          </Typography>
          <AddressFields control={control} className="w-full" />
          <View className="flex flex-row gap-2">
            <Button
              className="mr-2"
              title={'Back to Circle View'}
              variant="border"
              leadingIcon="arrow-left"
              onPress={() => {
                setCreateCircleClicked(!isCreateCircleClicked)
                setFormStep(0)
              }}
            />
            <Button
              className=""
              title={'Go To Circle'}
              trailingIcon="arrow-right"
              onPress={() => { }}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
