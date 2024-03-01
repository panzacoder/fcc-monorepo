export enum StaticDataActionTypes {
  GET_STATIC_DATA = 'GET_STATIC_DATA',
  SET_STATIC_DATA = 'SET_STATIC_DATA'
}

export interface StaticDataState {
  staticData: StaticData | {}
}
export type StaticDataActionProps =
  | {
    type: StaticDataActionTypes.GET_STATIC_DATA
  }
  | {
    type: StaticDataActionTypes.SET_STATIC_DATA
    payload: StaticData
  }

type Description = string | null
type Id = number
type ReferenceId = Id | null
type Timestamp = string | null

type MedicineType = {
  id: number
  type: string
  description: Description
}

type MedicineStatus = {
  id: number
  status: string
  description: Description
}

type RelationType = {
  id: number
  type: string
  description: Description
}

type RelationWithMember = {
  id: number
  relation: string
  description: Description
}

type AppointmentType = {
  id: number
  type: string
  description: Description
}

type AppointmentPurpose = {
  id: number
  purpose: string
  description: Description
  memberId: ReferenceId
  isInbuilt: boolean
  createdOn: Timestamp
  updatedOn: Timestamp
  createdBy: number | null
  updatedBy: number | null
  version: number
}

type TaskOccurance = {
  id: number
  occurance: string
  description: Description
}

type TaskType = {
  id: number
  type: string
  description: Description
}

type FacilityType = {
  id: number
  type: string
  description: Description
  memberId: ReferenceId
  isInbuilt: boolean
  createdOn: Timestamp
  updatedOn: Timestamp
  createdBy: number | null
  updatedBy: number | null
  version: number
}

type Specialization = {
  id: number
  specialization: string
  description: Description
  memberId: ReferenceId
  isInbuilt: boolean
  createdOn: Timestamp
  updatedOn: Timestamp
  createdBy: number | null
  updatedBy: number | null
  version: number
}

type ThreadType = {
  id: number
  type: string
  description: Description
}

type AccompanyType = {
  id: number
  type: string
  description: Description
}

type IncidentType = {
  id: number
  type: string
  description: Description
}

type Profile = {
  id: number
  uid: string
  name: string
  status: string
  description: Description
}

type AppointmentStatus = {
  id: number
  status: string
  description: Description
}

type YearList = {
  id: number | null
  name: number
}

type EventOccurance = {
  id: number
  occurance: string
  description: Description
}

type EventStatus = {
  id: number
  status: string
  description: Description
}

type EventType = {
  id: number
  type: string
  description: Description
}

type Plan = {
  id: number
  name: string
  description: Description
  price: number
  currency: string
  stripePriceId: string | null
  stripeProductId: string | null
  stripeOneMemberPriceId: string | null
  subscriptionType: string | null
  discountPercent: string
  stripeCoupanId: string | null
  interval: any
  plantype: string | null
  numberOfUsers: number | null
  oneUserPrice: number
  isActive: boolean
  appleProductId: string | null
  planItems: any
}

type PurchaseType = {
  id: number
  type: string
  description: Description
}

type PurchaseOccurance = {
  id: number
  occurance: string
  description: Description
}

type Country = {
  id: number
  code: string
  name: string
  namecode: string
  isoCode: string
}

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

type State = {
  id: number
  code: string
  name: string
  namecode: string
  snum: string
  country: string | null
}

export interface StateData {
  stateList: State[] | []
}
