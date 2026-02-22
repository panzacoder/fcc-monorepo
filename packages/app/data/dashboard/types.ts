export interface GetWeekDetailsResponse {
  memberList: any[]
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

export interface GetCalendarItemsResponse {
  domainObjectPrivileges: any
  allowedDomainObjects: any
  calenderItemList: any[]
}

export interface GetConsolidatedFilterOptionsResponse {
  filterOptionTypes: string[]
}

export interface GetConsolidatedDetailsParams {
  fromdate: string
  todate: string
}

export interface GetConsolidatedDetailsResponse {
  memberActivityList: any[]
}

export interface GetFilterConsolidatedDetailsParams {
  fromdate: string
  todate: string
  type: string
}
