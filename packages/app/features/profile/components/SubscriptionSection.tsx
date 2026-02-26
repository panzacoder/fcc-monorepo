'use client'
import { useState, useEffect, useRef } from 'react'
import { View, Alert } from 'react-native'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { Button } from 'app/ui/button'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'expo-router'
import { getFullDateForCalendar, isEmpty } from 'app/ui/utils'
import { format } from 'date-fns'
import ToggleSwitch from 'toggle-switch-react-native'
import type {
  ProfileAppUser,
  ProfileOrder,
  ProfileUserSubscription,
  UserProfileResponse
} from 'app/data/profile'
import type { ProfileDataReturn } from '../hooks/useProfileData'

const titleStyle = 'ml-2 font-normal w-[25%] text-[15px] text-[#1A1A1A]'
const valueStyle = 'font-normal ml-2 w-[70%] text-[15px] font-bold text-[#1A1A1A]'

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

interface SubscriptionSectionProps {
  profileData: UserProfileResponse
  appuserDetails: Partial<ProfileAppUser>
  userSubscription: Partial<ProfileUserSubscription>
  orderList: ProfileOrder[]
  isSubscribedUser: boolean
  userProfile: {
    premiumFeatureTrialinfo: {
      startDate: string
      endDate: string
      status: { status: string }
    } | null
  }
  autoSubscription: ProfileDataReturn['autoSubscription']
  manualSubscription: ProfileDataReturn['manualSubscription']
  cancelSubscription: ProfileDataReturn['cancelSubscription']
}

export function SubscriptionSection({
  profileData,
  appuserDetails,
  userSubscription,
  orderList,
  isSubscribedUser,
  userProfile,
  autoSubscription,
  manualSubscription,
  cancelSubscription
}: SubscriptionSectionProps) {
  const router = useRouter()
  const [isShowOrderList, setIsShowOrderList] = useState(false)
  const [isAutoSubscription, setIsAutoSubscription] = useState(false)
  const isShowRenewButtonRef = useRef(false)
  const hasShownAlerts = useRef(false)

  useEffect(() => {
    if (!profileData || hasShownAlerts.current) return
    hasShownAlerts.current = true

    if (
      profileData.expiringSubscription &&
      userSubscription.status &&
      userSubscription.status.toLowerCase() === 'active'
    ) {
      isShowRenewButtonRef.current = true
      Alert.alert(
        '',
        `Your subscription will expire on ${format(
          new Date(profileData.subscriptionEndDate),
          'dd-MMM-yyyy'
        )}. Please renew to use ad-free services.`,
        [
          {
            text: 'Renew',
            onPress: () => {
              if (profileData.userSubscription?.plan) {
                if (
                  String(profileData.userSubscription.source).toLowerCase() ===
                  'stripe'
                ) {
                  router.push(
                    formatUrl('/plans', {
                      planDetails: JSON.stringify(
                        profileData.userSubscription.plan
                      ),
                      isRenewPlan: 'true',
                      isFromUpgradePlan: 'false'
                    })
                  )
                }
              }
            }
          },
          { text: 'Cancel' }
        ]
      )
    }
    if (profileData.expiredSubscription) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData])

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

  function switchManualToAutoSubscription() {
    const email = appuserDetails.email ? appuserDetails.email : ''
    if (isAutoSubscription) {
      manualSubscription.mutate(
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
      autoSubscription.mutate(
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
    cancelSubscription.mutate(
      { email: appuserDetails.email ? appuserDetails.email : '' },
      {
        onError: (error) => {
          Alert.alert('', error.message || 'Failed to cancel subscription')
        }
      }
    )
  }

  function getOrderItemsView() {
    let orderView = orderList.map((data: ProfileOrder, index: number) => {
      let planName = data.orderItems
        ? data.orderItems[0]?.description.replace('Basic ', '') ?? ''
        : ''
      return (
        <View
          key={index}
          className={`flex-row py-1 ${index % 2 === 0 ? 'bg-white' : 'bg-[#b8d4e3]'}`}
        >
          <Typography className=" w-[5%] text-center">{index + 1}</Typography>
          <Typography className=" w-[20%] text-center">{planName}</Typography>
          <Typography className=" w-[30%] text-center">
            {getFullDateForCalendar(data.date, 'dd-MMM-yyyy')}
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

  return (
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
          {!isEmpty(userSubscription) ? (
            <View className="mt-1 rounded-[5px] border-[1px] border-gray-400 py-1">
              <Typography className="mx-2 py-1 font-bold text-black">
                {'Plan Details'}
              </Typography>
              {getDetailsView(
                'Start Date',
                getFullDateForCalendar(
                  userSubscription.startDate ?? '',
                  'dd-MMM-yyyy'
                )
              )}
              {getDetailsView(
                'End Date',
                getFullDateForCalendar(
                  userSubscription.endDate ?? '',
                  'dd-MMM-yyyy'
                )
              )}
              {getDetailsView('Status', userSubscription.status ?? '')}
            </View>
          ) : (
            <View />
          )}

          {userProfile.premiumFeatureTrialinfo !== null && !isSubscribedUser ? (
            <View className="mt-1 rounded-[5px] border-[1px] border-gray-400 py-1">
              <Typography className="mx-2  font-bold text-black">
                {'Trial Period Details'}
              </Typography>
              {getDetailsView(
                'Start Date',
                getFullDateForCalendar(
                  userProfile.premiumFeatureTrialinfo.startDate,
                  'dd-MMM-yyyy'
                )
              )}
              {getDetailsView(
                'End Date',
                getFullDateForCalendar(
                  userProfile.premiumFeatureTrialinfo.endDate,
                  'dd-MMM-yyyy'
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
              userSubscription.startDate ?? '',
              'dd-MMM-yyyy'
            )
          )}
          {getDetailsView(
            'End Date',
            getFullDateForCalendar(
              userSubscription.endDate ?? '',
              'dd-MMM-yyyy'
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
                onToggle={() => {
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
  )
}
