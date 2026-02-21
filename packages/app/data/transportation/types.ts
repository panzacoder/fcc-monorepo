export interface TransportationRequestsParams {
  memberId: number | string
}

export interface TransportationMemberListParams {
  memberId: number | string
}

export interface CreateTransportationParams {
  transportation: Record<string, unknown>
}

export interface UpdateTransportationParams {
  transportation: Record<string, unknown>
}

export interface DeleteTransportationParams {
  transportation: { id: number | string }
}

export interface CreateTransportationEventParams {
  transportation: Record<string, unknown>
}

export interface UpdateTransportationEventParams {
  transportation: Record<string, unknown>
}

export interface DeleteTransportationEventParams {
  transportation: { id: number | string }
}

export interface ApproveTransportParams {
  transportationVo: Record<string, unknown>
}

export interface RejectTransportParams {
  transportationVo: Record<string, unknown>
}

export interface EventAcceptTransportationRequestParams {
  transportationVo: Record<string, unknown>
}

export interface EventRejectTransportationRequestParams {
  transportationVo: Record<string, unknown>
}

export interface ResendTransportationRequestParams {
  transportation: Record<string, unknown>
}

export interface ResendTransportationRequestEventParams {
  transportation: Record<string, unknown>
}

export interface CancelTransportationRequestParams {
  transportationVo: Record<string, unknown>
}

export interface CancelTransportationRequestEventParams {
  transportationVo: Record<string, unknown>
}

export interface CreateTransportationReminderParams {
  reminder: Record<string, unknown>
}

export interface UpdateTransportationReminderParams {
  reminder: Record<string, unknown>
}

export interface DeleteTransportationReminderParams {
  reminder: Record<string, unknown>
}

export interface CreateTransportationReminderEventParams {
  reminder: Record<string, unknown>
}

export interface UpdateTransportationReminderEventParams {
  reminder: Record<string, unknown>
}

export interface DeleteTransportationReminderEventParams {
  reminder: Record<string, unknown>
}
