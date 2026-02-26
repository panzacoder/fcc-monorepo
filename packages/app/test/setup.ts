import { vi, beforeEach } from 'vitest'

beforeEach(async () => {
  // @ts-expect-error dynamic import for test mock
  const { _clear } = (await import('expo-secure-store')) as {
    _clear: () => void
  }
  _clear()
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
