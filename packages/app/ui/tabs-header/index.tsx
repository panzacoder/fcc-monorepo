import { Pressable, View } from 'react-native'
import store from 'app/redux/store'
import PtsNameInitials from '../PtsNameInitials'
import { Feather } from '../icons'

export type TabsHeaderProps = {
  navigation: any
  route: any
  options: any
  back?: {
    title: string
    onPress: () => void
  }
}

export function TabsHeader() {
  const user = store.getState().userProfileState.header
  return (
    <View className="absolute top-0 w-full flex-row justify-end gap-2">
      <PtsNameInitials className="" fullName={user.memberName} />
      <Pressable className="bg-accent rounded-full p-2" onPress={() => { }}>
        <Feather name={'menu'} size={25} className="color-accent-foreground" />
      </Pressable>
    </View>
  )
}
