import 'app/config/tailwind/global.css'
import { Slot } from 'expo-router'

import { Provider } from 'app/provider'

export default function Root() {
  return (
    <Provider>
      <Slot />
    </Provider>
  )
}
