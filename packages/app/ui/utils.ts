import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import moment from 'moment-timezone'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function consoleData(title: string, data: string) {
  console.log(title, data)
}
export const getFullDateForCalender = (time: any, formatType: any) => {
  return moment(time).format(formatType)
}
export const getNameInitials = (firstName: string, lastName: string) => {
  let initials =
    '' +
    firstName.split('')[0]?.toUpperCase() +
    lastName.split('')[0]?.toUpperCase()
  return initials
}
