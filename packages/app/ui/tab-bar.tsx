import { View, Text, TouchableOpacity } from 'react-native'
import IconButton from './icon-button'
import Button from './button'

const tabIconMap = {
  index: 'home',
  circles: 'circle',
  planner: 'calendar',
}
export default function MyTabBar({ state, descriptors, navigation }) {
  return (
    <View className="bg-card">
      <View className="bg-primary mx-12 mb-10 mt-8 flex flex-row flex-nowrap rounded-full p-2">
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

          return (
            tabIconMap[route.name] && (
              <Button
                key={route.name}
                onPress={onPress}
                onLongPress={onLongPress}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={label}
              // icon={tabIconMap[route.name]}
              // iconSize={24}
              // color={isFocused ? 'white' : 'gray'}
              />
            )
          )
        })}
      </View>
    </View>
  )
}
