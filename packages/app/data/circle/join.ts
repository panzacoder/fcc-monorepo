import { JOIN_CIRCLE } from 'app/utils/urlConstants'
import { fetchData } from '../base'
import { logger } from 'app/utils/logger'

export type JoinCircleReturnType = {
  version: number
  id: number
  memberEmail: string
  caregiverEmail: string
  phone: string | null
  requestRaisedBy: string
  caregiverFname: string
  caregiverLname: string
  memberFname: string
  memberLname: string
  consentFormVersionDate: null
  familyMember: number
  member: number
  isActive: boolean
}

export type JoinCircleProps =
  | {
      id: number
    }
  | {
      email: string
      caregiverFname: string
    }

export async function joinCircle(header: any, props: JoinCircleProps) {
  logger.debug('props', JSON.stringify(props))
  return await fetchData<JoinCircleReturnType>({
    header,
    route: JOIN_CIRCLE,
    data: { memberVo: { props } }
  })
}
