import { useEffect, useState } from 'react'
import { useStore } from 'app/store'

export function HydrationGate({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const unsub = useStore.persist.onFinishHydration(() => {
      setHydrated(true)
    })

    if (useStore.persist.hasHydrated()) {
      setHydrated(true)
    }

    return unsub
  }, [])

  if (!hydrated) {
    return null
  }

  return <>{children}</>
}
