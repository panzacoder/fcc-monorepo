import React, { useState, useEffect } from 'react'
import {
  View,
  Image,
  Text,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
  Alert,
  TextInput,
  ScrollView
} from 'react-native'
import { CheckBox } from 'react-native-elements'
import { MotiLink } from 'solito/moti'
import { CallPostService } from '../provider/fetchServerData'
import {
  BASE_URL,
  CREATE_ACCOUNT,
  GET_COUNTRIES,
  GET_STATES_AND_TIMEZONES
} from '../constant/urlConstants'
import { Typography, TextLink } from 'app/ui/typography'
// import Button from 'app/ui/button';
import PtsButton from 'app/ui/PtsButton'
import PtsLoader from 'app/ui/PtsLoader'
import PtsTextInput from 'app/ui/PtsTextInput'
import PtsHeader from 'app/ui/PtsHeader'
import PtsDropdown from 'app/ui/PtsDropdown'
import { Row } from 'app/ui/layout'
import { router } from 'expo-router'

export default function SignUp() {
  // const params = useSearchParams<Params>()
  // const search = searchParams.get('search')
  // const router = useRouter()
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
    password === confirmPassword ? 'border-black' : 'border-[#C81D1C]'

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
        {/* <Typography variant="h1">Login Page</Typography> */}
        <PtsLoader loading={isLoading} />

        {/* <Image
        source={require('../../../assets/logo.png')}
        className="absolute top-[40] z-[-1] h-[178] w-[223] self-center"
        resizeMode={'contain'}
        alt="logo"
      />
      <Image
        source={require('../../../assets/shapes.png')}
        className="absolute right-[0] top-[140] self-center"
        resizeMode={'contain'}
        alt="shapes"
      /> */}
        <Image
          source={require('../../../assets/logoNew.png')}
          className="mt-[10] h-[150] w-[150] self-center"
          resizeMode={'contain'}
          alt="logo"
        />
        <Text className="self-center text-center text-[16px] text-black">
          {'Welcome to Family Care Circle'}
        </Text>

        <View style={{ width: '100%' }} className=" self-center bg-[#fff]  ">
          {/* <Image
          source={require('../../../assets/logoWithText.png')}
          className="ml-[15] mt-[15]"
          resizeMode={'contain'}
          alt="logoWithText"
        /> */}

          {/* <TextInput
          className="m-5 h-[40] rounded-[5px] border-[1px] border-black px-5"
          setText={(email) => setEmail(email)}
          placeholder={'Email Address'}
          value={email}
          defaultValue=""
        /> */}
          <View className="flex-row">
            <PtsTextInput
              className="m-5 h-[50] w-[100%] rounded-[5px] border-[1px] border-[#808080] px-5"
              onChangeText={setFirstName.bind(this)}
              placeholder={'First Name*'}
              value={firstName}
              defaultValue=""
            />
            <PtsTextInput
              className="m-5 ml-[35] h-[50] w-[100%]  rounded-[5px] border-[1px] border-[#808080] px-5"
              onChangeText={setLastName.bind(this)}
              placeholder={'Last Name*'}
              value={lastName}
              defaultValue=""
            />
          </View>
          <PtsTextInput
            className={`m-5 mt-[-5] h-[50] rounded-[5px] border-[1px] border-[#808080] px-5 `}
            onChangeText={setEmail.bind(this)}
            placeholder={'Email Address*'}
            value={email}
            defaultValue=""
          />
          <PtsTextInput
            className={`m-5 mt-[-5] h-[50] rounded-[5px] border-[1px] border-[#808080] px-5 `}
            onChangeText={setPhone.bind(this)}
            placeholder={'Phone'}
            keyboard={'numeric'}
            value={phone}
            defaultValue=""
          />

          <View className="flex-row">
            <TextInput
              onChangeText={(password) => setPassword(password)}
              className={`mx-5 h-[50] flex-1 rounded-[5px] border-[1px] border-[#808080] px-5`}
              autoCorrect={false}
              secureTextEntry={!isShowPassword}
              placeholder="Password*"
              value={password}
              defaultValue=""
            />
            <TouchableOpacity
              onPress={() => {
                setShowPassword(!isShowPassword)
              }}
            >
              <Image
                source={
                  isShowPassword
                    ? require('../../../assets/view.png')
                    : require('../../../assets/hide.png')
                }
                className="absolute bottom-[0] right-[25] top-[15] h-[20] w-[20]  "
                resizeMode={'contain'}
                alt="logoWithText"
              />
            </TouchableOpacity>
          </View>

          <View className="flex-row">
            <TextInput
              onChangeText={(password) => setConfirmPassword(password)}
              className={`m-5 h-[50] flex-1 rounded-[5px] border-[1px] border-[#808080] border-black px-5 ${borderClassName}`}
              autoCorrect={false}
              secureTextEntry={!isShowConfirmPassword}
              placeholder="Confirm Password*"
              value={confirmPassword}
              defaultValue=""
            />
            <TouchableOpacity
              onPress={() => {
                setShowConfirmPassword(!isShowConfirmPassword)
              }}
            >
              <Image
                source={
                  isShowConfirmPassword
                    ? require('../../../assets/view.png')
                    : require('../../../assets/hide.png')
                }
                className="absolute bottom-[0] right-[25] top-[30] h-[20] w-[20] "
                resizeMode={'contain'}
                alt="logoWithText"
              />
            </TouchableOpacity>
          </View>
          {password !== confirmPassword ? (
            <View className=" mb-[5] ml-[15] mt-[-5] flex-row">
              <Image
                source={require('../../../assets/Icon.png')}
                className=""
                resizeMode={'contain'}
                alt="Icon"
              />
              <Text
                onPress={() => {
                  router.push('/login')
                }}
                className=" ml-[10]  text-[12px] text-[#1A1A1A]"
              >
                {'Passwords must match'}
              </Text>
            </View>
          ) : (
            <View />
          )}
          <Text
            onPress={() => {
              router.push('/login')
            }}
            className="ml-[20] text-[12px] font-bold text-[#1A1A1A]"
          >
            {'Address'}
          </Text>
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
            <Text className=" ml-[-10] max-w-[90%]">
              I accept the Terms and Conditions and Privacy Policy
            </Text>
          </View>
        </View>
        <PtsButton
          isDisabled={!isTcAccepted}
          isShowIcon={false}
          onPress={() => {
            signUpPressed()
          }}
          className=" w-[90%] 
        flex-row justify-center self-center rounded-[20px] bg-[#6493d9] p-[10]"
          title="Sign Up"
        />
        <View className="mb-[10] mt-[10] flex-row">
          <Text className="ml-[20] text-[16px] text-black">
            {'Already a member?'}
          </Text>
          <Text
            onPress={() => {
              router.push('/login')
            }}
            className="ml-[15] text-[16px] text-[#0C68DC]"
          >
            {'Log in'}
          </Text>
        </View>
      </ScrollView>
    </View>
  )
}
