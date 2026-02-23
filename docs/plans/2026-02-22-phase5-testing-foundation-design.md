# Phase 5: Testing Foundation — Design

**GH Issue**: [#102](https://github.com/panzacoder/fcc-monorepo/issues/102)
**Branch**: `chore/gh-102/phase5-testing-foundation`
**Date**: 2026-02-22

---

## Overview

Test infrastructure and initial coverage for critical paths. The codebase currently has zero tests. This phase establishes the test runner, mocking strategy, test utilities, and 5 priority test files covering the data/transport layer.

Includes a prerequisite refactor (Task 0) to unify `fetchData` and eliminate `CallPostService` before writing tests, so tests verify correct behavior rather than encoding bugs.

---

## Task 0: Unify fetchData & Eliminate CallPostService

### Problem

The current two-function call chain (`fetchData` -> `CallPostService`) has a critical error-handling bug: `fetchData` silently swallows all transport errors in its `.catch()`, returning `undefined`. This means TanStack Query's `isError`, `retry`, and error boundaries never fire for transport errors. Additionally, there is triple `Alert.alert` (CallPostService, fetchData, and QueryClient config) and the HTTP status switch in CallPostService is dead code.

### Changes

| File                                      | Action                                                                                                                                                                  |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/app/utils/fetchServerData.ts`   | **Delete** — `CallPostService` and `CallPostServiceResponse` removed                                                                                                    |
| `packages/app/data/base.ts`               | **Rewrite** — call `fetch` directly, throw on error (`Promise<T>` not `Promise<T \| void>`), absorb SEP_101 session expiry check, remove `onFailure`/`FetchDataOptions` |
| `packages/app/data/auth/api.ts`           | Remove `options`/`onFailure` passthrough from `login()`                                                                                                                 |
| `packages/app/features/splash/screen.tsx` | Adapt login error handling to TanStack Query `onError`                                                                                                                  |
| All 16 domain `api.ts` files              | **Unchanged** — they call `fetchData` which keeps the same core signature                                                                                               |

### What this does NOT change

- `AuthHeader = any` stays (Phase 6)
- `Record<string, unknown>` param types stay (Phase 6)
- `if (data)` guards in screens stay (removing them requires the `Promise<T>` return type to propagate, Phase 6)

---

## Tooling & Configuration

### Test Runner

**Vitest** — ESM-native, matches `"type": "module"` in `packages/app/package.json`.

### Config: `packages/app/vitest.config.ts`

- `environment: 'jsdom'` — simulates browser/RN globals
- `setupFiles: ['./test/setup.ts']` — global mocks
- `resolve.alias: { 'app/': './' }` — matches the `app/` import alias
- `globals: true` — no need to import `describe`/`it`/`expect`
- `restoreMocks: true` — auto-reset `vi.fn()` between tests

### Rendering

`@testing-library/react-native` installed and configured for future component tests. Not used by the 5 priority test files.

### Dependencies (all devDependencies in `packages/app`)

- `vitest`
- `@testing-library/react-native`
- `@testing-library/jest-dom`
- `jsdom`

---

## Mock Strategy: `packages/app/test/setup.ts`

### Global mocks (all tests)

| Module                             | Mock                                                                                                |
| ---------------------------------- | --------------------------------------------------------------------------------------------------- |
| `expo-secure-store`                | In-memory `Map<string, string>`, cleared via `beforeEach`                                           |
| `expo-router`                      | `useRouter()` returns `{ push, replace, back }` as `vi.fn()`. `useLocalSearchParams()` returns `{}` |
| `@react-native-firebase/messaging` | Default export returns `{ getInitialNotification: vi.fn(), onNotificationOpenedApp: vi.fn() }`      |
| `react-native`                     | Partial mock: override `Alert.alert` as `vi.fn()`, keep everything else                             |

### Per-test mocks (not global)

| Module             | Approach                                                                                  |
| ------------------ | ----------------------------------------------------------------------------------------- |
| `fetch`            | `vi.spyOn(globalThis, 'fetch')` per test — different tests need different response shapes |
| `app/utils/device` | `getUserDeviceInformation` mocked inline where needed                                     |

---

## Test Utilities: `packages/app/test/test-utils.tsx`

### Exports

- `createTestQueryClient()` — `QueryClient` with `retry: false`, minimal `staleTime`, error-swallowing disabled
- `ReduxTestProvider` — wraps children in Redux `<Provider>` with fresh store (accepts optional preloaded state)
- `renderWithProviders(ui, options?)` — always wraps with QueryClient; defaults `wrapper` to `ReduxTestProvider` but accepts any component via the `wrapper` option (pluggable for Zustand migration in Phase 8C)
- Re-exports everything from `@testing-library/react-native`

### Convention

Tests import from `app/test/test-utils` instead of `@testing-library/react-native` directly. One seam to control all provider wiring.

### Zustand migration path

When Phase 8C replaces Redux with Zustand, change the default `wrapper` from `ReduxTestProvider` to `ZustandTestProvider` — one line. Tests that pass a custom `wrapper` are unaffected.

---

## Priority Test Files

### 1. `packages/app/utils/__tests__/secure-storage.test.ts`

Tests the `.native.ts` variant (expo-secure-store mock).

| Case               | Description                                                           |
| ------------------ | --------------------------------------------------------------------- |
| Store and retrieve | `storeCredentials` -> `getCredentials` returns correct email/password |
| Get when empty     | `getCredentials` returns `null` when nothing stored                   |
| Clear removes      | `clearCredentials` -> `getCredentials` returns `null`                 |
| Corrupted JSON     | `getCredentials` returns `null` on parse error                        |

### 2. `packages/app/utils/__tests__/auth-events.test.ts`

Tests the pub/sub event emitter.

| Case                 | Description                                               |
| -------------------- | --------------------------------------------------------- |
| Subscriber fires     | `onSessionExpired` handler called on `emitSessionExpired` |
| Multiple subscribers | All registered handlers fire                              |
| Unsubscribe          | Returned cleanup function stops delivery                  |
| No subscribers       | `emitSessionExpired` with no listeners is a no-op         |

### 3. `packages/app/utils/__tests__/fetchServerData.test.ts`

Tests the unified `fetchData` (post-Task 0) against mocked `fetch`.

| Case             | Description                                                    |
| ---------------- | -------------------------------------------------------------- |
| Success          | Returns typed data from `{ status: 'SUCCESS', data }` envelope |
| HTTP error       | Throws on `!response.ok` (400, 401, 403, 500)                  |
| SEP_101          | Calls `emitSessionExpired()` and throws                        |
| Business failure | Throws with server message on `{ status: 'FAILURE', message }` |
| Network error    | `fetch` rejects -> error propagates (not swallowed)            |
| URL construction | Constructs correct URL from `BASE_URL` + route                 |
| Device info      | Injects device info into payload header                        |
| Auth header      | Merges auth header into payload                                |

### 4. `packages/app/data/__tests__/base.test.ts`

If Task 0 unifies everything into `base.ts`, this file may merge with #3. If `fetchData` remains a thin wrapper, tests verify the wrapper layer specifically. Decision made during implementation.

### 5. `packages/app/data/auth/__tests__/auth.test.ts`

Tests auth API functions against a mocked `fetchData`.

| Case            | Description                                         |
| --------------- | --------------------------------------------------- |
| Login           | Passes correct URL constant + params to `fetchData` |
| Logout          | Passes correct URL constant + params                |
| Create account  | Passes correct URL constant + params                |
| Forgot password | Passes correct URL constant + params                |

Lightweight — these are thin wrappers. Verifying correct argument forwarding, not deep logic.

**Total**: ~25 test cases across 4-5 files.

---

## CI Integration

### Scripts (`packages/app/package.json`)

- `"test": "vitest run"` — single run for CI
- `"test:watch": "vitest"` — watch mode for local dev

### Turbo (`turbo.json`)

Add `"test": {}` pipeline (no dependencies, parallel with lint/typecheck).

### GitHub Actions (`.github/workflows/ci.yml`)

New `test` job — same setup as existing jobs (checkout, Node 24, yarn install), runs `yarn turbo run test`. Parallel with lint, typecheck, format, build. No EAS/Expo build CI (that's Phase 8A).
