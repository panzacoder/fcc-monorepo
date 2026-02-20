export interface PaymentConfigResponse {
  config: any
}

export interface CheckOutSessionParams {
  payment: Record<string, unknown>
}

export interface PaymentSuccessParams {
  sessionId: string
}

export interface PaymentFailParams {
  sessionId: string
}

export interface AppleSuccessPaymentParams {
  payment: Record<string, unknown>
}

export interface IosReceiptVerificationParams {
  receiptData: string
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
