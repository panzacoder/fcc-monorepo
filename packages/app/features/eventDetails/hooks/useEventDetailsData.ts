import {
  useEventDetails as useEventDetailsQuery,
  useDeleteEvent,
  useCreateEventNote,
  useUpdateEventNote,
  useDeleteEventNote,
  useCreateEventReminder,
  useUpdateEventReminder,
  useDeleteEventReminder,
  useUpdateEventStatus
} from 'app/data/events'
import {
  useCreateMessageThread,
  useThreadParticipants
} from 'app/data/messages'
import {
  useDeleteTransportationEvent,
  useResendTransportationRequestEvent,
  useCancelTransportationRequestEvent
} from 'app/data/transportation'
import { usePermissions } from 'app/utils/usePermissions'
import type {
  EventDetailResponse,
  GetEventDetailsParams
} from 'app/data/events/types'
import type { GetThreadParticipantsParams } from 'app/data/messages/types'

export function useEventDetailsData(
  header: Record<string, unknown>,
  eventParams: GetEventDetailsParams,
  threadParticipantsParams: GetThreadParticipantsParams
) {
  const {
    data: rawData,
    isLoading,
    refetch
  } = useEventDetailsQuery(header, eventParams)

  const data = rawData as EventDetailResponse | undefined

  const eventPrivileges = usePermissions(data?.domainObjectPrivileges, 'Event')
  const notePrivileges = usePermissions(
    data?.domainObjectPrivileges,
    'EVENTNOTE',
    'EventNote'
  )
  const transportationPrivileges = usePermissions(
    data?.domainObjectPrivileges,
    'EVENTTRANSPORTATION',
    'EventTransportation'
  )

  const { refetch: refetchParticipants } = useThreadParticipants(
    header,
    threadParticipantsParams
  )

  return {
    data,
    isLoading,
    refetch,
    eventPrivileges,
    notePrivileges,
    transportationPrivileges,
    refetchParticipants,
    deleteEvent: useDeleteEvent(header),
    createNote: useCreateEventNote(header),
    updateNote: useUpdateEventNote(header),
    deleteNote: useDeleteEventNote(header),
    createReminder: useCreateEventReminder(header),
    updateReminder: useUpdateEventReminder(header),
    deleteReminder: useDeleteEventReminder(header),
    updateStatus: useUpdateEventStatus(header),
    createMessageThread: useCreateMessageThread(header),
    deleteTransportation: useDeleteTransportationEvent(header),
    resendTransportation: useResendTransportationRequestEvent(header),
    cancelTransportation: useCancelTransportationRequestEvent(header)
  }
}

export type EventDetailsHookReturn = ReturnType<typeof useEventDetailsData>
