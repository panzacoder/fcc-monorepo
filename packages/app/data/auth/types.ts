export interface LoginParams {
  appuserVo: {
    emailOrPhone: string
    credential: string
    rememberMe: boolean
  }
}

export interface LoginResponse {
  header: Record<string, unknown>
  appuserVo: Record<string, unknown>
  userSubscription: Record<string, unknown>
  subscriptionEndDate: string
  days: string
  expiredSubscription: boolean
  expiringSubscription: boolean
  sponsorUser: Record<string, unknown>
  sponsorship: Record<string, unknown>
  commercialsDetails: {
    commercials: Record<string, unknown>[]
    commercialPageMappings: Record<string, unknown>[]
  } | null
}

export interface LogoutParams {
  header: Record<string, unknown>
}

export type LogoutResponse = Record<string, unknown>

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

export type CreateAccountResponse = Record<string, unknown>

export interface ForgotPasswordParams {
  appuserVo: {
    emailOrPhone: string
  }
}

export type ForgotPasswordResponse = Record<string, unknown>

export interface ResetPasswordParams {
  appuserVo: {
    emailOrPhone: string
    tempPassword: string
    credential: string
  }
}

export type ResetPasswordResponse = Record<string, unknown>

export interface VerifyAccountParams {
  registrationVo: {
    emailOrPhone: string
    varificationCode: string
  }
}

export type VerifyAccountResponse = Record<string, unknown>

export interface ResendOtpParams {
  registration: {
    email: string
  }
}

export type ResendOtpResponse = Record<string, unknown>

export interface CheckValidCredentialParams {
  appuserVo: {
    credential: string
  }
}

export type CheckValidCredentialResponse = Record<string, unknown>
