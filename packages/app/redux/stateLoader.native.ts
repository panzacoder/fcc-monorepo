import AsyncStorage from '@react-native-async-storage/async-storage'
import type rootReducer from './rootReducer'

type AppState = ReturnType<typeof rootReducer>

const STORE_NAME = '_appdata_store'

export class StateLoader {
  async loadState(): Promise<Partial<AppState>> {
    try {
      const serializedState = await AsyncStorage.getItem(STORE_NAME)
      if (serializedState === null) {
        return this.initializeState()
      }
      return JSON.parse(serializedState) as Partial<AppState>
    } catch (err: unknown) {
      return this.initializeState()
    }
  }

  async saveState(state: AppState): Promise<void> {
    try {
      const serializedState = JSON.stringify(state)
      await AsyncStorage.setItem(STORE_NAME, serializedState)
    } catch (err: unknown) {
      // Silently fail — AsyncStorage may be unavailable
    }
  }

  initializeState(): Partial<AppState> {
    return {}
  }
}

export default StateLoader
