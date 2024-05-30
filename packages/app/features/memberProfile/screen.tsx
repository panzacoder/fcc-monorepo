'use client'

import { useState, useEffect, useCallback } from 'react'
import { View, Alert, ScrollView, Linking, Pressable } from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import store from 'app/redux/store'
import { CallPostService } from 'app/utils/fetchServerData'
import {
  BASE_URL,
  CHECK_VALID_CREDENTIAL,
  GET_MEMBER_PROFILE,
  DELETE_AUTHORIZED_CAREGIVER,
  DELETE_CAREGIVER,
  DELETE_MEMBER,
  UPDATE_MEMBER_AUTHORIZED_CAREGIVER,
  UPDATE_MEMBER_AUTHORIZED_CAREGIVER_ADDRESS
} from 'app/utils/urlConstants'
import { useParams } from 'solito/navigation'
import { useRouter } from 'solito/navigation'
import { Feather } from 'app/ui/icons'
import { Button } from 'app/ui/button'
import { ControlledSecureField } from 'app/ui/form-fields/controlled-secure-field'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  convertPhoneNumberToUsaPhoneNumberFormat,
  getAddressFromObject
} from 'app/ui/utils'
import { LocationDetails } from 'app/ui/locationDetails'
const schema = z.object({
  password: z.string().min(1, { message: 'Password is required' })
})
const profileSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().min(1, { message: 'Email is required' }),
  phone: z.string()
})
export type Schema = z.infer<typeof schema>
export type ProfileSchema = z.infer<typeof profileSchema>
let selectedAddress: any = {
  shortDescription: '',
  nickName: '',
  address: {
    id: '',
    line: '',
    city: '',
    zipCode: '',
    state: {
      name: '',
      code: '',
      namecode: '',
      description: '',
      snum: '',
      id: '',
      country: {
        name: '',
        code: '',
        namecode: '',
        isoCode: '',
        description: '',
        id: ''
      }
    },
    timezone: {
      id: ''
    }
  }
}
export function MemberProfileScreen() {
  const [isLoading, setLoading] = useState(false)
  const [isDataReceived, setIsDataReceived] = useState(false)
  const [memberDetails, setMemberDetails] = useState({}) as any
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
  const [isUpdateProfile, setIsUpdateProfile] = useState(false)
  const [isUpdateAddress, setIsUpdateAddress] = useState(false)
  const [isFromSelfCircle, setIsFromSelfCircle] = useState(false)
  const header = store.getState().headerState.header
  const item = useParams<any>()
  const router = useRouter()
  let memberData = item.memberData ? JSON.parse(item.memberData) : {}
  let userDetails = item.userDetails ? JSON.parse(item.userDetails) : {}
  // console.log('memberData', JSON.stringify(memberData))
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    },
    resolver: zodResolver(profileSchema)
  })

  const { handleSubmit: handleSubmit1, control: control1 } = useForm({
    defaultValues: {
      password: ''
    },
    resolver: zodResolver(schema)
  })
  const getMemberProfile = useCallback(async () => {
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
          let member = data.data ? data.data : {}
          setMemberDetails(data.data ? data.data : {})
          setIsDataReceived(true)
          let isMemberWithoutEmail = data.data.memberWithoutEmail
          // console.log('memberWithoutEmail', '' + isMemberWithoutEmail)
          reset({
            firstName: member.firstName ? member.firstName : '',
            lastName: member.lastName ? member.lastName : '',
            email: !isMemberWithoutEmail && member.email ? member.email : '',
            phone: member.phone ? member.phone : ''
          })
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
  useEffect(() => {
    getMemberProfile()
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
  async function setAddressObject(value: any, index: any) {
    if (value) {
      if (index === 0) {
        selectedAddress.shortDescription = value
        selectedAddress.nickName = value
      }
      if (index === 1) {
        selectedAddress.address.line = value
      }
      if (index === 2) {
        selectedAddress.address.city = value
      }
      if (index === 3) {
        selectedAddress.address.zipCode = value
      }
      if (index === 4) {
        selectedAddress.address.state.country.id = value.id
        selectedAddress.address.state.country.name = value.name
        selectedAddress.address.state.country.code = value.code
        selectedAddress.address.state.country.namecode = value.namecode
        selectedAddress.address.state.country.snum = value.snum
        selectedAddress.address.state.country.description = value.description
      }
      if (index === 5) {
        selectedAddress.address.state.id = value.id
        selectedAddress.address.state.name = value.name
        selectedAddress.address.state.code = value.code
        selectedAddress.address.state.namecode = value.namecode
        selectedAddress.address.state.snum = value.snum
        selectedAddress.address.state.description = value.description
      }
      if (index === 6) {
        selectedAddress = value
      }
      if (index === 7) {
        selectedAddress.address.timezone.id = value.id
      }
    }

    // console.log('selectedAddress', JSON.stringify(selectedAddress))
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
          if (isFromSelfCircle) {
            deleteCaregiver()
          } else {
            if (memberData.role === 'AuthorizedCaregiver') {
              deleteAuthorizedCaregiverCircle()
            } else {
              deleteCircle()
            }
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
  async function deleteCircle() {
    setLoading(true)
    let url = ''
    url = `${BASE_URL}${DELETE_MEMBER}`
    let dataObject = {
      header: header,
      memberVo: {
        memberDetailsId: memberData.member ? memberData.member : ''
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
  async function deleteCaregiver() {
    setLoading(true)
    let url = ''
    url = `${BASE_URL}${DELETE_CAREGIVER}`
    let dataObject = {
      header: header,
      familyMember: {
        id: memberData.id ? memberData.id : '',
        memberId: memberData.member ? memberData.member : ''
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
          control={control1}
          name="password"
          placeholder={'Password*'}
          className="w-[95%] self-center"
        />
        <View className="my-5 flex-row self-center">
          <Button
            className="my-1 bg-[#066f72]"
            title={'Confirm'}
            variant="default"
            onPress={handleSubmit1(checkCredential)}
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
  async function updateProfile(formData: ProfileSchema) {
    setLoading(true)
    let url = `${BASE_URL}${UPDATE_MEMBER_AUTHORIZED_CAREGIVER}`
    let dataObject = {
      header: header,
      memberVo: {
        id: memberDetails.id ? memberDetails.id : '',
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        isMemberUpdate: true
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          setIsUpdateProfile(false)
          getMemberProfile()
        } else {
          setLoading(false)
          Alert.alert('', data.message)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log('error', error)
      })
  }
  async function updateAddress() {
    setLoading(true)
    let url = `${BASE_URL}${UPDATE_MEMBER_AUTHORIZED_CAREGIVER_ADDRESS}`
    let dataObject = {
      header: header,
      memberVo: {
        id: memberDetails.id ? memberDetails.id : '',
        isMemberUpdate: true,
        address: selectedAddress.address
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          setIsUpdateAddress(false)
          getMemberProfile()
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
  const showProfileUpdateModal = () => {
    return (
      <View className="my-2 max-h-[90%] w-[95%] self-center rounded-[15px] border-[1px] border-[#e0deda] bg-white ">
        <View className="bg-primary h-[50] w-full flex-row rounded-tl-[15px] rounded-tr-[15px]">
          <Typography className=" w-full self-center text-center font-bold text-white">{``}</Typography>
        </View>
        <ControlledTextField
          control={control}
          name="firstName"
          placeholder={'First Name'}
          className="w-[95%] self-center"
          autoCapitalize="none"
        />
        <ControlledTextField
          control={control}
          name="lastName"
          placeholder="Last Name*"
          className="w-[95%] self-center"
        />
        <ControlledTextField
          control={control}
          name="phone"
          placeholder={'Phone'}
          className="w-[95%] self-center"
          autoCapitalize="none"
        />
        <ControlledTextField
          name="email"
          className="w-[95%] self-center"
          control={control}
          placeholder={'Email*'}
          autoCapitalize="none"
        />
        <View className="my-5 flex-row self-center pb-5 ">
          <Button
            className="bg-[#066f72]"
            title={'Save'}
            variant="default"
            onPress={handleSubmit(updateProfile)}
          />
          <Button
            className=" ml-5 bg-[#86939e]"
            title={'Cancel'}
            variant="default"
            onPress={() => {
              setIsUpdateProfile(false)
            }}
          />
        </View>
      </View>
    )
  }
  const showUpdateLocationModal = () => {
    return (
      <View className="my-2 max-h-[95%] w-[95%] self-center rounded-[15px] border-[1px] border-[#e0deda] bg-white ">
        <View className="bg-primary h-[50] w-full flex-row rounded-tl-[15px] rounded-tr-[15px]">
          <Typography className=" w-full self-center text-center font-bold text-white">{``}</Typography>
        </View>
        <LocationDetails
          component={'Profile'}
          data={
            memberDetails.address
              ? {
                  address: memberDetails.address
                }
              : {}
          }
          setAddressObject={setAddressObject}
        />
        <View className="my-2 mb-5 flex-row self-center ">
          <Button
            className="bg-[#066f72]"
            title={'Save'}
            variant="default"
            onPress={() => {
              updateAddress()
            }}
          />
          <Button
            className=" ml-5 bg-[#86939e]"
            title={'Cancel'}
            variant="default"
            onPress={() => {
              setIsUpdateAddress(false)
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
              {memberData.role === 'AuthorizedCaregiver' ? (
                <Pressable className="bg-primary mx-1 h-[30] w-[30] items-center justify-center rounded-[15px]">
                  <Feather
                    className=""
                    onPress={() => {
                      setIsUpdateProfile(true)
                    }}
                    name={'edit-2'}
                    size={15}
                    color={'white'}
                  />
                </Pressable>
              ) : (
                <View />
              )}
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
              {memberData.role === 'AuthorizedCaregiver' ? (
                <Pressable className="bg-primary mx-1 h-[30] w-[30] items-center justify-center rounded-[15px]">
                  <Feather
                    className=""
                    onPress={() => {
                      setIsUpdateAddress(true)
                    }}
                    name={'edit-2'}
                    size={15}
                    color={'white'}
                  />
                </Pressable>
              ) : (
                <View />
              )}
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
      {isUpdateProfile ? (
        <View className="absolute top-[50] w-[95%] self-center">
          {showProfileUpdateModal()}
        </View>
      ) : (
        <View />
      )}
      {isUpdateAddress ? (
        <View className="absolute top-[50] w-[95%] self-center">
          {showUpdateLocationModal()}
        </View>
      ) : (
        <View />
      )}
    </View>
  )
}
