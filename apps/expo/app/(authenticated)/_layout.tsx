import { Tabs } from 'expo-router/tabs'

import MyTabBar from 'app/ui/tab-bar'

export default function Root() {
  return (
    <Tabs
      tabBar={MyTabBar}
      screenOptions={{ headerShown: false, tabBarShowLabel: false }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="circles" />
      <Tabs.Screen name="planner" />
    </Tabs>
  )
}
