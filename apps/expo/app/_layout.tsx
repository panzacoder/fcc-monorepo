import 'app/design/tailwind/global.css'
import { Slot } from 'expo-router'
import { LogBox } from 'react-native'

import { Provider } from 'app/provider'

// TODO: figure out why we get a soft warning about Reanimated. Likely to do with nativewind v4
// I have double checked that the same Reanimated version is being used in expo sdk v50 and my own code.
LogBox.ignoreLogs(['[Reanimated]'])

export default function Root() {
  return (
    <Provider>
      <Slot />
    </Provider>
  )
}
