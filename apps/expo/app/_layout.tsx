import 'app/config/tailwind/global.css'
import { Slot } from 'expo-router'

import { Provider } from 'app/provider'
import { useEffect } from 'react'
import { fetchStaticData } from 'app/data/static'

export default function Root() {
  useEffect(() => {
    fetchStaticData()
  }, [])
  return (
    <Provider>
      <Slot />
    </Provider>
  )
}
