import { View, ScrollView, Pressable } from 'react-native'
import _ from 'lodash'
import { Feather } from 'app/ui/icons'
import { Typography } from '../typography'
export const SharedContactList = ({
  cancelClicked,
  sharedContactsList,
  acceptRejectClicked
}) => {
  // console.log('sharedContactsList', JSON.stringify(sharedContactsList))
  return (
    <View className="my-2 max-h-[90%] w-[95%] self-center rounded-[15px] border-[1px] border-[#e0deda]">
      <View className="bg-primary h-[50] w-full flex-row rounded-tl-[15px] rounded-tr-[15px]">
        <Typography className=" w-[85%] self-center text-center font-bold text-white">{`Shared Contacts`}</Typography>
        <View className="mr-[30] flex-row justify-end self-center">
          <Pressable
            className="h-[30px] w-[30px] items-center justify-center rounded-full bg-white"
            onPress={() => {
              cancelClicked()
            }}
          >
            <Feather name={'x'} size={25} className="color-primary" />
          </Pressable>
        </View>
      </View>
      <ScrollView className="">
        {sharedContactsList.map((data: any, index: number) => {
          let doctorFacilityName = ''
          if (data.doctorName) {
            doctorFacilityName = data.doctorName
          }
          if (data.facilityName) {
            doctorFacilityName = data.facilityName
          }
          return (
            <View key={index}>
              <View className="mx-3 flex-row">
                <Typography className="w-[95%] font-bold">
                  {data.frommemberName ? data.frommemberName : ''}
                  <Typography className="font-normal">{` has shared details of ${doctorFacilityName}.`}</Typography>
                </Typography>
              </View>
              <View className="my-2 mt-3 flex-row self-center">
                <Pressable
                  onPress={() => {
                    acceptRejectClicked(data, true)
                  }}
                  className="w-[25%] self-center rounded-full bg-[#34af80] py-1 "
                >
                  <Typography className="text-center font-bold text-white">
                    {'Accept'}
                  </Typography>
                </Pressable>
                <Pressable
                  onPress={() => {
                    acceptRejectClicked(data, true)
                  }}
                  className="ml-5 w-[25%] self-center rounded-full bg-[#e48f92] py-1 "
                >
                  <Typography className="text-center font-bold text-white">
                    {'Reject'}
                  </Typography>
                </Pressable>
              </View>
            </View>
          )
        })}
      </ScrollView>
    </View>
  )
}
