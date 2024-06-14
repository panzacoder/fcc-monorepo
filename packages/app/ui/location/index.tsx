import { Alert, View, Linking, TouchableOpacity } from 'react-native'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { useRouter } from 'expo-router'
import { getAddressFromObject, googleMapOpenUrl } from 'app/ui/utils'
import { formatUrl } from 'app/utils/format-url'
import { convertPhoneNumberToUsaPhoneNumberFormat } from 'app/ui/utils'
export function Location(data: any) {
  // export const Location = ({ data }) => {
  const router = useRouter()
  let locationData = data.data ? data.data : {}
  // console.log('locationData', JSON.stringify(locationData))
  function getWebsite(url: string) {
    let newUrl = String(url).replace(/(^\w+:|^)\/\//, '')
    return newUrl
  }
  async function deleteLocation() {
    console.log('deleteLocation')
  }
  let touchStyle =
    'mt-2 h-[32px] w-[32px] items-center justify-center  rounded-full bg-[#0d9195] ml-2'
  return (
    <View>
      {locationData.nickName && locationData.nickName !== '' ? (
        <View className="mt-2 w-full ">
          <View className="flex-row items-center py-1">
            <Typography className="text-primary mr-2 w-[70%] font-bold">
              {locationData.nickName ? locationData.nickName : ''}
            </Typography>
            <View className="flex-row self-center">
              {locationData.component !== 'Appointment' ? (
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert(
                      'Are you sure about deleting Location?',
                      'It cannot be recovered once deleted.',
                      [
                        {
                          text: 'Ok',
                          onPress: () => deleteLocation()
                        },
                        { text: 'Cancel', onPress: () => {} }
                      ]
                    )
                  }}
                  className={touchStyle}
                >
                  <Feather
                    className=" "
                    name={'trash'}
                    size={20}
                    color={'white'}
                  />
                </TouchableOpacity>
              ) : (
                <View />
              )}
              {locationData.component !== 'Appointment' ? (
                <TouchableOpacity
                  onPress={() => {
                    router.replace(
                      formatUrl('/circles/addEditLocation', {
                        locationDetails: JSON.stringify(locationData),
                        component: locationData.component
                          ? locationData.component
                          : ''
                      })
                    )
                  }}
                  className={touchStyle}
                >
                  <Feather
                    className=""
                    name={'edit-2'}
                    size={20}
                    color={'white'}
                  />
                </TouchableOpacity>
              ) : (
                <View />
              )}
            </View>
          </View>
          <View className="h-[0.5px] w-full bg-gray-400" />
        </View>
      ) : (
        <View />
      )}

      <View className="w-full flex-row">
        {locationData.address && locationData.address !== '' ? (
          <View className="mt-2 w-[90%] flex-row items-center">
            <Typography className="font-400 text-[16px] text-[#1A1A1A]">
              {getAddressFromObject(locationData.address)}
            </Typography>
          </View>
        ) : (
          <View />
        )}
        <TouchableOpacity
          onPress={() => {
            let addressString = getAddressFromObject(locationData.address)
            googleMapOpenUrl(addressString)
          }}
          className={touchStyle}
        >
          <Feather
            className="self-center"
            name={'navigation'}
            size={20}
            color={'white'}
          />
        </TouchableOpacity>
      </View>
      {locationData.phone && locationData.phone !== '' ? (
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(`tel:${locationData.phone}`)
          }}
          className=" mt-2 w-[95%] flex-row items-center"
        >
          <View className="w-[95%] flex-row">
            <Typography className="font-400 w-[25%] text-[16px] text-[#1A1A1A]">
              {'Phone:'}
            </Typography>
            <Typography className="font-400 ml-2 w-[70%] text-[16px] font-bold text-[#1A1A1A]">
              {convertPhoneNumberToUsaPhoneNumberFormat(locationData.phone)}
            </Typography>
          </View>
          <Feather className="ml-2" name={'phone'} size={20} color={'black'} />
        </TouchableOpacity>
      ) : (
        <View />
      )}

      {locationData.fax && locationData.fax !== '' ? (
        <View className=" mt-2 w-[95%] flex-row items-center">
          <View className="w-[95%] flex-row">
            <Typography className="font-400 w-[25%] text-[16px] text-[#1A1A1A]">
              {'Fax:'}
            </Typography>
            <Typography className="font-400 ml-2 w-[75%] text-[16px] font-bold text-[#1A1A1A]">
              {locationData.fax}
            </Typography>
          </View>
          <Feather className="ml-2" name={'copy'} size={20} color={'black'} />
        </View>
      ) : (
        <View />
      )}
      {locationData.website && locationData.website !== '' ? (
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(`http://${getWebsite(locationData.website)}`)
          }}
          className="mt-2 w-[95%] flex-row items-center"
        >
          <View className="w-[95%] flex-row">
            <Typography className="font-400 w-[25%] text-[16px] text-[#1A1A1A]">
              {'Website:'}
            </Typography>
            <Typography className="font-400 text-primary ml-2 w-[70%] text-[16px]">
              {locationData.website}
            </Typography>
          </View>
          <Feather className="ml-2" name={'globe'} size={20} color={'black'} />
        </TouchableOpacity>
      ) : (
        <View />
      )}
    </View>
  )
}
