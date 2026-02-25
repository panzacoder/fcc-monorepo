'use client'

import { View, TouchableOpacity } from 'react-native'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'

interface ViewNavigationBarProps {
  isDayView: boolean
  isWeekView: boolean
  dateLabel: string
  onDayPress: () => void
  onWeekPress: () => void
  onFilterPress: () => void
  onPrev: () => void
  onNext: () => void
}

export function ViewNavigationBar({
  isDayView,
  isWeekView,
  dateLabel,
  onDayPress,
  onWeekPress,
  onFilterPress,
  onPrev,
  onNext
}: ViewNavigationBarProps) {
  return (
    <>
      <View className="mt-[50px] w-full flex-row">
        <TouchableOpacity
          onPress={onDayPress}
          className={`w-[40%] items-center justify-center ${isDayView ? 'bg-[#c2cad1]' : 'bg-white'} py-2`}
        >
          <View>
            <Feather name={'calendar'} size={25} color={'black'} />
            <Typography className="mt-1 text-[14px] font-bold text-black">
              {'Day'}
            </Typography>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onWeekPress}
          className={`w-[40%] items-center justify-center ${isWeekView ? 'bg-[#c2cad1]' : 'bg-white'} py-2`}
        >
          <View>
            <Feather
              className="ml-1"
              name={'calendar'}
              size={25}
              color={'black'}
            />
            <Typography className=" mt-1 text-[14px] font-bold text-black">
              {'Week'}
            </Typography>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onFilterPress}
          className="w-[20%] items-center justify-center bg-white py-2"
        >
          <Feather className="ml-2" name={'filter'} size={25} color={'black'} />
        </TouchableOpacity>
      </View>

      <View className="bg-primary h-[60] w-full justify-center">
        <View className="flex-row">
          <View className="w-[15%]">
            <TouchableOpacity
              onPress={onPrev}
              className="ml-5 h-[40] w-[40] items-center justify-center self-center rounded-[5px] bg-white"
            >
              <Feather name={'chevron-left'} size={25} color={'black'} />
            </TouchableOpacity>
          </View>
          <View className="w-[70%] justify-center">
            <Typography className="text-center font-bold text-white">
              {dateLabel}
            </Typography>
          </View>
          <View className="w-[15%]">
            <TouchableOpacity
              onPress={onNext}
              className="mr-5 h-[40] w-[40] items-center justify-center self-center rounded-[5px] bg-white"
            >
              <Feather name={'chevron-right'} size={25} color={'black'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  )
}
