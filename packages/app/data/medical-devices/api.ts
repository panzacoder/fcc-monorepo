import { fetchData, type AuthHeader } from '../base'
import {
  GET_MEDICAL_DEVICES,
  GET_MEDICAL_DEVICE_DETAILS,
  CREATE_MEDICAL_DEVICE,
  UPDATE_MEDICAL_DEVICE,
  DELETE_MEDICAL_DEVICE,
  CREATE_MEDICAL_DEVICE_NOTE,
  UPDATE_MEDICAL_DEVICE_NOTE,
  DELETE_MEDICAL_DEVICE_NOTE,
  GET_MEDICAL_DEVICE_NOTE,
  CREATE_MEDICAL_DEVICE_REMINDER,
  UPDATE_MEDICAL_DEVICE_REMINDER,
  DELETE_MEDICAL_DEVICE_REMINDER
} from 'app/utils/urlConstants'
import type {
  MedicalDeviceListResponse,
  MedicalDeviceDetailsResponse,
  GetMedicalDevicesParams,
  CreateMedicalDeviceParams,
  UpdateMedicalDeviceParams,
  DeleteMedicalDeviceParams,
  MedicalDeviceNoteParams,
  DeleteMedicalDeviceNoteParams,
  MedicalDeviceReminderParams,
  DeleteMedicalDeviceReminderParams,
  GetMedicalDeviceNoteParams
} from './types'

export async function getMedicalDevices(
  header: AuthHeader,
  params: GetMedicalDevicesParams
) {
  const data: Record<string, unknown> = {
    purchase: { member: { id: params.memberId } }
  }
  if (params.month) data.month = params.month
  if (params.year) data.year = params.year
  return fetchData<MedicalDeviceListResponse>({
    header,
    route: GET_MEDICAL_DEVICES,
    data
  })
}

export async function getMedicalDeviceDetails(
  header: AuthHeader,
  params: { id: number }
) {
  return fetchData<MedicalDeviceDetailsResponse>({
    header,
    route: GET_MEDICAL_DEVICE_DETAILS,
    data: { purchase: params }
  })
}

export async function createMedicalDevice(
  header: AuthHeader,
  params: CreateMedicalDeviceParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: CREATE_MEDICAL_DEVICE,
    data: params
  })
}

export async function updateMedicalDevice(
  header: AuthHeader,
  params: UpdateMedicalDeviceParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: UPDATE_MEDICAL_DEVICE,
    data: params
  })
}

export async function deleteMedicalDevice(
  header: AuthHeader,
  params: DeleteMedicalDeviceParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: DELETE_MEDICAL_DEVICE,
    data: params
  })
}

export async function createMedicalDeviceNote(
  header: AuthHeader,
  params: MedicalDeviceNoteParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: CREATE_MEDICAL_DEVICE_NOTE,
    data: params
  })
}

export async function updateMedicalDeviceNote(
  header: AuthHeader,
  params: MedicalDeviceNoteParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: UPDATE_MEDICAL_DEVICE_NOTE,
    data: params
  })
}

export async function deleteMedicalDeviceNote(
  header: AuthHeader,
  params: DeleteMedicalDeviceNoteParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: DELETE_MEDICAL_DEVICE_NOTE,
    data: params
  })
}

export async function getMedicalDeviceNote(
  header: AuthHeader,
  params: GetMedicalDeviceNoteParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: GET_MEDICAL_DEVICE_NOTE,
    data: params
  })
}

export async function createMedicalDeviceReminder(
  header: AuthHeader,
  params: MedicalDeviceReminderParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: CREATE_MEDICAL_DEVICE_REMINDER,
    data: params
  })
}

export async function updateMedicalDeviceReminder(
  header: AuthHeader,
  params: MedicalDeviceReminderParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: UPDATE_MEDICAL_DEVICE_REMINDER,
    data: params
  })
}

export async function deleteMedicalDeviceReminder(
  header: AuthHeader,
  params: DeleteMedicalDeviceReminderParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: DELETE_MEDICAL_DEVICE_REMINDER,
    data: params
  })
}
