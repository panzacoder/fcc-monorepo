import { Alert } from 'react-native'

export type CallPostServiceResponse<T> =
  | {
      status: 'SUCCESS'
      data: T
    }
  | {
      status: 'FAILURE'
      message: string
    }

export function CallPostService<T>(
  url: string | URL | Request,
  data: any
): Promise<CallPostServiceResponse<T>> {
  console.log(
    `Service Call: url( ${url} ) with data object: ${JSON.stringify(data)}`
  )
  console.dir(data)
  return new Promise(function (accept, reject) {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then((response) => {
        if (response.status != 200) {
          Alert.alert('', `Error with code ${response.status}`)
          reject(`Error with code ${response.status}`)
          return null
        }
        return response
      })
      .then((response) => response && response.json())
      .then((response) => {
        if (response.errorCode === 'SEP_101') {
          Alert.alert('Session Expired. Please Login.', '', [
            {
              text: 'Ok',
              onPress: () => {}
            }
          ])
          reject('Login Expired')
        }
        accept(response)
      })
      .catch((error) => {
        console.log('Error Static Data Response: ' + JSON.stringify(error))
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
          console.log('errorMessage:' + errorMessage)
          reject(errorMessage)
        } else {
          if (
            error.message !== undefined &&
            error.message === 'Network request failed'
          ) {
            Alert.alert('', error.message !== undefined ? error.message : error)
          }

          // TODO: Need to handle unknown errors, this variable was unused
          //
          // let errorMessage =
          //   undefined !== error.message && null !== error.message
          //     ? error.message
          //     : 'Unknown Error occurred'
          reject(error)
        }
      })
  })
}
