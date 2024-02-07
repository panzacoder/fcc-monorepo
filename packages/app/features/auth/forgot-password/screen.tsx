'use client'
import { useState } from 'react'
import {
  View,
  Text,
  Alert,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView
} from 'react-native'
import { Typography } from 'app/ui/typography'
import PtsButton from 'app/ui/PtsButton'
import PtsLoader from 'app/ui/PtsLoader'
import { Button } from 'app/ui/button'
import PtsTextInput from 'app/ui/PtsTextInput'
import { Feather } from 'app/ui/icons'
import PtsHeader from 'app/ui/PtsHeader'
import { router } from 'expo-router'
import { CallPostService } from 'app/utils/fetchServerData'
import {
  BASE_URL,
  FORGOT_PASSWORD,
  RESET_PASSWORD
} from 'app/utils/urlConstants'

export function ForgotPasswordScreen() {
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
        emailOrPhone: email
      }
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
        credential: password
      }
    }
    CallPostService(loginURL, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
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
    password === confirmPassword ? 'border-gray-400' : 'border-red-400'
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <PtsHeader title="Forgot Password" />
        <PtsLoader loading={isLoading} />
        <Image
          source={require('app/assets/logoNew.png')}
          className="mt-[10] h-[150] w-[150] self-center"
          resizeMode={'contain'}
          alt="logo"
        />
        <Typography className="text-center">
          {'Welcome to Family Care Circle'}
        </Typography>
        <View className="mx-4 rounded-2xl bg-white px-4 pt-5">
          <PtsTextInput
            isEditable={!isReset}
            className=""
            onChangeText={setEmail.bind(this)}
            placeholder={'Email Address*'}
            value={email}
            defaultValue=""
          />
          {isReset ? (
            <View>
              <PtsTextInput
                className="mt-5"
                onChangeText={setAuthCode.bind(this)}
                placeholder={'Authentication Code*'}
                value={authCode}
                keyboard={'numeric'}
                defaultValue=""
              />
              <PtsTextInput
                className="mt-5"
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
                className={`mt-5 ${borderClassName}`}
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
                <View className="mt-4 flex-row">
                  <Image
                    source={require('app/assets/Icon.png')}
                    className=""
                    resizeMode={'contain'}
                    alt="Icon"
                  />
                  <Text
                    onPress={() => {
                      router.push('/login')
                    }}
                    className="mb-[10] ml-[10] text-[12px] text-black"
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

          <View className="mt-5 flex-row self-center">
            <PtsButton
              onPress={() => {
                if (!isReset) {
                  resetPressed()
                } else {
                  resePasswordtPressed()
                }
              }}
              className="w-[50%] "
              title="Reset"
            />
          </View>
          <View className="mt-[10] flex-row items-center self-center">
            <Typography className="text-center">{'New here?'}</Typography>
            <Button
              title="Sign Up"
              variant="link"
              onPress={() => {
                router.push('/sign-up')
              }}
            />
          </View>
          <View className="flex-row items-center self-center">
            <Typography className="text-center">{'Back to'}</Typography>
            <Button
              title="Log In"
              variant="link"
              onPress={() => {
                router.push('/login')
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
