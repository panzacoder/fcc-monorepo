import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import moment from 'moment-timezone'

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
export function getAddressFromObject(address: object) {
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
export const getFullDateForCalender = (time: any, formatType: any) => {
  return moment(time).format(formatType)
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
