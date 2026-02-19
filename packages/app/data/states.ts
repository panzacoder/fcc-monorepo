import { GET_STATES_AND_TIMEZONES } from 'app/utils/urlConstants'
import { Country, State, Timezone } from './types'
import { fetchData } from './base'
import { logger } from 'app/utils/logger'

export type StateAndTimezoneData = {
  country: Country
  stateList: State[]
  timeZoneList: Timezone[]
}

export type StateAndTimezoneProps = {
  id: Country['id']
}

export async function getStateAndTimezoneData(
  header: any,
  { id }: StateAndTimezoneProps
) {
  if (!id) {
    logger.debug('Country id is missing')
    return
  }

  return await fetchData<StateAndTimezoneData>({
    header,
    route: GET_STATES_AND_TIMEZONES,
    data: { country: { id } }
  })
}
