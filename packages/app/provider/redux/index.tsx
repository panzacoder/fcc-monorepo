import React, { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import store, { hydrateStore } from 'app/redux/store'

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    hydrateStore().then(() => {
      setHydrated(true)
    })
  }, [])

  if (!hydrated) {
    return null
  }

  return <Provider store={store}>{children}</Provider>
}
