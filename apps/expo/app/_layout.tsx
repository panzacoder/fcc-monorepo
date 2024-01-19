import 'app/design/tailwind/global.css'
import { Tabs } from 'expo-router/tabs'
import Feather from '@expo/vector-icons/Feather'
import { LogBox } from 'react-native'
// import { remapProps } from 'nativewind'

import { Provider } from 'app/provider'
import MyTabBar from 'app/ui/tab-bar'

// TODO: figure out why we get a soft warning about Reanimated. Likely to do with nativewind v4
// I have double checked that the same Reanimated version is being used in expo sdk v50 and my own code.
LogBox.ignoreLogs(['[Reanimated]'])

export default function Root() {
  return (
    <Provider>
      <Tabs
        // tabBar={MyTabBar}
        screenOptions={{ headerShown: false, tabBarShowLabel: false }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Feather name="home" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="circles"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Feather name="circle" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="planner"
          options={{
            tabBarIcon: ({ color, size }) => (
              <Feather name="calendar" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </Provider>
  )
}
