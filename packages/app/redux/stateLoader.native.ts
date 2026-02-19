import AsyncStorage from '@react-native-async-storage/async-storage'

const STORE_NAME = '_appdata_store'

export class StateLoader {
  async loadState() {
    try {
      const serializedState = await AsyncStorage.getItem(STORE_NAME)
      if (serializedState === null) {
        return this.initializeState()
      }
      return JSON.parse(serializedState)
    } catch (err) {
      return this.initializeState()
    }
  }

  async saveState(state: Record<string, unknown>) {
    try {
      const serializedState = JSON.stringify(state)
      await AsyncStorage.setItem(STORE_NAME, serializedState)
    } catch (err) {
      // Silently fail — AsyncStorage may be unavailable
    }
  }

  initializeState() {
    return {}
  }
}

export default StateLoader
