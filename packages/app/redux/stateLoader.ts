const STORE_NAME = '_appdata_store'

export class StateLoader {
  async loadState(): Promise<Record<string, unknown>> {
    try {
      const serializedState = localStorage.getItem(STORE_NAME)
      if (serializedState === null) {
        return this.initializeState()
      }
      return JSON.parse(serializedState)
    } catch (err) {
      return this.initializeState()
    }
  }

  async saveState(state: Record<string, unknown>): Promise<void> {
    try {
      const serializedState = JSON.stringify(state)
      localStorage.setItem(STORE_NAME, serializedState)
    } catch (err) {
      // Silently fail — localStorage may be full or unavailable
    }
  }

  initializeState(): Record<string, unknown> {
    return {}
  }
}

export default StateLoader
