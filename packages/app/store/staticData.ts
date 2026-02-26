import { Country } from 'app/data/types'
import type { StaticData } from 'app/data/static'
import { useAppSelector } from 'app/store'

export function useStaticData() {
  return useAppSelector((state) => state.staticDataState.staticData)
}

export function useCountries(): Country[] {
  return (useStaticData() as Partial<StaticData>).countryList || []
}
