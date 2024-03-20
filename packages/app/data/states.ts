import { GET_STATES_AND_TIMEZONES } from 'app/utils/urlConstants'
import { Country, State, Timezone } from './types'
import { fetchData } from './base'

export type StateAndTimezoneData = {
  country: Country
  stateList: State[]
  timeZoneList: Timezone[]
}

export type StateAndTimezoneProps = {
  id: Country['id']
}

export async function getStateAndTimezoneData({ id }: StateAndTimezoneProps) {
  if (!id) {
    console.log('Country id is missing')
    return
  }

  return await fetchData<StateAndTimezoneData>({
    route: GET_STATES_AND_TIMEZONES,
    data: { country: { id } }
  })
}
