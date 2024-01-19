import { View, Text, TouchableOpacity, Pressable } from 'react-native'
import IconButton from './icon-button'
import { Feather } from '@expo/vector-icons'

const tabIconMap = {
  index: 'home',
  circles: 'circle',
  planner: 'calendar',
}
export default function MyTabBar({ state, descriptors, navigation }) {
  return (
    <View className="bg-card">
      <View className="bg-primary mx-16 mb-10 mt-8 flex flex-row  content-center rounded-full px-2 py-4">
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key]
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name

          const isFocused = state.index === index

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            })

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params)
            }
          }

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            })
          }

          const icon = tabIconMap[route.name]
          return (
            icon && (
              <Pressable
                key={route.name}
                className="flex flex-1 flex-row content-center justify-center bg-transparent shadow-none"
                onPress={onPress}
                onLongPress={onLongPress}
              >
                <Feather
                  name={icon}
                  size={32}
                  color={isFocused ? 'white' : 'gray'}
                />
              </Pressable>
            )
          )
        })}
      </View>
    </View>
  )
}
