import { Tabs } from 'expo-router/tabs'

import MyTabBar from 'app/ui/tab-bar'
import { TabsHeader } from 'app/ui/tabs-header'
import { useSafeArea } from 'app/provider/safe-area/use-safe-area'

export default function Root() {
  const insets = useSafeArea()
  return (
    <Tabs
      tabBar={MyTabBar}
      screenOptions={{
        header: (props) => <TabsHeader {...props} insets={insets} />,
        tabBarShowLabel: false
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="circles" options={{ title: 'Circles' }} />
      <Tabs.Screen name="planner" options={{ title: 'Planner' }} />
    </Tabs>
  )
}
