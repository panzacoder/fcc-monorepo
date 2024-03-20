export type Description = string | null
export type Id = number
export type ReferenceId = Id | null
export type Timestamp = string | null

export type MedicineType = {
  id: number
  type: string
  description: Description
}

export type MedicineStatus = {
  id: number
  status: string
  description: Description
}

export type RelationType = {
  id: number
  type: string
  description: Description
}

export type RelationWithMember = {
  id: number
  relation: string
  description: Description
}

export type AppointmentType = {
  id: number
  type: string
  description: Description
}

export type AppointmentPurpose = {
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

export type TaskOccurance = {
  id: number
  occurance: string
  description: Description
}

export type TaskType = {
  id: number
  type: string
  description: Description
}

export type FacilityType = {
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

export type Specialization = {
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

export type ThreadType = {
  id: number
  type: string
  description: Description
}

export type AccompanyType = {
  id: number
  type: string
  description: Description
}

export type IncidentType = {
  id: number
  type: string
  description: Description
}

export type Profile = {
  id: number
  uid: string
  name: string
  status: string
  description: Description
}

export type AppointmentStatus = {
  id: number
  status: string
  description: Description
}

export type YearList = {
  id: number | null
  name: number
}

export type EventOccurance = {
  id: number
  occurance: string
  description: Description
}

export type EventStatus = {
  id: number
  status: string
  description: Description
}

export type EventType = {
  id: number
  type: string
  description: Description
}

export type Plan = {
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

export type PurchaseType = {
  id: number
  type: string
  description: Description
}

export type PurchaseOccurance = {
  id: number
  occurance: string
  description: Description
}

export type Country = {
  id: number
  code: string
  name: string
  namecode: string
  isoCode: string
}

export type State = {
  id: number
  code: string
  name: string
  namecode: string
  snum: string
  country: string | null
}

export type Timezone = {
  id: number
  name: string
  isoAlpha2: string
  abbreviation: string
  country: string | null
  description: Description
}

export type Address = {
  line: string
  city: string
  zipCode: string
  version: number
  id: number
  state: State
  geolocation: string | null
  timezone: Timezone
}

export type Member = {
  firstName: string,
  middleName: string | null,
  lastName: string,
  email: string,
  phone: string,
  salutation: string | null,
  gender: string | null,
  dob: string | null,
  createdOn: string,
  updatedOn: string | null,
  createdBy: string | null,
  modifiedBy: string | null,
  approvedBy: string | null,
  version: number,
  description: string | null,
  isMember: boolean,
  name: string | null,
  isActive: boolean,
  iscreatedbyPOA: boolean,
  id: number,
  address: Address,
  memberType: string | null,
  appuser: any | null,
  timezone: Timezone,
  isAuthorizedCaregiver: boolean,
  isSelfMember: boolean,
  memberId: number,
  memberWithoutEmail: boolean
}
