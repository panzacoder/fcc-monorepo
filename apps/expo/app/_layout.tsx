import 'app/config/tailwind/global.css'
import { Slot } from 'expo-router'

import { Provider } from 'app/provider'
import { useEffect } from 'react'
import { fetchStaticData } from 'app/data/static'
import { useAppSelector, useAppDispatch } from 'app/redux/hooks'

function RootInner() {
  const header = useAppSelector((state) => state.headerState.header)
  const dispatch = useAppDispatch()
  useEffect(() => {
    fetchStaticData(header, dispatch)
  }, [header, dispatch])
  return <Slot />
}

export default function Root() {
  return (
    <Provider>
      <RootInner />
    </Provider>
  )
}
