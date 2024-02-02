import { View } from 'react-native'
import { MotiLink } from 'solito/moti'
import { useRouter } from 'solito/navigation'

import { Typography } from 'app/ui/typography'
import { A, TextLink } from 'app/ui/link'
import { Button } from 'app/ui/button'
import { Row } from 'app/ui/layout'

export function HomeScreen() {
  const router = useRouter()

  return (
    <View className="mt-20 flex-1 items-center justify-center p-3">
      <Typography variant="h1">Family Care Circle</Typography>
      <Typography variant="h2">A single app across web and mobile.</Typography>
      <View className=" max-w-xl">
        <Typography className="my-1">
          Much of the code can be written once in the &quot;package/app&quot;
          folder, and imported into the routes for each platform.
        </Typography>
        <Typography className="my-1">
          These buttons are all currently WIP, showing different ways of
          building components with interactions on mobile and web. The code is
          written once and transpiled to different platforms.{' '}
        </Typography>

        <Typography className="my-1">
          The TextLink component knows to use the proper router (expo or next)
          for in-app navigation using <A href="https://solito.dev/">Solito</A>
        </Typography>

        <Typography className="my-1">
          Similarly, the Button component is using navigation hooks from solito
          to navigate. These concepts of cross-platform rendering and routing
          can be powerful for native & web shared components
        </Typography>
      </View>
      <Row className="items-center gap-8">
        <Button title="Home" onPress={() => router.push('/')} />
        <TextLink href="/circles">Circles</TextLink>
        <MotiLink
          href="/planner"
          animate={({ hovered, pressed }) => {
            'worklet'

            return {
              scale: pressed ? 0.95 : hovered ? 1.1 : 1,
              rotateZ: pressed ? '0deg' : hovered ? '-3deg' : '0deg'
            }
          }}
          transition={{
            type: 'timing',
            duration: 150
          }}
        >
          <Typography selectable={false} className="text-base font-bold">
            Planner
          </Typography>
        </MotiLink>
      </Row>
      <Typography variant="h4" className="mb-1 mt-8">
        Navigation
      </Typography>
      <Typography className="my-1">
        The navigation is only deployed on mobile, using expo router Tabs to
        switch between screens using native navigation, gestures, and caching.
      </Typography>
      <Typography variant="h5" className="my-1">
        Learn more about Navigation here:
      </Typography>
      <A href="https://docs.expo.dev/router/layouts/">Expo Layouts</A>
      <A href="https://docs.expo.dev/router/advanced/tabs/">Expo Tabs</A>
    </View>
  )
}
