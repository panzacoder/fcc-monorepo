import { getUserDeviceInformation } from "app/utils/device"
import { CallPostService, CallPostServiceResponse } from "app/utils/fetchServerData"
import { BASE_URL } from "app/utils/urlConstants"
import { Alert } from "react-native"

type fetchDataProps<DataType> = {
  route: string
  data?: any
  onFailure?: (response: CallPostServiceResponse<DataType>) => void // if not provided, will show alert with response message
}

export async function fetchData<DataType>({ route, data = {}, onFailure }: fetchDataProps<DataType>): Promise<DataType | void> {

  const url = new URL(route, BASE_URL)
  const deviceInfo = await getUserDeviceInformation()

  const payload = {
    header: { deviceInfo },
    ...data
  }

  CallPostService<DataType>(url, payload)
    .then(async (res) => {
      if (res.status === 'SUCCESS') {
        return res.data
      } else {
        onFailure ? onFailure(res) : Alert.alert('', res.message)
      }
    })
    .catch((error) => {
      console.log(error)
    })
}
