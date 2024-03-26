import store from 'app/redux/store'
import { getUserDeviceInformation } from 'app/utils/device'
import {
  CallPostService,
  CallPostServiceResponse
} from 'app/utils/fetchServerData'
import { BASE_URL } from 'app/utils/urlConstants'
import { Alert } from 'react-native'

type fetchDataProps<DataType> = {
  route: string
  data?: any
  onFailure?: (response: CallPostServiceResponse<DataType>) => void // if not provided, will show alert with response message
}

export async function fetchData<DataType>({
  route,
  data = {},
  onFailure
}: fetchDataProps<DataType>): Promise<DataType | void> {
  const url = new URL(route, BASE_URL)
  console.log(`Fetching data from ${url}`)
  const deviceInfo = await getUserDeviceInformation()
  const header = store.getState().headerState.header

  const payload = {
    header: { deviceInfo, ...header },
    ...data
  }

  const res = CallPostService<DataType>(url, payload)
    .then((res) => {
      if (res.status === 'SUCCESS') {
        return res.data
      } else {
        onFailure ? onFailure(res) : Alert.alert('', res.message)
      }
    })
    .catch((error) => {
      console.log(error)
    })
  return res
}
