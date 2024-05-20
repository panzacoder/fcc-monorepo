'use client'

import { useEffect, useRef, useState } from 'react'
import {
  View,
  Alert,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView
} from 'react-native'
import { Feather } from 'app/ui/icons'
import _ from 'lodash'
import PtsLoader from 'app/ui/PtsLoader'
import { Button } from 'app/ui/button'
import { Typography } from 'app/ui/typography'
import store from 'app/redux/store'
import { getAddressFromObject } from 'app/ui/utils'
import { CallPostService } from 'app/utils/fetchServerData'
import {
  APPLE_SUCCESS_PAYMENT_FOR_OUR_SERVER,
  BASE_URL,
  IOS_RECEIPT_VERIFICATION_URL,
  PAYMENT_CHECK_OUT_SESSION,
  PAYMENT_FAIL,
  PAYMENT_GET_PAYMENT_CONFIG,
  PAYMENT_SUCCESS
} from 'app/utils/urlConstants'
import { useParams } from 'solito/navigation'
import { useRouter } from 'solito/navigation'
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
  const { initPaymentSheet, presentPaymentSheet, confirmPaymentSheetPayment } =
    useStripe()
  const [isLoading, setLoading] = useState(false)
  const [isUserDataLoaded, setUserDataLoaded] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState({})
  const [publishableKey, setPublishableKey] = useState(
    'pk_test_51JAmgDG03dd4BHZM3C08oeGQu5A8rXJgh76L7Jwi4x2QaH2MhHtu6EMj3W8AMDQfaQ16WPiBZ4zpDHcL3zSZ0IfT00j27YaRq0'
  )

  const [email, setEmail] = useState('')
  const header = store.getState().headerState.header
  const userDetails = store.getState().userProfileState.header
  const item = useParams<any>()
  const router = useRouter()
  let planDetails = item.planDetails ? JSON.parse(item.planDetails) : {}
  // console.log('planDetails', JSON.stringify(planDetails))
  // console.log('userDetails', JSON.stringify(userDetails))
  const verifyInAppPurchaseReceipt = (receipt: any) => {
    let url = `${IOS_RECEIPT_VERIFICATION_URL}`
    // password is app secret key from appstore connect
    let object = {
      'receipt-data': receipt,
      password: '05460a36752c42a09e55e0ea57ee914f',
      'exclude-old-transactions': true
    }
    // console.log('../../', email,emailAddress,refEmail.current)
    CallPostService(url, object)
      .then((response: any) => {
        if (response) {
          let latestRecipt = response.latest_receipt_info
          // console.log(response, '../', userDetails.email, '../../', userDetails, refEmail);
          if (latestRecipt) {
            console.log('latestRecipt', latestRecipt)
            if (latestRecipt[0]) {
              completeIOSTransactionOnOurServer(latestRecipt[0])
            }
          }
        }
      })
      .catch((error) => {
        console.log(error)
        setLoading(false)
      })
  }
  const completeIOSTransactionOnOurServer = (data: any) => {
    // console.log('../../../../', email,emailAddress,refEmail.current)
    let object = {}

    object = {
      header: header,
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
    }

    let url = `${BASE_URL}${APPLE_SUCCESS_PAYMENT_FOR_OUR_SERVER}`

    CallPostService(url, object)
      .then((response) => {
        console.log('our server response', response)
        if (response.status === 'SUCCESS') {
          router.back()
        }
      })
      .catch((error) => {
        console.log(error)
        setLoading(false)
      })
  }
  async function getPaymentConfig() {
    let url = `${BASE_URL}${PAYMENT_GET_PAYMENT_CONFIG}`
    let object = { header: header }

    CallPostService(url, object)
      .then(async (response) => {
        console.log(response)
        if (response.status === 'SUCCESS') {
          let data: any = response.data
          await setPublishableKey(data.publicKey)
          console.log('publishableKey', publishableKey)
        } else {
          Alert.alert('', response.message)
        }
      })
      .catch((error) => {
        console.log(error)
        setLoading(false)
      })
  }
  async function initializePaymentSheet() {
    const {
      paymentIntent,
      ephemeralKey,
      customerId,
      sessionId,
      paymentIntentId,
      subscriptionId
    }: any = await createSessionCheckout()

    console.log(
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
      // setLoading(true);
    } else {
      console.log(error)
      Alert.alert('', error)
      return
    }

    setTimeout(
      () => openPaymentSheet(paymentIntent, sessionId, subscriptionId),
      1000
    )
  }

  async function paymentSuccess(sessionId: any, subscriptionId: any) {
    let url = `${BASE_URL}${PAYMENT_SUCCESS}`
    let object = {
      header: header,
      sessionId: sessionId,
      subscriptionId: subscriptionId
    }

    await CallPostService(url, object)
      .then(async (response: any) => {
        // setLoading(false)
        console.log('payment response', response)
        if (response.status === 'SUCCESS') {
          let userSubscription =
            response.data.userDetails &&
            response.data.userDetails.userSubscription
              ? response.data.userDetails.userSubscription
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
            response.data.userDetails && response.data.userDetails.appuserVo
              ? response.data.userDetails.appuserVo
              : {}
          if (!_.isEmpty(appuserVo)) {
            store.dispatch(userProfileAction.setUserProfile(appuserVo))
          }
          if (!_.isEmpty(userSubscription)) {
            store.dispatch(subscriptionAction.setSubscription(userSubscription))
          }
          if (!_.isEmpty(userSubscription)) {
            store.dispatch(
              userSubscriptionAction.setSubscriptionDetails(
                subscriptionDetailsobject
              )
            )
          }
          await store.dispatch(
            sponsororAction.setSponsor({
              sponsorDetails: {},
              sponsorShipDetails: {}
            })
          )
          await store.dispatch(
            paidAdAction.setPaidAd({
              commercialsDetails: {},
              commercialPageMappings: {}
            })
          )

          router.back()
        } else {
          Alert.alert('', response.message)
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }

  async function failPayment(reason: any, sessionId: any, subscriptionId: any) {
    let url = `${BASE_URL}${PAYMENT_FAIL}`
    let object = {
      sessionId: sessionId,
      reason: reason,
      header: header,
      subscriptionId: subscriptionId
    }

    CallPostService(url, object)
      .then((response) => {
        // setLoading(false)
        console.log(JSON.stringify(response))
      })
      .catch((error) => {
        setLoading(false)
        console.log(error)
      })
  }

  const openPaymentSheet = async (
    paymentIntent: any,
    sessionId: any,
    subscriptionId: any
  ) => {
    let { error } = await presentPaymentSheet({ clientSecret: paymentIntent })

    console.log(JSON.stringify(error), '../')

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message)
      failPayment(error.message, sessionId, subscriptionId)
    } else {
      Alert.alert('Success', 'Your order is confirmed!')
      console.log()
      paymentSuccess(sessionId, subscriptionId)
    }
  }

  async function createSessionCheckout() {
    console.log('in createSessionCheckout')
    setLoading(true)
    let url = `${BASE_URL}${PAYMENT_CHECK_OUT_SESSION}`
    let object = {
      header: header,
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
            description: planDetails.description ? planDetails.description : '',
            plan: { id: planDetails.id ? planDetails.id : '' }
          }
        ]
      }
    }

    let paymentParams = {}

    await CallPostService(url, object)
      .then((response) => {
        if (response.status === 'SUCCESS') {
          console.log(response.data)
          let data: any = response.data
          let ephemeralKey = data.ephemeralKey
          let paymentIntent = data.paymentIntentClientSecret
          let customerId = data.customerId
          let sessionId = data.sessionId
          let paymentIntentId = data.paymentIntentId
          let subscriptionId = data.subscriptionId
          // await setPaymentIntent(paymentIntent)
          // await setEphemeralKey(ephemeralKey)
          // await setAllPaymentIntentData(data)
          paymentParams = {
            paymentIntent,
            ephemeralKey,
            customerId,
            sessionId,
            paymentIntentId,
            subscriptionId
          }
        } else {
          // setLoading(false)
          Alert.alert('', response.message)
        }
        setLoading(false)
      })
      .catch((error) => {
        console.log(error)
        setLoading(false)
      })

    return paymentParams
  }

  useEffect(() => {
    if (!isUserDataLoaded) {
      if (Platform.OS === 'ios') {
        try {
          RNIap.initConnection()
          RNIap.clearTransactionIOS()
        } catch (err) {
          console.warn(err.code, err.message)
        }

        let purchaseUpdateSubscription = purchaseUpdatedListener(
          async (purchase: InAppPurchase | SubscriptionPurchase) => {
            // console.info('purchase', purchase);
            const receipt = purchase.transactionReceipt
              ? purchase.transactionReceipt
              : purchase.originalJson
            if (receipt) {
              try {
                verifyInAppPurchaseReceipt(receipt)
              } catch (ackErr) {
                console.warn('ackErr', ackErr)
              }
            }
          }
        )

        let purchaseErrorSubscription = purchaseErrorListener(
          (error: PurchaseError) => {
            console.log('purchaseErrorListener', error)
            Alert.alert('Purchase error', error.code)
          }
        )
      }
      getPaymentConfig()

      setUserDataLoaded(true)

      // getPlanDetails();
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
      // console.log('identifier', identifier)
      RNIap.requestSubscription(identifier)
    } catch (err) {
      console.log('err', err.message)
      Alert.alert(err.message)
    }
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
        <Typography className=" ml-[5px] flex-1 text-[16px] font-bold">
          {'Payment'}
        </Typography>
      </View>
      <ScrollView>
        <View className="my-2 max-h-[95%] w-[95%] self-center rounded-[10px] border-[1px] border-[#e0deda] bg-white ">
          <Typography className="m-2 ml-5 text-[16px] font-bold">
            {'Billing Details'}
          </Typography>
          <View className="h-[1px] w-full bg-gray-400" />
          <Typography className="mx-5 my-1 text-[16px]">
            {userDetails.memberName ? userDetails.memberName : ''}
          </Typography>
          <Typography className="mx-5 my-1 text-[16px]">
            {userDetails.email ? userDetails.email : ''}
          </Typography>
          <Typography className="mx-5 my-1 text-[16px]">
            {userDetails.phone ? userDetails.phone : ''}
          </Typography>
          <Typography className="mx-5 my-1 text-[16px]">
            {userDetails.address
              ? getAddressFromObject(userDetails.address)
              : ''}
          </Typography>
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
          <View className="h-[1px] w-full bg-gray-400" />
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
              {'Order Total:'}
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
              requestSubscription()
            }}
          />
        </View>
      </ScrollView>
    </View>
  )
}
