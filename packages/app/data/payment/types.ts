export interface PaymentConfigResponse {
  publicKey: string
}

export interface CheckOutSessionOrderItem {
  id: number | null
  description: string
  plan: { id: number | string }
}

export interface CheckOutSessionParams {
  user: { email: string }
  order: {
    id: number | null
    description: string | null
    email: string
    price: string
    currency: string | null
    status: string | null
    date: string | null
    orderid: string | null
    orderItems: CheckOutSessionOrderItem[]
  }
}

export interface CheckOutSessionResponse {
  ephemeralKey: string
  paymentIntentClientSecret: string
  customerId: string
  sessionId: string
  paymentIntentId: string
  subscriptionId: string
}

export interface PaymentSuccessParams {
  sessionId: string
  subscriptionId: string
}

export interface PaymentUserSubscription {
  subscriptionEndDate: string
  days: string
  expiredSubscription: boolean
  expiringSubscription: boolean
  status: string
  plan: {
    id: number
    description: string
    price: number
    plantype: string
  }
  source: string
  startDate: string
  endDate: string
}

export interface PaymentSuccessResponse {
  userDetails: {
    userSubscription?: PaymentUserSubscription
    appuserVo?: {
      firstName: string
      lastName: string
      email: string
      phone: string
    }
  }
}

export interface PaymentFailParams {
  sessionId: string
  reason: string
  subscriptionId: string
}

export interface AppleRenewableInfo {
  expirationIntent: string
  originalTransactionId: string
  autoRenewProductId: string
  productId: string
  autoRenewStatus: string
  signedDate: string
  isInBillingRetryPeriod: string
}

export interface AppleTransactionInfo {
  transactionId: string
  originalTransactionId: string
  webOrderLineItemId: string
  bundleId: string
  productId: string
  subscriptionGroupIdentifier: string
  purchaseDate: string
  originalPurchaseDate: string
  expiresDate: string
  quantity: string
  type: string
  inAppOwnershipType: string
  signedDate: string
}

export interface AppleSuccessPaymentParams {
  notificationType: string
  notificationUUID: string
  subtype: string
  email: string
  version: string
  renewableInfo: AppleRenewableInfo
  transactionInfo: AppleTransactionInfo
}

export interface IosReceiptVerificationParams {
  'receipt-data': string
  password: string
  'exclude-old-transactions': boolean
}

export interface IosReceiptInfo {
  original_transaction_id: string
  product_id: string
  transaction_id: string
  web_order_line_item_id: string
  subscription_group_identifier: string
  purchase_date_ms: string
  original_purchase_date_ms: string
  expires_date_ms: string
}

export interface IosReceiptVerificationResponse {
  latest_receipt_info: IosReceiptInfo[]
}

export interface PlanItem {
  id: number
  name: string
  displaySequence: number
}

export interface PlanDetail {
  id: number
  plantype: string
  price: number
  description: string
  discountPercent: string
  planItems: PlanItem[]
}

export interface PlanGroup {
  planName: string
  planList: PlanDetail[]
}

export type GetAllPlansResponse = PlanGroup[]

export interface CardListItem {
  id: string
  number: string
  name: string
  exp_month: string
  exp_year: string
  paymentMethodId: string
}

export type GetCardListResponse = CardListItem[]

export interface UpgradePlanParams {
  email: string
  subscriptionId: string
  paymentMethodId: string
  plan: { id: number; plantype: string }
}

export interface RenewSubscriptionParams {
  email: string
  subscriptionId: string
  paymentMethodId: string
  plan: { id: number; plantype: string }
}

export interface AddCardParams {
  card: {
    number: string
    exp_month: string
    exp_year: string
    country: string
    cvc: string
    name: string
  }
}

export interface DeleteCardParams {
  card: { id: string }
}
