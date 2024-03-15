import { BASE_URL, GET_STATES_AND_TIMEZONES } from 'app/utils/urlConstants'
import { Alert } from 'react-native'
import { CallPostService } from 'app/utils/fetchServerData'
import { getUserDeviceInformation } from 'app/utils/device'
import { Country, State, Timezone } from './types'

export type StateAndTimezoneData = {
  country: Country
  stateList: State[]
  timeZoneList: Timezone[]
}

export async function fetchStateAndTimezoneData(
  id: Country['id']
): Promise<StateAndTimezoneData | void> {
  const serviceUrl = `${BASE_URL}${GET_STATES_AND_TIMEZONES}`
  const deviceInfo = await getUserDeviceInformation()

  if (!id) {
    console.log('Country id is missing')
    return
  }
  const requestBody = {
    header: { deviceInfo },
    country: {
      id
    }
  }

  return CallPostService<StateAndTimezoneData>(serviceUrl, requestBody)
    .then(async (res) => {
      if (res.status === 'SUCCESS') {
        return res.data
      } else {
        Alert.alert('', res.message)
      }
    })
    .catch((error) => {
      console.log(error)
    })
}
