import { CREATE_CIRCLE, CREATE_CIRCLE_NO_EMAIL } from 'app/utils/urlConstants'
import { Address } from '../types'
import { fetchData } from '../base'


export type CreateCircleReturnType = {
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

export type CreateCircleProps = {
  description?: string
  email?: string | null
  firstName: string
  lastName: string
  phone: string
  address: Address
}

export async function createCircle(props: CreateCircleProps) {
  return await fetchData<CreateCircleReturnType>({
    route: props?.email ? CREATE_CIRCLE : CREATE_CIRCLE_NO_EMAIL,
    data: { memberVo: { props } }
  })
}
