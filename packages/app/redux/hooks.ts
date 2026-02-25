import { useStore, type AppState } from 'app/store'
import type { StoreApi, UseBoundStore } from 'zustand'

export type RootState = AppState

export function useAppSelector<T>(selector: (state: AppState) => T): T {
  return useStore(selector)
}

export type AppDispatch = StoreApi<
  AppState & ReturnType<UseBoundStore<StoreApi<AppState>>['getState']>
>['setState']
