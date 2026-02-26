import type { AuthHeader } from '../base'
import type { Address } from '../types.d'

export interface LoginParams {
  appuserVo: {
    emailOrPhone: string
    credential: string
    rememberMe: boolean
  }
}

export interface LoginHeader {
  accessToken: string
  email: string
  timezone: string
}

export interface LoginAppUser {
  firstName: string
  lastName: string
  email: string
  phone: string
  memberName: string
  memberId?: number
  id?: number
  address: Address
  isFreeUser: boolean
  premiumFeatureTrialinfo: {
    startDate: string
    endDate: string
    status: { status: string }
  } | null
}

export interface LoginUserSubscription {
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

export interface Commercial {
  id: number
  name: string
  description: string | null
  url: string | null
}

export interface CommercialPageMapping {
  id: number
  page: string
  position: string
}

export interface LoginResponse {
  header: LoginHeader
  appuserVo: LoginAppUser
  userSubscription: LoginUserSubscription
  subscriptionEndDate: string
  days: string
  expiredSubscription: boolean
  expiringSubscription: boolean
  sponsorUser: { id: number; name: string } | null
  sponsorship: { id: number; sponsorCode: string } | null
  commercialsDetails: {
    commercials: Commercial[]
    commercialPageMappings: CommercialPageMapping[]
  } | null
}

export interface LogoutParams {
  header: AuthHeader
}

export type LogoutResponse = unknown

export interface CreateAccountParams {
  registration: {
    firstName: string
    lastName: string
    phone: string
    email: string
    credential: string
    userTimezone: string
    referralCode: string
    address: {
      state: {
        id: string | number
      }
    }
  }
}

export type CreateAccountResponse = unknown

export interface ForgotPasswordParams {
  appuserVo: {
    emailOrPhone: string
  }
}

export type ForgotPasswordResponse = unknown

export interface ResetPasswordParams {
  appuserVo: {
    emailOrPhone: string
    tempPassword: string
    credential: string
  }
}

export type ResetPasswordResponse = unknown

export interface VerifyAccountParams {
  registrationVo: {
    emailOrPhone: string
    varificationCode: string
  }
}

export type VerifyAccountResponse = unknown

export interface ResendOtpParams {
  registration: {
    email: string
  }
}

export type ResendOtpResponse = unknown

export interface CheckValidCredentialParams {
  appuserVo: {
    credential: string
  }
}

export type CheckValidCredentialResponse = unknown
