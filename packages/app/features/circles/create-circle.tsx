import { Button } from 'app/ui/button'
import { Feather } from 'app/ui/icons'
import { Typography } from 'app/ui/typography'
import { useCallback, useState } from 'react'
import { Alert, Pressable, View } from 'react-native'

import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { formatUrl } from 'app/utils/format-url'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'
import { ScrollView } from 'app/ui/scroll-view'
import store from 'app/redux/store'
import { CallPostService } from 'app/utils/fetchServerData'
import { BASE_URL, GET_STATES_AND_TIMEZONES } from 'app/utils/urlConstants'
import { Image } from 'app/ui/image'

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

  const [selectedCountryValue, setSelectedCountry] = useState(-1)
  const [countries, setCountries] = useState<any>([])
  const [states, setStates] = useState<any>([])
  const [timezones, setTimezones] = useState<any>([])
  const header = store.getState().headerState.header
  const user = store.getState().userProfileState.header
  const [isLoading, setLoading] = useState(false)
  const [isCreateCircle, setCreateCircle] = useState(false)
  const [isDataReceived, setDataReceived] = useState(false)

  const [isCreateCircleClicked, setCreateCircleClicked] = useState(false)
  const [memberList, setMemberList] = useState([])

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

  const getStates = useCallback(async (countryId: any) => {
    setLoading(true)
    let url = `${BASE_URL}${GET_STATES_AND_TIMEZONES}`
    let dataObject = {
      country: {
        id: countryId || 101
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        console.log('data', data)
        // setLoading(false)
        if (data.status === 'SUCCESS') {
          // set available states
          const statesList = data.data.stateList.map((data: any) => {
            return {
              label: data.name,
              value: data.id
            }
          })
          setStates(statesList)

          // set available timezones
          const timeZones = data.data.timeZoneList.map((data: any) => {
            return {
              label: data.name,
              value: data.name
            }
          })
          setTimezones(timeZones)
        } else {
          Alert.alert('', data.message)
          setLoading(false)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }, [])

  async function setSelectedCountryChange(value: any) {
    setSelectedCountry(value)
    await getStates(value)
  }

  return (
    <View className="absolute z-50 flex h-full w-full items-center justify-center p-8">
      <View className="z-50 h-[60%] items-center self-center rounded-2xl bg-white p-6 shadow-lg">
        <View className="flex items-center">
          <View className="flex-row items-center ">
            {formStep === 0 ? (
              <View className="border-primary h-[30px] w-[30px] items-center rounded-[15px] border-[3px]">
                <View className="border-primary mt-1 h-[16px] w-[16px] self-center rounded-[8px] border-[2px]" />
              </View>
            ) : (
              <View className="border-primary bg-primary h-[30px] w-[30px] items-center rounded-[15px] border-[3px]">
                <Feather name={'check'} size={20} color={'white'} />
              </View>
            )}
            <View className="h-[2px] w-[35%] bg-[#A8AAAD]" />
            {formStep <= 1 ? (
              <View
                className={`h-[30px] w-[30px] items-center rounded-[15px] border-[3px] border-[${formStep !== 1 ? '#A8AAAD' : '#287CFA'}]`}
              >
                <View
                  className={`mt-1 h-[16px] w-[16px] self-center rounded-[8px] border-[2px] border-[${formStep !== 1 ? '#A8AAAD' : '#287CFA'}]`}
                />
              </View>
            ) : (
              <View className="border-primary bg-primary h-[30px] w-[30px] items-center rounded-[15px] border-[3px]">
                <Feather name={'check'} size={20} color={'white'} />
              </View>
            )}

            <View className="h-[2px] w-[35%] bg-[#A8AAAD]" />
            <View className="h-[30px] w-[30px] items-center rounded-[15px] border-[3px] border-[#A8AAAD]">
              <View className="mt-1 h-[16px] w-[16px] self-center rounded-[8px] border-[3px] border-[#1A1A1A]" />
            </View>
          </View>
          <Typography className="font-400 mt-10 text-[16px] text-black">
            {formStep === 0
              ? 'Who is this Circle for?'
              : formStep === 1
                ? `Do you want to invite ${firstName} to manage their Circle?`
                : ''}
          </Typography>

          {formStep === 0 ? (
            <View className="my-5 flex flex-col gap-2">
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
              <View className="flex-row">
                <Feather name={'info'} size={25} className="color-primary" />
                <Typography className="ml-3">
                  {'Circles organize caregiving details for an individual.'}
                </Typography>
              </View>
            </View>
          ) : (
            <View />
          )}
          {formStep === 1 ? (
            <View className="rounded-[25px] bg-[#EBECED] px-2 py-2 ">
              <View className="flex-row">
                <Pressable
                  onPress={() => {
                    setManageCircle(0)
                  }}
                  className={`bg-[${isManageCircle === 0 ? '#287CFA' : '#EBECED'}] rounded-[25px] px-10 py-2`}
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
                  className={`bg-[${isManageCircle === 1 ? '#287CFA' : '#EBECED'}] rounded-[25px] px-10 py-2`}
                >
                  <Typography
                    className={`items-center self-center font-bold text-black`}
                  >
                    {'No'}
                  </Typography>
                </Pressable>
              </View>
            </View>
          ) : (
            <View />
          )}
          {formStep === 1 && isManageCircle === 0 ? (
            <View className="my-5">
              <ControlledTextField
                control={control}
                name="email"
                placeholder={'Email Address'}
                className="w-full"
                autoCapitalize="none"
              />
            </View>
          ) : (
            <View />
          )}
          {formStep === 1 && isManageCircle === 1 ? (
            <View className="my-5">
              <Typography>
                {`You will be the sole manager of ${firstName + "'s"} Circle. If at any point ${firstName} wants to manage their Circle, you can add their email address in Circle settings.`}
              </Typography>
            </View>
          ) : (
            <View />
          )}
          {formStep === 2 ? (
            <ScrollView
              contentContainerStyle={{ marginHorizontal: 10 }}
              persistentScrollbar={true}
              className="mt-[-30] w-full"
            >
              <Typography className="font-400 text-[16px] text-black">
                {`What is ${firstName ? firstName + "'s" : ''} default timezone?`}
              </Typography>
              <View className=" my-5 flex w-full items-center justify-center gap-2 self-center">
                <ControlledDropdown
                  control={control}
                  name="country"
                  label="Country*"
                  maxHeight={300}
                  list={countries}
                  onChangeValue={setSelectedCountryChange}
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
                <ControlledTextField
                  control={control}
                  name="address"
                  placeholder={'Address'}
                  className="w-full"
                  autoCapitalize="none"
                />
                <ControlledTextField
                  control={control}
                  name="city"
                  placeholder={'City'}
                  className="w-full"
                  autoCapitalize="none"
                />
                <ControlledTextField
                  control={control}
                  name="postalCode"
                  placeholder={'Postal Code'}
                  className="w-full"
                  autoCapitalize="none"
                />
              </View>
              <View className="mb-5 flex-row justify-end">
                <Button
                  className="mr-5"
                  title="Cancel"
                  variant="border"
                  onPress={() => {
                    setFormStep(0)
                    onCancel()
                  }}
                />
                <Button
                  className=""
                  title="Next"
                  trailingIcon="arrow-right"
                  onPress={() => {
                    if (formStep < 2) {
                      setFormStep((prev) => prev + 1)
                    }
                  }}
                />
              </View>
            </ScrollView>
          ) : (
            <View />
          )}
          {formStep === 3 ? (
            <View>
              <Image
                src={require('app/assets/circles.png')}
                className="self-center"
                resizeMode={'contain'}
                alt="logo"
              />
              <Typography className="font-400 text-center text-[16px] text-black">
                {'A new Circle has been created for Lily Hebert.'}
              </Typography>
              <View className="mt-10 flex-row self-center ">
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
          ) : (
            <View />
          )}
        </View>
      </View>
    </View>
  )
}
