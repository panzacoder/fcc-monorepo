import WebView from 'app/wrappers/webview'
import { useState, useEffect } from 'react'
import { View, Alert } from 'react-native'
import PtsButton from 'app/ui/PtsButton'
import PtsLoader from 'app/ui/PtsLoader'
import PtsTextInput from 'app/ui/PtsTextInput'
import { Typography } from 'app/ui/typography'
import { Button } from 'app/ui/button'
import { useLocalSearchParams, router } from 'expo-router'
import PtsHeader from 'app/ui/PtsHeader'
import { CallPostService } from '../provider/fetchServerData'
import store from '../redux/store'
import { BASE_URL, VERIFY_ACCOUNT, RESEND_OTP } from '../constant/urlConstants'
export default function Verification() {
  const header = store.getState().headerState.header
  console.log('header', header)
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
        varificationCode: verificationCode
      }
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
        email: item.email
      }
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
    <View className="flex-1 bg-white">
      <PtsHeader title="Account Verification" />
      <PtsLoader loading={isLoading} />
      <View className="flex-1 justify-center">
        <Typography className="mx-[5] mt-[20]  text-center text-[16px] font-bold text-black">
          {
            'Congratulations! you are successfully registered on Family Care Circle.'
          }
        </Typography>
        <Typography className="mx-[5] mt-[20] text-center text-[16px] text-black">
          {
            ' An Authentication Code has been sent to your registered email address. Please check your email for more details.'
          }
        </Typography>
        <View className="mt-5 w-[90%]">
          <PtsTextInput
            className="m-5 mt-[0]"
            placeholder={'Email'}
            isEditable={false}
            value={item.email ? item.email : ''}
            defaultValue=""
          />
          <PtsTextInput
            className="m-5 mt-[0]"
            onChangeText={setVerficationCode.bind(this)}
            placeholder={'Verification Code'}
            value={verificationCode}
            defaultValue=""
            keyboard="numeric"
          />
        </View>
        <View className="flex-row self-center">
          <PtsButton
            onPress={() => {
              verifyPressed()
            }}
            className="w-[30%] "
            title="Verify"
          />
          <PtsButton
            onPress={() => {
              router.replace('/login')
            }}
            className="ml-[20] w-[30%] bg-[#86939e]"
            title="Cancel"
          />
        </View>
        <Button
          className="mt-5"
          title="Resend Authentication Code"
          variant="link"
          onPress={() => {
            resendPressed()
          }}
        />
      </View>
    </View>
  )
}
