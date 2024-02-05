import { View, Pressable } from 'react-native'
import { Tabs } from 'expo-router/tabs'
import Feather from './icons/feather'
import { ComponentProps } from 'react'
import { cn } from './utils'

const tabIconMap = {
  index: 'home',
  circles: 'circle',
  planner: 'calendar'
}

const MyTabBar: ComponentProps<typeof Tabs>['tabBar'] = ({
  state,
  navigation
}) => {
  return (
    <View className="bg-muted">
      <View className="bg-card mx-16 mb-10 mt-8 flex flex-row content-center rounded-full p-2 shadow-md">
        {state.routes.map((route, index: number) => {
          const isFocused = state.index === index

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true
            })

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params)
            }
          }

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key
            })
          }

          const icon = tabIconMap[route.name]
          return (
            icon && (
              <Pressable
                key={route.name}
                className={
                  'flex flex-1 flex-row content-center justify-center shadow-none'
                }
                onPress={onPress}
                onLongPress={onLongPress}
              >
                <View
                  className={cn(
                    isFocused ? 'border-primary border-b-2' : '',
                    'py-1'
                  )}
                >
                  <Feather
                    name={icon}
                    size={32}
                    className={isFocused ? 'text-primary ' : 'text-gray-400'}
                  />
                </View>
              </Pressable>
            )
          )
        })}
      </View>
    </View>
  )
}

export default MyTabBar
