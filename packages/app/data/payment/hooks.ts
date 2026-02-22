import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { AuthHeader } from '../base'
import {
  getPaymentConfig,
  checkOutSession,
  paymentSuccess,
  paymentFail,
  appleSuccessPayment,
  iosReceiptVerification,
  getAllPlans,
  getCardList,
  upgradePlan,
  renewSubscription,
  addCard,
  deleteCard
} from './api'
import type {
  CheckOutSessionParams,
  PaymentSuccessParams,
  PaymentFailParams,
  AppleSuccessPaymentParams,
  IosReceiptVerificationParams,
  UpgradePlanParams,
  RenewSubscriptionParams,
  AddCardParams,
  DeleteCardParams
} from './types'

export const paymentKeys = {
  all: ['payment'] as const,
  config: () => [...paymentKeys.all, 'config'] as const,
  plans: () => [...paymentKeys.all, 'plans'] as const,
  cards: () => [...paymentKeys.all, 'cards'] as const
}

export function usePaymentConfig(header: AuthHeader) {
  return useQuery({
    queryKey: paymentKeys.config(),
    queryFn: () => getPaymentConfig(header),
    enabled: !!header
  })
}

export function useAllPlans(header: AuthHeader) {
  return useQuery({
    queryKey: paymentKeys.plans(),
    queryFn: () => getAllPlans(header),
    enabled: !!header
  })
}

export function useCardList(header: AuthHeader) {
  return useQuery({
    queryKey: paymentKeys.cards(),
    queryFn: () => getCardList(header),
    enabled: !!header
  })
}

export function useCheckOutSession(header: AuthHeader) {
  return useMutation({
    mutationFn: (params: CheckOutSessionParams) =>
      checkOutSession(header, params)
  })
}

export function usePaymentSuccess(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: PaymentSuccessParams) =>
      paymentSuccess(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.all })
    }
  })
}

export function usePaymentFail(header: AuthHeader) {
  return useMutation({
    mutationFn: (params: PaymentFailParams) => paymentFail(header, params)
  })
}

export function useAppleSuccessPayment(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: AppleSuccessPaymentParams) =>
      appleSuccessPayment(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.all })
    }
  })
}

export function useIosReceiptVerification(header: AuthHeader) {
  return useMutation({
    mutationFn: (params: IosReceiptVerificationParams) =>
      iosReceiptVerification(header, params)
  })
}

export function useUpgradePlan(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: UpgradePlanParams) => upgradePlan(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.plans() })
    }
  })
}

export function useRenewSubscription(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: RenewSubscriptionParams) =>
      renewSubscription(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.all })
    }
  })
}

export function useAddCard(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: AddCardParams) => addCard(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.cards() })
    }
  })
}

export function useDeleteCard(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: DeleteCardParams) => deleteCard(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.cards() })
    }
  })
}
