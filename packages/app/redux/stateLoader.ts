import type rootReducer from './rootReducer'

type AppState = ReturnType<typeof rootReducer>

const STORE_NAME = '_appdata_store'

export class StateLoader {
  async loadState(): Promise<Partial<AppState>> {
    try {
      const serializedState = localStorage.getItem(STORE_NAME)
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
      localStorage.setItem(STORE_NAME, serializedState)
    } catch (err: unknown) {
      // Silently fail — localStorage may be full or unavailable
    }
  }

  initializeState(): Partial<AppState> {
    return {}
  }
}

export default StateLoader
