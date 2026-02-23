import { useMutation } from '@tanstack/react-query'
import type { AuthHeader } from '../base'
import {
  login,
  logout,
  createAccount,
  forgotPassword,
  resetPassword,
  verifyAccount,
  resendOtp,
  checkValidCredential
} from './api'
import type {
  LoginParams,
  LogoutParams,
  CreateAccountParams,
  ForgotPasswordParams,
  ResetPasswordParams,
  VerifyAccountParams,
  ResendOtpParams,
  CheckValidCredentialParams
} from './types'

export const authKeys = {
  all: ['auth'] as const,
  session: () => [...authKeys.all, 'session'] as const
}

export function useLogin(header: AuthHeader) {
  return useMutation({
    mutationFn: (params: LoginParams) => login(header, params)
  })
}

export function useLogout(header: AuthHeader) {
  return useMutation({
    mutationFn: (params: LogoutParams) => logout(header, params)
  })
}

export function useCreateAccount(header: AuthHeader) {
  return useMutation({
    mutationFn: (params: CreateAccountParams) => createAccount(header, params)
  })
}

export function useForgotPassword(header: AuthHeader) {
  return useMutation({
    mutationFn: (params: ForgotPasswordParams) => forgotPassword(header, params)
  })
}

export function useResetPassword(header: AuthHeader) {
  return useMutation({
    mutationFn: (params: ResetPasswordParams) => resetPassword(header, params)
  })
}

export function useVerifyAccount(header: AuthHeader) {
  return useMutation({
    mutationFn: (params: VerifyAccountParams) => verifyAccount(header, params)
  })
}

export function useResendOtp(header: AuthHeader) {
  return useMutation({
    mutationFn: (params: ResendOtpParams) => resendOtp(header, params)
  })
}

export function useCheckValidCredential(header: AuthHeader) {
  return useMutation({
    mutationFn: (params: CheckValidCredentialParams) =>
      checkValidCredential(header, params)
  })
}
