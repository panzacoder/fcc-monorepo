import { fetchData, type AuthHeader } from '../base'
import {
  PAYMENT_GET_PAYMENT_CONFIG,
  PAYMENT_CHECK_OUT_SESSION,
  PAYMENT_SUCCESS,
  PAYMENT_FAIL,
  APPLE_SUCCESS_PAYMENT_FOR_OUR_SERVER,
  IOS_RECEIPT_VERIFICATION_URL,
  GET_ALL_PLANS,
  GET_CARD_LIST,
  UPGRADE_PLAN,
  RENEW_SUBSCRIPTION,
  ADD_CARD,
  DELETE_CARD
} from 'app/utils/urlConstants'
import type {
  PaymentConfigResponse,
  CheckOutSessionParams,
  PaymentSuccessParams,
  PaymentFailParams,
  AppleSuccessPaymentParams,
  IosReceiptVerificationParams,
  GetAllPlansResponse,
  GetCardListResponse,
  UpgradePlanParams,
  RenewSubscriptionParams,
  AddCardParams,
  DeleteCardParams
} from './types'

export async function getPaymentConfig(header: AuthHeader) {
  return fetchData<PaymentConfigResponse>({
    header,
    route: PAYMENT_GET_PAYMENT_CONFIG
  })
}

export async function checkOutSession(
  header: AuthHeader,
  params: CheckOutSessionParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: PAYMENT_CHECK_OUT_SESSION,
    data: params
  })
}

export async function paymentSuccess(
  header: AuthHeader,
  params: PaymentSuccessParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: PAYMENT_SUCCESS,
    data: params
  })
}

export async function paymentFail(
  header: AuthHeader,
  params: PaymentFailParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: PAYMENT_FAIL,
    data: params
  })
}

export async function appleSuccessPayment(
  header: AuthHeader,
  params: AppleSuccessPaymentParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: APPLE_SUCCESS_PAYMENT_FOR_OUR_SERVER,
    data: params
  })
}

export async function iosReceiptVerification(
  header: AuthHeader,
  params: IosReceiptVerificationParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: IOS_RECEIPT_VERIFICATION_URL,
    data: params
  })
}

export async function getAllPlans(header: AuthHeader) {
  return fetchData<GetAllPlansResponse>({
    header,
    route: GET_ALL_PLANS
  })
}

export async function getCardList(header: AuthHeader) {
  return fetchData<GetCardListResponse>({
    header,
    route: GET_CARD_LIST
  })
}

export async function upgradePlan(
  header: AuthHeader,
  params: UpgradePlanParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: UPGRADE_PLAN,
    data: params
  })
}

export async function renewSubscription(
  header: AuthHeader,
  params: RenewSubscriptionParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: RENEW_SUBSCRIPTION,
    data: params
  })
}

export async function addCard(header: AuthHeader, params: AddCardParams) {
  return fetchData<Record<string, unknown>>({
    header,
    route: ADD_CARD,
    data: params
  })
}

export async function deleteCard(header: AuthHeader, params: DeleteCardParams) {
  return fetchData<Record<string, unknown>>({
    header,
    route: DELETE_CARD,
    data: params
  })
}
