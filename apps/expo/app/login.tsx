import React, { useState } from 'react'
import {
  View,
  Image,
  Text,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
  Alert,
  TextInput,
} from 'react-native'
import { MotiLink } from 'solito/moti'
import { router } from 'expo-router'
import { CallPostService } from '../provider/fetchServerData'
import { BASE_URL, USER_LOGIN } from '../constant/urlConstants'
import { getUserDeviceInformation } from '../utils/utils'
import { Typography, TextLink } from 'app/ui/typography'
// import Button from 'app/ui/button';
import PtsButton from 'app/ui/PtsButton'
import PtsLoader from 'app/ui/PtsLoader'
import PtsTextInput from 'app/ui/PtsTextInput'
import PtsHeader from 'app/ui/PtsHeader'
import { Row } from 'app/ui/layout'
export default function Login() {
  const [email, onChangeEmail] = useState('')
  const [password, onChangePassword] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [isShowPassword, onChangeShowPassword] = useState(false)
  async function buttonPressed() {
    console.log('email', email)
    // console.log('password', password)
    if (!email) {
      Alert.alert('', 'Please Enter Email')
      return
    }
    if (!password) {
      Alert.alert('', 'Please Enter Password')
      return
    }
    setLoading(true)
    let deviceInfo = await getUserDeviceInformation()
    let loginURL = `${BASE_URL}${USER_LOGIN}`
    let dataObject = {
      header: deviceInfo,
      appuserVo: {
        emailOrPhone: email,
        credential: password,
        rememberMe: true,
      },
    }
    CallPostService(loginURL, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          console.log('login success', data)
          router.replace('/home')
        } else if (data.errorCode === 'RVF_101') {
          Alert.alert('', 'Do verification')
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }

  return (
    // <View>
    <View className="flex-1 bg-white">
      {/* <Typography variant="h1">Login Page</Typography> */}
      <PtsHeader title="Login" />
      <PtsLoader loading={isLoading} />
      <Image
        source={require('../../../assets/logoNew.png')}
        className="mt-[40] h-[150] w-[150] self-center"
        resizeMode={'contain'}
        alt="logo"
      />
      <Text className="self-center text-center text-[16px] text-black">
        {'Welcome to Family Care Circle'}
      </Text>
      {/* <Image
        source={require('../../../assets/shapes.png')}
        className="absolute right-[0] top-[140] self-center"
        resizeMode={'contain'}
        alt="shapes"
      /> */}
      <View className=" ">
        {/* <Image
          source={require('../../../assets/logoWithText.png')}
          className="ml-[15] mt-[15]"
          resizeMode={'contain'}
          alt="logoWithText"
        /> */}
        {/* <Text className="absolute right-[10] top-[10] self-center text-center text-[16px] text-black">
          {'New here?'}
        </Text>
        <Text
          onPress={() => {
            router.push('/signUp')
          }}
          className="absolute right-[10] top-[30] self-center text-center text-[16px] text-[#0C68DC]"
        >
          {'Sign Up'}
        </Text> */}

        {/* <TextInput
          className="m-5 h-[40] rounded-[5px] border-[1px] border-black px-5"
          onChangeText={(email) => onChangeEmail(email)}
          placeholder={'Email Address'}
          value={email}
          defaultValue=""
        /> */}
        <PtsTextInput
          className={`m-5 h-[50] w-[90%] rounded-[5px] border-[1px] border-[#808080] px-5 `}
          onChangeText={onChangeEmail.bind(this)}
          placeHolder={'Email Address'}
          value={email}
          defaultValue=""
        />
        <View className="flex-row">
          <TextInput
            onChangeText={(password) => onChangePassword(password)}
            className={`mx-5 h-[50] w-[90%] rounded-[5px] border-[1px] border-[#808080] px-5`}
            autoCorrect={false}
            secureTextEntry={!isShowPassword}
            placeholder="Password*"
            value={password}
            defaultValue=""
          />
          <TouchableOpacity
            onPress={() => {
              onChangeShowPassword(!isShowPassword)
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
        <View className="ml-[20] mt-[10] flex-row">
          <Text className=" self-center text-center text-[16px] text-black">
            {'New here?'}
          </Text>
          <Text
            onPress={() => {
              router.replace('/signUp')
            }}
            className="ml-[20] self-center text-center text-[16px] text-[#0C68DC]"
          >
            {'Sign Up'}
          </Text>
        </View>
        <View className="ml-[20] mt-[20] flex-row">
          <TouchableOpacity
            onPress={() => {
              router.push('/forgotPassword')
            }}
            className="  "
          >
            <Text className="text-center text-[16px] font-bold text-[#2884F9]">
              {'Forgot Password?'}
            </Text>
          </TouchableOpacity>
          <PtsButton
            isShowIcon={true}
            onPress={() => {
              buttonPressed()
            }}
            className="absolute right-[15] w-[120px] flex-row justify-center self-center rounded-[20px] bg-[#6493d9] p-[10]"
            title="Log In"
          />
        </View>
      </View>

      {/* </View> */}
    </View>
  )
}
