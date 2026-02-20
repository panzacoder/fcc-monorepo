export interface TransportationRequestsParams {
  memberId: number | string
}

export interface TransportationMemberListParams {
  memberId: number | string
}

export interface CreateTransportationParams {
  transport: Record<string, unknown>
}

export interface UpdateTransportationParams {
  transport: Record<string, unknown>
}

export interface DeleteTransportationParams {
  transport: { id: number }
}

export interface CreateTransportationEventParams {
  transport: Record<string, unknown>
}

export interface UpdateTransportationEventParams {
  transport: Record<string, unknown>
}

export interface DeleteTransportationEventParams {
  transport: { id: number }
}

export interface ApproveTransportParams {
  transport: Record<string, unknown>
}

export interface RejectTransportParams {
  transport: Record<string, unknown>
}

export interface EventAcceptTransportationRequestParams {
  transport: Record<string, unknown>
}

export interface EventRejectTransportationRequestParams {
  transport: Record<string, unknown>
}

export interface ResendTransportationRequestParams {
  transport: Record<string, unknown>
}

export interface ResendTransportationRequestEventParams {
  transport: Record<string, unknown>
}

export interface CancelTransportationRequestParams {
  transport: Record<string, unknown>
}

export interface CancelTransportationRequestEventParams {
  transport: Record<string, unknown>
}

export interface CreateTransportationReminderParams {
  reminder: Record<string, unknown>
}

export interface UpdateTransportationReminderParams {
  reminder: Record<string, unknown>
}

export interface DeleteTransportationReminderParams {
  reminder: { id: number }
}

export interface CreateTransportationReminderEventParams {
  reminder: Record<string, unknown>
}

export interface UpdateTransportationReminderEventParams {
  reminder: Record<string, unknown>
}

export interface DeleteTransportationReminderEventParams {
  reminder: { id: number }
}
