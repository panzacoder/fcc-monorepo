import { View, Pressable } from 'react-native';
import { Tabs } from 'expo-router/tabs';
// import Feather from 'app/ui/icons/feather'
import { Feather } from '@expo/vector-icons';
import { ComponentProps } from 'react';

const tabIconMap = {
  index: 'home',
  circles: 'circle',
  planner: 'calendar',
};
const MyTabBar: ComponentProps<typeof Tabs>['tabBar'] = ({
  state,
  navigation,
}) => {
  return (
    // <View className="bg-card">
    //   <View className="bg-primary mx-16 mb-10 mt-8 flex flex-row  content-center rounded-full px-2 py-4">
    //     {state.routes.map((route, index: number) => {
    //       const isFocused = state.index === index

    //       const onPress = () => {
    //         const event = navigation.emit({
    //           type: 'tabPress',
    //           target: route.key,
    //           canPreventDefault: true,
    //         })

    //         if (!isFocused && !event.defaultPrevented) {
    //           navigation.navigate(route.name, route.params)
    //         }
    //       }

    //       const onLongPress = () => {
    //         navigation.emit({
    //           type: 'tabLongPress',
    //           target: route.key,
    //         })
    //       }

    //       const icon = tabIconMap[route.name]
    //       return (
    //         icon && (
    //           <Pressable
    //             key={route.name}
    //             className="flex flex-1 flex-row content-center justify-center shadow-none"
    //             onPress={onPress}
    //             onLongPress={onLongPress}
    //           >
    //             <Feather name={icon} size={32} color="white" />
    //           </Pressable>
    //         )
    //       )
    //     })}
    //   </View>
    // </View>
    <View />
  );
};

export default MyTabBar;
