import { Alert } from 'react-native'
import { emitSessionExpired } from 'app/utils/auth-events'
import { logger } from 'app/utils/logger'

export type CallPostServiceResponse<T> =
  | {
      status: 'SUCCESS'
      data: T
    }
  | {
      status: 'FAILURE'
      message: string
      errorCode?: string
    }

export function CallPostService<T>(
  url: string | URL | Request,
  data: any
): Promise<CallPostServiceResponse<T>> {
  logger.debug(`Service Call: url( ${url} )`)
  return new Promise(function (accept, reject) {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then((response) => {
        if (!response.ok) {
          Alert.alert('', `Error with code ${response.status}`)
          reject(`Error with code ${response.status}`)
          return null
        }
        return response.json()
      })

      .then((response) => {
        if (!response) return
        if (response.errorCode === 'SEP_101') {
          emitSessionExpired()
          reject('Login Expired')
          return
        }
        accept(response)
      })
      .catch((error) => {
        logger.error('API Error:', error)
        if (error.name !== null && error.name === 'TimeoutError') {
          reject("Can't reach to server, please try again later.")
        } else if (error.status) {
          let errorMessage =
            undefined !== error.message && null !== error.message
              ? error.message
              : 'Unknown Error occurred'

          switch (error.status) {
            /* 
                        Unauthorized
             */
            case 401:
              errorMessage = 'You are not authenticate to call this service'
              break
            /* 
                        Forbidden
           */
            case 403:
              errorMessage =
                'You are not authorized to perform this operation or the resource is unavailable for some reason'
              break
            /* 
                        Internal server error
             */
            case 500:
              errorMessage =
                'Internal Server Error occurred , please try again later'
              break
            /* 
                        Request Timeout 
            */
            case 408:
              errorMessage =
                'Internal Server Error occurred , please try again later'
              break
            case 504:
              /*  
                        Network connect timeout error
             */
              errorMessage =
                'Internal Server Error occurred , please try again later'
              break
            case 599:
              errorMessage = "Can't reach to server , please try again later."
              break
            /*  
                         Service Unavailable
             */
            case 503:
              errorMessage =
                'Service you are trying is currently unavailable , please try again later.'
              break
            default:
              errorMessage = 'You are not authenticate to call this service'
              break
          }
          logger.error('errorMessage:', errorMessage)
          reject(errorMessage)
        } else {
          if (
            error.message !== undefined &&
            error.message === 'Network request failed'
          ) {
            Alert.alert('', error.message !== undefined ? error.message : error)
          }

          reject(error)
        }
      })
  })
}
