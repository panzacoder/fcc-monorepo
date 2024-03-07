import { Country } from 'app/data/types'
import { useAppSelector } from '../hooks'

export function useStaticData() {
  return useAppSelector((state) => state.staticDataState.staticData)
}

export function useCountries(): Country[] {
  return useStaticData()['countries'] || []
}
