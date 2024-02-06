import { Tabs } from 'expo-router/tabs'

import MyTabBar from 'app/ui/tab-bar'

// TODO: figure out why we get a soft warning about Reanimated. Likely to do with nativewind v4
// I have double checked that the same Reanimated version is being used in expo sdk v50 and my own code.

export default function Root() {
  return (
    <Tabs
      tabBar={MyTabBar}
      screenOptions={{ headerShown: false, tabBarShowLabel: false }}
    >
      <Tabs.Screen
        name="home"
        // options={{
        //   tabBarIcon: ({ color, size }) => (
        //     <Feather name="home" size={size} color={color} />
        //   ),
        // }}
      />
      <Tabs.Screen
        name="circles"
        // options={{
        //   tabBarIcon: ({ color, size }) => (
        //     <Feather name="circle" size={size} color={color} />
        //   ),
        // }}
      />
      <Tabs.Screen
        name="planner"
        // options={{
        //   tabBarIcon: ({ color, size }) => (
        //     <Feather name="calendar" size={size} color={color} />
        //   ),
        // }}
      />
    </Tabs>
  )
}
