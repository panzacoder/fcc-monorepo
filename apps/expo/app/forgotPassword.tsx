import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  Alert,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native'
import PtsButton from 'app/ui/PtsButton'
import PtsLoader from 'app/ui/PtsLoader'
import PtsTextInput from 'app/ui/PtsTextInput'
import PtsHeader from 'app/ui/PtsHeader'
import { router } from 'expo-router'
import { CallPostService } from '../provider/fetchServerData'
import {
  BASE_URL,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
} from '../constant/urlConstants'

export default function ForgotPassword() {
  // return <WebView path="/circles" />
  const [email, setEmail] = useState('')
  const [authCode, setAuthCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isShowPassword, setShowPassword] = useState(false)
  const [isShowConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [isReset, setReset] = useState(false)
  function resetPressed() {
    if (!email) {
      Alert.alert('', 'Please Enter Email Address')
      return
    }
    setLoading(true)
    let loginURL = `${BASE_URL}${FORGOT_PASSWORD}`
    let dataObject = {
      appuserVo: {
        emailOrPhone: email,
      },
    }
    CallPostService(loginURL, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          // console.log('resetPressed success', data)
          setReset(true)
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(true)
        console.log(error)
      })
  }
  function resePasswordtPressed() {
    if (!email) {
      Alert.alert('', 'Please Enter Email')
      return
    }
    if (!authCode) {
      Alert.alert('', 'Please Authentication Code')
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
    setLoading(true)
    let loginURL = `${BASE_URL}${RESET_PASSWORD}`
    let dataObject = {
      appuserVo: {
        emailOrPhone: email,
        tempPassword: authCode,
        credential: password,
      },
    }
    CallPostService(loginURL, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          // console.log('resetPressed success', data)
          router.push('/login')
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(true)
        console.log(error)
      })
  }
  const borderClassName =
    password === confirmPassword ? 'border-black' : 'border-[#C81D1C]'
  return (
    <SafeAreaView className="flex-1 bg-[#fff]">
      <PtsHeader title="Forgot Password" />
      <PtsLoader loading={isLoading} />
      <Image
        source={require('../../../assets/logoNew.png')}
        className="mt-[10] h-[150] w-[150] self-center"
        resizeMode={'contain'}
        alt="logo"
      />
      <Text className="self-center text-center text-[16px] text-black">
        {'Welcome to Family Care Circle'}
      </Text>
      <View className="flex-1">
        <PtsTextInput
          isEditable={!isReset}
          className="m-5 h-[50] w-[90%] rounded-[5px] border-[1px] border-[#808080] px-5"
          onChangeText={setEmail.bind(this)}
          placeHolder={'Email Address*'}
          value={email}
          defaultValue=""
        />
        {!isReset ? (
          <View>
            <PtsTextInput
              className="m-5 mt-[0] h-[50] w-[90%] rounded-[5px] border-[1px] border-[#808080] px-5"
              onChangeText={setAuthCode.bind(this)}
              placeHolder={'Authentication Code*'}
              value={authCode}
              keyboard={'numeric'}
              defaultValue=""
            />
            <View className="flex-row">
              <TextInput
                onChangeText={(password) => setPassword(password)}
                className={`mx-5 h-[50]  w-[90%] flex-1 rounded-[5px] border-[1px] border-[#808080] px-5`}
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
                className={`m-5 h-[50] w-[90%]  flex-1 rounded-[5px] border-[1px] border-[#808080] border-black px-5 ${borderClassName}`}
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
              <View className="ml-[15] mt-[-10] flex-row">
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
                  className="mb-[10] ml-[10] text-[12px] text-[#1A1A1A]"
                >
                  {'Passwords must match'}
                </Text>
              </View>
            ) : (
              <View />
            )}
          </View>
        ) : (
          <View />
        )}

        <View className="flex-row self-center">
          <PtsButton
            isShowIcon={false}
            onPress={() => {
              if (!isReset) {
                resetPressed()
              } else {
                resePasswordtPressed()
              }
            }}
            className=" w-[40%] 
        flex-row justify-center rounded-[20px] bg-[#6493d9] p-[10]"
            title="Reset"
          />
        </View>
        <View className="mt-[20] flex-row items-center self-center">
          <Text className=" text-center text-[16px] text-black">
            {'New here?'}
          </Text>
          <Text
            onPress={() => {
              router.push('/signUp')
            }}
            className="ml-[20] self-center text-center text-[16px] text-[#0C68DC]"
          >
            {'Sign Up'}
          </Text>
        </View>
        <View className="mt-[10] flex-row items-center self-center">
          <Text className=" text-center text-[16px] text-black">
            {'Back to'}
          </Text>
          <Text
            onPress={() => {
              router.push('/login')
            }}
            className="ml-[10] self-center text-center text-[16px] text-[#0C68DC]"
          >
            {'Log In'}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  )
}
