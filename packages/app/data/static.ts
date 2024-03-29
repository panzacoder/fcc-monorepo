import { fetchData } from './base'
import { GET_STATIC_DATA } from 'app/utils/urlConstants'
import store from 'app/redux/store'
import staticDataAction from 'app/redux/staticData/staticAction'
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
export async function fetchStaticData() {
  const staticData = await fetchData<StaticData>({ route: GET_STATIC_DATA })
  if (staticData) {
    store.dispatch(staticDataAction.setStaticData(staticData))
  }

  return staticData
}
