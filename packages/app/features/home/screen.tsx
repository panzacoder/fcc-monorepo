import { Typography, A, TextLink } from 'app/design/typography'
import { Row } from 'app/design/layout'
import { View } from 'react-native'

import { MotiLink } from 'solito/moti'
import Button from 'app/design/button'
import { useRouter } from 'solito/navigation'

export function HomeScreen() {
  const router = useRouter()

  return (
    <View className="flex-1 items-center justify-center p-3">
      <Typography variant="h1">Welcome to Solito.</Typography>
      <Typography variant="h2">
        It does a good job of translating text types to Native and Web.
      </Typography>
      <View className="max-w-xl">
        <Typography className="text-center">
          Here is a basic starter to show you how you can navigate from one
          screen to another. This screen uses the same code on Next.js and React
          Native.
        </Typography>
        <Typography className="text-center">
          Solito is made by{' '}
          <A
            href="https://twitter.com/fernandotherojo"
            hrefAttrs={{
              target: '_blank',
              rel: 'noreferrer',
            }}
          >
            Fernando Rojo
          </A>
          .
        </Typography>
        <Typography className="text-center">
          NativeWind is made by{' '}
          <A
            href="https://twitter.com/mark__lawlor"
            hrefAttrs={{
              target: '_blank',
              rel: 'noreferrer',
            }}
          >
            Mark Lawlor
          </A>
          .
        </Typography>
      </View>
      <View className="h-[32px]" />
      <Row className="items-center gap-8">
        <Button title="Home" onPress={() => router.push('/example')} />
        <TextLink href="/user/fernando">Regular Link</TextLink>
        <MotiLink
          href="/user/fernando"
          animate={({ hovered, pressed }) => {
            'worklet'

            return {
              scale: pressed ? 0.95 : hovered ? 1.1 : 1,
              rotateZ: pressed ? '0deg' : hovered ? '-3deg' : '0deg',
            }
          }}
          transition={{
            type: 'timing',
            duration: 150,
          }}
        >
          <Typography selectable={false} className="text-base font-bold">
            Moti Link
          </Typography>
        </MotiLink>
      </Row>
    </View>
  )
}
