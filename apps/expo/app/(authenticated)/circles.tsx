'use client'

import { useState, useEffect, useCallback } from 'react'
import { View, Image, TouchableOpacity, Alert, ScrollView } from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
// import PtsCard from 'app/ui/PtsCard'
import { Typography } from 'app/ui/typography'
import { CircleCard } from 'app/ui/circle-card'
import { Feather } from 'app/ui/icons'
import store from 'app/redux/store'
import { Button } from 'app/ui/button'
import PtsNameInitials from 'app/ui/PtsNameInitials'
import { CallPostService } from 'app/utils/fetchServerData'
import {
  BASE_URL,
  GET_MEMBER_DETAILS,
  GET_COUNTRIES,
  GET_STATES_AND_TIMEZONES
} from 'app/utils/urlConstants'
import { consoleData } from 'app/ui/utils'
import { COLORS } from 'app/utils/colors'

import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { formatUrl } from 'app/utils/format-url'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'

const schema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email(),
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  country: z.number().min(1, { message: 'Country is required' }),
  state: z.number().min(1, { message: 'State is required' }),
  timezone: z.string().min(1, { message: 'Timezone is required' })
})

export type Schema = z.infer<typeof schema>
export default function CirclesTab(formData: Schema) {
  const { control, handleSubmit } = useForm({
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
  const [selectedCountryValue, setSelectedCountry] = useState(-1)
  const [countries, setCountries] = useState<any>([])
  const [states, setStates] = useState<any>([])
  const [timezones, setTimezones] = useState<any>([])
  const header = store.getState().headerState.header
  const user = store.getState().userProfileState.header
  const [isLoading, setLoading] = useState(false)
  const [isCreateCircle, setCreateCircle] = useState(false)
  const [isDataReceived, setDataReceived] = useState(false)
  let [circleScreenCount, setScreenCount] = useState(0)
  const [isManageCircle, setManageCircle] = useState(-1)

  const [isCreateCircleClicked, setCreateCircleClicked] = useState(false)
  const [memberList, setMemberList] = useState([])
  useEffect(() => {
    async function getMemberDetails() {
      setLoading(true)
      let url = `${BASE_URL}${GET_MEMBER_DETAILS}`
      let dataObject = {
        header: header
      }
      CallPostService(url, dataObject)
        .then(async (data: any) => {
          if (data.status === 'SUCCESS') {
            // consoleData('getMemberDetails', data.data.memberList)
            setMemberList(data.data.memberList ? data.data.memberList : [])
            setDataReceived(true)
          } else {
            Alert.alert('', data.message)
            setLoading(false)
          }
        })
        .catch((error) => {
          setLoading(false)
          console.log(error)
        })
    }
    getMemberDetails()
  }, [])
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

  useEffect(() => {
    async function getCountries() {
      setLoading(true)
      let url = `${BASE_URL}${GET_COUNTRIES}`
      CallPostService(url, {})
        .then(async (data: any) => {
          if (data.status === 'SUCCESS') {
            const countryList = data.data.map((data: any, index: any) => {
              return {
                label: data.name,
                value: data.id
              }
            })
            setCountries(countryList)
            if (selectedCountryValue !== -1) {
              getStates(selectedCountryValue)
            }
            setLoading(false)
          } else {
            Alert.alert('', data.message)
            setLoading(false)
          }
        })
        .catch((error) => {
          setLoading(false)
          console.log(error)
        })
    }
    getCountries()
  }, [])
  async function nextClicked(formData: Schema) {
    consoleData('formData', formData.firstName)
    consoleData('circleScreenCount', '' + circleScreenCount)

    if (circleScreenCount < 2) {
      setScreenCount(++circleScreenCount)
    }
  }
  async function setSelectedCountryChange(value: any) {
    setSelectedCountry(value)
    await getStates(value)
  }
  return (
    <View className=" flex-1 bg-white">
      <PtsLoader loading={isLoading} />
      <Image
        source={require('app/assets/header.png')}
        className="mt-[-40px]"
        resizeMode={'contain'}
        alt="logo"
      />
      <View className="absolute top-[60] w-[100%]">
        <View className="flex-row items-center">
          <Typography className="ml-[20] text-[22px] font-bold">
            {'Your Circles'}
          </Typography>
          <PtsNameInitials
            className="absolute right-[5]"
            fullName={user.memberName}
          />
        </View>
        {/* <View className=" ml-[30] mt-5 h-[20%] flex-row">
          <View className="w-[80%] flex-row">
            <Typography className="mr-3 font-bold">{'Sort by'}</Typography>
            <TouchableOpacity className="" onPress={() => {}}>
              <Feather name={'chevron-down'} size={25} color={'black'} />
            </TouchableOpacity>
          </View>

        
        </View> */}
        <View className="mr-[30] mt-[30] flex-row justify-end">
          <TouchableOpacity
            className="h-[30px] w-[30px] items-center justify-center rounded-[15px] bg-[#c5dbfd]"
            onPress={() => {
              setCreateCircle(!isCreateCircle)
            }}
          >
            <Feather name={'plus'} size={25} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {isCreateCircle ? (
        <View className="mt-[-20] flex-row">
          <Typography className="w-[33%]" />
          <View className="mt-[5] w-[45%] rounded-[10px] bg-white py-5 shadow-lg">
            <TouchableOpacity
              className="flex-row"
              onPress={() => {
                setCreateCircleClicked(!isCreateCircleClicked)
                setCreateCircle(!isCreateCircle)
              }}
            >
              <View className="mx-3 h-[30px] w-[30px] flex-row items-center justify-center rounded-[15px] border-[2px] border-black">
                <Feather name={'plus'} size={25} color={'black'} />
              </View>
              <Typography className="font-400 self-center text-[16px]">
                {'Create Circle'}
              </Typography>
            </TouchableOpacity>
            <View className="mt-3 flex-row">
              <TouchableOpacity className="flex-row">
                <View className="mx-3 h-[30px] w-[30px] flex-row items-center justify-center rounded-[15px] border-[2px] border-black">
                  <Feather name={'check'} size={25} color={'black'} />
                </View>
                <Typography className="font-400 self-center text-[16px]">
                  {'Join Circle'}
                </Typography>
              </TouchableOpacity>
            </View>
          </View>
          <View className="h-[20px] w-[20px] rounded-[10px] bg-white shadow-lg" />
          <View className="h-[10px] w-[10px] rounded-[5px] bg-white shadow-lg" />
        </View>
      ) : (
        <View />
      )}
      {isCreateCircleClicked ? (
        <View
          className={`h-[${circleScreenCount !== 2 ? '60%' : '70%'}] w-[90%] flex-1 items-center self-center rounded-[15px] bg-white shadow-lg`}
        >
          <View className=" w-[90%] flex-1 items-center ">
            <View className="mt-5 flex-row items-center ">
              {circleScreenCount === 0 ? (
                <View className="border-primary h-[30px] w-[30px] items-center rounded-[15px] border-[3px]">
                  <View className="border-primary mt-1 h-[16px] w-[16px] self-center rounded-[8px] border-[2px]" />
                </View>
              ) : (
                <View className="border-primary bg-primary h-[30px] w-[30px] items-center rounded-[15px] border-[3px]">
                  <Feather name={'check'} size={20} color={'white'} />
                </View>
              )}
              <View className="h-[2px] w-[35%] bg-[#A8AAAD]" />
              {circleScreenCount <= 1 ? (
                <View
                  className={`h-[30px] w-[30px] items-center rounded-[15px] border-[3px] border-[${circleScreenCount !== 1 ? '#A8AAAD' : '#287CFA'}]`}
                >
                  <View
                    className={`mt-1 h-[16px] w-[16px] self-center rounded-[8px] border-[2px] border-[${circleScreenCount !== 1 ? '#A8AAAD' : '#287CFA'}]`}
                  />
                </View>
              ) : (
                <View className="border-primary bg-primary h-[30px] w-[30px] items-center rounded-[15px] border-[3px]">
                  <Feather name={'check'} size={20} color={'white'} />
                </View>
              )}

              <View className="h-[2px] w-[35%] bg-[#A8AAAD]" />
              {circleScreenCount <= 2 ? (
                <View
                  className={`h-[30px] w-[30px] items-center rounded-[15px] border-[3px] border-[${circleScreenCount !== 1 ? '#A8AAAD' : '#287CFA'}]`}
                >
                  <View
                    className={`mt-1 h-[16px] w-[16px] self-center rounded-[8px] border-[2px] border-[${circleScreenCount !== 1 ? '#A8AAAD' : '#287CFA'}]`}
                  />
                </View>
              ) : (
                <View className="border-primary bg-primary h-[30px] w-[30px] items-center rounded-[15px] border-[3px]">
                  <Feather name={'check'} size={20} color={'white'} />
                </View>
              )}
            </View>
            <Typography className="font-400 mt-10 text-[16px] text-black">
              {circleScreenCount === 0
                ? 'Who is this Circle for?'
                : circleScreenCount === 1
                  ? `Do you want to invite ${formData.firstName} to manage their Circle?`
                  : ''}
            </Typography>

            {circleScreenCount === 0 ? (
              <View className="my-5 w-full">
                <View className="flex w-full gap-2">
                  <ControlledTextField
                    control={control}
                    name="firstName"
                    placeholder={'First Name'}
                    className="w-full"
                    autoCapitalize="none"
                  />
                  <ControlledTextField
                    control={control}
                    name="lastName"
                    placeholder="Last Name"
                    className="w-full"
                  />
                </View>
                <View className="my-5 flex-row">
                  <Feather name={'info'} size={25} color={COLORS.primary} />
                  <Typography className="ml-3">
                    {'Circles organize caregiving details for an individual.'}
                  </Typography>
                </View>
              </View>
            ) : (
              <View />
            )}
            {circleScreenCount === 1 ? (
              <View className="rounded-[25px] bg-[#EBECED] px-2 py-2 ">
                <View className="flex-row">
                  <TouchableOpacity
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
                  </TouchableOpacity>
                  <TouchableOpacity
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
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View />
            )}
            {circleScreenCount === 1 && isManageCircle === 0 ? (
              <View className="my-5 w-full">
                <View className="flex w-full gap-2">
                  <ControlledTextField
                    control={control}
                    name="email"
                    placeholder={'Email Address'}
                    className="w-full"
                    autoCapitalize="none"
                  />
                </View>
              </View>
            ) : (
              <View />
            )}
            {circleScreenCount === 1 && isManageCircle === 1 ? (
              <View className="my-5">
                <Typography>
                  {`You will be the sole manager of ${formData.firstName + "'s"} Circle.If at any point ${formData.firstName} wants to manage their Circle, you can add their email address in Circle settings.`}
                </Typography>
              </View>
            ) : (
              <View />
            )}
            {circleScreenCount === 2 ? (
              <ScrollView
                contentContainerStyle={{ marginHorizontal: 10 }}
                persistentScrollbar={true}
                className="mt-[-30] w-full"
              >
                <Typography className="font-400 text-center text-[16px] text-black">
                  {`What is ${formData.firstName ? formData.firstName + "'s" : ''} default timezone?`}
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
                      setCreateCircleClicked(!isCreateCircleClicked)
                      setScreenCount(0)
                    }}
                  />
                  <Button
                    className=""
                    title="Create"
                    trailingIcon="plus"
                    // onPress={handleSubmit(nextClicked)}
                    onPress={() => {
                      if (circleScreenCount < 3) {
                        setScreenCount(++circleScreenCount)
                      }
                    }}
                  />
                </View>
              </ScrollView>
            ) : (
              <View />
            )}
            {circleScreenCount === 3 ? (
              <View>
                <Image
                  source={require('app/assets/circles.png')}
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
                      setScreenCount(0)
                    }}
                  />
                  <Button
                    className=""
                    title={'Go To Circle'}
                    trailingIcon="arrow-right"
                    onPress={() => {}}
                  />
                </View>
              </View>
            ) : (
              <View />
            )}
          </View>

          {circleScreenCount < 2 ? (
            <View className="absolute bottom-[10] right-[10] flex-row ">
              <Button
                className="mr-5"
                title={'Cancel'}
                variant="border"
                onPress={() => {
                  setCreateCircleClicked(!isCreateCircleClicked)
                  setScreenCount(0)
                }}
              />
              <Button
                className=""
                title={'Next'}
                trailingIcon="arrow-right"
                // onPress={handleSubmit(nextClicked)}
                onPress={() => {
                  if (circleScreenCount < 3) {
                    setScreenCount(++circleScreenCount)
                  }
                }}
              />
            </View>
          ) : (
            <View />
          )}
        </View>
      ) : (
        <View />
      )}
      {!isCreateCircleClicked ? (
        <ScrollView persistentScrollbar={true} className="z-[1] m-2 flex-1">
          {memberList.map((data: any, index: number) => {
            return (
              <View key={index}>
                <CircleCard data={data}></CircleCard>
              </View>
            )
          })}
        </ScrollView>
      ) : (
        <View />
      )}
    </View>
  )
}
