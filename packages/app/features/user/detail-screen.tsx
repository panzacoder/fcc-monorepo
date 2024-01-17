import { createParam } from 'solito'
import { TextLink } from 'solito/link'
import { View } from 'react-native'
import { Typography } from 'app/design/typography'

const { useParam } = createParam<{ id: string }>()

export function UserDetailScreen() {
  const [id] = useParam('id')

  return (
    <View className="flex-1 items-center justify-center">
      <Typography className="mb-4 text-center font-bold">{`User ID: ${id}`}</Typography>
      <TextLink href="/">👈 Go Home</TextLink>
    </View>
  )
}
