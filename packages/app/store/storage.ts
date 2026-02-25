import type { StateStorage } from 'zustand/middleware'

const webStorage: StateStorage = {
  getItem: (name) => localStorage.getItem(name),
  setItem: (name, value) => localStorage.setItem(name, value),
  removeItem: (name) => localStorage.removeItem(name)
}

export function getStorage(): StateStorage {
  return webStorage
}
