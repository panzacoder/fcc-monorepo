import { fetchData, type AuthHeader } from '../base'
import {
  GET_APPOINTMENTS,
  GET_DOCTOR_FACILITIES,
  GET_APPOINTMENT_DETAILS,
  CREATE_APPOINTMENT,
  UPDATE_APPOINTMENT,
  DELETE_APPOINTMENT,
  CREATE_APPOINTMENT_NOTE,
  UPDATE_APPOINTMENT_NOTE,
  DELETE_APPOINTMENT_NOTE,
  GET_APPOINTMENT_NOTE,
  CREATE_APPOINTMENT_REMINDER,
  UPDATE_APPOINTMENT_REMINDER,
  DELETE_APPOINTMENT_REMINDER,
  UPDATE_APPOINTMENT_STATUS,
  GET_APPOINTMENT_DOCTORS,
  GET_APPOINTMENT_FACILITIES
} from 'app/utils/urlConstants'
import type {
  AppointmentListResponse,
  GetAppointmentsParams,
  DoctorFacilityListResponse,
  GetDoctorFacilitiesParams,
  CreateAppointmentParams,
  UpdateAppointmentParams,
  DeleteAppointmentParams,
  AppointmentNoteParams,
  AppointmentReminderParams,
  UpdateAppointmentStatusParams
} from './types'

export async function getAppointments(
  header: AuthHeader,
  params: GetAppointmentsParams
) {
  return fetchData<AppointmentListResponse>({
    header,
    route: GET_APPOINTMENTS,
    data: { memberDetails: params }
  })
}

export async function getDoctorFacilities(
  header: AuthHeader,
  params: GetDoctorFacilitiesParams
) {
  return fetchData<DoctorFacilityListResponse>({
    header,
    route: GET_DOCTOR_FACILITIES,
    data: {
      doctor: { member: { id: params.memberId } },
      appointmentType: params.appointmentType
    }
  })
}

export async function getAppointmentDetails(
  header: AuthHeader,
  params: { id: number }
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: GET_APPOINTMENT_DETAILS,
    data: { appointment: params }
  })
}

export async function createAppointment(
  header: AuthHeader,
  params: CreateAppointmentParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: CREATE_APPOINTMENT,
    data: params
  })
}

export async function updateAppointment(
  header: AuthHeader,
  params: UpdateAppointmentParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: UPDATE_APPOINTMENT,
    data: params
  })
}

export async function deleteAppointment(
  header: AuthHeader,
  params: DeleteAppointmentParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: DELETE_APPOINTMENT,
    data: params
  })
}

export async function createAppointmentNote(
  header: AuthHeader,
  params: AppointmentNoteParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: CREATE_APPOINTMENT_NOTE,
    data: params
  })
}

export async function updateAppointmentNote(
  header: AuthHeader,
  params: AppointmentNoteParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: UPDATE_APPOINTMENT_NOTE,
    data: params
  })
}

export async function deleteAppointmentNote(
  header: AuthHeader,
  params: { appointmentNote: { id: number } }
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: DELETE_APPOINTMENT_NOTE,
    data: params
  })
}

export async function getAppointmentNote(
  header: AuthHeader,
  params: { appointmentNote: { id: number } }
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: GET_APPOINTMENT_NOTE,
    data: params
  })
}

export async function createAppointmentReminder(
  header: AuthHeader,
  params: AppointmentReminderParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: CREATE_APPOINTMENT_REMINDER,
    data: params
  })
}

export async function updateAppointmentReminder(
  header: AuthHeader,
  params: AppointmentReminderParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: UPDATE_APPOINTMENT_REMINDER,
    data: params
  })
}

export async function deleteAppointmentReminder(
  header: AuthHeader,
  params: { reminder: Record<string, unknown> }
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: DELETE_APPOINTMENT_REMINDER,
    data: params
  })
}

export async function updateAppointmentStatus(
  header: AuthHeader,
  params: UpdateAppointmentStatusParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: UPDATE_APPOINTMENT_STATUS,
    data: params
  })
}

export async function getAppointmentDoctors(
  header: AuthHeader,
  params: { memberId: number }
) {
  return fetchData<Record<string, unknown>[]>({
    header,
    route: GET_APPOINTMENT_DOCTORS,
    data: { member: { id: params.memberId } }
  })
}

export async function getAppointmentFacilities(
  header: AuthHeader,
  params: { memberId: number }
) {
  return fetchData<Record<string, unknown>[]>({
    header,
    route: GET_APPOINTMENT_FACILITIES,
    data: { member: { id: params.memberId } }
  })
}
