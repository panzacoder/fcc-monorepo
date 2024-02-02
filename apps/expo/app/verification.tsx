import WebView from 'app/wrappers/webview'
import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Alert } from 'react-native'
import PtsButton from 'app/ui/PtsButton'
import PtsLoader from 'app/ui/PtsLoader'
import PtsTextInput from 'app/ui/PtsTextInput'
import { useLocalSearchParams, router } from 'expo-router'
import PtsHeader from 'app/ui/PtsHeader'
import { CallPostService } from '../provider/fetchServerData'
import { BASE_URL, VERIFY_ACCOUNT, RESEND_OTP } from '../constant/urlConstants'
export default function Verification() {
  const item = useLocalSearchParams()
  // console.log('item', item)
  const [verificationCode, setVerficationCode] = useState('')
  const [isLoading, setLoading] = useState(false)
  async function verifyPressed() {
    if (!verificationCode) {
      Alert.alert('', 'Please Enter Verification Code')
      return
    }
    setLoading(true)

    let loginURL = `${BASE_URL}${VERIFY_ACCOUNT}`
    let dataObject = {
      registrationVo: {
        emailOrPhone: item.email,
        varificationCode: verificationCode,
      },
    }
    CallPostService(loginURL, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          // console.log('login success', data)
          router.replace('/login')
        } else {
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }
  async function resendPressed() {
    setLoading(true)
    let loginURL = `${BASE_URL}${RESEND_OTP}`
    let dataObject = {
      registration: {
        email: item.email,
      },
    }
    CallPostService(loginURL, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        Alert.alert('', data.message)
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }
  return (
    <View className="flex-1 bg-[#fff]">
      <PtsHeader title="Account Verification" />
      <PtsLoader loading={isLoading} />
      <View className="flex-1 justify-center">
        <Text className="mx-[5] mt-[20]  text-center text-[16px] font-bold text-black">
          {
            'Congratulations! you are successfully registered on Family Care Circle.'
          }
        </Text>
        <Text className="mx-[5] mt-[20] text-center text-[16px] text-black">
          {
            ' An Authentication Code has been sent to your registered email address. Please check your email for more details.'
          }
        </Text>
        <PtsTextInput
          className="m-5 h-[50] w-[90%] rounded-[5px] border-[1px] border-[#808080] px-5"
          placeHolder={'Email'}
          isEditable={false}
          value={item.email ? item.email : ''}
          defaultValue=""
        />
        <PtsTextInput
          className="m-5 mt-[0] h-[50] w-[90%] rounded-[5px] border-[1px] border-[#808080] px-5"
          onChangeText={setVerficationCode.bind(this)}
          placeHolder={'Verification Code'}
          value={verificationCode}
          defaultValue=""
          keyboard="numeric"
        />
        <View className="flex-row self-center">
          <PtsButton
            isShowIcon={false}
            onPress={() => {
              verifyPressed()
            }}
            className=" w-[30%] 
        flex-row justify-center rounded-[20px] bg-[#6493d9] p-[10]"
            title="Verify"
          />
          <PtsButton
            isShowIcon={false}
            onPress={() => {
              router.replace('/login')
            }}
            className="ml-[20] w-[30%] 
        flex-row justify-center rounded-[20px] bg-[#86939e] p-[10]"
            title="Cancel"
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            resendPressed()
          }}
          className="mt-[30] "
        >
          <Text className="text-center text-[16px] font-bold text-[#2884F9]">
            {'Resend Authentication Code'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
