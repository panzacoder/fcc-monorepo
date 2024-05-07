import { View, ScrollView, Pressable } from 'react-native'
import { Button } from 'app/ui/button'
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
    <View className="my-2 max-h-[90%] min-h-[40%] w-[95%] self-center rounded-[15px] border-[1px] border-[#e0deda]">
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
      <ScrollView className="min-h-[50%]">
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
              <View className="my-2 flex-row self-center">
                <Button
                  className="bg-[#ef6603]"
                  title="Accept"
                  variant="default"
                  onPress={() => {
                    acceptRejectClicked(data, true)
                  }}
                />
                <Button
                  className="ml-5 bg-[#86939e]"
                  title="Reject"
                  variant="default"
                  onPress={() => {
                    acceptRejectClicked(data, false)
                  }}
                />
              </View>
            </View>
          )
        })}
      </ScrollView>
    </View>
  )
}
