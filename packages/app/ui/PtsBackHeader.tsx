import { View, TouchableOpacity } from 'react-native'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { useRouter, useNavigation } from 'expo-router'
import { formatUrl } from 'app/utils/format-url'
export const PtsBackHeader = ({ title, memberData }) => {
  const router = useRouter()
  const navigation = useNavigation()
  async function goToScreen(title: any) {
    if (title === 'Appointment Details') {
      router.dismiss(2)
      router.push(
        formatUrl('/circles/appointmentsList', {
          memberData: JSON.stringify(memberData)
        })
      )
    } else if (title === 'Event Details') {
      router.dismiss(2)
      router.push(
        formatUrl('/circles/eventsList', {
          memberData: JSON.stringify(memberData)
        })
      )
    } else if (title === 'Incident Details') {
      router.dismiss(2)
      router.push(
        formatUrl('/circles/incidentsList', {
          memberData: JSON.stringify(memberData)
        })
      )
    } else if (title === 'Caregiver Details' || title === 'Edit Caregiver') {
      router.dismiss(3)
      router.push(
        formatUrl('/circles/caregiversList', {
          memberData: JSON.stringify(memberData)
        })
      )
    } else if (title === 'Doctor Details') {
      router.dismiss(2)
      router.push(
        formatUrl('/circles/doctorsList', {
          memberData: JSON.stringify(memberData)
        })
      )
    } else if (title === 'Facility Details') {
      router.dismiss(2)
      router.push(
        formatUrl('/circles/facilitiesList', {
          memberData: JSON.stringify(memberData)
        })
      )
    } else if (title === 'Prescription Details') {
      router.dismiss(2)
      router.push(
        formatUrl('/circles/prescriptionsList', {
          memberData: JSON.stringify(memberData)
        })
      )
    } else if (title === 'Medical Device Details') {
      router.dismiss(2)
      router.push(
        formatUrl('/circles/medicalDevicesList', {
          memberData: JSON.stringify(memberData)
        })
      )
    } else if (title === 'Circle Details') {
      router.dismissAll()
      router.push('/home')
    } else if (
      title === 'Appointments' ||
      title === 'Events' ||
      title === 'Incidents' ||
      title === 'Doctors'
    ) {
      let fullName = ''
      if (memberData.firstname) {
        fullName += memberData.firstname.trim() + ' '
      }
      if (memberData.lastname) {
        fullName += memberData.lastname.trim()
      }
      router.dismiss(1)
      router.push(
        formatUrl('/circles/circleDetails', {
          fullName,
          memberData: JSON.stringify(memberData)
        })
      )
    } else {
      router.back()
    }
  }
  return (
    <View className=" mt-2 w-[100%] flex-row ">
      <TouchableOpacity
        className="mx-[10px] self-center"
        onPress={() => {
          goToScreen(title)
        }}
      >
        <Feather name={'arrow-left'} size={25} color={'black'} />
      </TouchableOpacity>
      <Typography className="flex-1 text-[20px] font-bold">{title}</Typography>
    </View>
  )
}
export default PtsBackHeader
