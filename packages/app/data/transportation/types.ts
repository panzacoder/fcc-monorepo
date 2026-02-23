import type { Address, AccompanyType } from '../types.d'

export interface TransportationRequestsParams {
  memberId: number | string
}

export interface TransportationMemberListParams {
  memberId: number | string
}

export interface TransportationData {
  id?: number | string
  date: Date | string
  description?: string
  accompany?: number | string
  accompanyType?: Partial<AccompanyType>
  reminderList?: unknown[]
  address?: Partial<Address>
  appointment?: { id: number | string }
  event?: { id: number | string }
}

export interface CreateTransportationParams {
  transportation: TransportationData
}

export interface UpdateTransportationParams {
  transportation: TransportationData
}

export interface DeleteTransportationParams {
  transportation: { id: number | string }
}

export interface CreateTransportationEventParams {
  transportation: TransportationData
}

export interface UpdateTransportationEventParams {
  transportation: TransportationData
}

export interface DeleteTransportationEventParams {
  transportation: { id: number | string }
}

export interface TransportationVoData {
  id: number | string
  reason?: string
  isApprove?: boolean
}

export interface ApproveTransportParams {
  transportationVo: TransportationVoData
}

export interface RejectTransportParams {
  transportationVo: TransportationVoData
}

export interface EventAcceptTransportationRequestParams {
  transportationVo: TransportationVoData
}

export interface EventRejectTransportationRequestParams {
  transportationVo: TransportationVoData
}

export interface ResendTransportationRequestParams {
  transportation: { id: number | string }
}

export interface ResendTransportationRequestEventParams {
  transportation: { id: number | string }
}

export interface CancelTransportationRequestParams {
  transportationVo: { id: number | string }
}

export interface CancelTransportationRequestEventParams {
  transportationVo: { id: number | string }
}

export interface TransportationReminderData {
  id?: number | string
  content?: string
  date?: Date | string
  appointmentTransportation?: { id: number | string }
  eventTransportation?: { id: number | string }
}

export interface CreateTransportationReminderParams {
  reminder: TransportationReminderData
}

export interface UpdateTransportationReminderParams {
  reminder: TransportationReminderData
}

export interface DeleteTransportationReminderParams {
  reminder: TransportationReminderData
}

export interface CreateTransportationReminderEventParams {
  reminder: TransportationReminderData
}

export interface UpdateTransportationReminderEventParams {
  reminder: TransportationReminderData
}

export interface DeleteTransportationReminderEventParams {
  reminder: TransportationReminderData
}
