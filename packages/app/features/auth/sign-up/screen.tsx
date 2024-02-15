'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform
} from 'react-native'
import { CallPostService } from 'app/utils/fetchServerData'
import { Button } from 'app/ui/button'
import {
  BASE_URL,
  CREATE_ACCOUNT,
  GET_COUNTRIES,
  GET_STATES_AND_TIMEZONES
} from 'app/utils/urlConstants'
import { Typography } from 'app/ui/typography'
import PtsLoader from 'app/ui/PtsLoader'
import PtsTextInput from 'app/ui/PtsTextInput'
import { Feather } from 'app/ui/icons'
import PtsDropdown from 'app/ui/PtsDropdown'
import { useRouter } from 'solito/navigation'
import { CardHeader } from '../card-header'
import { CardView } from 'app/ui/layouts/card-view'
import { CheckBox } from 'react-native-elements'
import { Select } from 'app/ui/select'

const VALUES = {
  apple: 'Apple',
  banana: 'Banana',
  blueberry: 'Blueberry',
  grapes: 'Grapes',
  pineapple: 'Pineapple'
}

export function SignUpScreen() {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [isTcAccepted, setIsTcAccepted] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [selectedCountryValue, setSelectedCountry] = useState(-1)
  const [countryList, setCountryList] = useState<any>([])
  const [countryListDropdown, setCountryListDropdown] = useState<any>([])
  const [selectedStateValue, setSelectedState] = useState(-1)
  const [statesList, setStatesList] = useState<any>([])
  const [statesListDropdown, setStatesListDropdown] = useState<any>([])
  const [selectedTimeZoneValue, setSelectedTimeZone] = useState(-1)
  const [timeZonesList, setTimeZonesList] = useState<any>([])
  const [timeZonesListDropdown, settimeZonesListDropdown] = useState<any>([])
  const [isShowPassword, setShowPassword] = useState(false)
  const [isShowConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const borderClassName =
    password === confirmPassword ? 'border-gray-400' : 'border-red-400'

  const router = useRouter()

  const getStates = useCallback(
    async (countryId: any) => {
      setLoading(true)
      let url = `${BASE_URL}${GET_STATES_AND_TIMEZONES}`
      let dataObject = {
        country: {
          id:
            countryList[countryId] && countryList[countryId].id
              ? countryList[countryId].id
              : 101
        }
      }
      CallPostService(url, dataObject)
        .then(async (data: any) => {
          setLoading(false)
          if (data.status === 'SUCCESS') {
            const statesList = Array()
            const timeZones = Array()
            data.data.stateList.map((data: any, index: any) => {
              let object = {
                label: data.name,
                value: index
              }
              statesList.push(object)
            })
            data.data.timeZoneList.map((data: any, index: any) => {
              let object = {
                label: data.name,
                value: index
              }
              timeZones.push(object)
            })
            setStatesListDropdown(statesList)
            setStatesList(data.data.stateList ? data.data.stateList : [])
            settimeZonesListDropdown(timeZones)
            setTimeZonesList(
              data.data.timeZoneList ? data.data.timeZoneList : []
            )
          } else {
            Alert.alert('', data.message)
          }
          setLoading(false)
        })
        .catch((error) => {
          setLoading(false)
          console.log(error)
        })
    },
    [countryList]
  )

  useEffect(() => {
    async function getCountries() {
      setLoading(true)
      let url = `${BASE_URL}${GET_COUNTRIES}`
      CallPostService(url, {})
        .then(async (data: any) => {
          setLoading(false)
          if (data.status === 'SUCCESS') {
            const countryList = Array()
            data.data.map((data: any, index: any) => {
              // if (data.name === 'India') {
              //   setSelectedCountry(index)
              // }
              let object = {
                label: data.name,
                value: index
              }
              countryList.push(object)
            })
            // console.log('countryList success', countryList)
            setCountryListDropdown(countryList)
            setCountryList(data.data ? data.data : [])
            if (selectedCountryValue !== -1) {
              getStates(selectedCountryValue)
            }
          } else {
            setLoading(false)
            Alert.alert('', data.message)
          }
        })
        .catch((error) => {
          setLoading(false)
          console.log(error)
        })
    }
    getCountries()
  }, [])
  async function signUpPressed() {
    if (!firstName) {
      Alert.alert('', 'Please Enter First Name')
      return
    }
    if (!lastName) {
      Alert.alert('', 'Please Enter Last Name')
      return
    }
    if (!email) {
      Alert.alert('', 'Please Enter Email')
      return
    }
    if (!password) {
      Alert.alert('', 'Please Enter Password')
      return
    }
    if (!confirmPassword) {
      Alert.alert('', 'Please Confirm Password')
      return
    }
    if (password !== confirmPassword) {
      Alert.alert('', 'Password and Confirm Password are not same')
      return
    }
    if (selectedCountryValue === -1) {
      Alert.alert('', 'Please Select Country')
      return
    }
    if (selectedStateValue === -1) {
      Alert.alert('', 'Please Select State')
      return
    }
    if (selectedTimeZoneValue === -1) {
      Alert.alert('', 'Please Select Country')
      return
    }
    let loginURL = `${BASE_URL}${CREATE_ACCOUNT}`
    let dataObject = {
      registration: {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email,
        credential: password,
        userTimezone: timeZonesList[selectedTimeZoneValue].name,
        referralCode: '',
        address: {
          state: {
            id: statesList[selectedStateValue].id
          }
        }
      }
    }
    setLoading(true)
    CallPostService(loginURL, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          router.push({
            pathname: '/verification',
            params: {
              email: email
            }
          })
        } else if (data.errorCode === 'RVF_101') {
          Alert.alert('', 'Do verification')
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        Alert.alert('', error)
        console.log(error)
      })
  }
  async function setSelectedCountryChange(value: any) {
    setSelectedCountry(value)
    await getStates(value)
  }

  return (
    <CardView>
      <CardHeader
        actionSlot={
          <View className="flex flex-1 flex-col items-end">
            <Typography className="text-right">
              {'Already a member?'}
            </Typography>
            <Button
              title="Log in"
              variant="link"
              onPress={() => {
                router.push('/login')
              }}
              className="p-0"
            />
          </View>
        }
      />

      <PtsLoader loading={isLoading} />
      <ScrollView className="flex-1">
        <View className="my-5 flex w-full flex-1 flex-col flex-wrap gap-4">
          <View className="flex flex-1 flex-row flex-wrap gap-4 self-center">
            <PtsTextInput
              className="basis-1/3"
              onChangeText={setFirstName}
              placeholder={'First Name*'}
              value={firstName}
            />
            <PtsTextInput
              className="basis-1/3"
              onChangeText={setLastName}
              placeholder={'Last Name*'}
              value={lastName}
            />
            <PtsTextInput
              className="basis-full"
              onChangeText={setEmail}
              placeholder={'Email Address*'}
              value={email}
            />
            <PtsTextInput
              className="basis-full"
              onChangeText={setPhone}
              placeholder={'Phone'}
              keyboard={'numeric'}
              value={phone}
            />

            <PtsTextInput
              className="basis-full"
              onChangeText={(password) => setPassword(password)}
              autoCorrect={false}
              secureTextEntry={!isShowPassword}
              placeholder="Password*"
              value={password}
              trailingSlot={
                <TouchableOpacity
                  onPress={() => {
                    setShowPassword(!isShowPassword)
                  }}
                >
                  <Feather
                    name={isShowPassword ? 'eye' : 'eye-off'}
                    size={20}
                    color={'black'}
                  />
                </TouchableOpacity>
              }
            />
            <PtsTextInput
              className={`basis-full ${borderClassName}`}
              onChangeText={(password) => setConfirmPassword(password)}
              autoCorrect={false}
              secureTextEntry={!isShowConfirmPassword}
              placeholder="Confirm Password*"
              value={confirmPassword}
              defaultValue=""
              trailingSlot={
                <TouchableOpacity
                  onPress={() => {
                    setShowConfirmPassword(!isShowConfirmPassword)
                  }}
                >
                  <Feather
                    name={isShowConfirmPassword ? 'eye' : 'eye-off'}
                    size={20}
                    color={'black'}
                  />
                </TouchableOpacity>
              }
            />
            {password === confirmPassword ? (
              <View className="flex basis-full flex-row gap-2">
                <Image
                  source={require('app/assets/Icon.png')}
                  className=""
                  resizeMode={'contain'}
                  alt="Icon"
                />
                <Typography className="text-[12px] text-black">
                  {'Passwords must match'}
                </Typography>
              </View>
            ) : (
              <View />
            )}
            <Typography className="basis-full font-bold">
              {'Address'}
            </Typography>

            <Select placeholder="Country" options={countryListDropdown} />
            <View className="basis-full">
              <PtsDropdown
                onChangeValue={setSelectedCountryChange}
                label="Country*"
                maxHeight={300}
                value={selectedCountryValue}
                list={countryListDropdown}
              />
            </View>
            <View className="basis-full">
              <PtsDropdown
                onChangeValue={setSelectedState}
                label="State*"
                maxHeight={300}
                value={selectedStateValue}
                list={statesListDropdown}
              />
            </View>
            <View className="basis-full">
              <PtsDropdown
                onChangeValue={setSelectedTimeZone}
                label="Time Zone*"
                maxHeight={300}
                value={selectedTimeZoneValue}
                list={timeZonesListDropdown}
              />
            </View>
          </View>
          <View className="flex flex-row">
            <CheckBox
              checked={isTcAccepted}
              checkedColor={'#6493d9'}
              onPress={() => {
                setIsTcAccepted(!isTcAccepted)
              }}
              className="flex-shrink"
            />
            <Typography className="flex-1">
              {'I accept the Terms and Conditions and Privacy Policy'}
            </Typography>
          </View>
          <Button
            disabled={!isTcAccepted}
            onPress={() => {
              signUpPressed()
            }}
            className="w-full"
            title="Sign Up"
          />
        </View>
      </ScrollView>
    </CardView>
  )
}
