'use client'
import { useState, useEffect, useRef } from 'react'
import {
  View,
  Alert,
  ScrollView,
  TouchableOpacity,
  Linking
} from 'react-native'
import { Typography } from 'app/ui/typography'
import { useRouter } from 'expo-router'
import { Feather } from 'app/ui/icons'
import { formatUrl } from 'app/utils/format-url'
import moment from 'moment'
import PtsLoader from 'app/ui/PtsLoader'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import {
  useUserProfile,
  useAutoSubscription,
  useManualSubscription,
  useCancelSubscription,
  useDeleteAccount,
  useCheckValidCredential,
  useUpdateSponsorCode
} from 'app/data/profile'
import { Button } from 'app/ui/button'
import _ from 'lodash'
import ToggleSwitch from 'toggle-switch-react-native'
import { ControlledSecureField } from 'app/ui/form-fields/controlled-secure-field'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import {
  convertPhoneNumberToUsaPhoneNumberFormat,
  getAddressFromObject,
  getFullDateForCalendar
} from 'app/ui/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppSelector } from 'app/redux/hooks'
const schema = z.object({
  password: z.string().min(1, { message: 'Password is required' })
})
const sponsorSchema = z.object({
  sponsorCode: z.string().min(1, { message: 'Sponsor code is required' })
})

export type Schema = z.infer<typeof schema>
export type SponsorSchema = z.infer<typeof sponsorSchema>

export function ProfileScreen() {
  const isShowRenewButtonRef = useRef(false)
  const header = useAppSelector((state) => state.headerState.header)
  const userProfile = useAppSelector((state) => state.userProfileState.header)
  const [isShowOrderList, setIsShowOrderList] = useState(false)
  const [isShowSponsorship, setIsShowSponsorship] = useState(false)
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false)
  const [isAutoSubscription, setIsAutoSubscription] = useState(false)
  const [isSubscribedUser, setISubscribedUser] = useState(false)
  const [isShowAlerts, setIsShowAlerts] = useState(false)
  const [appuserDetails, setAppuserDetails] = useState({}) as any
  const [userSubscription, setUserSubscription] = useState({}) as any
  const [memberDetails, setMemberDetails] = useState({}) as any
  const [orderList, setOrderList] = useState([])

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

  const { data: profileData, isLoading: isProfileLoading } =
    useUserProfile(header)

  const autoSubscriptionMutation = useAutoSubscription(header)
  const manualSubscriptionMutation = useManualSubscription(header)
  const cancelSubscriptionMutation = useCancelSubscription(header)
  const deleteAccountMutation = useDeleteAccount(header)
  const checkValidCredentialMutation = useCheckValidCredential(header)
  const updateSponsorCodeMutation = useUpdateSponsorCode(header)

  const router = useRouter()

  useEffect(() => {
    if (!profileData) return
    const data = profileData as any
    let appUser = data.appuser ? data.appuser : {}
    setAppuserDetails(appUser)
    let member = data.member ? data.member : {}
    setMemberDetails(member)
    let orders = data.orderList ? data.orderList : []
    setOrderList(orders)
    let subscription = data.userSubscription ? data.userSubscription : {}
    setUserSubscription(subscription)
    let subscribedUser = data.userSubscription
      ? data.userSubscription.status.toLowerCase() !== 'active'
        ? false
        : true
      : false
    setISubscribedUser(subscribedUser)
    if (!isShowAlerts) {
      if (
        data.expiringSubscription &&
        subscription.status &&
        subscription.status.toLowerCase() === 'active'
      ) {
        isShowRenewButtonRef.current = true
        Alert.alert(
          '',
          `Your subscription will expire on ${moment(
            data.subscriptionEndDate
          ).format('DD-MMM-YYYY')}. Please renew to use ad-free services.`,
          [
            {
              text: 'Renew',
              onPress: () => {
                if (data.userSubscription) {
                  if (data.userSubscription.plan) {
                    if (
                      String(data.userSubscription.source).toLowerCase() ===
                      'Stripe'.toLowerCase()
                    ) {
                      let plan = data.userSubscription.plan
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
      if (data.expiredSubscription) {
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
  }, [profileData])

  const isLoading =
    isProfileLoading ||
    autoSubscriptionMutation.isPending ||
    manualSubscriptionMutation.isPending ||
    cancelSubscriptionMutation.isPending ||
    deleteAccountMutation.isPending ||
    checkValidCredentialMutation.isPending ||
    updateSponsorCodeMutation.isPending

  function switchManualToAutoSubscription() {
    const email = appuserDetails.email ? appuserDetails.email : ''
    if (isAutoSubscription) {
      manualSubscriptionMutation.mutate(
        { email },
        {
          onSuccess: () => {
            setIsAutoSubscription(false)
          },
          onError: (error) => {
            Alert.alert('', error.message || 'Failed to switch subscription')
          }
        }
      )
    } else {
      autoSubscriptionMutation.mutate(
        { email },
        {
          onSuccess: () => {
            setIsAutoSubscription(true)
          },
          onError: (error) => {
            Alert.alert('', error.message || 'Failed to switch subscription')
          }
        }
      )
    }
  }
  function upgradeButtonClicked() {
    router.push(
      formatUrl('/plans', {
        planDetails: JSON.stringify(userSubscription),
        isRenewPlan: 'false',
        isFromUpgradePlan: 'true'
      })
    )
  }
  function renewButtonClicked() {
    router.push(
      formatUrl('/plans', {
        planDetails: JSON.stringify(userSubscription),
        isRenewPlan: 'true',
        isFromUpgradePlan: 'false'
      })
    )
  }

  function cancelSubscriptionButtonClicked() {
    cancelSubscriptionMutation.mutate(
      { email: appuserDetails.email ? appuserDetails.email : '' },
      {
        onError: (error) => {
          Alert.alert('', error.message || 'Failed to cancel subscription')
        }
      }
    )
  }

  function saveSponsorCode(formData: SponsorSchema) {
    updateSponsorCodeMutation.mutate(
      {
        appuserVo: {
          sponsorCode: formData.sponsorCode,
          email: memberDetails.email ? memberDetails.email : ''
        }
      },
      {
        onSuccess: () => {
          reset1({
            sponsorCode: ''
          })
        },
        onError: (error) => {
          Alert.alert('', error.message || 'Failed to update sponsor code')
        }
      }
    )
  }
  function checkCredential(formData: Schema) {
    checkValidCredentialMutation.mutate(
      {
        appuserVo: {
          credential: formData.password
        }
      },
      {
        onSuccess: () => {
          deleteAccount(formData.password)
        },
        onError: (error) => {
          Alert.alert('', error.message || 'Invalid credential')
        }
      }
    )
  }
  function deleteAccount(password: any) {
    deleteAccountMutation.mutate(
      {
        appuserVo: {
          email: appuserDetails.email ? appuserDetails.email : '',
          credential: password
        }
      },
      {
        onSuccess: () => {
          router.push('/login')
        },
        onError: (error) => {
          Alert.alert('', error.message || 'Failed to delete account')
        }
      }
    )
  }
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

  return (
    <View className="flex-1">
      <PtsLoader loading={isLoading} />
      <View className="mt-[25px]">
        <PtsBackHeader title="Profile" memberData={{}} />
      </View>
      {profileData ? (
        <ScrollView persistentScrollbar={true} className="flex-1">
          <View className="border-primary mt-[20] w-[95%] flex-1 self-center rounded-[10px] border-[1px] p-2">
            <View className="flex-row">
              <Typography className="ml-2 w-[85%] self-center font-bold">
                {'User Profile'}
              </Typography>
              <TouchableOpacity
                onPress={() => {
                  router.push(
                    formatUrl('/circles/editUserProfile', {
                      component: 'Profile',
                      userDetails: JSON.stringify(appuserDetails),
                      memberDetails: JSON.stringify(memberDetails)
                    })
                  )
                }}
                className="bg-primary mx-1 h-[30] w-[30] items-center justify-center rounded-[15px]"
              >
                <Feather
                  className=""
                  name={'edit-2'}
                  size={15}
                  color={'white'}
                />
              </TouchableOpacity>
            </View>
            {getDetailsView(
              'Name',
              `${appuserDetails.firstName ? appuserDetails.firstName : ''} ${appuserDetails.lastName ? appuserDetails.lastName : ''}`
            )}
            {getDetailsView(
              'Email',
              appuserDetails.email ? appuserDetails.email : ''
            )}
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
              <TouchableOpacity
                onPress={() => {
                  router.push(
                    formatUrl('/circles/editUserAddress', {
                      component: 'Profile',
                      memberDetails: JSON.stringify(memberDetails)
                    })
                  )
                }}
                className="bg-primary mx-1 h-[30] w-[30] items-center justify-center rounded-[15px]"
              >
                <Feather
                  className=""
                  name={'edit-2'}
                  size={15}
                  color={'white'}
                />
              </TouchableOpacity>
            </View>
            {getDetailsView(
              'Address',
              getAddressFromObject(
                memberDetails.address ? memberDetails.address : {}
              )
            )}
            {getDetailsView(
              'Timezone',
              memberDetails.address && memberDetails.address.timezone
                ? `${memberDetails.address.timezone.name} (${memberDetails.address.timezone.abbreviation})`
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
                        className="my-2 w-[50%] self-center bg-[#ef6603]"
                        title={'Upgrade Plan'}
                        variant="default"
                        onPress={() => {
                          upgradeButtonClicked()
                        }}
                      />
                    ) : (
                      <View />
                    )}
                    {isShowRenewButtonRef.current ? (
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
                    className="my-2 w-[50%] self-center bg-[#c43416]"
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
                <View className="bg-primary flex-row rounded-tl-[5px] rounded-tr-[5px]">
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
              <Typography className="ml-2 w-[90%] self-center font-bold">
                {'Sponsorship Details'}
              </Typography>
              <Feather
                onPress={() => {
                  setIsShowSponsorship(!isShowSponsorship)
                }}
                className="self-center"
                name={!isShowSponsorship ? 'chevron-down' : 'chevron-up'}
                size={20}
                color={'black'}
              />
            </View>
            {isShowSponsorship ? (
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
                  leadingIcon="save"
                  variant="default"
                  onPress={handleSubmit2(saveSponsorCode)}
                />
              </View>
            ) : (
              <View />
            )}
          </View>

          {isShowDeleteModal ? (
            <View className="absolute top-[100] w-[95%] flex-1 self-center">
              {showDeleteModal()}
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
