'use client'

import { useState, useEffect } from 'react'
import { View, Alert, ScrollView, TouchableOpacity } from 'react-native'
import _ from 'lodash'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { getMonthsListOnly } from 'app/ui/utils'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import store from 'app/redux/store'
import { CallPostService } from 'app/utils/fetchServerData'
import {
  BASE_URL,
  GET_ALL_PLANS,
  GET_CARD_LIST,
  UPGRADE_PLAN,
  RENEW_SUBSCRIPTION,
  ADD_CARD,
  DELETE_CARD
} from 'app/utils/urlConstants'
import { useLocalSearchParams } from 'expo-router'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'expo-router'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'
import { ControlledTextField } from 'app/ui/form-fields/controlled-field'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from 'app/ui/button'
const schema = z.object({
  planIndex: z.number()
})
const cardSchema = z.object({
  cardNumber: z.string().min(1, { message: 'Card number is required' }),
  monthIndex: z.number().min(0, { message: 'Month is required' }),
  expiryYear: z.string().min(1, { message: 'Expiry year is required' }),
  cvv: z.string().min(1, { message: 'CVV is required' }),
  cardHolderName: z.string().min(1, { message: 'Name is required' })
})
export type CardSchema = z.infer<typeof cardSchema>
const monthsList = getMonthsListOnly() as any
let cardNumberWithoutDash = ''
export function PlansScreen() {
  const [isLoading, setLoading] = useState(false)
  const [selectedPlanId, setSelectedPlanId] = useState(-1)
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(1)
  const [isDataReceived, setIsDataReceived] = useState(false)
  const [isShowCardModal, setIsShowCardModal] = useState(false)
  const [isAddCard, setIsAddCardModal] = useState(false)
  const [plansList, setPlansList] = useState([]) as any
  const [planNames, setPlanNames] = useState([]) as any
  const [cardDetails, setCardDetails] = useState([]) as any
  const header = store.getState().headerState.header
  const item = useLocalSearchParams<any>()
  const router = useRouter()
  const userDetails = store.getState().userProfileState.header
  let isRenewPlan =
    item.isRenewPlan && item.isRenewPlan === 'true' ? true : false
  let isFromUpgradePlan =
    item.isFromUpgradePlan && item.isFromUpgradePlan === 'true' ? true : false
  let previousPlanDetails = item.planDetails ? JSON.parse(item.planDetails) : {}
  // console.log('userDetails', JSON.stringify(userDetails))
  // console.log('isRenewPlan', '' + isRenewPlan)
  // console.log('isFromUpgradePlan', '' + isFromUpgradePlan)
  const { control, handleSubmit } = useForm({
    defaultValues: {
      planIndex: 1
    },
    resolver: zodResolver(schema)
  })
  const {
    handleSubmit: handleSubmit1,
    control: control1,
    reset: reset1
  } = useForm({
    defaultValues: {
      cardNumber: '',
      monthIndex: -1,
      expiryYear: '',
      cvv: '',
      cardHolderName: ''
    },
    resolver: zodResolver(cardSchema)
  })
  async function getCardsInfoFromServer() {
    setLoading(true)
    let url = `${BASE_URL}${GET_CARD_LIST}`
    let dataObject = {
      header: header,
      email: userDetails.email ? userDetails.email : ''
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          // console.log('setCardDetails', JSON.stringify(data.data))
          setCardDetails(data.data ? data.data : [])
          setIsShowCardModal(true)
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
  useEffect(() => {
    async function getPlandetails() {
      setLoading(true)
      let url = `${BASE_URL}${GET_ALL_PLANS}`
      let dataObject = {
        header: header
      }
      CallPostService(url, dataObject)
        .then(async (data: any) => {
          if (data.status === 'SUCCESS') {
            let planDetails = data.data
            let plan: any = {}
            planDetails.map((plans: any) => {
              if (plans.planName === 'FCC Subscription') {
                plan = plans
              }
            })

            let plansData: any = plan.planList
            if (isFromUpgradePlan || isRenewPlan) {
              plansData = []
              let previousPlanIndex = 0
              plan.planList.map((data: any, index: any) => {
                if (data.plantype === previousPlanDetails.plan.plantype) {
                  previousPlanIndex = index
                  // console.log('previousPlanIndex', '' + previousPlanIndex)
                }
              })
              plan.planList.map((data: any, index: any) => {
                if (isFromUpgradePlan) {
                  if (index > previousPlanIndex) {
                    plansData.push(data)
                  }
                } else {
                  if (index === previousPlanIndex) {
                    plansData.push(data)
                  }
                }
              })
              // console.log('plansData', JSON.stringify(plansData))
            }
            type Response = {
              id: number
              plantype: string
            }
            let planNamesList: Array<{ id: number; title: string }> =
              plansData.map(({ plantype, id }: Response, index: any) => {
                return {
                  title: plantype,
                  id: index + 1
                }
              })
            let planNames: any = []
            plansData.map((planData: any) => {
              planNames.push(planData.plantype)
            })
            let first_plan = _.find(
              plansData,
              (e) => e.plantype === planNames[0]
            )
            let selectedPlanId = first_plan.id
            setPlansList(plansData)
            setPlanNames(planNamesList)
            setSelectedPlanId(selectedPlanId)
            // console.log('getPlanDetails', JSON.stringify(plansData))
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
    getPlandetails()
  }, [])
  async function upgradePlan() {
    getCardsInfoFromServer()
  }
  async function deleteCard(data: any) {
    setLoading(true)
    let url = `${BASE_URL}${DELETE_CARD}`
    let dataObject = {
      header: header,
      email: userDetails.email ? userDetails.email : '',
      card: data
    }
    // console.log('dataObject', JSON.stringify(dataObject))
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          // console.log('setCardDetails', JSON.stringify(data.data))
          setCardDetails(data.data ? data.data : [])
          // setIsAddCardModal(false)
          // setIsShowCardModal(true)
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
  async function upgradePlanOnServer(data: any) {
    setLoading(true)
    let url = ''
    url = isFromUpgradePlan
      ? `${BASE_URL}${UPGRADE_PLAN}`
      : `${BASE_URL}${RENEW_SUBSCRIPTION}`
    let dataObject = {
      header: header,
      email: userDetails.email ? userDetails.email : '',
      subscriptionId: '',
      paymentMethodId: data.paymentMethodId ? data.paymentMethodId : '',
      plan: {
        id: selectedPlanId,
        plantype: plansList[selectedPlanIndex - 1].plantype
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          // console.log('setCardDetails', JSON.stringify(data.data))
          router.back()
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
  async function navigateToPayments(data: any) {
    // console.log('data', JSON.stringify(data))
    router.push(
      formatUrl('/payments', {
        planDetails: JSON.stringify(data)
      })
    )
  }

  async function addCard(formData: CardSchema) {
    // console.log('formData', JSON.stringify(formData.cardHolderName))
    setLoading(true)
    let url = `${BASE_URL}${ADD_CARD}`
    let dataObject = {
      header: header,
      email: userDetails.email ? userDetails.email : '',
      card: {
        number: cardNumberWithoutDash,
        exp_month:
          formData.monthIndex < 10
            ? '0' + formData.monthIndex
            : '' + formData.monthIndex,
        exp_year: formData.expiryYear,
        country:
          userDetails.address &&
          userDetails.address.timezone &&
          userDetails.address.timezone.isoAlpha2
            ? userDetails.address.timezone.isoAlpha2
            : 'US',
        cvc: formData.cvv,
        name: formData.cardHolderName
      }
    }
    // console.log('dataObject', JSON.stringify(dataObject))
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          // console.log('setCardDetails', JSON.stringify(data.data))
          setCardDetails(data.data ? data.data : [])
          setIsAddCardModal(false)
          setIsShowCardModal(true)
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
  const getPlansView = () => {
    let planId = selectedPlanId
    if (planId === -1) {
      return <View />
    }
    let data = _.find(plansList, (e) => e.id === planId)
    let colorSet: any = [
      { headingBackground: 'bg-[#dd4b5e]' },
      { headingBackground: 'bg-[#53cfe9]' },
      { headingBackground: 'bg-[#48c9b0]' },
      { headingBackground: 'bg-[#a569bd]' },
      { headingBackground: 'bg-[#eb984e]' }
    ]

    if (!data) {
      return <View />
    }

    let planItems = _.orderBy(data.planItems, (e) => e.displaySequence, 'asc')
    return (
      <View>
        <View
          key={0}
          style={[
            {
              overflow: 'hidden',
              elevation: 3
            }
          ]}
          className="mx-[5%] my-20  rounded-[10px] bg-white "
        >
          <View
            className={`w-full items-center justify-center p-[8px] ${colorSet[selectedPlanIndex].headingBackground}`}
          >
            <Typography className="flex-1 text-[18px] font-bold text-white">
              {planNames[selectedPlanIndex - 1].title.toUpperCase()}
            </Typography>
            <View
              style={{ width: 100, height: 100, borderRadius: 50 }}
              className={`mt-[5px] flex-1 items-center justify-center border-[5px] border-white ${data.price > 0 ? 'h-[60]' : 'h-[0]'} ${colorSet[selectedPlanIndex].headingBackground}`}
            >
              <Typography className="text-[25px] text-white">
                {data.price > 0 ? `$${data.price}` : ''}
              </Typography>
            </View>
          </View>
          <View className="mb-[20px] bg-white">
            <Typography className="my-[5px] text-center text-[16px] font-bold">
              Discount: {data.discountPercent.replace('.0', '')} %
            </Typography>
            <View className="h-[0.5px] w-full bg-gray-400" />
            {planItems.map((plan, index) => {
              return (
                <View key={index}>
                  <Typography
                    className="my-[5px] text-center text-[16px] "
                    key={index + 2}
                  >
                    {plan.name ? plan.name : ''}
                  </Typography>
                  <View className="h-[0.5px] w-full bg-gray-400" />
                </View>
              )
            })}

            <ControlledDropdown
              className="my-[10px] w-[80%] self-center"
              control={control}
              name={'planIndex'}
              label={''}
              maxHeight={300}
              list={planNames}
              onChangeValue={(data) => {
                if (data) {
                  let selectedIndex = _.find(
                    plansList,
                    (e) => e.plantype === data.title
                  )
                  // console.log('selectedIndex', JSON.stringify(selectedIndex))
                  setSelectedPlanId(selectedIndex.id)
                  setSelectedPlanIndex(Number(data.id))
                }
              }}
            />

            <Button
              className={`my-[10px] self-center ${isFromUpgradePlan ? 'w-[50%]' : 'w-[40%]'}    ${colorSet[selectedPlanIndex].headingBackground}`}
              title={
                isFromUpgradePlan
                  ? 'Upgrade to this plan'
                  : isRenewPlan
                    ? 'Renew Plan'
                    : 'Buy Now'
              }
              variant="default"
              onPress={() => {
                if (isFromUpgradePlan || isRenewPlan) {
                  upgradePlan()
                } else {
                  navigateToPayments(data)
                }
              }}
            />
          </View>
        </View>
      </View>
    )
  }
  const showCardModal = () => {
    return (
      <View
        style={{
          backgroundColor: 'white'
        }}
        className="my-2 max-h-[90%] w-[95%] self-center rounded-[15px] border-[1px] border-[#e0deda] "
      >
        <View className="bg-primary h-[50] w-full flex-row rounded-tl-[15px] rounded-tr-[15px]">
          <Typography className=" w-[85%] self-center text-center font-bold text-white">{`Saved Cards`}</Typography>
          <View className="mr-[30] flex-row justify-end self-center">
            <TouchableOpacity
              className="h-[30px] w-[30px] items-center justify-center rounded-full bg-white"
              onPress={() => {
                setIsShowCardModal(false)
              }}
            >
              <Feather name={'x'} size={25} className="color-primary" />
            </TouchableOpacity>
          </View>
        </View>
        <View className="m-2 flex-row">
          <View className="w-[60%]" />
          <Button
            className={`w-[40%] bg-[#ef6603]`}
            title={'Add new card'}
            variant="default"
            onPress={() => {
              reset1({
                cardNumber: '',
                monthIndex: -1,
                expiryYear: '',
                cvv: '',
                cardHolderName: ''
              })
              setIsShowCardModal(false)
              setIsAddCardModal(true)
            }}
          />
        </View>
        <View className=" items-center">
          {cardDetails.length > 0 ? (
            <ScrollView className="my-2 h-full w-[95%]">
              {cardDetails.map((data: any, index: number) => {
                return (
                  <View key={index}>
                    <View className="my-1 max-h-[90%] w-full self-center rounded-[5px] border-[1px] border-[#e0deda] bg-[#3c7eb0] px-5 py-10">
                      <Typography className="self-center text-[16px] font-bold text-white">
                        {`XXXX XXXX XXXX ${data.number ? data.number : ''}`}
                      </Typography>
                      <View className="my-2 flex-row">
                        <View className="w-[70%]">
                          <Typography className="text-[16px] text-white">
                            {`CARD HOLDER`}
                          </Typography>
                          <Typography className=" text-[16px] font-bold text-white">
                            {`${data.name ? data.name : 'XXXX XXXX'}`}
                          </Typography>
                        </View>
                        <View>
                          <Typography className=" text-[16px] text-white ">
                            {`EXPIRES`}
                          </Typography>
                          <Typography className=" text-[16px] font-bold text-white">
                            {`${data.exp_month ? data.exp_month : 'XX'}${data.exp_year ? '/' + data.exp_year : '/XXXX'}`}
                          </Typography>
                        </View>
                      </View>
                    </View>
                    <View className="flex-row self-center">
                      {/* <Button
                        className={`mb-5 mt-2 w-[40%] self-center bg-[#c43416]`}
                        title={'Delete Card'}
                        variant="default"
                        onPress={() => {
                          deleteCard(data)
                        }}
                      /> */}
                      <Button
                        className={`mb-5 ml-5 mt-2 self-center ${isFromUpgradePlan ? 'w-[40%]' : 'w-[40%]'} bg-[#ef6603]`}
                        title={'Pay with card'}
                        variant="default"
                        onPress={() => {
                          upgradePlanOnServer(data)
                        }}
                      />
                    </View>
                  </View>
                )
              })}
            </ScrollView>
          ) : (
            <View />
          )}
        </View>
      </View>
    )
  }
  async function setMonthChange(value: any) {
    if (value === null) {
      reset1({
        monthIndex: -1
      })
    }
  }
  const showAddCardModal = () => {
    return (
      <ScrollView
        style={{
          backgroundColor: 'white'
        }}
        className="my-2 max-h-[90%] w-[95%] self-center rounded-[15px] border-[1px] border-[#e0deda] "
      >
        <View className="bg-primary h-[50] w-full flex-row rounded-tl-[15px] rounded-tr-[15px]">
          <Typography className=" w-[85%] self-center text-center font-bold text-white">{`Add New Card`}</Typography>
          <View className="mr-[30] flex-row justify-end self-center">
            <TouchableOpacity
              className="h-[30px] w-[30px] items-center justify-center rounded-full bg-white"
              onPress={() => {
                setIsAddCardModal(false)
                setIsShowCardModal(true)
              }}
            >
              <Feather name={'x'} size={25} className="color-primary" />
            </TouchableOpacity>
          </View>
        </View>
        <View className="my-2 mb-10 w-[95%] self-center ">
          <ControlledTextField
            control={control1}
            name="cardNumber"
            placeholder={'Card Number*'}
            className="w-[95%] self-center"
            autoCapitalize="none"
            onChangeText={(data: any) => {
              let cardNumber = data
              let arr = cardNumber.split('')
              let cardNum = ''
              arr.map((value: any) => {
                if (value !== '-') {
                  cardNum += value
                }
              })
              cardNumberWithoutDash = cardNum
              cardNumber = cardNum
              // console.log('cardNumber hyphens', cardNumber)
              if (cardNumber.length > 0) {
                cardNumber = cardNumber
                  .match(new RegExp('.{1,4}', 'g'))
                  .join('-')
              }
              // console.log('cardNumber', cardNumber)
              reset1({
                cardNumber: cardNumber
              })
            }}
          />
          <ControlledDropdown
            control={control1}
            name="monthIndex"
            label="Month"
            maxHeight={300}
            list={monthsList}
            className="w-[95%] self-center"
            onChangeValue={setMonthChange}
          />
          <ControlledTextField
            control={control1}
            name="expiryYear"
            placeholder={'Expiration Year*'}
            className="w-[95%] self-center"
          />
          <ControlledTextField
            control={control1}
            name="cvv"
            placeholder={'CVV*'}
            className="w-[95%] self-center"
          />
          <ControlledTextField
            control={control1}
            name="cardHolderName"
            placeholder={'Name*'}
            className="w-[95%] self-center"
          />
          <Button
            className="my-5 w-[40%] self-center bg-[#ef6603]"
            title={'Add card'}
            variant="default"
            onPress={handleSubmit1(addCard)}
          />
        </View>
      </ScrollView>
    )
  }
  return (
    <View className="flex-1">
      <View className="">
        <PtsLoader loading={isLoading} />
        <View className="mt-[25px]">
          <PtsBackHeader title={'Plans'} memberData={{}} />
        </View>
        {!isShowCardModal && !isAddCard ? (
          <ScrollView>
            <View>{getPlansView()}</View>
          </ScrollView>
        ) : (
          <View />
        )}
      </View>
      {isShowCardModal ? (
        <View className="absolute top-[100] self-center">
          {showCardModal()}
        </View>
      ) : (
        <View />
      )}
      {/* {isAddCard ? (
        <View className="absolute top-[100] self-center">
          {showAddCardModal()}
        </View>
      ) : (
        <View />
      )} */}
    </View>
  )
}
