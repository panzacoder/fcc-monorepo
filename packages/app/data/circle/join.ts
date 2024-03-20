import { JOIN_CIRCLE } from 'app/utils/urlConstants'
import { Address } from '../types'
import { fetchData } from '../base'


export type JoinCircleReturnType = {
  version: number
  id: string
  email: string
  phone: string | null
  caregiverEmail: string
  requestRaisedBy: string
  caregiverFname: string
  caregiverLname: string
  memberFname: string
  memberLname: string
  constentFormVersionDate: null
  familyMember: number
  member: number
  isActive: boolean
}

export type JoinCircleProps = {
  id: number
}

export async function createCircle(props: JoinCircleProps) {
  return await fetchData<JoinCircleReturnType>({
    route: JOIN_CIRCLE,
    data: { memberVo: { props } }
  })
}
