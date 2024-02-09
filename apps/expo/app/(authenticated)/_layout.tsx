import { Drawer } from 'expo-router/drawer'
export default function Root() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerPosition: 'right',
      }}
    ></Drawer>
  )
}
