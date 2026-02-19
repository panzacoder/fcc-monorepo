import { CREATE_CIRCLE, CREATE_CIRCLE_NO_EMAIL } from 'app/utils/urlConstants'
import { Address } from '../types'
import { fetchData } from '../base'

export type CreateCircleReturnType = {
  version: number
  id: number
  email: string
  phone: string | null
  caregiverEmail: string
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

export type CreateCircleProps = {
  description?: string
  email?: string | null
  firstName: string
  lastName: string
  phone?: string
  address: Address
}

export async function createCircle(header: any, props: CreateCircleProps) {
  return await fetchData<CreateCircleReturnType>({
    header,
    route: props?.email ? CREATE_CIRCLE : CREATE_CIRCLE_NO_EMAIL,
    data: { memberVo: props }
    // onFailure: ({ errorCode }) => {
    //   if (errorCode === "FMM_101") {
    //     // TODO: redirect to circle if already a member
    //
    //   }
    // }
  })
}
