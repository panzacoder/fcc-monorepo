'use client'

import { AccentButton } from 'app/ui/accent-button'
import { View, Text } from 'react-native'
import { Typography } from 'app/ui/typography'
import { useRouter } from 'solito/navigation'
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue
// } from 'app/ui/select'
// // import { useSafeAreaInsets } from 'react-native-safe-area-context'

export function SplashScreen() {
  const router = useRouter()
  // const insets = useSafeAreaInsets()
  // const contentInsets = {
  //   top: 12,
  //   bottom: 12,
  //   left: 12,
  //   right: 12
  // }
  return (
    <View className="native:pt-60 web:pt-40 flex h-full w-full flex-1 px-4 md:justify-center md:pt-0">
      <Typography
        variant="h2"
        as="h1"
        className="text-center font-bold text-white"
      >
        Caregiving can be <Text className="italic">heavy</Text>.
        {"\n\nLet's lighten the load."}
      </Typography>
      {/* <Select defaultValue={{ value: 'apple', label: 'Apple' }}> */}
      {/*   <SelectTrigger className="w-[250px]"> */}
      {/*     <SelectValue */}
      {/*       className="text-foreground native:text-lg text-sm" */}
      {/*       placeholder="Select a fruit" */}
      {/*     /> */}
      {/*   </SelectTrigger> */}
      {/*   <SelectContent insets={contentInsets} className="w-[250px]"> */}
      {/*     <SelectGroup> */}
      {/*       <SelectLabel>Fruits</SelectLabel> */}
      {/*       <SelectItem label="Apple" value="apple"> */}
      {/*         Apple */}
      {/*       </SelectItem> */}
      {/*       <SelectItem label="Banana" value="banana"> */}
      {/*         Banana */}
      {/*       </SelectItem> */}
      {/*       <SelectItem label="Blueberry" value="blueberry"> */}
      {/*         Blueberry */}
      {/*       </SelectItem> */}
      {/*       <SelectItem label="Grapes" value="grapes"> */}
      {/*         Grapes */}
      {/*       </SelectItem> */}
      {/*       <SelectItem label="Pineapple" value="pineapple"> */}
      {/*         Pineapple */}
      {/*       </SelectItem> */}
      {/*     </SelectGroup> */}
      {/*   </SelectContent> */}
      {/* </Select> */}
      <View className="absolute bottom-20 right-4 flex flex-col items-end gap-4 ">
        <AccentButton title="Log in" onPress={() => router.push('/login')} />
        <AccentButton title="Sign up" onPress={() => router.push('/sign-up')} />
      </View>
    </View>
  )
}
