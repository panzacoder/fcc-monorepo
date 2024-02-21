import { Pressable, View } from 'react-native'
import { Typography } from '../typography'
import { Feather } from '../icons'

export type StackHeaderProps = {
  navigation: any
  route: any
  options: any
  back?: {
    title: string
    onPress: () => void
  }
}

export function StackHeader({ navigation, options, back }: StackHeaderProps) {
  return (
    <View className="flex-row items-end pl-2 pt-2">
      {back && (
        <Pressable className="self-center" onPress={navigation.goBack}>
          <Feather name={'arrow-left'} size={25} color={'black'} />
        </Pressable>
      )}
      <Typography variant="h3" className="text-center text-black">
        {options.title}
      </Typography>
    </View>
  )
}
