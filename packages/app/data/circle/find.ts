import { FIND_CIRCLE } from 'app/utils/urlConstants'
import { Member } from '../types'
import { fetchData } from '../base'


export type FindCircleProps = {
  email?: Member['email']
  phone?: Member['phone']
}

export type FindCircleReturnType = Member | null


export async function findCircle({ email, phone }: FindCircleProps) {
  if (email) {
    return await fetchData<FindCircleReturnType>({
      route: FIND_CIRCLE,
      data: { member: { email } }
    })
  } else if (phone) {
    return await fetchData<FindCircleReturnType>({
      route: FIND_CIRCLE,
      data: { member: { phone } }
    })
  }
  console.log('Cannot lookup member without email or phone')
}
