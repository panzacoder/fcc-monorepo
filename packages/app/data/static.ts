import { BASE_URL, GET_STATIC_DATA } from 'app/utils/urlConstants'
import { Alert } from 'react-native'
import { CallPostService } from 'app/utils/fetchServerData'
import staticDataAction from 'app/redux/staticData/staticAction'
import store from 'app/redux/store'
import { getUserDeviceInformation } from 'app/utils/device'

export async function fetchStaticData(callback?: () => void) {
  callback ||= () => null

  const serviceUrl = `${BASE_URL}${GET_STATIC_DATA}`
  const deviceInfo = await getUserDeviceInformation()
  const dataObject = {
    header: { deviceInfo }
  }

  CallPostService(serviceUrl, dataObject)
    .then(async (data: any) => {
      if (data.status === 'SUCCESS') {
        store.dispatch(staticDataAction.setStaticData(data.data))
      } else {
        Alert.alert('', data.message)
      }
    })
    .catch((error) => {
      console.log(error)
    })
    .finally(callback)
}
