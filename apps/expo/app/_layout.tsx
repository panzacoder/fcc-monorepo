import { Provider } from 'app/provider'
import { Tabs } from 'expo-router/tabs'
import Feather from '@expo/vector-icons/Feather'
import '../../../global.css'

export default function Root() {
  return (
    <Provider>
      <Tabs screenOptions={{ headerShown: false }}>
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
