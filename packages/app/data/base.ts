import { getUserDeviceInformation } from 'app/utils/device'
import { emitSessionExpired } from 'app/utils/auth-events'
import { BASE_URL } from 'app/utils/urlConstants'
import { logger } from 'app/utils/logger'

export type AuthHeader = Record<string, unknown>

export class ApiError extends Error {
  errorCode?: string
  constructor(message: string, errorCode?: string) {
    super(message)
    this.name = 'ApiError'
    this.errorCode = errorCode
  }
}

type FetchDataProps = {
  header: AuthHeader
  route: string
  data?: object
}

export async function fetchData<T>({
  header,
  route,
  data = {}
}: FetchDataProps): Promise<T> {
  const url = new URL(route, BASE_URL)
  logger.debug(`Fetching data from ${url}`)
  const deviceInfo = await getUserDeviceInformation()

  const payload = {
    header: { deviceInfo, ...header },
    ...data
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  const json = await response.json()

  if (json.errorCode === 'SEP_101') {
    emitSessionExpired()
    throw new Error('Session expired')
  }

  if (json.status === 'SUCCESS') {
    return json.data as T
  }

  throw new ApiError(json.message || 'Request failed', json.errorCode)
}
