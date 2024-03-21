import { JOIN_CIRCLE } from 'app/utils/urlConstants'
import { fetchData } from '../base'

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
    }

export async function joinCircle(props: JoinCircleProps) {
  return await fetchData<JoinCircleReturnType>({
    route: JOIN_CIRCLE,
    data: { memberVo: { props } }
  })
}
