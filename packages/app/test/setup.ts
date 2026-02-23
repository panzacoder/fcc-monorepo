import { vi, beforeEach } from 'vitest'

beforeEach(async () => {
  const { _clear } = (await import('expo-secure-store')) as any
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
