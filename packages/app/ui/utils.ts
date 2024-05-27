import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import moment, { MomentInput } from 'moment-timezone'
import { Alert, Platform, Linking } from 'react-native'
import store from '../redux/store'

export const DATE_CONSTANT = {
  FULL_DATE: 'DD MMM YYYY hh:mm A'
  // FULL_DATE: 'MMM DD, YYYY'
}
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function consoleData(title: string, data: string) {
  console.log(title, data)
}
export const isNull = (input: any) => {
  if (undefined === input || null === input) {
    return true
  }
  return false
}
export function googleMapOpenUrl(address: string) {
  var url =
    'https://www.google.com/maps/dir/?api=1&travelmode=driving&dir_action=navigate&destination=' +
    address
  Linking.canOpenURL(url)
    .then((supported) => {
      if (!supported) {
        console.log("Can't handle url: " + url)
      } else {
        return Linking.openURL(url)
      }
    })
    .catch((err) => console.error('An error occurred', err))
}
export const convertPhoneNumberToUsaPhoneNumberFormat = (value: any) => {
  if (!value) return value
  const currentValue = value.replace(/[^\d]/g, '')
  const cvLength = currentValue.length

  if (value.length > 0) {
    if (cvLength < 4) return currentValue
    if (cvLength < 7)
      return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3)}`
    return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3, 6)}-${currentValue.slice(6, 10)}`
  }
}
export function getAddressFromObject(address: any) {
  if (isNull(address)) {
    return ''
  }
  let finalAddress = ''

  let addressLine = address.line
  if (addressLine && addressLine.length > 0) {
    finalAddress = finalAddress + addressLine.toString().trim() + ', '
  }

  let city = address.city
  if (city && city.length > 0) {
    finalAddress = finalAddress + city.toString().trim() + ', '
  }

  let state = address.statevo
  if (state && state.name && state.name.toString().length > 0) {
    finalAddress = finalAddress + state.name.toString().trim() + ', '
    if (
      state.countryvo &&
      state.countryvo.name &&
      state.countryvo.name.toString().length > 0
    ) {
      finalAddress =
        finalAddress + state.countryvo.name.toString().trim() + ', '
    }
  } else {
    state = address.state
    if (state && state.name && state.name.toString().length > 0) {
      finalAddress = finalAddress + state.name.toString().trim() + ', '
      if (
        state.countryvo &&
        state.countryvo.name &&
        state.countryvo.name.toString().length > 0
      ) {
        finalAddress =
          finalAddress + state.countryvo.name.toString().trim() + ', '
      }
      if (
        state.country &&
        state.country.name &&
        state.country.name.toString().length > 0
      ) {
        finalAddress =
          finalAddress + state.country.name.toString().trim() + ', '
      }
    }
  }
  let country = address.country
  if (country && country.name) {
    finalAddress = finalAddress + country.name.toString().trim() + ', '
  }
  let pin = address.pin
  if (pin && pin.length > 0) {
    finalAddress = finalAddress + pin.toString().trim()
  } else if (address.pincode && address.pincode > 0) {
    finalAddress = finalAddress + address.pincode.toString().trim()
  }

  let zip = address.zipCode
  if (zip && zip.length > 0) {
    finalAddress = finalAddress + zip.toString().trim()
  }

  zip = address.zicode
  if (zip && zip.length > 0) {
    finalAddress = finalAddress + zip.toString().trim()
  }

  return finalAddress
}
export const getFullDateForCalendar = (
  time: MomentInput,
  formatType: string
) => {
  return moment(time).format(formatType)
}
export const getMonthsList = () => {
  let monthsList: object[] = [
    { title: 'All', id: 1 },
    { title: 'January', id: 2 },
    { title: 'February', id: 3 },
    { title: 'March', id: 4 },
    { title: 'April', id: 5 },
    { title: 'May', id: 6 },
    { title: 'June', id: 7 },
    { title: 'July', id: 8 },
    { title: 'August', id: 9 },
    { title: 'September', id: 10 },
    { title: 'October', id: 11 },
    { title: 'November', id: 12 },
    { title: 'December', id: 13 }
  ]
  return monthsList
}
export const getMonthsListOnly = () => {
  let monthsList: object[] = [
    { title: 'January', id: 1 },
    { title: 'February', id: 2 },
    { title: 'March', id: 3 },
    { title: 'April', id: 4 },
    { title: 'May', id: 5 },
    { title: 'June', id: 6 },
    { title: 'July', id: 7 },
    { title: 'August', id: 8 },
    { title: 'September', id: 9 },
    { title: 'October', id: 10 },
    { title: 'November', id: 11 },
    { title: 'December', id: 12 }
  ]
  return monthsList
}
function getTimezoneName() {
  let userData = store.getState().userProfileState.header.address
  // console.log('getTimezoneName', userData);
  let timeZoneName = null
  let memberData = store.getState().currentMemberAddress.currentMemberAddress
  if (memberData.timezone ? memberData.timezone.name : false) {
    timeZoneName = memberData.timezone.name
  } else if (
    userData !== null
      ? userData.timezone !== null
        ? userData.timezone.name
        : false
      : false
  ) {
    timeZoneName = userData.timezone.name
  }

  if (timeZoneName) {
    return timeZoneName
  } else {
    return moment.tz.guess()
  }
}

export const getFullDate = (date: any) => {
  return moment(date).format(DATE_CONSTANT.FULL_DATE)
}
export const getDay = (date: any) => {
  // console.log('date./.', date)
  var time = moment(date).format('hh:mm A')
  var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  var formatDate = moment(date).format('MMM DD, YYYY')
  return formatDate + ' (' + days[moment(date).day()] + ') - ' + time
}
export const convertUserTimeToUTC = (time: any) => {
  let timeZoneName = getTimezoneName()
  let time1 = moment(time).format(DATE_CONSTANT.FULL_DATE)
  let utcDateTime = moment
    .tz(time1, DATE_CONSTANT.FULL_DATE, timeZoneName)
    .utc()
  return utcDateTime
}
export const getOnlyUserTimeZone = () => {
  let timeZoneName = getTimezoneName()
  if (timeZoneName) {
    return `(${moment().tz(timeZoneName).format('z')})`
  }
}
export const convertTimeToUserLocalTime = (time: any) => {
  let timeZoneName = getTimezoneName()
  if (timeZoneName) {
    return `${getFullDate(moment(time).tz(timeZoneName))} (${moment().tz(timeZoneName).format('z')})`
  } else {
    return getFullDate(moment(time).utc(true))
  }
}
export const formatTimeToUserLocalTime = (time: any) => {
  let timeZoneName = getTimezoneName()
  if (timeZoneName) {
    return `${getDay(moment(time).tz(timeZoneName))} (${moment().tz(timeZoneName).format('z')})`
  } else {
    return getFullDate(moment(time).utc(true))
  }
}
export const getNameInitials = (fullName: string) => {
  let fullNameStr = fullName.split(' ')
  let initials = ''
  if (fullNameStr[0]?.split('')[0]?.toUpperCase() !== undefined) {
    initials += fullNameStr[0]?.split('')[0]?.toUpperCase()
  }
  if (fullNameStr[1]?.split('')[0]?.toUpperCase() !== undefined) {
    initials += fullNameStr[1]?.split('')[0]?.toUpperCase()
  }

  return initials
}
