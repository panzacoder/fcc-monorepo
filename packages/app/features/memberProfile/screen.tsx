'use client'

import { useState, useEffect } from 'react'
import { View, Alert, ScrollView, Linking } from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import store from 'app/redux/store'
import { CallPostService } from 'app/utils/fetchServerData'
import {
  BASE_URL,
  CHECK_VALID_CREDENTIAL,
  GET_MEMBER_PROFILE,
  DELETE_AUTHORIZED_CAREGIVER,
  DELETE_CAREGIVER_CIRCLE
} from 'app/utils/urlConstants'
import { useParams } from 'solito/navigation'
import { useRouter } from 'solito/navigation'
import { Feather } from 'app/ui/icons'
import { Button } from 'app/ui/button'
import { ControlledSecureField } from 'app/ui/form-fields/controlled-secure-field'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  convertPhoneNumberToUsaPhoneNumberFormat,
  getAddressFromObject
} from 'app/ui/utils'
const schema = z.object({
  password: z.string().min(1, { message: 'Password is required' })
})
export type Schema = z.infer<typeof schema>
export function MemberProfileScreen() {
  const [isLoading, setLoading] = useState(false)
  const [isDataReceived, setIsDataReceived] = useState(false)
  const [memberDetails, setMemberDetails] = useState({}) as any
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
  const [isFromSelfCircle, setIsFromSelfCircle] = useState(false)
  const header = store.getState().headerState.header
  const item = useParams<any>()
  const router = useRouter()
  let memberData = item.memberData ? JSON.parse(item.memberData) : {}
  let userDetails = item.userDetails ? JSON.parse(item.userDetails) : {}
  // console.log('userDetails', JSON.stringify(userDetails))
  const { handleSubmit, control } = useForm({
    defaultValues: {
      password: ''
    },
    resolver: zodResolver(schema)
  })
  useEffect(() => {
    setLoading(true)
    let url = `${BASE_URL}${GET_MEMBER_PROFILE}`
    let dataObject = {
      header: header,
      member: {
        id: memberData.member ? memberData.member : ''
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          setMemberDetails(data.data ? data.data : {})
          setIsDataReceived(true)
        } else {
          Alert.alert('', data.message)
        }
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        console.log('error', error)
      })
  }, [])
  let titleStyle = 'ml-2 font-400 w-[25%] text-[15px] text-[#1A1A1A]'
  let valueStyle = 'font-400 ml-2 w-[70%] text-[15px] font-bold text-[#1A1A1A]'
  function getDetailsView(title: string, value: string) {
    return (
      <View className="mt-2 w-full flex-row items-center">
        <View className="w-full flex-row">
          <Typography className={titleStyle}>{title}</Typography>
          <Typography className={valueStyle}>{value}</Typography>
        </View>
      </View>
    )
  }
  async function checkCredential(formData: Schema) {
    setLoading(true)
    let url = `${BASE_URL}${CHECK_VALID_CREDENTIAL}`
    let dataObject = {
      header: header,
      appuserVo: {
        credential: formData.password
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          if (!isFromSelfCircle) {
            if (memberData.role === 'AuthorizedCaregiver') {
              deleteAuthorizedCaregiverCircle()
            }
          } else {
            deletCaregiver()
          }
        } else {
          Alert.alert('', data.message)
          setLoading(false)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log('error', error)
      })
  }
  async function deleteAuthorizedCaregiverCircle() {
    setLoading(true)
    let url = ''
    url = `${BASE_URL}${DELETE_AUTHORIZED_CAREGIVER}`
    let dataObject = {
      header: header,
      appuserVo: {
        id: memberData.member ? memberData.member : ''
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          router.replace('/home')
        } else {
          Alert.alert('', data.message)
        }
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        console.log('error', error)
      })
  }
  async function deletCaregiver() {
    setLoading(true)
    let url = ''
    url = `${BASE_URL}${DELETE_CAREGIVER_CIRCLE}`
    let dataObject = {
      header: header,
      appuserVo: {
        id: memberData.member ? memberData.member : '',
        caregiverId: memberDetails.id ? memberDetails.id : '',
        familyMemberMemberId: null
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          router.replace('/home')
        } else {
          Alert.alert('', data.message)
        }
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        console.log('error', error)
      })
  }
  const showDeleteModal = () => {
    return (
      <View
        style={{
          backgroundColor: 'white'
        }}
        className="my-2 max-h-[90%] w-[95%] self-center rounded-[15px] border-[1px] border-[#e0deda] "
      >
        <View className="bg-primary h-[50] w-full flex-row rounded-tl-[15px] rounded-tr-[15px]">
          <Typography className=" w-full self-center text-center font-bold text-white">{``}</Typography>
        </View>
        <ControlledSecureField
          control={control}
          name="password"
          placeholder={'Password*'}
          className="w-[95%] self-center"
        />
        <View className="my-5 flex-row self-center">
          <Button
            className="my-1 bg-[#066f72]"
            title={'Confirm'}
            variant="default"
            onPress={handleSubmit(checkCredential)}
          />
          <Button
            className="my-1 ml-5 bg-[#86939e]"
            title={'Cancel'}
            variant="default"
            onPress={() => {
              setIsShowDeleteModal(false)
            }}
          />
        </View>
      </View>
    )
  }
  return (
    <View className="flex-1">
      <PtsLoader loading={isLoading} />
      <View className="ml-5 mt-[40px] flex-row">
        <Feather
          className="mt-1"
          name={'arrow-left'}
          size={20}
          color={'black'}
          onPress={() => {
            router.back()
          }}
        />
        <Typography className="ml-[5px] flex-1 text-[18px] font-bold">
          {'Member Profile'}
        </Typography>
      </View>
      {isDataReceived ? (
        <ScrollView persistentScrollbar={true} className="flex-1">
          <View className="border-primary mt-[20] w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-2">
            <View className="flex-row">
              <Typography className="ml-2 w-[85%] self-center font-bold">
                {'Member Profile Details'}
              </Typography>
            </View>
            {getDetailsView(
              'Name',
              `${memberDetails.firstName ? memberDetails.firstName : ''} ${memberDetails.lastName ? memberDetails.lastName : ''}`
            )}
            {getDetailsView(
              'Email',
              memberDetails.email ? memberDetails.email : ''
            )}
            <View className="mt-2 w-full flex-row items-center">
              <View className="w-full flex-row">
                <Typography className={titleStyle}>{'Phone'}</Typography>
                <Typography
                  onPress={() => {
                    Linking.openURL(`tel:${memberDetails.phone}`)
                  }}
                  className="font-400 text-primary ml-2 w-[70%] text-[15px] font-bold"
                >
                  {convertPhoneNumberToUsaPhoneNumberFormat(
                    memberDetails.phone
                  )}
                </Typography>
              </View>
            </View>
            <View className="flex-row self-center">
              {memberData.role === 'My Circle' ||
              memberData.role === 'AuthorizedCaregiver' ? (
                <Button
                  className="my-2 w-[35%] self-center bg-[#c43416]"
                  title={'Delete Circle'}
                  variant="default"
                  onPress={() => {
                    Alert.alert(
                      ``,
                      `You are about to delete all Family Care Information about ${memberDetails.firstName} ${memberDetails.lastName}.All Appointments, Incidents, Purchases, Notes and Communications associated with ${memberDetails.firstName} ${memberDetails.lastName} will be permanently removed.\nAre you sure, you wish to continue as this information cannot be recovered once deleted?`,
                      [
                        {
                          text: 'Confirm',
                          onPress: () => {
                            setIsFromSelfCircle(false)
                            setIsShowDeleteModal(true)
                          }
                        },
                        { text: 'Cancel' }
                      ]
                    )
                  }}
                />
              ) : (
                <View />
              )}
              {memberData.role !== 'My Circle' ? (
                <Button
                  className="my-2 ml-2 w-[60%] self-center bg-[#ef6603]"
                  title={'Remove self from circle'}
                  variant="default"
                  onPress={() => {
                    Alert.alert(
                      `Dear ${userDetails.firstName} ${userDetails.lastName}`,
                      `You are about to remove yourself from Circle of ${memberDetails.firstName} ${memberDetails.lastName}.Once removed, you cannot view or monitor Appointments, Incidents, Purchases, Notes and Communications associated with ${memberDetails.firstName} ${memberDetails.lastName}.\nDo you want to continue?`,
                      [
                        {
                          text: 'Confirm',
                          onPress: () => {
                            setIsFromSelfCircle(true)
                            setIsShowDeleteModal(true)
                          }
                        },
                        { text: 'Cancel' }
                      ]
                    )
                  }}
                />
              ) : (
                <View />
              )}
            </View>
          </View>
          <View className="border-primary mt-[20] w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-2">
            <View className="flex-row">
              <Typography className="ml-2 w-[85%] self-center font-bold">
                {'Address'}
              </Typography>
            </View>
            {getDetailsView(
              'Address',
              getAddressFromObject(
                memberDetails.address ? memberDetails.address : {}
              )
            )}
            {getDetailsView(
              'Timezone',
              memberDetails.timezone
                ? `${memberDetails.timezone.name} (${memberDetails.timezone.abbreviation})`
                : ''
            )}
          </View>
        </ScrollView>
      ) : (
        <View />
      )}
      {isShowDeleteModal ? (
        <View className="absolute top-[100] w-[95%] flex-1 self-center">
          {showDeleteModal()}
        </View>
      ) : (
        <View />
      )}
    </View>
  )
}
