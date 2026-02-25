import 'app/config/tailwind/global.css'
import { Slot } from 'expo-router'

import { Provider } from 'app/provider'
import { useEffect } from 'react'
import { fetchStaticData } from 'app/data/static'
import { useAppSelector } from 'app/redux/hooks'

function RootInner() {
  const header = useAppSelector((state) => state.headerState.header)
  useEffect(() => {
    fetchStaticData(header)
  }, [header])
  return <Slot />
}

export default function Root() {
  return (
    <Provider>
      <RootInner />
    </Provider>
  )
}
