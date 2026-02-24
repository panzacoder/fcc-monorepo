import type { DomainPrivileges, PrivilegeAction } from '../types.d'

export interface WeekDetailsMember {
  firstname: string
  lastname: string
  member: number | string
  upcomingAppointment: unknown
  recentIncident: unknown
  upcomingEvent: unknown
}

export interface GetWeekDetailsResponse {
  memberList: WeekDetailsMember[]
  upcomingAppointmentCount: number
  upcomingEventCount: number
}

export interface UpdateFcmTokenParams {
  appuserVo: {
    fcmToken: string
  }
}

export interface GetCalendarItemsParams {
  memberId: number | string
  month: string
  year: string
}

export type AllowedDomainObjects = Record<string, PrivilegeAction[]>

export interface GetCalendarItemsResponse {
  domainObjectPrivileges: DomainPrivileges
  allowedDomainObjects: AllowedDomainObjects
  calenderItemList: unknown[]
}

export interface GetConsolidatedFilterOptionsResponse {
  filterOptionTypes: string[]
}

export interface GetConsolidatedDetailsParams {
  fromdate: string
  todate: string
}

export interface MemberActivity {
  date: string
  type: string
  membername: string
  status: string
  address: string
  purpose: string
  hasNotes: boolean
  hasReminders: boolean
  hasTransportation: boolean
  unreadMessageCount: number
  activeReminderCount: number
  transportationStatus: string
}

export interface GetConsolidatedDetailsResponse {
  memberActivityList: MemberActivity[]
}

export interface GetFilterConsolidatedDetailsParams {
  fromdate: string
  todate: string
  type: string
}
