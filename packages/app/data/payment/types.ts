export interface PaymentConfigResponse {
  publicKey: string
}

export interface CheckOutSessionParams {
  user: Record<string, unknown>
  order: Record<string, unknown>
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

export interface PaymentSuccessResponse {
  userDetails: {
    userSubscription?: Record<string, unknown>
    appuserVo?: Record<string, unknown>
  }
}

export interface PaymentFailParams {
  sessionId: string
  reason: string
  subscriptionId: string
}

export interface AppleSuccessPaymentParams {
  notificationType: string
  notificationUUID: string
  subtype: string
  email: string
  version: string
  renewableInfo: Record<string, unknown>
  transactionInfo: Record<string, unknown>
}

export interface IosReceiptVerificationParams {
  'receipt-data': string
  password: string
  'exclude-old-transactions': boolean
}

export interface GetAllPlansResponse {
  list: any[]
}

export interface GetCardListResponse {
  list: any[]
}

export interface UpgradePlanParams {
  plan: Record<string, unknown>
}

export interface RenewSubscriptionParams {
  subscription: Record<string, unknown>
}

export interface AddCardParams {
  card: Record<string, unknown>
}

export interface DeleteCardParams {
  card: { id: string }
}
