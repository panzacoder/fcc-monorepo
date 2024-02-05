import { useState } from 'react'
import { View, Image, TouchableOpacity, Alert } from 'react-native'
import { router } from 'expo-router'
import { CallPostService } from '../../provider/fetchServerData'
import { BASE_URL, USER_LOGIN } from '../../constant/urlConstants'
import { getUserDeviceInformation } from '../../utils/utils'
import PtsLoader from 'app/ui/PtsLoader'
import PtsTextInput from 'app/ui/PtsTextInput'
import { Button } from 'app/ui/button'
import { Typography } from 'app/ui/typography'
import headerAction from '../../redux/header/headerAction'
import { Feather } from 'app/ui/icons'
import store from '../../redux/store'
export default function Login() {
  const [email, onChangeEmail] = useState('sachaudhari0704@gmail.com')
  const [password, onChangePassword] = useState('Shubh@m27')
  const [isLoading, setLoading] = useState(false)
  const [isShowPassword, onChangeShowPassword] = useState(false)
  async function buttonPressed() {
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
        rememberMe: true
      }
    }
    CallPostService(loginURL, dataObject)
      .then(async (data: any) => {
        setLoading(false)
        if (data.status === 'SUCCESS') {
          console.log('login success', data)
          store.dispatch(headerAction.setHeader(data.data.header))
          router.replace('/verification')
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
    <View className="m-auto grid h-full">
      <View className="mx-4 my-auto rounded-2xl bg-white px-4 pt-5">
        <PtsLoader loading={isLoading} />
        <View className="flex flex-row justify-between">
          <Image
            source={require('../../assets/fcc-logos/textStacked.png')}
            className="h-[40] w-[200]"
            resizeMode={'contain'}
            alt="logo"
          />
          <View className="flex flex-col items-end">
            <Typography>{'New here?'}</Typography>
            <Button
              title="Sign up"
              variant="link"
              onPress={() => {
                router.push('/signUp')
              }}
              className="pt-0"
            />
          </View>
        </View>
        <View className="my-5 flex flex-col gap-2">
          <PtsTextInput
            onChangeText={onChangeEmail}
            placeholder={'Email Address'}
            value={email}
            defaultValue=""
          />
          <PtsTextInput
            onChangeText={(password) => {
              onChangePassword(password)
            }}
            autoCorrect={false}
            secureTextEntry={!isShowPassword}
            placeholder="Password"
            value={password}
            defaultValue=""
            trailingSlot={
              <TouchableOpacity
                onPress={() => {
                  onChangeShowPassword(!isShowPassword)
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
          <View className="mt-[20] flex-row justify-end">
            <Button
              title="Forgot Password?"
              variant="link"
              onPress={() => {
                router.push('/forgotPassword')
              }}
            />

            <Button
              title="Log in"
              trailingIcon="arrow-right"
              onPress={buttonPressed}
            />
          </View>
        </View>
      </View>
    </View>
  )
}
