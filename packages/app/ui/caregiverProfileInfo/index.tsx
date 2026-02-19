import { View, TouchableOpacity } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
export const CaregiverProfileInfo = ({ cancelClicked }) => {
  let titleStyle = 'font-400 w-full text-[15px] text-[#066f72] font-bold'
  let valueStyle = 'font-400 w-[95%] text-[15px] text-[#1A1A1A]'
  function getDetailsView(title: string, value: string) {
    return (
      <View className="mx-2 mt-2 w-full items-center">
        <View className="w-full ">
          <Typography className={titleStyle}>{title}</Typography>
          <Typography className={valueStyle}>{value}</Typography>
        </View>
      </View>
    )
  }
  return (
    <View className="my-2 h-[90%] w-[95%] self-center rounded-[15px] border-[0.5px] border-gray-400 bg-white shadow">
      <View className=" w-full">
        <View className="h-[50px] w-full flex-row rounded-tl-[10px] rounded-tr-[10px] bg-[#066f72]">
          <Typography className="mt-[15px] w-[85%] text-center font-bold text-white">
            {'Profile Information'}
          </Typography>
          <View className="flex-row justify-end self-center">
            <TouchableOpacity
              className="h-[30px] w-[30px] items-center justify-center rounded-full bg-white"
              onPress={() => {
                cancelClicked()
              }}
            >
              <Feather name={'x'} size={25} className="color-[#066f72]" />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView className="max-h-[87%]">
          {getDetailsView(
            'Authorized Caregiver - ',
            'This role has total responsibility for the Circle.They represent the Member “Center of the Circle” with the ability to expand the Circle to other caregivers, assign the roles to other caregivers and delete the circle.Typically this role is assigned to one person when the Member needs someone to represent them.'
          )}
          {getDetailsView(
            'Family Manager - ',
            'This role also has the ability to expand the Circle and has all rights needed to create appointments and communicate with others. Typically this role is assigned to a close relative. This role is very similar to Authorized Caregiver with the exception of the ability to delete the Circle for the Member.'
          )}
          {getDetailsView(
            'Family Member - ',
            'As an important caregiver, they can help manage all appointments. They are restricted from adding others to the Circle. Typically this role is assigned to extended relatives or close friends.'
          )}
          {getDetailsView(
            'Transporter - ',
            'Can only view Appointments/Events for which they are responsible for transportation. Typically this role is assigned to friends that are wanting to help by offering to take the loved one to an appointment. This is the most restrictive role.'
          )}
        </ScrollView>
      </View>
    </View>
  )
}
