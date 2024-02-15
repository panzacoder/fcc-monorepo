'use client'
import { useState, useCallback } from 'react'
import {
  View,
  Text,
  Alert,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  Pressable
} from 'react-native'
import { Typography } from 'app/ui/typography'
import PtsButton from 'app/ui/PtsButton'
import PtsLoader from 'app/ui/PtsLoader'
import { Button } from 'app/ui/button'
import PtsTextInput from 'app/ui/PtsTextInput'
import { Feather } from 'app/ui/icons'
import PtsHeader from 'app/ui/PtsHeader'
import { useRouter } from 'solito/navigation'
import { CallPostService } from 'app/utils/fetchServerData'
import {
  BASE_URL,
  FORGOT_PASSWORD,
  RESET_PASSWORD
} from 'app/utils/urlConstants'
import { CardView } from 'app/ui/layouts/card-view'
import { CardHeader } from '../card-header'

export function ForgotPasswordScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [authCode, setAuthCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isShowPassword, setShowPassword] = useState(false)
  const [isShowConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [isReset, setReset] = useState(false)
  console.log('email', email)
  const resetPressed = () => {
    console.log('resetPressed')
    console.log('email', email)
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
  function resetPasswordPressed() {
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
    <CardView>
      <CardHeader
        actionSlot={
          <View className="flex flex-col justify-end">
            <Typography>{'New here?'}</Typography>
            <Button
              title="Sign up"
              variant="link"
              onPress={() => {
                router.push('/login')
              }}
              className="py-0"
            />
          </View>
        }
      />
      <PtsLoader loading={isLoading} />
      <View className="my-4 flex flex-row flex-wrap justify-end gap-y-4">
        <Typography variant="h5" as="h1" className="text-accent basis-full">
          {'Enter your email to reset your password'}
        </Typography>
        <PtsTextInput
          isEditable={!isReset}
          className="basis-full"
          onChangeText={(text) => setEmail(text)}
          placeholder={'Email Address*'}
          value={email}
          defaultValue=""
        />
        {isReset ? (
          <>
            <PtsTextInput
              className="mt-5 basis-full"
              onChangeText={setAuthCode}
              placeholder={'Authentication Code*'}
              value={authCode}
              keyboard={'numeric'}
              defaultValue=""
            />
            <PtsTextInput
              className="mt-5 basis-full"
              onChangeText={setPassword}
              autoCorrect={false}
              secureTextEntry={!isShowPassword}
              placeholder="Password*"
              value={password}
              defaultValue=""
              trailingSlot={
                <Pressable
                  onPress={() => {
                    setShowPassword(!isShowPassword)
                  }}
                >
                  <Feather
                    name={isShowPassword ? 'eye' : 'eye-off'}
                    size={20}
                    color={'black'}
                  />
                </Pressable>
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
            ) : null}
          </>
        ) : null}
        <View className="flex basis-full flex-row justify-end gap-4">
          <Button
            variant="link"
            className=""
            onPress={() => {
              router.push('/login')
            }}
            title="Back to Log in"
            leadingIcon="arrow-left"
          />

          <Button
            className="web:max-w-fit basis-1/3"
            onPress={() => {
              if (!isReset) {
                resetPressed()
              } else {
                resetPasswordPressed()
              }
            }}
            title="Reset"
          />
        </View>
      </View>
    </CardView>
  )
}
