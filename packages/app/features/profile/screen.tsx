'use client'
import { useState, useEffect, useCallback } from 'react'
import { View, Alert, ScrollView, Pressable, Linking } from 'react-native'
import { Typography } from 'app/ui/typography'
import { useRouter } from 'solito/navigation'
import { Feather } from 'app/ui/icons'
import { CallPostService } from 'app/utils/fetchServerData'
import PtsLoader from 'app/ui/PtsLoader'
import {
  BASE_URL,
  GET_USER_PROFILE,
  AUTO_SUBSCRIPTION,
  MANUAL_SUBSCRIPTION,
  CANCEL_SUBSCRIPTION
} from 'app/utils/urlConstants'
import { Button } from 'app/ui/button'
import _ from 'lodash'
import ToggleSwitch from 'toggle-switch-react-native'
import store from 'app/redux/store'
import {
  convertPhoneNumberToUsaPhoneNumberFormat,
  getAddressFromObject,
  getFullDateForCalendar
} from 'app/ui/utils'
export function ProfileScreen() {
  const header = store.getState().headerState.header
  const userProfile = store.getState().userProfileState.header
  // console.log('userProfile', JSON.stringify(userProfile))
  const [isLoading, setLoading] = useState(false)
  const [isDataReceived, setIsDataReceived] = useState(false)
  const [isAutoSubscription, setIsAutoSubscription] = useState(false)
  const [isSubscribedUser, setISubscribedUser] = useState(false)
  const [appuserDetails, setAppuserDetails] = useState({}) as any
  const [userSubscription, setUserSubscription] = useState({}) as any
  const [memberDetails, setMemberDetails] = useState({}) as any
  const [orderList, setaOrderList] = useState([])
  const getUserProfile = useCallback(async () => {
    setLoading(true)
    let url = `${BASE_URL}${GET_USER_PROFILE}`
    let dataObject = {
      header: header
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          setAppuserDetails(data.data.appuser ? data.data.appuser : {})
          setMemberDetails(data.data.member ? data.data.member : {})
          setaOrderList(data.data.orderList ? data.data.orderList : [])
          setUserSubscription(
            data.data.userSubscription ? data.data.userSubscription : {}
          )
          let isSubscribedUser = data.data.userSubscription
            ? data.data.userSubscription.status !== 'Active'
              ? false
              : true
            : false
          setISubscribedUser(isSubscribedUser)
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
    console.log('upgradeButtonClicked')
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
          className={`flex-row py-1 ${index % 2 === 0 ? 'bg-white' : 'bg-[#9cc5db]'}`}
        >
          <Typography className=" w-[5%] text-center">{index + 1}</Typography>
          <Typography className=" w-[20%] text-center">{planName}</Typography>
          <Typography className=" w-[25%] text-center">
            {getFullDateForCalendar(data.date, 'DD-MMM-YYYY')}
          </Typography>
          <Typography className=" w-[20%] text-center">
            {data.price ? `${'$'}${data.price}` : ''}
          </Typography>
          <Typography className=" w-[25%] text-center">
            {data.status ? data.status : ''}
          </Typography>
        </View>
      )
    })
    return (
      <View className="">
        <View className="flex-row">
          <Typography className="w-[5%] text-center font-bold">
            {'#'}
          </Typography>
          <Typography className="w-[20%] text-center font-bold">
            {'Order'}
          </Typography>
          <Typography className="w-[25%] text-center font-bold">
            {'Date'}
          </Typography>
          <Typography className="w-[20%] text-center font-bold">
            {'Price'}
          </Typography>
          <Typography className="w-[25%] text-center font-bold">
            {'Status'}
          </Typography>
        </View>
        {orderView}
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
        <Typography className=" flex-1 text-center text-lg font-bold ">
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
                  onPress={() => {}}
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
              className="my-2 w-[50%] self-center"
              title={'Delete Account'}
              variant="default"
              onPress={() => {}}
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
                  onPress={() => {}}
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
                <Typography className="mx-2 bg-[#20bada] py-1 text-center font-bold text-white">
                  {'FREE WITH ADS'}
                </Typography>
                <Typography className="mx-2 bg-[#53cfe9] py-5 text-center font-bold text-white">
                  {'$0.00'}
                </Typography>

                {!_.isEmpty(userSubscription) ? (
                  <View className="mt-1">
                    <Typography className="mx-2 py-1 text-center font-bold text-black">
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
                  <View className="mt-1">
                    <Typography className="mx-2 py-1 text-center font-bold text-black">
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
                  onPress={() => {}}
                />
              </View>
            ) : (
              <View>
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
                  'Plan Name',
                  userSubscription.plan ? userSubscription.plan.description : ''
                )}
                {getDetailsView(
                  'Price',
                  `$${userSubscription.plan ? userSubscription.plan.price : ''}`
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
                  <Button
                    className="my-2 ml-5 w-[50%] self-center bg-[#ef6603]"
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
                <Typography className="bg-primary py-2 text-center text-white font-bold">
                  {'Order History'}
                </Typography>
                {getOrderItemsView()}
              </View>
            ) : (
              <View />
            )}
          </View>
        </ScrollView>
      ) : (
        <View />
      )}
    </View>
  )
}
