import { View, Linking, TouchableOpacity, ToastAndroid } from 'react-native'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { useRouter } from 'solito/navigation'
import { getAddressFromObject, googleMapOpenUrl } from 'app/ui/utils'
import { formatUrl } from 'app/utils/format-url'
export function Location(data: any) {
  const router = useRouter()
  let locationData = data.data ? data.data : {}
  // console.log('locationData', locationData.component)
  function getWebsite(url: string) {
    let newUrl = String(url).replace(/(^\w+:|^)\/\//, '')
    return newUrl
  }
  return (
    <View>
      {locationData.nickName && locationData.nickName !== '' ? (
        <View className="mt-2 flex-row items-center">
          <View className="flex-row">
            <Typography className="font-400 mr-2 text-[12px] text-[#1A1A1A]">
              {locationData.nickName ? locationData.nickName : ''}
            </Typography>
            {locationData.component !== 'Appointment' ? (
              <Feather
                onPress={() => {
                  // console.log('component', JSON.stringify(locationData))
                  router.replace(
                    formatUrl('/(authenticated)/circles/addEditLocation', {
                      locationDetails: JSON.stringify(locationData),
                      component: locationData.component
                        ? locationData.component
                        : ''
                    })
                  )
                }}
                name={'settings'}
                size={15}
                color={'black'}
              />
            ) : (
              <View />
            )}
          </View>
          <View className="bg-primary h-[1px] w-full" />
        </View>
      ) : (
        <View />
      )}
      {locationData.address && locationData.address !== '' ? (
        <View className="ml-2 mt-2 w-full flex-row items-center">
          <View className="w-[95%] flex-row">
            <Typography className="font-400  w-[95%] text-[16px] text-[#1A1A1A]">
              {getAddressFromObject(locationData.address)}
            </Typography>
          </View>
          <Feather
            onPress={() => {
              let addressString = getAddressFromObject(locationData.address)
              googleMapOpenUrl(addressString)
            }}
            name={'navigation'}
            size={20}
            color={'black'}
          />
        </View>
      ) : (
        <View />
      )}
      {locationData.phone && locationData.phone !== '' ? (
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(`tel:${locationData.phone}`)
          }}
          className="ml-2 mt-2 w-full flex-row items-center"
        >
          <View className="w-[95%] flex-row">
            <Typography className="font-400 w-[25%] text-[16px] text-[#1A1A1A]">
              {'Phone:'}
            </Typography>
            <Typography className="font-400 ml-2 w-[70%] text-[16px] font-bold text-[#1A1A1A]">
              {locationData.phone ? locationData.phone : ''}
            </Typography>
          </View>
          <Feather name={'phone'} size={20} color={'black'} />
        </TouchableOpacity>
      ) : (
        <View />
      )}

      {locationData.fax && locationData.fax !== '' ? (
        <View className="ml-2 mt-2 w-full flex-row items-center">
          <View className="w-[95%] flex-row">
            <Typography className="font-400 w-[25%] text-[16px] text-[#1A1A1A]">
              {'Fax:'}
            </Typography>
            <Typography className="font-400 ml-2 w-[75%] text-[16px] font-bold text-[#1A1A1A]">
              {locationData.fax ? locationData.fax : ''}
            </Typography>
          </View>
          <Feather name={'copy'} size={20} color={'black'} />
        </View>
      ) : (
        <View />
      )}
      {locationData.website && locationData.website !== '' ? (
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(`http://${getWebsite(locationData.website)}`)
          }}
          className="ml-2 mt-2 w-full flex-row items-center"
        >
          <View className="w-[95%] flex-row">
            <Typography className="font-400 w-[25%] text-[16px] text-[#1A1A1A]">
              {'Website:'}
            </Typography>
            <Typography className="font-400 text-primary ml-2 w-[70%] text-[16px] font-bold">
              {locationData.website ? locationData.website : ''}
            </Typography>
          </View>
          <Feather name={'globe'} size={20} color={'black'} />
        </TouchableOpacity>
      ) : (
        <View />
      )}
    </View>
  )
}
