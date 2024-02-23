import { Tabs } from 'expo-router/tabs'

import MyTabBar from 'app/ui/tab-bar'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TabsHeader } from 'app/ui/tabs-header'

export default function Root() {
  return (
    <>
      <View className="bg-muted flex h-screen w-screen">
        <SafeAreaView className="flex h-full w-full basis-full bg-transparent">
          <View className="bg-background flex flex-1 px-4">
            <View className="bg-muted absolute -top-[18%] h-[35%] w-[120%] self-center rounded-b-full" />
            <Tabs
              tabBar={MyTabBar}
              sceneContainerStyle={{
                backgroundColor: 'transparent'
              }}
              screenOptions={{
                header: TabsHeader,
                tabBarShowLabel: false
              }}
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
          </View>
        </SafeAreaView>
      </View>
    </>
  )
}
