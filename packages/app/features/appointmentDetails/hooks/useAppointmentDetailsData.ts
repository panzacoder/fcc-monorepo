import {
  useAppointmentDetails as useAppointmentDetailsQuery,
  useDeleteAppointment,
  useCreateAppointmentNote,
  useUpdateAppointmentNote,
  useDeleteAppointmentNote,
  useCreateAppointmentReminder,
  useUpdateAppointmentReminder,
  useDeleteAppointmentReminder,
  useUpdateAppointmentStatus,
  useSendCalendarInvite
} from 'app/data/appointments'
import { useAllMemberDetails } from 'app/data/circle'
import {
  useCreateMessageThread,
  useThreadParticipants
} from 'app/data/messages'
import {
  useDeleteTransportation,
  useResendTransportationRequest,
  useCancelTransportationRequest
} from 'app/data/transportation'
import { usePermissions } from 'app/utils/usePermissions'
import type { AppointmentDetailResponse } from 'app/data/appointments/types'
import type { GetThreadParticipantsParams } from 'app/data/messages/types'

export function useAppointmentDetailsData(
  header: Record<string, unknown>,
  appointmentId: number,
  threadParticipantsParams: GetThreadParticipantsParams
) {
  const {
    data: rawData,
    isLoading,
    refetch
  } = useAppointmentDetailsQuery(header, appointmentId)

  const data = rawData as AppointmentDetailResponse | undefined

  const appointmentPrivileges = usePermissions(
    data?.domainObjectPrivileges,
    'Appointment'
  )
  const notePrivileges = usePermissions(
    data?.domainObjectPrivileges,
    'APPOINTMENTNOTE',
    'AppointmentNote'
  )
  const transportationPrivileges = usePermissions(
    data?.domainObjectPrivileges,
    'APPOINTMENTTRANSPORTATION',
    'AppointmentTransportation'
  )

  const { refetch: refetchParticipants } = useThreadParticipants(
    header,
    threadParticipantsParams
  )

  const { data: allMemberDetailsData } = useAllMemberDetails(header)

  return {
    data,
    isLoading,
    refetch,
    appointmentPrivileges,
    notePrivileges,
    transportationPrivileges,
    refetchParticipants,
    allMemberDetailsData,
    deleteAppointment: useDeleteAppointment(header),
    createNote: useCreateAppointmentNote(header),
    updateNote: useUpdateAppointmentNote(header),
    deleteNote: useDeleteAppointmentNote(header),
    createReminder: useCreateAppointmentReminder(header),
    updateReminder: useUpdateAppointmentReminder(header),
    deleteReminder: useDeleteAppointmentReminder(header),
    updateStatus: useUpdateAppointmentStatus(header),
    sendCalendarInvite: useSendCalendarInvite(header),
    createMessageThread: useCreateMessageThread(header),
    deleteTransportation: useDeleteTransportation(header),
    resendTransportation: useResendTransportationRequest(header),
    cancelTransportation: useCancelTransportationRequest(header)
  }
}

export type AppointmentDetailsHookReturn = ReturnType<
  typeof useAppointmentDetailsData
>
