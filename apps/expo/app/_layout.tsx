import { Provider } from 'app/provider'
import { Stack } from 'expo-router'
import '../../../global.css'

export default function Root() {
  return (
    <Provider>
      <Stack />
    </Provider>
  )
}
