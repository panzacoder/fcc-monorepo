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
