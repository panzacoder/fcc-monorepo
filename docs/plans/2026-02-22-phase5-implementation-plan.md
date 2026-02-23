# Phase 5: Testing Foundation — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Establish test infrastructure with Vitest, eliminate the broken CallPostService layer, and deliver ~25 tests covering the critical data/transport path.

**Architecture:** Vitest with jsdom environment, global mocks in a setup file, a `test-utils.tsx` providing QueryClient + pluggable state management wrapper. Task 0 unifies `fetchData` to call `fetch` directly so errors propagate to TanStack Query.

**Tech Stack:** Vitest, @testing-library/react-native, jsdom, TanStack Query (existing)

---

## Task 1: Install Dependencies

**Files:**

- Modify: `packages/app/package.json`

**Step 1: Install Vitest and testing libraries**

Run:

```bash
yarn workspace app add -D vitest jsdom @testing-library/react-native @testing-library/jest-dom
```

**Step 2: Verify installation**

Run:

```bash
yarn workspace app vitest --version
```

Expected: Version number printed (e.g., `3.x.x`)

**Step 3: Commit**

```bash
git add packages/app/package.json yarn.lock
git commit -m "chore: install vitest and testing libraries"
```

---

## Task 2: Create Vitest Config

**Files:**

- Create: `packages/app/vitest.config.ts`

**Step 1: Create the config file**

```typescript
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    restoreMocks: true,
    include: ['**/__tests__/**/*.test.{ts,tsx}', '**/*.test.{ts,tsx}']
  },
  resolve: {
    alias: {
      app: path.resolve(__dirname, '.')
    }
  }
})
```

**Step 2: Commit**

```bash
git add packages/app/vitest.config.ts
git commit -m "chore: add vitest config with jsdom and app alias"
```

---

## Task 3: Create Global Mock Setup

**Files:**

- Create: `packages/app/test/setup.ts`

**Step 1: Create the setup file**

```typescript
import { vi, beforeEach } from 'vitest'

// --- expo-secure-store mock ---
const secureStoreMap = new Map<string, string>()

vi.mock('expo-secure-store', () => ({
  setItemAsync: vi.fn(async (key: string, value: string) => {
    secureStoreMap.set(key, value)
  }),
  getItemAsync: vi.fn(async (key: string) => {
    return secureStoreMap.get(key) ?? null
  }),
  deleteItemAsync: vi.fn(async (key: string) => {
    secureStoreMap.delete(key)
  })
}))

beforeEach(() => {
  secureStoreMap.clear()
})

// --- expo-router mock ---
vi.mock('expo-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn()
  }),
  useLocalSearchParams: () => ({})
}))

// --- @react-native-firebase/messaging mock ---
vi.mock('@react-native-firebase/messaging', () => ({
  default: () => ({
    getInitialNotification: vi.fn().mockResolvedValue(null),
    onNotificationOpenedApp: vi.fn()
  })
}))

// --- expo-device mock ---
vi.mock('expo-device', () => ({
  osBuildId: 'test-build',
  brand: 'test-brand',
  osVersion: '17.0',
  modelName: 'test-model'
}))

// --- react-native partial mock (Alert) ---
vi.mock('react-native', async () => {
  const actual =
    await vi.importActual<typeof import('react-native')>('react-native')
  return {
    ...actual,
    Alert: {
      alert: vi.fn()
    },
    Platform: {
      OS: 'ios',
      select: vi.fn((obj: Record<string, unknown>) => obj.ios)
    }
  }
})
```

**Step 2: Commit**

```bash
git add packages/app/test/setup.ts
git commit -m "chore: add global test mocks for expo, firebase, and react-native"
```

---

## Task 4: Create Test Utilities

**Files:**

- Create: `packages/app/test/test-utils.tsx`

**Step 1: Create test-utils with pluggable provider wrapper**

```tsx
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider as ReduxStoreProvider } from 'react-redux'
import { legacy_createStore as createStore } from 'redux'
import rootReducer from 'app/redux/rootReducer'
import { render, type RenderOptions } from '@testing-library/react-native'

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0
      },
      mutations: {
        retry: false
      }
    }
  })
}

function ReduxTestProvider({ children }: { children: React.ReactNode }) {
  const store = createStore(rootReducer, {})
  return <ReduxStoreProvider store={store}>{children}</ReduxStoreProvider>
}

type RenderWithProvidersOptions = Omit<RenderOptions, 'wrapper'> & {
  queryClient?: QueryClient
  wrapper?: React.ComponentType<{ children: React.ReactNode }>
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    queryClient = createTestQueryClient(),
    wrapper: StateWrapper = ReduxTestProvider,
    ...options
  }: RenderWithProvidersOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <StateWrapper>{children}</StateWrapper>
      </QueryClientProvider>
    )
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...options }),
    queryClient
  }
}

export * from '@testing-library/react-native'
export { renderWithProviders as render }
```

**Step 2: Verify the file compiles**

Run:

```bash
cd packages/app && npx tsc --noEmit test/test-utils.tsx --jsx react-jsx --esModuleInterop --moduleResolution node --skipLibCheck 2>&1 || echo "Type check skipped — will validate via test run"
```

Note: Full type checking may require the full tsconfig context. This will be validated when tests run.

**Step 3: Commit**

```bash
git add packages/app/test/test-utils.tsx
git commit -m "chore: add test-utils with pluggable provider wrapper"
```

---

## Task 5: Add Test Scripts and CI Pipeline

**Files:**

- Modify: `packages/app/package.json` (add scripts)
- Modify: `turbo.json` (add test pipeline)
- Modify: `.github/workflows/ci.yml` (add test job)

**Step 1: Add test scripts to packages/app/package.json**

Add to `"scripts"`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

**Step 2: Add test pipeline to turbo.json**

Add `"test": {}` to the `"pipeline"` object (parallel, no dependencies).

**Step 3: Add test job to CI**

Add after the `format` job in `.github/workflows/ci.yml`:

```yaml
test:
  name: Test
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: 24
        cache: yarn
    - run: yarn install --immutable
    - run: yarn turbo run test
```

**Step 4: Verify test runner works (should pass with 0 tests)**

Run:

```bash
yarn workspace app test
```

Expected: `No test files found` or similar — no failures.

**Step 5: Commit**

```bash
git add packages/app/package.json turbo.json .github/workflows/ci.yml
git commit -m "chore: add test scripts, turbo pipeline, and CI test job"
```

---

## Task 6: Write secure-storage tests

**Files:**

- Create: `packages/app/utils/__tests__/secure-storage.test.ts`
- Test: `packages/app/utils/secure-storage.native.ts`

**Step 1: Write the tests**

```typescript
import { describe, it, expect } from 'vitest'
import {
  storeCredentials,
  getCredentials,
  clearCredentials
} from '../secure-storage.native'

describe('secure-storage (native)', () => {
  it('stores and retrieves credentials', async () => {
    await storeCredentials('user@example.com', 's3cret')
    const creds = await getCredentials()
    expect(creds).toEqual({ email: 'user@example.com', password: 's3cret' })
  })

  it('returns null when no credentials stored', async () => {
    const creds = await getCredentials()
    expect(creds).toBeNull()
  })

  it('clears stored credentials', async () => {
    await storeCredentials('user@example.com', 's3cret')
    await clearCredentials()
    const creds = await getCredentials()
    expect(creds).toBeNull()
  })

  it('returns null on corrupted JSON', async () => {
    const SecureStore = await import('expo-secure-store')
    await SecureStore.setItemAsync('user_credentials', '{not valid json')
    const creds = await getCredentials()
    expect(creds).toBeNull()
  })
})
```

**Step 2: Run tests**

Run:

```bash
yarn workspace app test -- utils/__tests__/secure-storage.test.ts
```

Expected: 4 tests pass.

**Step 3: Commit**

```bash
git add packages/app/utils/__tests__/secure-storage.test.ts
git commit -m "test: secure-storage — store, retrieve, clear, corrupted JSON"
```

---

## Task 7: Write auth-events tests

**Files:**

- Create: `packages/app/utils/__tests__/auth-events.test.ts`
- Test: `packages/app/utils/auth-events.ts`

**Step 1: Write the tests**

```typescript
import { describe, it, expect, vi } from 'vitest'
import { onSessionExpired, emitSessionExpired } from '../auth-events'

describe('auth-events', () => {
  it('calls subscriber on emit', () => {
    const handler = vi.fn()
    onSessionExpired(handler)
    emitSessionExpired()
    expect(handler).toHaveBeenCalledOnce()
  })

  it('calls multiple subscribers', () => {
    const handler1 = vi.fn()
    const handler2 = vi.fn()
    onSessionExpired(handler1)
    onSessionExpired(handler2)
    emitSessionExpired()
    expect(handler1).toHaveBeenCalledOnce()
    expect(handler2).toHaveBeenCalledOnce()
  })

  it('stops delivery after unsubscribe', () => {
    const handler = vi.fn()
    const unsubscribe = onSessionExpired(handler)
    unsubscribe()
    emitSessionExpired()
    expect(handler).not.toHaveBeenCalled()
  })

  it('handles emit with no subscribers', () => {
    expect(() => emitSessionExpired()).not.toThrow()
  })
})
```

Note: `auth-events.ts` uses a module-level `Set` for listeners. Since `restoreMocks: true` resets `vi.fn()` but does NOT reset module state, the `Set` persists between tests. Each test adds its own handler — this is fine because we never test "exactly N handlers registered." If this causes flaky tests, add manual cleanup. But test it first — YAGNI.

**Step 2: Run tests**

Run:

```bash
yarn workspace app test -- utils/__tests__/auth-events.test.ts
```

Expected: 4 tests pass. If "calls subscriber on emit" gets extra calls from handlers registered in prior tests, add a cleanup helper. Otherwise proceed.

**Step 3: Commit**

```bash
git add packages/app/utils/__tests__/auth-events.test.ts
git commit -m "test: auth-events — subscribe, multi-subscribe, unsubscribe, no-op"
```

---

## Task 8: Unify fetchData — Eliminate CallPostService (Task 0)

This is the critical refactor. Do it BEFORE writing fetchData tests so we test correct behavior.

**Files:**

- Delete: `packages/app/utils/fetchServerData.ts`
- Rewrite: `packages/app/data/base.ts`
- Modify: `packages/app/data/auth/api.ts` (remove onFailure passthrough)
- Modify: `packages/app/data/auth/hooks.ts` (remove FetchDataOptions)
- Modify: `packages/app/features/auth/login/screen.tsx` (move onFailure to onError)
- Modify: `packages/app/features/splash/screen.tsx` (move onFailure to onError)

**Step 1: Rewrite `packages/app/data/base.ts`**

Replace the entire file with:

```typescript
import { getUserDeviceInformation } from 'app/utils/device'
import { emitSessionExpired } from 'app/utils/auth-events'
import { BASE_URL } from 'app/utils/urlConstants'
import { logger } from 'app/utils/logger'

export type AuthHeader = any

type FetchDataProps = {
  header: AuthHeader
  route: string
  data?: any
}

export async function fetchData<T>({
  header,
  route,
  data = {}
}: FetchDataProps): Promise<T> {
  const url = new URL(route, BASE_URL)
  logger.debug(`Fetching data from ${url}`)
  const deviceInfo = await getUserDeviceInformation()

  const payload = {
    header: { deviceInfo, ...header },
    ...data
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  const json = await response.json()

  if (json.errorCode === 'SEP_101') {
    emitSessionExpired()
    throw new Error('Session expired')
  }

  if (json.status === 'SUCCESS') {
    return json.data as T
  }

  throw new Error(json.message || 'Request failed')
}
```

Key changes from original:

- No `CallPostService` import — calls `fetch` directly
- No `onFailure` callback — errors thrown, handled by TanStack Query
- No `FetchDataOptions` type export
- Returns `Promise<T>` not `Promise<T | void>`
- No `Alert.alert` — error alerts handled by QueryClient config's mutation `onError`
- SEP_101 check absorbed from CallPostService

**Step 2: Delete `packages/app/utils/fetchServerData.ts`**

Run:

```bash
rm packages/app/utils/fetchServerData.ts
```

**Step 3: Update `packages/app/data/auth/api.ts`**

Remove `FetchDataOptions` import and `options` parameter from `login()`:

```typescript
import { fetchData, type AuthHeader } from '../base'
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

export async function login(header: AuthHeader, params: LoginParams) {
  return fetchData<LoginResponse>({
    header,
    route: USER_LOGIN,
    data: params
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
```

**Step 4: Update `packages/app/data/auth/hooks.ts`**

Remove `FetchDataOptions` import. Simplify `useLogin` — no more `options` in params:

```typescript
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
```

**Step 5: Update `packages/app/features/auth/login/screen.tsx`**

Change the `login()` function to move error handling from `onFailure` to TanStack Query's `onError`:

Find:

```typescript
      {
        appuserVo: {
          emailOrPhone: formData.email,
          credential: formData.password,
          rememberMe: true
        },
        options: {
          onFailure: (res) => {
            if (res.status === 'FAILURE' && res.errorCode === 'RVF_101') {
              router.push(formatUrl('/verification', { email: formData.email }))
            } else if (res.status === 'FAILURE') {
              Alert.alert('', res.message)
            }
          }
        }
      },
      {
        onSuccess: async (data: any) => {
```

Replace with:

```typescript
      {
        appuserVo: {
          emailOrPhone: formData.email,
          credential: formData.password,
          rememberMe: true
        }
      },
      {
        onError: (error: Error) => {
          if (error.message === 'RVF_101') {
            router.push(formatUrl('/verification', { email: formData.email }))
          } else {
            Alert.alert('', error.message)
          }
        },
        onSuccess: async (data: any) => {
```

Wait — the `RVF_101` is an `errorCode` from the API response, not the error message. After the Task 0 refactor, the server response `{ status: 'FAILURE', message: '...', errorCode: 'RVF_101' }` gets thrown as `new Error(json.message)`. We need to preserve the errorCode.

**Updated approach**: Create a small `ApiError` class in `base.ts` that carries `errorCode`:

Add to `packages/app/data/base.ts`:

```typescript
export class ApiError extends Error {
  errorCode?: string
  constructor(message: string, errorCode?: string) {
    super(message)
    this.name = 'ApiError'
    this.errorCode = errorCode
  }
}
```

And in the `fetchData` function, the failure branch becomes:

```typescript
throw new ApiError(json.message || 'Request failed', json.errorCode)
```

Then in `login/screen.tsx`, the `onError` becomes:

```typescript
        onError: (error: Error) => {
          if ('errorCode' in error && error.errorCode === 'RVF_101') {
            router.push(formatUrl('/verification', { email: formData.email }))
          } else {
            Alert.alert('', error.message)
          }
        },
```

**Step 6: Update `packages/app/features/splash/screen.tsx`**

The splash screen's login function currently passes `onFailure` and also has `onError` (added in PR #119). After refactor:

Find the `loginMutation.mutate(...)` call and replace the first argument (params) and the mutation callbacks:

The mutate params become just `LoginParams` (no `options` key):

```typescript
      {
        appuserVo: {
          emailOrPhone: email,
          credential: password,
          rememberMe: true
        }
      },
```

The callbacks become:

```typescript
      {
        onError: (error: Error) => {
          if ('errorCode' in error && error.errorCode === 'RVF_101') {
            router.push(formatUrl('/verification', { email: email }))
          } else {
            Alert.alert('', error.message)
          }
          setIsShowButtons(true)
        },
        onSuccess: async (data: any) => {
```

Note: The `if (!data) return` guard at the top of `onSuccess` is no longer needed since `fetchData` now throws instead of returning `void`. But removing all `if (data)` guards is Phase 6 scope. Leaving it is harmless — `data` will always be truthy in `onSuccess` now.

**Step 7: Verify the refactor compiles**

Run:

```bash
yarn workspace next-app lint
```

Expected: No errors (warnings for `no-explicit-any` are fine).

**Step 8: Commit**

```bash
git add -A
git commit -m "refactor: unify fetchData — eliminate CallPostService, let errors propagate to TanStack Query

- Delete fetchServerData.ts (CallPostService removed)
- Rewrite data/base.ts to call fetch directly with ApiError class
- Remove onFailure/FetchDataOptions from auth api and hooks
- Move error handling to TanStack Query onError in login + splash screens
- Errors now propagate: isError, retry, and error boundaries work correctly"
```

---

## Task 9: Write fetchData tests

**Files:**

- Create: `packages/app/data/__tests__/base.test.ts`
- Test: `packages/app/data/base.ts`

Since Task 0 unified everything into `base.ts`, the planned `fetchServerData.test.ts` and `base.test.ts` merge into one file.

**Step 1: Write the tests**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchData, ApiError } from '../base'

const mockFetch = vi.fn()
globalThis.fetch = mockFetch

vi.mock('app/utils/device', () => ({
  getUserDeviceInformation: vi.fn().mockResolvedValue({
    buildNumber: 'test-build',
    ostype: 'ios',
    host: 'test-brand',
    osversion: '17.0',
    modelnumber: 'test-model',
    browser: 'test-browser',
    appclient: 'M'
  })
}))

vi.mock('app/utils/urlConstants', () => ({
  BASE_URL: 'https://api.example.com/'
}))

const mockEmitSessionExpired = vi.fn()
vi.mock('app/utils/auth-events', () => ({
  emitSessionExpired: (...args: unknown[]) => mockEmitSessionExpired(...args)
}))

function jsonResponse(body: unknown, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body)
  })
}

describe('fetchData', () => {
  const header = { token: 'test-token' }

  beforeEach(() => {
    mockFetch.mockReset()
    mockEmitSessionExpired.mockReset()
  })

  it('returns typed data on SUCCESS', async () => {
    mockFetch.mockReturnValue(
      jsonResponse({ status: 'SUCCESS', data: { id: 1, name: 'Test' } })
    )

    const result = await fetchData<{ id: number; name: string }>({
      header,
      route: 'test/endpoint',
      data: { query: 'value' }
    })

    expect(result).toEqual({ id: 1, name: 'Test' })
  })

  it('constructs correct URL from BASE_URL + route', async () => {
    mockFetch.mockReturnValue(jsonResponse({ status: 'SUCCESS', data: {} }))

    await fetchData({ header, route: 'users/list' })

    const calledUrl = mockFetch.mock.calls[0]![0]
    expect(calledUrl.toString()).toBe('https://api.example.com/users/list')
  })

  it('sends POST with JSON content-type and correct payload', async () => {
    mockFetch.mockReturnValue(jsonResponse({ status: 'SUCCESS', data: {} }))

    await fetchData({
      header: { token: 'abc' },
      route: 'test',
      data: { foo: 'bar' }
    })

    const [, options] = mockFetch.mock.calls[0]!
    expect(options.method).toBe('POST')
    expect(options.headers['Content-Type']).toBe('application/json')
    const body = JSON.parse(options.body)
    expect(body.header.token).toBe('abc')
    expect(body.header.deviceInfo).toBeDefined()
    expect(body.foo).toBe('bar')
  })

  it('throws on HTTP error', async () => {
    mockFetch.mockReturnValue(Promise.resolve({ ok: false, status: 500 }))

    await expect(fetchData({ header, route: 'test' })).rejects.toThrow(
      'Request failed with status 500'
    )
  })

  it('throws on SEP_101 and emits session expired', async () => {
    mockFetch.mockReturnValue(jsonResponse({ errorCode: 'SEP_101' }))

    await expect(fetchData({ header, route: 'test' })).rejects.toThrow(
      'Session expired'
    )
    expect(mockEmitSessionExpired).toHaveBeenCalledOnce()
  })

  it('throws ApiError with errorCode on business failure', async () => {
    mockFetch.mockReturnValue(
      jsonResponse({
        status: 'FAILURE',
        message: 'Not found',
        errorCode: 'NF_404'
      })
    )

    try {
      await fetchData({ header, route: 'test' })
      expect.fail('should have thrown')
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError)
      expect((err as ApiError).message).toBe('Not found')
      expect((err as ApiError).errorCode).toBe('NF_404')
    }
  })

  it('propagates network errors (does not swallow)', async () => {
    mockFetch.mockRejectedValue(new TypeError('Network request failed'))

    await expect(fetchData({ header, route: 'test' })).rejects.toThrow(
      'Network request failed'
    )
  })

  it('uses default empty data when none provided', async () => {
    mockFetch.mockReturnValue(jsonResponse({ status: 'SUCCESS', data: {} }))

    await fetchData({ header, route: 'test' })

    const body = JSON.parse(mockFetch.mock.calls[0]![1].body)
    expect(body.header).toBeDefined()
  })
})
```

**Step 2: Run tests**

Run:

```bash
yarn workspace app test -- data/__tests__/base.test.ts
```

Expected: 8 tests pass.

**Step 3: Commit**

```bash
git add packages/app/data/__tests__/base.test.ts
git commit -m "test: fetchData — success, HTTP error, SEP_101, business failure, network error"
```

---

## Task 10: Write auth API tests

**Files:**

- Create: `packages/app/data/auth/__tests__/auth.test.ts`
- Test: `packages/app/data/auth/api.ts`

**Step 1: Write the tests**

```typescript
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
```

**Step 2: Run tests**

Run:

```bash
yarn workspace app test -- data/auth/__tests__/auth.test.ts
```

Expected: 4 tests pass.

**Step 3: Commit**

```bash
git add packages/app/data/auth/__tests__/auth.test.ts
git commit -m "test: auth API — login, logout, createAccount, forgotPassword"
```

---

## Task 11: Run Full Suite and Verify CI-Ready

**Step 1: Run all tests**

Run:

```bash
yarn workspace app test
```

Expected: ~20 tests pass across 4 test files.

**Step 2: Run lint**

Run:

```bash
yarn workspace next-app lint
```

Expected: No errors.

**Step 3: Run format check**

Run:

```bash
npx prettier --check packages/app/test/ packages/app/data/__tests__/ packages/app/utils/__tests__/ packages/app/data/auth/__tests__/ packages/app/data/base.ts
```

Expected: All files formatted correctly. If not, run `yarn format` and amend.

**Step 4: Commit any formatting fixes if needed, then push**

```bash
git push -u origin chore/gh-102/phase5-testing-foundation
```
