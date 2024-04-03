'use client'

import { useState } from 'react'
import { View } from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { COLORS } from 'app/utils/colors'
import { Button } from 'app/ui/button'
import store from 'app/redux/store'
import { CallPostService } from 'app/utils/fetchServerData'
import { BASE_URL, GET_INCIDENTS } from 'app/utils/urlConstants'
import { useParams } from 'solito/navigation'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'solito/navigation'
import { formatTimeToUserLocalTime, getMonthsList } from 'app/ui/utils'
import { getUserPermission } from 'app/utils/getUserPemissions'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'
let incidentsPrivileges = {}
const schema = z.object({
  monthIndex: z.number(),
  yearIndex: z.number()
})
export type Schema = z.infer<typeof schema>
const yearList: object[] = [{ label: 'All', value: 0 }] as any
const monthsList = getMonthsList() as any
let selectedMonth = 'All'
let selectedYear = 'All'
export function IncidentsListScreen() {
  const router = useRouter()
  const [isLoading, setLoading] = useState(false)
  const [isDataReceived, setIsDataReceived] = useState(false)
  const [isFilter, setIsFilter] = useState(false)
  const [incidentsList, setIncidentsList] = useState([]) as any
  const header = store.getState().headerState.header
  const staticData: any = store.getState().staticDataState.staticData
  const item = useParams<any>()
  let memberData =
    item.memberData !== undefined ? JSON.parse(item.memberData) : {}
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      monthIndex: 0,
      yearIndex: 0
    },
    resolver: zodResolver(schema)
  })
  staticData.yearList.map((data: any, index: any) => {
    let object = {
      label: data.name,
      value: index + 1
    }
    yearList.push(object)
  })

  const getIncidentDetails = useCallback(async () => {
    setLoading(true)
    let url = `${BASE_URL}${GET_INCIDENTS}`
    let dataObject = {
      header: header,
      incident: {
        member: {
          id: memberData.member ? memberData.member : ''
        }
      },
      month: selectedMonth,
      year: selectedYear
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          // console.log('data', JSON.stringify(data.data.eventList))
          if (data.data.domainObjectPrivileges) {
            incidentsPrivileges = data.data.domainObjectPrivileges.Incident
              ? data.data.domainObjectPrivileges.Incident
              : {}
          }
          setIncidentsList(data.data.list ? data.data.list : [])
          setIsDataReceived(true)
          setIsFilter(false)
          // console.log('eventList', incidentsList)
        } else {
          Alert.alert('', data.message)
        }
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        console.log('error', error)
      })
  }, [])
  useEffect(() => {
    getIncidentDetails()
  }, [])

  function filterEvents(formData: Schema) {
    selectedMonth = monthsList[formData.monthIndex].label
    selectedYear = yearList[formData.yearIndex].label
    getIncidentDetails()
  }
  function resetFilter() {
    selectedMonth = 'All'
    selectedYear = 'All'
    getIncidentDetails()
    reset({
      monthIndex: 0,
      yearIndex: 0
    })
  }
  async function refreshPage() {}
  return (
    <View className="flex-1  bg-white">
      <PtsLoader loading={isLoading} />
      <Typography className="mt-[150px] flex-1 items-center justify-center self-center text-[20px] font-bold">
        {'Incidents'}
      </Typography>
    </View>
  )
}
