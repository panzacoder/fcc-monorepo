import { Alert, Platform, Linking } from 'react-native'
import * as deviceInfoModule from 'expo-device'

export const getUserDeviceInformation = async () => {
  let buildNumber = deviceInfoModule.osBuildId
  let ostype = Platform.OS
  let host = deviceInfoModule.brand
  let osversion = deviceInfoModule.osVersion
  let modelnumber = deviceInfoModule.modelName
  let browser = `Mobile-osBuildId-${deviceInfoModule.osBuildId} Brand:${deviceInfoModule.brand}`
  return {
    buildNumber,
    ostype,
    host,
    osversion,
    modelnumber,
    browser,
    appclient: 'M',
  }
}
