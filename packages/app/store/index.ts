import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { getStorage } from './storage'
import type { StaticData } from 'app/data/static'
import type { LoginAppUser } from 'app/data/auth/types'
import type { Address } from 'app/data/types.d'

interface HeaderState {
  header: Record<string, unknown>
}

interface StaticDataState {
  staticData: StaticData | Record<string, never>
}

interface SponsorState {
  header: Record<string, unknown>
}

interface PaidAdvertiserState {
  header: Record<string, unknown>
}

interface UserProfileState {
  header: LoginAppUser
}

interface SubscriptionState {
  subscription: Record<string, unknown>
}

interface SubscriptionDetailsState {
  subscriptionDetails: Record<string, unknown>
}

interface CurrentMemberAddressState {
  currentMemberAddress: Partial<Address>
}

interface MemberNamesState {
  memberNames: string[]
  memberNamesList?: string[]
}

interface MessageListState {
  messageList: Record<string, unknown>[]
}

export interface AppState {
  headerState: HeaderState
  staticDataState: StaticDataState
  userProfileState: UserProfileState
  sponsor: SponsorState
  paidAdvertiser: PaidAdvertiserState
  subscriptionState: SubscriptionState
  subscriptionDetailsState: SubscriptionDetailsState
  currentMemberAddress: CurrentMemberAddressState
  memberNames: MemberNamesState
  messageList: MessageListState
}

interface AppActions {
  setHeader: (data: Record<string, unknown>) => void
  setStaticData: (data: StaticData) => void
  setUserProfile: (data: LoginAppUser) => void
  setSponsor: (data: unknown) => void
  setPaidAd: (data: unknown) => void
  setSubscription: (data: unknown) => void
  setSubscriptionDetails: (data: unknown) => void
  setMemberAddress: (data: Partial<Address>) => void
  setMemberNames: (data: string[]) => void
  setMessageList: (data: Record<string, unknown>[]) => void
  resetStore: () => void
}

const initialState: AppState = {
  headerState: { header: {} },
  staticDataState: { staticData: {} as Record<string, never> },
  userProfileState: { header: {} as LoginAppUser },
  sponsor: { header: {} },
  paidAdvertiser: { header: {} },
  subscriptionState: { subscription: {} },
  subscriptionDetailsState: { subscriptionDetails: {} },
  currentMemberAddress: { currentMemberAddress: {} },
  memberNames: { memberNames: [] },
  messageList: { messageList: [] }
}

export const useStore = create<AppState & AppActions>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setHeader: (data) =>
          set(
            (state) => ({
              headerState: { ...state.headerState, header: data }
            }),
            undefined,
            'setHeader'
          ),

        setStaticData: (data) =>
          set(
            (state) => ({
              staticDataState: { ...state.staticDataState, staticData: data }
            }),
            undefined,
            'setStaticData'
          ),

        setUserProfile: (data) =>
          set(
            (state) => ({
              userProfileState: {
                ...state.userProfileState,
                header: data
              }
            }),
            undefined,
            'setUserProfile'
          ),

        setSponsor: (data) =>
          set(
            (state) => ({
              sponsor: {
                ...state.sponsor,
                header: data as Record<string, unknown>
              }
            }),
            undefined,
            'setSponsor'
          ),

        setPaidAd: (data) =>
          set(
            (state) => ({
              paidAdvertiser: {
                ...state.paidAdvertiser,
                header: data as Record<string, unknown>
              }
            }),
            undefined,
            'setPaidAd'
          ),

        setSubscription: (data) =>
          set(
            (state) => ({
              subscriptionState: {
                ...state.subscriptionState,
                subscription: data as Record<string, unknown>
              }
            }),
            undefined,
            'setSubscription'
          ),

        setSubscriptionDetails: (data) =>
          set(
            (state) => ({
              subscriptionDetailsState: {
                ...state.subscriptionDetailsState,
                subscriptionDetails: data as Record<string, unknown>
              }
            }),
            undefined,
            'setSubscriptionDetails'
          ),

        setMemberAddress: (data) =>
          set(
            (state) => ({
              currentMemberAddress: {
                ...state.currentMemberAddress,
                currentMemberAddress: data
              }
            }),
            undefined,
            'setMemberAddress'
          ),

        setMemberNames: (data) =>
          set(
            (state) => ({
              memberNames: { ...state.memberNames, memberNamesList: data }
            }),
            undefined,
            'setMemberNames'
          ),

        setMessageList: (data) =>
          set(
            (state) => ({
              messageList: { ...state.messageList, messageList: data }
            }),
            undefined,
            'setMessageList'
          ),

        resetStore: () => set(initialState, undefined, 'resetStore')
      }),
      {
        name: '_appdata_store',
        storage: createJSONStorage(() => getStorage()),
        partialize: (state) => {
          const { resetStore: _, ...rest } = state
          const stateOnly: Record<string, unknown> = {}
          for (const key of Object.keys(initialState)) {
            stateOnly[key] = rest[key as keyof AppState]
          }
          return stateOnly as unknown as AppState
        }
      }
    ),
    { name: 'AppStore' }
  )
)

export type { StaticData }
