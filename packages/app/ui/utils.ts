import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import moment, { MomentInput } from 'moment-timezone'
import { Alert, Platform, Linking } from 'react-native'
import _ from 'lodash'
import { logger } from 'app/utils/logger'
export const DATE_CONSTANT = {
  FULL_DATE: 'DD MMM YYYY hh:mm A'
  // FULL_DATE: 'MMM DD, YYYY'
}
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function consoleData(title: string, data: string) {
  logger.debug(title, data)
}
export const isNull = (input: unknown) => {
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
        logger.debug("Can't handle url: " + url)
      } else {
        return Linking.openURL(url)
      }
    })
    .catch((err: unknown) => logger.error('An error occurred', err))
}
export const removeAllSpecialCharFromString = (
  phoneNumber: string | number
) => {
  let newNumber = String(phoneNumber).replace(
    /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi,
    ''
  )
  newNumber = newNumber.replace(' ', '')
  return newNumber
}
export const convertPhoneNumberToUsaPhoneNumberFormat = (value: string) => {
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
interface StateWithCountry {
  name?: string
  countryvo?: { name?: string }
  country?: { name?: string }
}
export interface AddressLike {
  line?: string
  city?: string
  statevo?: StateWithCountry
  state?: StateWithCountry
  country?: { name?: string }
  pin?: string
  pincode?: number | string
  zipCode?: string
  zicode?: string
}
export function getAddressFromObject(address: AddressLike | null | undefined) {
  if (isNull(address) || !address) {
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
  } else if (address.pincode && Number(address.pincode) > 0) {
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
export interface TimezoneHolder {
  timezone?: { name?: string } | null
}
function getTimezoneName(
  userAddress: TimezoneHolder | null,
  memberAddress: TimezoneHolder | null
) {
  let userData = userAddress
  let timeZoneName: string | null = null
  let memberData = memberAddress
  if (memberData?.timezone?.name) {
    timeZoneName = memberData.timezone.name
  } else if (userData?.timezone?.name) {
    timeZoneName = userData.timezone.name
  }

  if (timeZoneName) {
    return timeZoneName
  } else {
    return moment.tz.guess()
  }
}

export const getFullDate = (date: MomentInput) => {
  return moment(date).format(DATE_CONSTANT.FULL_DATE)
}
export const getDay = (date: MomentInput) => {
  var time = moment(date).format('hh:mm A')
  var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  var formatDate = moment(date).format('MMM DD, YYYY')
  return formatDate + ' (' + days[moment(date).day()] + ') - ' + time
}
export const convertUserTimeToUTC = (
  time: MomentInput,
  userAddress: TimezoneHolder | null,
  memberAddress: TimezoneHolder | null
) => {
  let timeZoneName = getTimezoneName(userAddress, memberAddress)
  let time1 = moment(time).format(DATE_CONSTANT.FULL_DATE)
  let utcDateTime = moment
    .tz(time1, DATE_CONSTANT.FULL_DATE, timeZoneName)
    .utc()
  return utcDateTime
}
export const getOnlyUserTimeZone = (
  userAddress: TimezoneHolder | null,
  memberAddress: TimezoneHolder | null
) => {
  let timeZoneName = getTimezoneName(userAddress, memberAddress)
  if (timeZoneName) {
    return `(${moment().tz(timeZoneName).format('z')})`
  }
}
export const convertTimeToUserLocalTime = (
  time: MomentInput,
  userAddress: TimezoneHolder | null,
  memberAddress: TimezoneHolder | null
) => {
  let timeZoneName = getTimezoneName(userAddress, memberAddress)
  if (timeZoneName) {
    return `${getFullDate(moment(time).tz(timeZoneName))} (${moment().tz(timeZoneName).format('z')})`
  } else {
    return getFullDate(moment(time).utc(true))
  }
}
export const formatTimeToUserLocalTime = (
  time: MomentInput,
  userAddress: TimezoneHolder | null,
  memberAddress: TimezoneHolder | null
) => {
  let timeZoneName = getTimezoneName(userAddress, memberAddress)
  if (timeZoneName) {
    return `${getDay(moment(time).tz(timeZoneName))} (${moment().tz(timeZoneName).format('z')})`
  } else {
    return getFullDate(moment(time).utc(true))
  }
}
export const getColorSet = (index: number) => {
  let colorsList = [
    'bg-[#A2416B]',
    'bg-[#000080]',
    'bg-[#65d48a]',
    'bg-[#99627A]',
    'bg-[#536fa3]',
    'bg-[#800000]',
    'bg-[#2C2891]',
    'bg-[#009DAE]',
    'bg-[#7b631c]',
    'bg-[#8843F2]',
    'bg-[#9A0680]',
    'bg-[#146356]',
    'bg-[#A86464]',
    'bg-[#EA5455]',
    'bg-[#0A2647]',
    'bg-[#b055cc]',
    'bg-[#495579]',
    'bg-[#600090]',
    'bg-[#68B984]',
    'bg-[#3FA796]',
    'bg-[#600090]',
    'bg-[#069A8E]',
    'bg-[#9A86A4]',
    'bg-[#0093AB]',
    'bg-[#00C897]',
    'bg-[#3E497A]',
    'bg-[#D9534F]'
  ]
  return colorsList[index]
}
export const isValidObject = (input?: object) => {
  if (
    input &&
    input !== undefined &&
    Object.getOwnPropertyNames(input).length > 0
  ) {
    return true
  }
  return false
}
export const getNameInitials = (fullName?: string) => {
  let fullNameStr = fullName?.split(' ') || []
  let initials = ''
  if (fullNameStr[0]?.split('')[0]?.toUpperCase() !== undefined) {
    initials += fullNameStr[0]?.split('')[0]?.toUpperCase()
  }
  if (fullNameStr[1]?.split('')[0]?.toUpperCase() !== undefined) {
    initials += fullNameStr[1]?.split('')[0]?.toUpperCase()
  }

  return initials
}
