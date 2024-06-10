import { Pressable, View } from 'react-native'
import store from 'app/redux/store'
import PtsNameInitials from '../PtsNameInitials'
import { Feather } from '../icons'
import { EdgeInsets } from 'react-native-safe-area-context'
import { Typography } from '../typography'

export type TabsHeaderProps = {
  insets: EdgeInsets
  navigation: any
  route: any
  options: any
  back?: {
    title: string
    onPress: () => void
  }
}

export function TabsHeader({
  insets,
  back,
  options,
  navigation
}: TabsHeaderProps) {
  const user = store.getState().userProfileState.header
  return (
    <View
      className={`bg-muted top-0 flex w-full flex-row flex-wrap justify-end  pb-4`}
    >
      <View
        className={`w-1/4 flex-1 flex-row justify-end gap-2 pr-4`}
        style={{ marginTop: insets.top }}
      >
        <View className="w-3/4 flex-row items-center gap-2 pl-2 pt-2">
          {back && (
            <Pressable className="" onPress={navigation.goBack}>
              <Feather name={'arrow-left'} size={25} color={'black'} />
            </Pressable>
          )}
          <Typography variant="h3" className="text-center text-black">
            {options.title}
          </Typography>
        </View>

        <PtsNameInitials className="" fullName={user.memberName} />
        <Pressable className="bg-accent rounded-full p-2" onPress={() => {}}>
          <Feather
            name={'menu'}
            size={20}
            className="color-accent-foreground"
          />
        </Pressable>
      </View>
    </View>
  )
}
