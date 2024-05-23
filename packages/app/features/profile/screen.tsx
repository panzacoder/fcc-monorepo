'use client'
import { useState, useEffect, useCallback } from 'react'
import { View, Alert, ScrollView, Pressable, Linking } from 'react-native'
import { Typography } from 'app/ui/typography'
import { useRouter } from 'solito/navigation'
import { Feather } from 'app/ui/icons'
import { CallPostService } from 'app/utils/fetchServerData'
import { formatUrl } from 'app/utils/format-url'
import moment from 'moment'
import PtsLoader from 'app/ui/PtsLoader'
import {
  BASE_URL,
  GET_USER_PROFILE,
  AUTO_SUBSCRIPTION,
  MANUAL_SUBSCRIPTION,
  CANCEL_SUBSCRIPTION,
  DELETE_ACCOUNT,
  CHECK_VALID_CREDENTIAL,
  UPDATE_PROFILE,
  UPDATE_MEMBER_ADDRESS,
  UPDATE_SPONSOR_CODE
} from 'app/utils/urlConstants'
import { Button } from 'app/ui/button'
import _ from 'lodash'
import ToggleSwitch from 'toggle-switch-react-native'
import store from 'app/redux/store'
import { ControlledSecureField } from 'app/ui/form-fields/controlled-secure-field'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
// import { AddressFields } from 'app/ui/form-fields/address-fields'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import {
  convertPhoneNumberToUsaPhoneNumberFormat,
  getAddressFromObject,
  getFullDateForCalendar
} from 'app/ui/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { LocationDetails } from 'app/ui/locationDetails'
const schema = z.object({
  password: z.string().min(1, { message: 'Password is required' })
})
const sponsorSchema = z.object({
  sponsorCode: z.string().min(1, { message: 'Sponsor code is required' })
})
const profileSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().min(1, { message: 'Email is required' }),
  phone: z.string()
})
export type Schema = z.infer<typeof schema>
export type SponsorSchema = z.infer<typeof sponsorSchema>
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
let isShowRenewButton = false
export function ProfileScreen() {
  const header = store.getState().headerState.header
  const userProfile = store.getState().userProfileState.header
  // console.log('userProfile', JSON.stringify(userProfile))
  const [isLoading, setLoading] = useState(false)
  const [isDataReceived, setIsDataReceived] = useState(false)
  const [isShowOrderList, setIsShowOrderList] = useState(false)
  const [isUpdateProfile, setIsUpdateProfile] = useState(false)
  const [isUpdateAddress, setIsUpdateAddress] = useState(false)
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
  const [isAutoSubscription, setIsAutoSubscription] = useState(false)
  const [isSubscribedUser, setISubscribedUser] = useState(false)
  const [isShowAlerts, setIsShowAlerts] = useState(false)
  const [appuserDetails, setAppuserDetails] = useState({}) as any
  const [userSubscription, setUserSubscription] = useState({}) as any
  const [memberDetails, setMemberDetails] = useState({}) as any
  const [orderList, setOrderList] = useState([])
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
  const {
    handleSubmit: handleSubmit2,
    control: control2,
    reset: reset1
  } = useForm({
    defaultValues: {
      sponsorCode: ''
    },
    resolver: zodResolver(sponsorSchema)
  })
  const getUserProfile = useCallback(async () => {
    setLoading(true)
    let url = `${BASE_URL}${GET_USER_PROFILE}`
    let dataObject = {
      header: header
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          let appUser = data.data.appuser ? data.data.appuser : {}
          setAppuserDetails(appUser)
          setMemberDetails(data.data.member ? data.data.member : {})
          setOrderList(data.data.orderList ? data.data.orderList : [])
          setUserSubscription(
            data.data.userSubscription ? data.data.userSubscription : {}
          )
          // console.log(
          //   'data.data.userSubscription',
          //   JSON.stringify(data.data.userSubscription)
          // )
          let isSubscribedUser = data.data.userSubscription
            ? data.data.userSubscription.status.toLowerCase() !== 'active'
              ? false
              : true
            : false
          setISubscribedUser(isSubscribedUser)
          setIsDataReceived(true)
          if (!isShowAlerts) {
            if (
              data.data.expiringSubscription &&
              userSubscription.status.toLowerCase() === 'active'
            ) {
              isShowRenewButton = true
              // console.log('expiringSubscription../', JSON.stringify(data.data))
              Alert.alert(
                '',
                `Your subscription will expire on ${moment(
                  data.data.subscriptionEndDate
                ).format(
                  'DD-MMM-YYYY'
                )}. Please renew to use ad-free services.`,
                [
                  {
                    text: 'Renew',
                    onPress: () => {
                      if (data.data.userSubscription) {
                        if (data.data.userSubscription.plan) {
                          if (
                            String(
                              data.data.userSubscription.source
                            ).toLowerCase() === 'Stripe'.toLowerCase()
                          ) {
                            let plan = data.data.userSubscription.plan
                            router.push(
                              formatUrl('/plans', {
                                planDetails: JSON.stringify(plan),
                                isRenewPlan: 'true',
                                isFromUpgradePlan: 'false'
                              })
                            )
                          }
                        }
                      }
                    }
                  },
                  { text: 'Cancel' }
                ]
              )
            }
            if (data.data.expiredSubscription) {
              Alert.alert(
                '',
                `Your Subscription has expired. Please Renew it to continue Ad free experience.`,
                [
                  {
                    text: 'Subscribe',
                    onPress: () => {
                      router.push(
                        formatUrl('/plans', {
                          isFromUpgradePlan: 'false'
                        })
                      )
                    }
                  },
                  { text: 'Cancel' }
                ]
              )
            }
          }
          setIsShowAlerts(true)
          reset({
            firstName: appUser.firstName ? appUser.firstName : '',
            lastName: appUser.lastName ? appUser.lastName : '',
            email: appUser.email ? appUser.email : '',
            phone: appUser.phone ? appUser.phone : ''
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
    getUserProfile()
  }, [])
  async function switchManualToAutoSubscription() {
    setLoading(true)
    let url = `${BASE_URL}${isAutoSubscription ? MANUAL_SUBSCRIPTION : AUTO_SUBSCRIPTION}`
    let dataObject = {
      header: header,
      email: appuserDetails.email ? appuserDetails.email : ''
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          setIsAutoSubscription(!isAutoSubscription)
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
  async function upgradeButtonClicked() {
    // console.log('upgradeButtonClicked')
    router.push(
      formatUrl('/plans', {
        planDetails: JSON.stringify(userSubscription),
        isRenewPlan: 'false',
        isFromUpgradePlan: 'true'
      })
    )
  }
  async function renewButtonClicked() {
    // console.log('renewButtonClicked')
    router.push(
      formatUrl('/plans', {
        planDetails: JSON.stringify(userSubscription),
        isRenewPlan: 'true',
        isFromUpgradePlan: 'false'
      })
    )
  }
  async function updateAddress() {
    setLoading(true)
    let url = `${BASE_URL}${UPDATE_MEMBER_ADDRESS}`
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
          getUserProfile()
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
  async function cancelSubscriptionButtonClicked() {
    setLoading(true)
    let url = `${BASE_URL}${CANCEL_SUBSCRIPTION}`
    let dataObject = {
      header: header,
      email: appuserDetails.email ? appuserDetails.email : ''
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          getUserProfile()
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
  async function updateProfile(formData: ProfileSchema) {
    setLoading(true)
    let url = `${BASE_URL}${UPDATE_PROFILE}`
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
          getUserProfile()
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
  async function saveSponsorCode(formData: SponsorSchema) {
    // console.log('formData', formData.sponsorCode)
    setLoading(true)
    let url = `${BASE_URL}${UPDATE_SPONSOR_CODE}`
    let dataObject = {
      header: header,
      appuserVo: {
        sponsorCode: formData.sponsorCode,
        email: memberDetails.email ? memberDetails.email : ''
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          reset1({
            sponsorCode: ''
          })
          getUserProfile()
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
          deleteAccount(formData.password)
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
  async function deleteAccount(password: any) {
    setLoading(true)
    let url = `${BASE_URL}${DELETE_ACCOUNT}`
    let dataObject = {
      header: header,
      appuserVo: {
        email: appuserDetails.email ? appuserDetails.email : '',
        credential: password
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          router.push('/login')
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
  const router = useRouter()
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
  let showUpgradeButton = true
  let isStripe = true
  if (userSubscription) {
    if (userSubscription.plan) {
      if (userSubscription.plan.plantype === 'Yearly') {
        showUpgradeButton = false
      }
    }
    if (
      String(userSubscription.source).toLowerCase() !== 'Stripe'.toLowerCase()
    ) {
      isStripe = false
    }
  }
  function getOrderItemsView() {
    let orderView = orderList.map((data: any, index: any) => {
      let planName = data.orderItems
        ? data.orderItems[0].description.replace('Basic ', '')
        : ''
      return (
        <View
          key={index}
          className={`flex-row py-1 ${index % 2 === 0 ? 'bg-white' : 'bg-[#b8d4e3]'}`}
        >
          <Typography className=" w-[5%] text-center">{index + 1}</Typography>
          <Typography className=" w-[20%] text-center">{planName}</Typography>
          <Typography className=" w-[30%] text-center">
            {getFullDateForCalendar(data.date, 'DD-MMM-YYYY')}
          </Typography>
          <Typography className=" w-[15%] text-center">
            {data.price ? `${'$'}${data.price}` : ''}
          </Typography>
          <Typography className=" w-[25%] text-center">
            {data.status ? data.status : ''}
          </Typography>
        </View>
      )
    })
    return (
      <View className="rounded-bl-[5px] rounded-br-[5px] border-[1px] border-gray-400">
        <View className="flex-row">
          <Typography className="w-[5%] text-center font-bold">
            {'#'}
          </Typography>
          <Typography className="w-[20%] text-center font-bold">
            {'Order'}
          </Typography>
          <Typography className="w-[30%] text-center font-bold">
            {'Date'}
          </Typography>
          <Typography className="w-[15%] text-center font-bold">
            {'Price'}
          </Typography>
          <Typography className="w-[25%] text-center font-bold">
            {'Status'}
          </Typography>
        </View>
        <View className="h-[0.5px] w-full bg-gray-400" />
        {orderView}
      </View>
    )
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
          {'Profile'}
        </Typography>
      </View>
      {isDataReceived ? (
        <ScrollView persistentScrollbar={true} className="flex-1">
          <View className="border-primary mt-[20] w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-2">
            <View className="flex-row">
              <Typography className="ml-2 w-[85%] self-center font-bold">
                {'User Profile'}
              </Typography>
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
            </View>
            {getDetailsView(
              'Name',
              `${appuserDetails.firstName ? appuserDetails.firstName : ''} ${appuserDetails.lastName ? appuserDetails.lastName : ''}`
            )}
            {getDetailsView(
              'Email',
              appuserDetails.email ? appuserDetails.email : ''
            )}
            {/* {getDetailsView(
              'Phone:',
              convertPhoneNumberToUsaPhoneNumberFormat(appuserDetails.phone)
            )} */}
            <View className="mt-2 w-full flex-row items-center">
              <View className="w-full flex-row">
                <Typography className={titleStyle}>{'Phone'}</Typography>
                <Typography
                  onPress={() => {
                    Linking.openURL(`tel:${appuserDetails.phone}`)
                  }}
                  className="font-400 text-primary ml-2 w-[70%] text-[15px] font-bold"
                >
                  {convertPhoneNumberToUsaPhoneNumberFormat(
                    appuserDetails.phone
                  )}
                </Typography>
              </View>
            </View>
            <Button
              className="my-2 w-[50%] self-center bg-[#c43416]"
              title={'Delete Account'}
              variant="default"
              onPress={() => {
                Alert.alert(
                  `Dear ${appuserDetails.firstName} ${appuserDetails.lastName}`,
                  `You are about to delete your account permanently. If you are ready to delete, enter your password and click CONFIRM. Once you confirm your account for deletion, you will not be able to retrieve any information you have added here. You will be deleted from other Family Care Circles.`,
                  [
                    {
                      text: 'Confirm',
                      onPress: () => {
                        setIsShowDeleteModal(true)
                      }
                    },
                    { text: 'Cancel' }
                  ]
                )
              }}
            />
          </View>

          <View className="border-primary mt-[20] w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-2">
            <View className="flex-row">
              <Typography className="ml-2 w-[85%] self-center font-bold">
                {'Address'}
              </Typography>
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

          <View className="border-primary mt-[20] w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-2">
            <View className="flex-row">
              <Typography className="ml-2 w-[85%] self-center font-bold">
                {'Plans and subscription'}
              </Typography>
            </View>
            {appuserDetails.isFreeUser ? (
              <View className="mt-1">
                <View className="flex-row py-1">
                  <Typography className="mx-2 w-[80%] font-bold text-black">
                    {'FREE WITH ADS'}
                  </Typography>
                  <Typography className="mx-2 font-bold text-black">
                    {'$0.00'}
                  </Typography>
                </View>
                {!_.isEmpty(userSubscription) ? (
                  <View className="mt-1 rounded-[5px] border-[1px] border-gray-400 py-1">
                    <Typography className="mx-2 py-1 font-bold text-black">
                      {'Plan Details'}
                    </Typography>
                    {getDetailsView(
                      'Start Date',
                      getFullDateForCalendar(
                        userSubscription.startDate,
                        'DD-MMM-YYYY'
                      )
                    )}
                    {getDetailsView(
                      'End Date',
                      getFullDateForCalendar(
                        userSubscription.endDate,
                        'DD-MMM-YYYY'
                      )
                    )}
                    {getDetailsView('Status', userSubscription.status)}
                  </View>
                ) : (
                  <View />
                )}

                {userProfile.premiumFeatureTrialinfo !== null &&
                !isSubscribedUser ? (
                  <View className="mt-1 rounded-[5px] border-[1px] border-gray-400 py-1">
                    <Typography className="mx-2  font-bold text-black">
                      {'Trial Period Details'}
                    </Typography>
                    {getDetailsView(
                      'Start Date',
                      getFullDateForCalendar(
                        userProfile.premiumFeatureTrialinfo.startDate,
                        'DD-MMM-YYYY'
                      )
                    )}
                    {getDetailsView(
                      'End Date',
                      getFullDateForCalendar(
                        userProfile.premiumFeatureTrialinfo.endDate,
                        'DD-MMM-YYYY'
                      )
                    )}
                    {getDetailsView(
                      'Status',
                      userProfile.premiumFeatureTrialinfo.status.status
                    )}
                  </View>
                ) : (
                  <View />
                )}
                <Button
                  className="my-2 w-[50%] self-center bg-[#ef6603]"
                  title={'Purchase Plan'}
                  variant="default"
                  onPress={() => {
                    router.push(
                      formatUrl('/plans', {
                        isFromUpgradePlan: 'false'
                      })
                    )
                  }}
                />
              </View>
            ) : (
              <View>
                {getDetailsView(
                  'Plan Name',
                  userSubscription.plan ? userSubscription.plan.description : ''
                )}
                {getDetailsView(
                  'Price',
                  `$${userSubscription.plan ? userSubscription.plan.price : ''}`
                )}
                {getDetailsView(
                  'Start Date',
                  getFullDateForCalendar(
                    userSubscription.startDate,
                    'DD-MMM-YYYY'
                  )
                )}
                {getDetailsView(
                  'End Date',
                  getFullDateForCalendar(
                    userSubscription.endDate,
                    'DD-MMM-YYYY'
                  )
                )}

                {getDetailsView(
                  'Status',
                  userSubscription.status
                    ? userSubscription.status.charAt(0).toUpperCase() +
                        userSubscription.status.slice(1)
                    : ''
                )}

                {isStripe ? (
                  <View className="flex-row">
                    <Typography className="mx-2 mr-3 py-1 text-center font-bold text-black">
                      {'Manual Charge'}
                    </Typography>
                    <ToggleSwitch
                      isOn={isAutoSubscription}
                      onColor="#2884F9"
                      offColor="#2884F9"
                      size="medium"
                      onToggle={(isOn) => {
                        switchManualToAutoSubscription()
                      }}
                    />
                    <Typography className="mx-2 mr-3 py-1 text-center font-bold text-black">
                      {'Auto Charge'}
                    </Typography>
                  </View>
                ) : (
                  <View />
                )}
                <View className="self-center">
                  <View className="flex-row self-center">
                    {showUpgradeButton ? (
                      <Button
                        className="my-2 w-[40%] self-center bg-[#ef6603]"
                        title={'Upgrade Plan'}
                        variant="default"
                        onPress={() => {
                          upgradeButtonClicked()
                        }}
                      />
                    ) : (
                      <View />
                    )}
                    {!isShowRenewButton ? (
                      <Button
                        className="my-2 ml-5 w-[40%] self-center bg-[#ef6603]"
                        title={'Renew Plan'}
                        variant="default"
                        onPress={() => {
                          renewButtonClicked()
                        }}
                      />
                    ) : (
                      <View />
                    )}
                  </View>

                  <Button
                    className="my-2 ml-5 w-[50%] self-center bg-[#c43416]"
                    title={'Cancel Subscription'}
                    variant="default"
                    onPress={() => {
                      cancelSubscriptionButtonClicked()
                    }}
                  />
                </View>
              </View>
            )}
            {orderList.length > 0 ? (
              <View>
                <View className="bg-primary flex-row rounded-tl-[5px] rounded-tr-[5px]" >
                  <Typography className=" w-[90%] py-2 text-center font-bold text-white">
                    {'Order History'}
                  </Typography>
                  <Feather
                    onPress={() => {
                      setIsShowOrderList(!isShowOrderList)
                    }}
                    className="self-center"
                    name={!isShowOrderList ? 'chevron-down' : 'chevron-up'}
                    size={20}
                    color={'white'}
                  />
                </View>
                {isShowOrderList ? getOrderItemsView() : <View />}
              </View>
            ) : (
              <View />
            )}
          </View>
          <View className="border-primary mt-[20] w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-2">
            <View className="flex-row">
              <Typography className="ml-2 w-[85%] self-center font-bold">
                {'Sponsorship Details'}
              </Typography>
            </View>
            <View className="ml-2">
              <ControlledTextField
                control={control2}
                name="sponsorCode"
                placeholder={'Sponsor Code*'}
                className="w-[95%] bg-white"
              />
              <Button
                className="my-2 w-[40%] self-center bg-[#ef6603]"
                title={'Save'}
                variant="default"
                onPress={handleSubmit2(saveSponsorCode)}
              />
            </View>
          </View>

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
        </ScrollView>
      ) : (
        <View />
      )}
    </View>
  )
}
