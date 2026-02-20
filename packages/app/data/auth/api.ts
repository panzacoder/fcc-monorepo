import { fetchData, type AuthHeader, type FetchDataOptions } from '../base'
import {
  USER_LOGIN,
  USER_LOGOUT,
  CREATE_ACCOUNT,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  VERIFY_ACCOUNT,
  RESEND_OTP,
  CHECK_VALID_CREDENTIAL
} from 'app/utils/urlConstants'
import type {
  LoginParams,
  LoginResponse,
  LogoutParams,
  LogoutResponse,
  CreateAccountParams,
  CreateAccountResponse,
  ForgotPasswordParams,
  ForgotPasswordResponse,
  ResetPasswordParams,
  ResetPasswordResponse,
  VerifyAccountParams,
  VerifyAccountResponse,
  ResendOtpParams,
  ResendOtpResponse,
  CheckValidCredentialParams,
  CheckValidCredentialResponse
} from './types'

export async function login(
  header: AuthHeader,
  params: LoginParams,
  options?: FetchDataOptions<LoginResponse>
) {
  return fetchData<LoginResponse>({
    header,
    route: USER_LOGIN,
    data: params,
    ...options
  })
}

export async function logout(header: AuthHeader, params: LogoutParams) {
  return fetchData<LogoutResponse>({
    header,
    route: USER_LOGOUT,
    data: params
  })
}

export async function createAccount(
  header: AuthHeader,
  params: CreateAccountParams
) {
  return fetchData<CreateAccountResponse>({
    header,
    route: CREATE_ACCOUNT,
    data: params
  })
}

export async function forgotPassword(
  header: AuthHeader,
  params: ForgotPasswordParams
) {
  return fetchData<ForgotPasswordResponse>({
    header,
    route: FORGOT_PASSWORD,
    data: params
  })
}

export async function resetPassword(
  header: AuthHeader,
  params: ResetPasswordParams
) {
  return fetchData<ResetPasswordResponse>({
    header,
    route: RESET_PASSWORD,
    data: params
  })
}

export async function verifyAccount(
  header: AuthHeader,
  params: VerifyAccountParams
) {
  return fetchData<VerifyAccountResponse>({
    header,
    route: VERIFY_ACCOUNT,
    data: params
  })
}

export async function resendOtp(header: AuthHeader, params: ResendOtpParams) {
  return fetchData<ResendOtpResponse>({
    header,
    route: RESEND_OTP,
    data: params
  })
}

export async function checkValidCredential(
  header: AuthHeader,
  params: CheckValidCredentialParams
) {
  return fetchData<CheckValidCredentialResponse>({
    header,
    route: CHECK_VALID_CREDENTIAL,
    data: params
  })
}
