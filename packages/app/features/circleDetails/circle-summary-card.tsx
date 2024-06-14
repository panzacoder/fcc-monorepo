import PtsNameInitials from 'app/ui/PtsNameInitials'
import { Button } from 'app/ui/button'
import { Feather } from 'app/ui/icons'
import { Typography } from 'app/ui/typography'
import { LinearGradient } from 'expo-linear-gradient'
import { useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { TodayCard } from './today-card'
import { cssInterop } from 'nativewind'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'expo-router'

cssInterop(LinearGradient, {
  className: { target: 'style' }
})
export function CircleSummaryCard({ memberData, userDetails }) {
  const router = useRouter()
  const [isSeeMore, setSeeMore] = useState(true)

  const fullName =
    memberData.firstname.trim() + ' ' + memberData.lastname.trim()

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
        <TouchableOpacity
          className=""
          onPress={() => {
            router.push(
              formatUrl('/memberProfile', {
                memberData: JSON.stringify(memberData),
                userDetails: JSON.stringify(userDetails)
              })
            )
          }}
        >
          <Feather name={'settings'} size={20} color={'white'} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => {
          router.push(
            formatUrl('/circles/calendar', {
              memberData: JSON.stringify(memberData)
            })
          )
        }}
      >
        <TodayCard memberData={memberData} userDetails={userDetails} />
      </TouchableOpacity>

      <View className="mx-2 items-center gap-2">
        <View className="flex-row items-center gap-2">
          <TouchableOpacity
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
          </TouchableOpacity>
          <View className="bg-accent-foreground h-[1] flex-1" />
        </View>
        {isSeeMore ? (
          <View>
            <View className="mt-5 flex-row self-center">
              <Button
                className="px-3"
                title="Caregivers"
                leadingIcon="pocket"
                onPress={() => {
                  router.push(
                    formatUrl('/circles/caregiversList', {
                      memberData: JSON.stringify(memberData)
                    })
                  )
                }}
              />
              <Button
                className="ml-2 px-3"
                title="Doctors"
                leadingIcon="briefcase"
                onPress={() => {
                  router.push(
                    formatUrl('/circles/doctorsList', {
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
                    formatUrl('/circles/facilitiesList', {
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
                leadingIcon="thermometer"
                onPress={() => {
                  router.push(
                    formatUrl('/circles/prescriptionsList', {
                      memberData: JSON.stringify(memberData)
                    })
                  )
                }}
              />
              <Button
                className="ml-2 px-3"
                title="Medical Devices"
                leadingIcon="watch"
                onPress={() => {
                  router.push(
                    formatUrl('/circles/medicalDevicesList', {
                      memberData: JSON.stringify(memberData)
                    })
                  )
                }}
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
