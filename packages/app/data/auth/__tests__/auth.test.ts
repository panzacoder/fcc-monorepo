import { describe, it, expect, vi } from 'vitest'

const mockFetchData = vi.fn()
vi.mock('app/data/base', () => ({
  fetchData: (...args: unknown[]) => mockFetchData(...args)
}))

vi.mock('app/utils/urlConstants', () => ({
  USER_LOGIN: 'userms/login',
  USER_LOGOUT: 'userms/logout',
  CREATE_ACCOUNT: 'regms/create',
  FORGOT_PASSWORD: 'userms/forgetPassword',
  RESET_PASSWORD: 'userms/resetPassword',
  VERIFY_ACCOUNT: 'regms/verify',
  RESEND_OTP: 'regms/verificationCodeRequest',
  CHECK_VALID_CREDENTIAL: 'userms/checkValidCredential'
}))

import { login, logout, createAccount, forgotPassword } from '../api'

describe('auth API', () => {
  const header = { token: 'test' }

  it('login calls fetchData with correct route and params', async () => {
    mockFetchData.mockResolvedValue({ header: {} })
    const params = {
      appuserVo: {
        emailOrPhone: 'user@test.com',
        credential: 'pass',
        rememberMe: true
      }
    }

    await login(header, params)

    expect(mockFetchData).toHaveBeenCalledWith({
      header,
      route: 'userms/login',
      data: params
    })
  })

  it('logout calls fetchData with correct route and params', async () => {
    mockFetchData.mockResolvedValue({})
    const params = { header: { token: 'test' } }

    await logout(header, params)

    expect(mockFetchData).toHaveBeenCalledWith({
      header,
      route: 'userms/logout',
      data: params
    })
  })

  it('createAccount calls fetchData with correct route and params', async () => {
    mockFetchData.mockResolvedValue({})
    const params = {
      registration: {
        firstName: 'Test',
        lastName: 'User',
        phone: '555-1234',
        email: 'test@test.com',
        credential: 'pass123',
        userTimezone: 'America/New_York',
        referralCode: '',
        address: { state: { id: '1' } }
      }
    }

    await createAccount(header, params)

    expect(mockFetchData).toHaveBeenCalledWith({
      header,
      route: 'regms/create',
      data: params
    })
  })

  it('forgotPassword calls fetchData with correct route and params', async () => {
    mockFetchData.mockResolvedValue({})
    const params = { appuserVo: { emailOrPhone: 'user@test.com' } }

    await forgotPassword(header, params)

    expect(mockFetchData).toHaveBeenCalledWith({
      header,
      route: 'userms/forgetPassword',
      data: params
    })
  })
})
