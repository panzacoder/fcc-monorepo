import { BASE_URL, GET_STATIC_DATA } from 'app/utils/urlConstants'
import { Alert } from 'react-native'
import { CallPostService } from 'app/utils/fetchServerData'
import staticDataAction from 'app/redux/staticData/staticAction'
import store from 'app/redux/store'
import { getUserDeviceInformation } from 'app/utils/device'
import {
  AccompanyType,
  AppointmentPurpose,
  AppointmentStatus,
  AppointmentType,
  Country,
  EventOccurance,
  EventStatus,
  EventType,
  FacilityType,
  IncidentType,
  MedicineStatus,
  MedicineType,
  Plan,
  Profile,
  PurchaseOccurance,
  PurchaseType,
  RelationType,
  RelationWithMember,
  Specialization,
  TaskOccurance,
  TaskType,
  ThreadType,
  YearList
} from './types'

export interface StaticData {
  medicineTypeList: MedicineType[]
  medicineStatusList: MedicineStatus[]
  relationTypeList: RelationType[]
  relationWithMemberList: RelationWithMember[]
  appointmentTypeList: AppointmentType[]
  appointmentPurposeList: AppointmentPurpose[]
  taskOccuranceList: TaskOccurance[]
  taskTypeList: TaskType[]
  facilityTypeList: FacilityType[]
  specializationList: Specialization[]
  threadTypeList: ThreadType[]
  accompanyTypeList: AccompanyType[]
  incidentTypeList: IncidentType[]
  profileList: Profile[]
  appointmentStatusList: AppointmentStatus[]
  yearList: YearList[]
  eventOccuranceList: EventOccurance[]
  eventStatusList: EventStatus[]
  eventTypeList: EventType[]
  planList: Plan[]
  purchaseTypeList: PurchaseType[]
  purchaseOccuranceList: PurchaseOccurance[]
  countryList: Country[]
}
export async function fetchStaticData(callback?: () => void) {
  callback ||= () => null

  const serviceUrl = `${BASE_URL}${GET_STATIC_DATA}`
  const deviceInfo = await getUserDeviceInformation()
  const dataObject = {
    header: { deviceInfo }
  }

  CallPostService(serviceUrl, dataObject)
    .then(async (res: any) => {
      if (res.status === 'SUCCESS') {
        store.dispatch(staticDataAction.setStaticData(res.data as StaticData))
      } else {
        Alert.alert('', res.message)
      }
    })
    .catch((error) => {
      console.log(error)
    })
    .finally(callback)
}
