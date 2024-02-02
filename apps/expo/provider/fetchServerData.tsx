import { Alert } from 'react-native'
// import { CommonActions } from '@react-navigation/native';
// import { SCREENNAMES } from '../constant/screenName';

export const CallPostService = (url: string | URL | Request, data: any) => {
  console.log('Service Call :' + url + ' width data ' + JSON.stringify(data))
  // hideLoader();
  // showLoader();
  return new Promise(function (accept, reject) {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        // console.log('..../')
        // console.log(response)
        if (response.status != 200) {
          Alert.alert('', `Error with code ${response.status}`)
          reject(`Error with code ${response.status}`)
          return null
        }
        return response
      })
      .then((response) => response && response.json())
      .then((response) => {
        //   hideLoader();
        // console.log(response)
        // console.log('..../')
        // console.log(response)
        if (response.errorCode === 'SEP_101') {
          Alert.alert('Session Expired. Please Login.', '', [
            {
              text: 'Ok',
              onPress: () => {
             
              },
            },
          ])
          reject('Login Expired')
        }
        accept(response)
      })
      .catch((error) => {
        // hideLoader();
        console.log('Error Static Data Response: ' + JSON.stringify(error))
        if (error.name !== null && error.name === 'TimeoutError') {
          // PtsAlert.error("Can't reach to server,please try again later.");
          reject("Can't reach to server,please try again later.")
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
                        internal server error
             */
            case 500:
              errorMessage =
                'Internal Server Error occurred , please try again later'
              break
            /* 
                        Request Timeout 
            */
            case 408:
              /*
                          gatewat timeout
             */
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
          console.log('erroMessage:' + errorMessage)
          // PtsAlert.error(errorMessage);
          reject(errorMessage)
        } else {
          if (
            error.message !== undefined &&
            error.message === 'Network request failed'
          ) {
            Alert.alert('', error.message !== undefined ? error.message : error)
          }
          let errorMessage =
            undefined !== error.message && null !== error.message
              ? error.message
              : 'Unknown Error occurred'
          // PtsAlert.error(errorMessage);
          reject(error)
        }
      })
  })
  // hideLoader();
}
