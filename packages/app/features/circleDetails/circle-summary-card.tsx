import PtsNameInitials from 'app/ui/PtsNameInitials'
import { Button } from 'app/ui/button'
import { Feather } from 'app/ui/icons'
import { Typography } from 'app/ui/typography'
import { LinearGradient } from 'expo-linear-gradient'
import { useState } from 'react'
import { Pressable, View } from 'react-native'
import { TodayCard } from './today-card'
import { cssInterop } from 'nativewind'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'solito/navigation'

cssInterop(LinearGradient, {
  className: { target: 'style' }
})
export function CircleSummaryCard({ memberData, userDetails }) {
  const router = useRouter()
  const [isSeeMore, setSeeMore] = useState(true)

  const fullName = userDetails.firstName + ' ' + userDetails.lastName

  function buttonPressed() {}
  return (
    <LinearGradient
      colors={['#103264', '#113263', '#319D9D']}
      end={{ x: 0.3, y: 0 }}
      start={{ x: 0.65, y: 0.4 }}
      className="w-full gap-5 self-center rounded-2xl border border-[#3DC4C4] py-4"
    >
      <View className="mx-4 flex-row justify-between">
        <View className="flex-row items-center gap-3">
          <PtsNameInitials fullName={fullName} />
          <Typography className="text-center text-xl font-bold text-white">
            {fullName}
          </Typography>
        </View>
        <Pressable className="" onPress={() => {}}>
          <Feather name={'menu'} size={20} color={'#5ACC6C'} />
        </Pressable>
      </View>
      <TodayCard memberData={memberData} userDetails={userDetails} />
      <View className="mx-2 items-center gap-2">
        <View className="flex-row items-center gap-2">
          <Pressable
            className="flex-row gap-2"
            onPress={() => {
              setSeeMore(!isSeeMore)
            }}
          >
            <Feather
              name={isSeeMore ? 'chevron-up' : 'chevron-down'}
              size={25}
              color={'#5ACC6C'}
            />
            <Typography className="text-white">
              {isSeeMore ? 'See less' : 'See more'}
            </Typography>
          </Pressable>
          <View className="bg-accent-foreground h-[1] flex-1" />
        </View>
        {isSeeMore ? (
          <View>
            <View className="mt-5 flex-row self-center">
              <Button
                className="px-3"
                title="Caregivers"
                leadingIcon="arrow-right"
                onPress={() => {
                  // router.push(
                  //   formatUrl('/circles/caregivers', {
                  //     memberData: JSON.stringify(memberData)
                  //   })
                  // )
                }}
              />
              <Button
                className="ml-2 px-3"
                title="Doctors"
                leadingIcon="arrow-right"
                onPress={() => {
                  router.push(
                    formatUrl('/circles/doctors', {
                      memberData: JSON.stringify(memberData)
                    })
                  )
                }}
              />
              <Button
                className="ml-2 px-3"
                title="Facilities"
                leadingIcon="home"
                onPress={() => {
                  router.push(
                    formatUrl('/circles/facilities', {
                      memberData: JSON.stringify(memberData)
                    })
                  )
                }}
              />
            </View>

            <View className="mt-5 flex-row self-center">
              <Button
                className="px-3"
                title="Prescriptions"
                leadingIcon="arrow-right"
                onPress={buttonPressed}
              />
              <Button
                className="ml-2 px-3"
                title="Medical Devices"
                leadingIcon="watch"
                onPress={buttonPressed}
              />
            </View>
          </View>
        ) : (
          <View />
        )}
      </View>
    </LinearGradient>
  )
}
