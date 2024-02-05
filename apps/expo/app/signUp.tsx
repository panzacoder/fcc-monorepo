import React, { useState, useEffect } from 'react'
import { View, Image, TouchableOpacity, Alert, ScrollView } from 'react-native'
import { CheckBox } from 'react-native-elements'
import { MotiLink } from 'solito/moti'
import { CallPostService } from '../provider/fetchServerData'
import { Button } from 'app/ui/button'
import {
  BASE_URL,
  CREATE_ACCOUNT,
  GET_COUNTRIES,
  GET_STATES_AND_TIMEZONES
} from '../constant/urlConstants'
import { Typography } from 'app/ui/typography'
// import Button from 'app/ui/button';
import PtsButton from 'app/ui/PtsButton'
import PtsLoader from 'app/ui/PtsLoader'
import PtsTextInput from 'app/ui/PtsTextInput'
import { Feather } from 'app/ui/icons'
import PtsHeader from 'app/ui/PtsHeader'
import PtsDropdown from 'app/ui/PtsDropdown'
import { Row } from 'app/ui/layout'
import { router } from 'expo-router'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [isTcAccepted, setIsTcAccepted] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [selectedCountryValue, setSelectedCountry] = useState(0)
  const [countryList, setCountryList] = useState<any>([])
  const [countryListDropdown, setCountryListDropdown] = useState<any>([])
  const [selectedStateValue, setSelectedState] = useState(-1)
  const [statesList, setStatesList] = useState<any>([])
  const [statesListDropdown, setStatesListDropdown] = useState<any>([])
  const [selectedTimeZoneValue, setSelectedTimeZone] = useState(0)
  const [timeZonesList, setTimeZonesList] = useState<any>([])
  const [timeZonesListDropdown, settimeZonesListDropdown] = useState<any>([])
  const [isShowPassword, setShowPassword] = useState(false)
  const [isShowConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setLoading] = useState(false)
  // return <WebView path="/login" />
  const borderClassName =
    password === confirmPassword ? 'border-gray-400' : 'border-red-400'

  useEffect(() => {
    async function getCountries() {
      setLoading(true)
      let url = `${BASE_URL}${GET_COUNTRIES}`
      CallPostService(url, {})
        .then(async (data: any) => {
          // setLoading(false)
          if (data.status === 'SUCCESS') {
            // console.log('fetchData success', data)
            const countryList = Array()
            data.data.map((data: any, index: any) => {
              if (data.name === 'India') {
                setSelectedCountry(index)
              }
              let object = {
                label: data.name,
                value: index
              }
              countryList.push(object)
            })
            console.log('countryList success', countryList)
            setCountryListDropdown(countryList)
            setCountryList(data.data ? data.data : [])
            getStates(selectedCountryValue)
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
  async function getStates(countryId: any) {
    // console.log('selectedCountryValue getStates', selectedCountryValue)

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
          // console.log('fetchData success', data)
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
          // console.log('countryList success', countryList)
          setStatesListDropdown(statesList)
          setStatesList(data.data.stateList ? data.data.stateList : [])
          settimeZonesListDropdown(timeZones)
          setTimeZonesList(data.data.timeZoneList ? data.data.timeZoneList : [])
        } else {
          Alert.alert('', data.message)
        }
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }

  async function signUpPressed() {
    // console.log('email', email)
    // console.log('password', password)

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
    if (selectedStateValue === -1) {
      Alert.alert('', 'Please Select State')
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
    // console.log('dataObject', dataObject.registration)
    setLoading(true)
    CallPostService(loginURL, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        // console.log('login success', data)
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
    // <View>

    <View className="flex-1 bg-white">
      <PtsHeader title="Registration" />
      <ScrollView>
        <PtsLoader loading={isLoading} />
        <Image
          source={require('../../../assets/logoNew.png')}
          className="mt-[10] h-[150] w-[150] self-center"
          resizeMode={'contain'}
          alt="logo"
        />
        <Typography className="text-center">
          {'Welcome to Family Care Circle'}
        </Typography>

        <View className="w-[100%] self-center bg-white  ">
          <View className="flex-row">
            <PtsTextInput
              className="m-5 w-[40%]"
              onChangeText={setFirstName.bind(this)}
              placeholder={'First Name*'}
              value={firstName}
              defaultValue=""
            />
            <PtsTextInput
              className="m-5 ml-[15] w-[40%]"
              onChangeText={setLastName.bind(this)}
              placeholder={'Last Name*'}
              value={lastName}
              defaultValue=""
            />
          </View>
          <View className="w-[90%]">
            <PtsTextInput
              className="m-5 mt-[0]"
              onChangeText={setEmail.bind(this)}
              placeholder={'Email Address*'}
              value={email}
              defaultValue=""
            />
            <PtsTextInput
              className="m-5 mt-[0]"
              onChangeText={setPhone.bind(this)}
              placeholder={'Phone'}
              keyboard={'numeric'}
              value={phone}
              defaultValue=""
            />

            <PtsTextInput
              className="m-5 mt-[0]"
              onChangeText={(password) => setPassword(password)}
              autoCorrect={false}
              secureTextEntry={!isShowPassword}
              placeholder="Password*"
              value={password}
              defaultValue=""
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
              className={`m-5 mt-[0] ${borderClassName}`}
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
            {password !== confirmPassword ? (
              <View className=" mb-[5] ml-[15] mt-[-5] flex-row">
                <Image
                  source={require('../../../assets/Icon.png')}
                  className=""
                  resizeMode={'contain'}
                  alt="Icon"
                />
                <Typography className="ml-[10]  text-[12px] text-black">
                  {'Passwords must match'}
                </Typography>
              </View>
            ) : (
              <View />
            )}
          </View>
          <Typography className="ml-[20] font-bold">{'Address'}</Typography>
          <PtsDropdown
            onChangeValue={setSelectedCountryChange.bind(this)}
            // onChange={setSelectedCountryChange.bind(this)}
            label="Country*"
            maxHeight={300}
            value={selectedCountryValue}
            list={countryListDropdown}
          />
          <View className="mt-[-10]">
            <PtsDropdown
              onChangeValue={setSelectedState.bind(this)}
              label="State*"
              maxHeight={300}
              // value={selectedStateValue}
              list={statesListDropdown}
            />
          </View>
        </View>
        <View className="mt-[-10]">
          <PtsDropdown
            onChangeValue={setSelectedTimeZone.bind(this)}
            label="Time Zone*"
            maxHeight={300}
            value={selectedTimeZoneValue}
            list={timeZonesListDropdown}
          />
        </View>
        <View className="mb-[5] flex-row">
          <View className=" flex-row">
            <CheckBox
              checked={isTcAccepted}
              checkedColor={'#6493d9'}
              onPress={() => {
                setIsTcAccepted(!isTcAccepted)
              }}
              className="mt-[-10] self-center"
            />
            <Typography className="ml-[-10] max-w-[90%]">
              {'I accept the Terms and Conditions and Privacy Policy'}
            </Typography>
          </View>
        </View>
        <PtsButton
          isDisabled={!isTcAccepted}
          onPress={() => {
            signUpPressed()
          }}
          className="w-[90%] "
          title="Sign Up"
        />
        <View className="mb-[10] mt-[10] flex-row">
          <Typography className="ml-[20] mt-[5] text-[16px] text-black">
            {'Already a member?'}
          </Typography>
          <Button
            title="Log In"
            variant="link"
            onPress={() => {
              router.push('/login')
            }}
          />
        </View>
      </ScrollView>
    </View>
  )
}
