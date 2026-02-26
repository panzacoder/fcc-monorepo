import AsyncStorage from '@react-native-async-storage/async-storage'
import type { StateStorage } from 'zustand/middleware'

const nativeStorage: StateStorage = {
  getItem: (name) => AsyncStorage.getItem(name),
  setItem: (name, value) => AsyncStorage.setItem(name, value),
  removeItem: (name) => AsyncStorage.removeItem(name)
}

export function getStorage(): StateStorage {
  return nativeStorage
}
