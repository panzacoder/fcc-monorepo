import type { DomainPrivileges } from '../types.d'

export interface MessageThreadType {
  id: number
  type: string
  description: string | null
}

export interface ParticipantDetail {
  name: string
}

export interface Participant {
  participantName: string
}

export interface Message {
  sender: number
  senderName: string
  body: string
  createdOn: string
}

export interface MessageThread {
  id: number
  subject: string
  type: MessageThreadType
  updatedOn: string | null
  unreadMessageCount: number
  participantDetailsList: ParticipantDetail[]
  participantList: Participant[]
  messageList: Message[]
  isCreatedByUser: boolean
}

export interface GetMemberThreadsResponse {
  domainObjectPrivileges: DomainPrivileges
  threadList: MessageThread[]
}

export interface GetMemberThreadsParams {
  member: {
    id: number | string
  }
}

export interface GetThreadResponse {
  messageThread: MessageThread
}

export interface GetThreadParams {
  messageThread: {
    id: number | string
  }
}

export interface CreateMessageThreadParams {
  messageThread: {
    subject: string
    member: number | string
    type: {
      type: string
    }
    participantList: { user: { id: number } }[]
    messageList: Record<string, unknown>[]
  }
}

export interface CreateMessageThreadResponse {
  messageThread: MessageThread
}

export interface UpdateMessageThreadParams {
  messageThread: {
    id: number | string
    messageList: { body: string; operation: string }[]
  }
}

export interface GetThreadParticipantsParams {
  member: {
    id: number | string
  }
  messageThreadType: {
    type: string
  }
}

export interface ThreadParticipant {
  id: number
  name: string
  firstname: string
  lastname: string
  isSelected?: boolean
}

export type GetThreadParticipantsResponse = ThreadParticipant[]

export interface UpdateThreadParticipantsParams {
  messageThread: {
    id: number | string
    type: {
      type: string
    }
    participantList: { user: { id: number }; operation: string }[]
  }
}
