import { View } from 'react-native'
import { Typography } from '../typography'
import { Divider } from '../divider'
import { ScrollView } from '../scroll-view'

export function ModalScreen({ children, title }) {
  return (
    <View className="flex h-full items-center">
      <Typography
        variant="h1"
        className="bg-accent text-accent-foreground w-full py-4 text-center"
      >
        {title}
      </Typography>
      <Divider className="bg-accent-foreground" />
      <ScrollView
        automaticallyAdjustKeyboardInsets={true}
        contentInsetAdjustmentBehavior="automatic"
        className="w-full bg-white p-4"
      >
        <View className="flex items-start gap-4">{children}</View>
      </ScrollView>
    </View>
  )
}
