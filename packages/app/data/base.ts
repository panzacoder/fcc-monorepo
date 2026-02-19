import { getUserDeviceInformation } from 'app/utils/device'
import {
  CallPostService,
  CallPostServiceResponse
} from 'app/utils/fetchServerData'
import { BASE_URL } from 'app/utils/urlConstants'
import { Alert } from 'react-native'
import { logger } from 'app/utils/logger'

type fetchDataProps<DataType> = {
  header: any
  route: string
  data?: any
  onFailure?: (response: CallPostServiceResponse<DataType>) => void // if not provided, will show alert with response message
}

export async function fetchData<DataType>({
  header,
  route,
  data = {},
  onFailure
}: fetchDataProps<DataType>): Promise<DataType | void> {
  const url = new URL(route, BASE_URL)
  logger.debug(`Fetching data from ${url}`)
  const deviceInfo = await getUserDeviceInformation()

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
      logger.debug(error)
    })
  return res
}
