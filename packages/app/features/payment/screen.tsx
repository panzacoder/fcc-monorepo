'use client'

import { useEffect, useState } from 'react'
import {
  View,
  Alert,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView
} from 'react-native'
import _ from 'lodash'
import PtsLoader from 'app/ui/PtsLoader'
import { Button } from 'app/ui/button'
import { Typography } from 'app/ui/typography'
import { getAddressFromObject } from 'app/ui/utils'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import {
  usePaymentConfig,
  useCheckOutSession,
  usePaymentSuccess,
  usePaymentFail,
  useAppleSuccessPayment,
  useIosReceiptVerification
} from 'app/data/payment'
import { useLocalSearchParams } from 'expo-router'
import { useRouter } from 'expo-router'
import RNIap, {
  InAppPurchase,
  PurchaseError,
  SubscriptionPurchase,
  finishTransaction,
  purchaseErrorListener,
  purchaseUpdatedListener
} from 'react-native-iap'
import userProfileAction from 'app/redux/userProfile/userProfileAction'
import subscriptionAction from 'app/redux/userSubscription/subcriptionAction'
import userSubscriptionAction from 'app/redux/userSubscriptionDetails/userSubscriptionAction'
import sponsororAction from 'app/redux/sponsor/sponsorAction'
import paidAdAction from 'app/redux/paidAdvertiser/paidAdAction'
import { logger } from 'app/utils/logger'
import { useAppSelector, useAppDispatch } from 'app/redux/hooks'
let StripeProvider: any
let useStripe: any

if (Platform.OS === 'android') {
  StripeProvider = require('@stripe/stripe-react-native').StripeProvider
  useStripe = require('@stripe/stripe-react-native').useStripe
} else {
  useStripe = () => {
    return {
      initPaymentSheet: () => {},
      presentPaymentSheet: () => {},
      confirmPaymentSheetPayment: () => {}
    }
  }
}
const itemSubs = Platform.select({
  ios: [
    'com.familycarecircle.monthly',
    'com.familycarecircle.quarterly',
    'com.familycarecircle.halfyearly',
    'com.familycarecircle.yearly'
  ]
}) as any

export function PaymentsScreen() {
  const dispatch = useAppDispatch()
  const { initPaymentSheet, presentPaymentSheet, confirmPaymentSheetPayment } =
    useStripe()
  const [isUserDataLoaded, setUserDataLoaded] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState({})

  const [email, setEmail] = useState('')
  const header = useAppSelector((state) => state.headerState.header)
  const userDetails = useAppSelector((state) => state.userProfileState.header)
  const item = useLocalSearchParams<any>()
  const router = useRouter()
  let planDetails = item.planDetails ? JSON.parse(item.planDetails) : {}

  const paymentConfigQuery = usePaymentConfig(header)
  const checkOutSessionMutation = useCheckOutSession(header)
  const paymentSuccessMutation = usePaymentSuccess(header)
  const paymentFailMutation = usePaymentFail(header)
  const appleSuccessPaymentMutation = useAppleSuccessPayment(header)
  const iosReceiptVerificationMutation = useIosReceiptVerification(header)

  const publishableKey =
    paymentConfigQuery.data?.publicKey ??
    'pk_test_51JAmgDG03dd4BHZM3C08oeGQu5A8rXJgh76L7Jwi4x2QaH2MhHtu6EMj3W8AMDQfaQ16WPiBZ4zpDHcL3zSZ0IfT00j27YaRq0'

  const isLoading =
    checkOutSessionMutation.isPending ||
    paymentSuccessMutation.isPending ||
    paymentFailMutation.isPending ||
    appleSuccessPaymentMutation.isPending ||
    iosReceiptVerificationMutation.isPending

  const verifyInAppPurchaseReceipt = (receipt: any) => {
    iosReceiptVerificationMutation.mutate(
      {
        'receipt-data': receipt,
        password: '05460a36752c42a09e55e0ea57ee914f',
        'exclude-old-transactions': true
      },
      {
        onSuccess: (response: any) => {
          if (response) {
            let latestRecipt = response.latest_receipt_info
            if (latestRecipt) {
              logger.debug('latestRecipt', latestRecipt)
              if (latestRecipt[0]) {
                completeIOSTransactionOnOurServer(latestRecipt[0])
              }
            }
          }
        },
        onError: (error) => {
          logger.debug(error)
        }
      }
    )
  }
  const completeIOSTransactionOnOurServer = (data: any) => {
    appleSuccessPaymentMutation.mutate(
      {
        notificationType: 'PTS_PURCHASED',
        notificationUUID: '',
        subtype: '',
        email: userDetails.email,
        version: '',
        renewableInfo: {
          expirationIntent: '1',
          originalTransactionId: data.original_transaction_id,
          autoRenewProductId: data.product_id,
          productId: data.product_id,
          autoRenewStatus: '0',
          signedDate: '',
          isInBillingRetryPeriod: 'false'
        },
        transactionInfo: {
          transactionId: data.transaction_id,
          originalTransactionId: data.original_transaction_id,
          webOrderLineItemId: data.web_order_line_item_id,
          bundleId: 'com.familycarecircle.fccmobileapp',
          productId: data.product_id,
          subscriptionGroupIdentifier: data.subscription_group_identifier,
          purchaseDate: data.purchase_date_ms,
          originalPurchaseDate: data.original_purchase_date_ms,
          expiresDate: data.expires_date_ms,
          quantity: '1',
          type: 'Auto-Renewable Subscription',
          inAppOwnershipType: 'PURCHASED',
          signedDate: ''
        }
      },
      {
        onSuccess: (response: any) => {
          logger.debug('our server response', response)
          router.back()
        },
        onError: (error) => {
          logger.debug(error)
        }
      }
    )
  }
  async function initializePaymentSheet() {
    logger.debug('in createSessionCheckout')
    try {
      const data: any = await checkOutSessionMutation.mutateAsync({
        user: { email: userDetails.email },
        order: {
          id: null,
          description: null,
          email: userDetails.email,
          price: planDetails.price ? '' + planDetails.price : '',
          currency: null,
          status: null,
          date: null,
          orderid: null,
          orderItems: [
            {
              id: null,
              description: planDetails.description
                ? planDetails.description
                : '',
              plan: { id: planDetails.id ? planDetails.id : '' }
            }
          ]
        }
      })

      if (!data) {
        return
      }

      let ephemeralKey = data.ephemeralKey
      let paymentIntent = data.paymentIntentClientSecret
      let customerId = data.customerId
      let sessionId = data.sessionId
      let paymentIntentId = data.paymentIntentId
      let subscriptionId = data.subscriptionId

      logger.debug(
        paymentIntent,
        ephemeralKey,
        customerId,
        sessionId,
        paymentIntentId
      )
      const { error } = await initPaymentSheet({
        customerId: customerId,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        merchantDisplayName: 'FCC'
      })
      if (!error) {
      } else {
        logger.debug(error)
        Alert.alert('', error)
        return
      }

      setTimeout(
        () => openPaymentSheet(paymentIntent, sessionId, subscriptionId),
        1000
      )
    } catch (error) {
      logger.debug(error)
    }
  }

  async function handlePaymentSuccess(sessionId: any, subscriptionId: any) {
    paymentSuccessMutation.mutate(
      {
        sessionId: sessionId,
        subscriptionId: subscriptionId
      },
      {
        onSuccess: async (data: any) => {
          logger.debug('payment response', data)
          if (data) {
            let userSubscription =
              data.userDetails && data.userDetails.userSubscription
                ? data.userDetails.userSubscription
                : {}
            let subscriptionDetailsobject = {
              subscriptionEndDate: userSubscription.subscriptionEndDate
                ? userSubscription.subscriptionEndDate
                : '',
              days: userSubscription.days ? userSubscription.days : '',
              expiredSubscription: userSubscription.expiredSubscription,
              expiringSubscription: userSubscription.expiringSubscription
            }
            let appuserVo =
              data.userDetails && data.userDetails.appuserVo
                ? data.userDetails.appuserVo
                : {}
            if (!_.isEmpty(appuserVo)) {
              dispatch(userProfileAction.setUserProfile(appuserVo))
            }
            if (!_.isEmpty(userSubscription)) {
              dispatch(subscriptionAction.setSubscription(userSubscription))
            }
            if (!_.isEmpty(userSubscription)) {
              dispatch(
                userSubscriptionAction.setSubscriptionDetails(
                  subscriptionDetailsobject
                )
              )
            }
            await dispatch(
              sponsororAction.setSponsor({
                sponsorDetails: {},
                sponsorShipDetails: {}
              })
            )
            await dispatch(
              paidAdAction.setPaidAd({
                commercialsDetails: {},
                commercialPageMappings: {}
              })
            )
            router.push('/profile')
          }
        },
        onError: (error) => {
          logger.debug(error)
        }
      }
    )
  }

  async function failPayment(reason: any, sessionId: any, subscriptionId: any) {
    paymentFailMutation.mutate(
      {
        sessionId: sessionId,
        reason: reason,
        subscriptionId: subscriptionId
      },
      {
        onSuccess: (response: any) => {
          logger.debug(JSON.stringify(response))
        },
        onError: (error) => {
          logger.debug(error)
        }
      }
    )
  }

  const openPaymentSheet = async (
    paymentIntent: any,
    sessionId: any,
    subscriptionId: any
  ) => {
    let { error } = await presentPaymentSheet({ clientSecret: paymentIntent })

    logger.debug(JSON.stringify(error), '../')

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message)
      failPayment(error.message, sessionId, subscriptionId)
    } else {
      Alert.alert('Success', 'Your order is confirmed!')
      logger.debug()
      handlePaymentSuccess(sessionId, subscriptionId)
    }
  }

  useEffect(() => {
    if (!isUserDataLoaded) {
      if (Platform.OS === 'ios') {
        try {
          RNIap.initConnection()
          RNIap.clearTransactionIOS()
        } catch (err) {
          logger.warn(err.code, err.message)
        }

        let purchaseUpdateSubscription = purchaseUpdatedListener(
          async (purchase: InAppPurchase | SubscriptionPurchase) => {
            const receipt = purchase.transactionReceipt
              ? purchase.transactionReceipt
              : purchase.originalJson
            if (receipt) {
              try {
                verifyInAppPurchaseReceipt(receipt)
              } catch (ackErr) {
                logger.warn('ackErr', ackErr)
              }
            }
          }
        )

        let purchaseErrorSubscription = purchaseErrorListener(
          (error: PurchaseError) => {
            logger.debug('purchaseErrorListener', error)
            Alert.alert('Purchase error', error.code)
          }
        )
      }

      setUserDataLoaded(true)
    }
  }, [])
  let planItems = _.orderBy(
    planDetails.planItems,
    (e) => e.displaySequence,
    'asc'
  )
  async function requestSubscription() {
    try {
      let identifier: any = ''
      let price = planDetails.price ? '' + planDetails.price : ''
      if (price === '1.99') {
        identifier = 'com.familycarecircle.monthly'
      } else if (price === '1.59') {
        identifier = 'com.familycarecircle.quarterly'
      } else if (price === '1.39') {
        identifier = 'com.familycarecircle.halfyearly'
      } else {
        identifier = 'com.familycarecircle.yearly'
      }
      RNIap.requestSubscription(identifier)
    } catch (err) {
      logger.debug('err', err.message)
      Alert.alert(err.message)
    }
  }
  return (
    <SafeAreaView className="flex-1">
      <PtsLoader loading={isLoading} />
      <View className="mt-[25px]">
        <PtsBackHeader title={'Payment'} memberData={{}} />
      </View>
      <ScrollView>
        <View className="my-2 max-h-[95%] w-[95%] self-center rounded-[10px] border-[1px] border-[#e0deda] bg-white ">
          <Typography className="m-2 ml-5 text-[16px] font-bold">
            {'Billing Details'}
          </Typography>
          <View className="h-[1px] w-full bg-gray-400" />
          {userDetails.memberName ? (
            <Typography className="mx-5 my-1 text-[16px]">
              {userDetails.memberName}
            </Typography>
          ) : (
            <View />
          )}
          {userDetails.email ? (
            <Typography className="mx-5 my-1 text-[16px]">
              {userDetails.email}
            </Typography>
          ) : (
            <View />
          )}
          {userDetails.phone ? (
            <Typography className="mx-5 my-1 text-[16px]">
              {userDetails.phone}
            </Typography>
          ) : (
            <View />
          )}
          {userDetails.address ? (
            <Typography className="mx-5 my-1 text-[16px]">
              {getAddressFromObject(userDetails.address)}
            </Typography>
          ) : (
            <View />
          )}
        </View>

        <View className="my-2 max-h-[95%] w-[95%] self-center rounded-[10px] border-[1px] border-[#e0deda] bg-white ">
          <Typography className="m-2 ml-5 text-[16px] font-bold">
            {'Plan Details'}
          </Typography>
          <View className="h-[1px] w-full bg-gray-400" />
          <View className="w-full flex-row">
            <View className="w-[80%] flex-row">
              <Typography className="my-1 ml-5 font-bold ">
                {`FCC Subscription -`}
              </Typography>
              <Typography className="text-primary my-1 ml-2 font-bold">
                {`${planDetails.plantype ? planDetails.plantype : ''}`}
              </Typography>
            </View>
            <Typography className="text-primary my-1 ml-2  font-bold">
              {`$ ${planDetails.price ? planDetails.price : ''}`}
            </Typography>
          </View>
          <View className="h-[0.5px] w-full bg-gray-400" />
          {planDetails.discountPercent === '0.0' ? (
            <View />
          ) : (
            <View className="w-[80%] flex-row">
              <View className="ml-5 h-[6px] w-[6px] self-center rounded-full bg-black" />
              <Typography className="my-1 ml-2 ">{`Discount: `}</Typography>
              <Typography className="my-1 ml-2 text-black ">
                {`${planDetails.discountPercent ? planDetails.discountPercent : ''}%`}
              </Typography>
            </View>
          )}

          {planItems.map((plan, index) => {
            return (
              <View key={index}>
                <View key={index} className="flex-row">
                  <View className="ml-5 h-[6px] w-[6px] self-center rounded-full bg-black" />
                  <Typography className="my-1 ml-2 text-black ">
                    {plan.name ? plan.name : ''}
                  </Typography>
                </View>
              </View>
            )
          })}
        </View>

        <View className="my-2 max-h-[95%] w-[95%] self-center rounded-[10px] border-[1px] border-[#e0deda] bg-white ">
          <View className="flex-row">
            <Typography className="m-2 ml-5 text-[16px] font-bold">
              {'Order Total'}
            </Typography>
            <Typography className="m-2 ml-10 text-[16px]">
              {`$ ${planDetails.price ? planDetails.price : ''}`}
            </Typography>
          </View>
          <Button
            className={`my-[10px] w-[40%] self-center bg-[#ef6603]`}
            title="Pay Now"
            variant="default"
            onPress={() => {
              if (Platform.OS === 'android') {
                initializePaymentSheet()
              } else {
                requestSubscription()
              }
            }}
          />
          {Platform.OS === 'ios' ? (
            <View
              style={{
                flexDirection: 'row',
                padding: 10,
                justifyContent: 'center'
              }}
            >
              <Button
                title={'Terms of service'}
                onPress={() =>
                  Linking.openURL(
                    'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/'
                  )
                }
                className="bg-primary"
              />
              <Button
                title={'Terms and Conditions'}
                onPress={() => {
                  router.push('/termsAndConditions')
                }}
                className="ml-5 bg-[#55c2b0]"
              />
            </View>
          ) : (
            <View />
          )}
        </View>
      </ScrollView>
      <StripeProvider
        publishableKey={publishableKey}
        setUrlSchemeOnAndroid={false}
      >
        <View />
      </StripeProvider>
    </SafeAreaView>
  )
}
