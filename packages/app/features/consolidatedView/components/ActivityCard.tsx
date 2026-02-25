'use client'

import { View, TouchableOpacity } from 'react-native'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import type { MemberActivity } from 'app/data/dashboard/types'
import { formatTimeToUserLocalTime } from 'app/ui/utils'

const ACTIVITY_NAMES: Record<string, string> = {
  'Doctor Appointment': 'Doctor',
  'Facility Appointment': 'Facility',
  Event: 'Event',
  Incident: 'Incident'
}

const ACTIVITY_COLORS: Record<string, string> = {
  'Doctor Appointment': 'bg-[#ebe4d1]',
  'Facility Appointment': 'bg-[#e1ebe5]',
  Event: 'bg-[#dcebf5]',
  Incident: 'bg-[#f5dedc]'
}

interface ActivityCardProps {
  data: MemberActivity
  userAddress: string
  memberAddress: string
  onPress: (data: MemberActivity) => void
}

export function ActivityCard({
  data,
  userAddress,
  memberAddress,
  onPress
}: ActivityCardProps) {
  return (
    <TouchableOpacity
      onPress={() => onPress(data)}
      className={`my-1 w-full flex-1 self-center rounded-[15px] border-[1px] border-gray-400 py-2 ${data.type ? ACTIVITY_COLORS[data.type] ?? 'bg-white' : 'bg-white'}`}
    >
      <View className=" flex-row">
        <Typography className="font-400 ml-2 w-[75%] max-w-[75%] text-sm font-bold text-black">
          {data.membername ? data.membername : ''}
        </Typography>
        <View className="">
          <Typography className="text-sm text-black">
            {data.type ? ACTIVITY_NAMES[data.type] ?? '' : ''}
          </Typography>
        </View>
      </View>
      <View className=" flex-row">
        <Typography className="font-400 ml-2 w-[75%] max-w-[75%] text-sm text-black">
          {data.date
            ? formatTimeToUserLocalTime(data.date, userAddress, memberAddress)
            : ''}
        </Typography>
        <View className="">
          <Typography className="text-sm text-black">
            {data.status ? data.status : ''}
          </Typography>
        </View>
      </View>
      <View className=" flex-row">
        <Typography className="font-400 text-primary ml-2 mr-[2px] w-[95%] text-sm font-bold">
          {data.address ? data.address : ''}
        </Typography>
      </View>
      <View className=" flex-row">
        <Typography className="font-400 ml-2 w-full text-sm text-black">
          {data.purpose ? data.purpose : ''}
        </Typography>
      </View>
      {data.hasNotes || data.hasReminders || data.hasTransportation ? (
        <View className="my-2 h-[1px] w-[95%] self-center bg-[#86939e]" />
      ) : (
        <View />
      )}

      <View className="ml-2 flex-row self-center">
        <View className="w-[30%]">
          {data.hasNotes ? (
            <View className="flex-row">
              <Feather
                className="ml-5 mt-1"
                name={'message-circle'}
                size={25}
                color={'green'}
              />
              {data.unreadMessageCount > 0 ? (
                <Typography className="bg-primary ml-[-5px] h-[20px] w-[20px] rounded-[10px] text-center text-sm font-bold text-white">
                  {data.unreadMessageCount}
                </Typography>
              ) : (
                <View />
              )}
            </View>
          ) : (
            <View />
          )}
        </View>
        <View className="w-[30%]">
          {data.hasReminders ? (
            <View className="flex-row">
              <Feather
                className="ml-5 mt-1"
                name={'clock'}
                size={25}
                color={'red'}
              />
              {data.activeReminderCount > 0 ? (
                <Typography className="bg-primary ml-[-5px] h-[20px] w-[20px] rounded-[10px] text-center text-sm font-bold text-white">
                  {data.activeReminderCount}
                </Typography>
              ) : (
                <View />
              )}
            </View>
          ) : (
            <View />
          )}
        </View>
        {data.hasTransportation ? (
          <View className="w-[30%]">
            <Feather
              className="ml-5 mt-1"
              name={'truck'}
              size={25}
              color={
                data.transportationStatus === 'Requested'
                  ? '#cf8442'
                  : data.transportationStatus === 'Rejected'
                    ? 'red'
                    : '#4DA529'
              }
            />
          </View>
        ) : (
          <View />
        )}
      </View>
    </TouchableOpacity>
  )
}
