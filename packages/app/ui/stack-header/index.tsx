import { Pressable, View } from 'react-native'
import { Typography } from '../typography'
import { Feather } from '../icons'

export type StackHeaderProps = {
  navigation: any
  route: any
  options: any
  back?: {
    title: string
  }
}

export function StackHeader({ navigation, options, back }: StackHeaderProps) {
  return (
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
  )
}
