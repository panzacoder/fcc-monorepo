# Phase 4: Data Layer Modernization — Design

**GH Issue**: [#101](https://github.com/panzacoder/fcc-monorepo/issues/101)
**Branch**: `fix/gh-101/phase4-data-layer`
**Date**: 2026-02-19

---

## Goal

Typed, consistent data fetching with TanStack Query. Build typed data modules for all domains, create query/mutation hooks, and migrate appointment screens as proof-of-concept. Full 55-screen migration is Phase 4 follow-up work.

---

## Architecture

```
┌─────────────────────────────────────┐
│  Screen Components                  │  ← useAppointments(), useMutation()
├─────────────────────────────────────┤
│  Domain Hooks (data/appointments/   │  ← useQuery/useMutation wrappers
│    hooks.ts, data/doctors/hooks.ts) │     with query key factories
├─────────────────────────────────────┤
│  Data Modules (data/appointments/   │  ← Pure typed async functions
│    api.ts, data/doctors/api.ts)     │     wrapping fetchData<T>
├─────────────────────────────────────┤
│  fetchData<T> (data/base.ts)        │  ← Existing generic wrapper (unchanged)
├─────────────────────────────────────┤
│  CallPostService (utils/)           │  ← Untouched legacy HTTP layer
└─────────────────────────────────────┘
```

### Key Decisions

- **TanStack Query** for caching, deduplication, background refetching, retry — avoids building a throwaway custom hook layer
- Each domain gets a **folder**: `api.ts`, `hooks.ts`, `types.ts`, `index.ts` barrel
- `fetchData<T>` and `CallPostService` stay untouched
- `QueryClientProvider` added to existing Provider tree
- Query keys follow `[domain, action, ...params]` convention
- Both reads (`useQuery`) and writes (`useMutation`) in scope

---

## Domain Module Pattern

Each of the 10 domains follows this identical structure:

```
packages/app/data/<domain>/
  ├── api.ts      # Pure typed async functions (no React)
  ├── hooks.ts    # useQuery/useMutation wrappers with query keys
  ├── types.ts    # Request/response interfaces
  └── index.ts    # Barrel re-exports
```

### api.ts — Pure Functions

```typescript
import { fetchData, type AuthHeader } from '../base'
import { GET_APPOINTMENTS } from 'app/utils/urlConstants'
import type { AppointmentListResponse, GetAppointmentsParams } from './types'

export async function getAppointments(
  header: AuthHeader,
  params: GetAppointmentsParams
): Promise<AppointmentListResponse> {
  return fetchData<AppointmentListResponse>({
    header,
    route: GET_APPOINTMENTS,
    data: { memberDetails: params }
  })
}
```

### hooks.ts — TanStack Query Wrappers

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { AuthHeader } from '../base'
import { getAppointments, createAppointment } from './api'
import type { GetAppointmentsParams, CreateAppointmentParams } from './types'

export const appointmentKeys = {
  all: ['appointments'] as const,
  lists: () => [...appointmentKeys.all, 'list'] as const,
  list: (params: GetAppointmentsParams) =>
    [...appointmentKeys.lists(), params] as const,
  details: () => [...appointmentKeys.all, 'detail'] as const,
  detail: (id: number) => [...appointmentKeys.details(), id] as const
}

export function useAppointments(
  header: AuthHeader,
  params: GetAppointmentsParams
) {
  return useQuery({
    queryKey: appointmentKeys.list(params),
    queryFn: () => getAppointments(header, params)
  })
}

export function useCreateAppointment(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: CreateAppointmentParams) =>
      createAppointment(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() })
    }
  })
}
```

### types.ts — Request/Response Interfaces

```typescript
import type {
  DomainPrivileges,
  AppointmentStatus,
  AppointmentPurpose
} from '../types.d'

export interface AppointmentListItem {
  id: number
  date: string
  status: AppointmentStatus
  purpose: AppointmentPurpose
  // ... derived from actual API response shape
}

export interface AppointmentListResponse {
  domainObjectPrivileges: DomainPrivileges
  list: AppointmentListItem[]
}

export interface GetAppointmentsParams {
  memberId: number
}
```

---

## Shared Types

### AuthHeader (data/base.ts)

```typescript
export type AuthHeader = any // Single place to tighten later
```

### DomainPrivileges (data/types.d.ts)

```typescript
export type PrivilegeAction = '*' | 'Create' | 'Read' | 'Update' | 'Delete'
export type DomainPrivileges = Record<string, PrivilegeAction[]>
```

---

## Provider Setup

### QueryClient Configuration (packages/app/provider/query.tsx)

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 min fresh
      retry: 1, // one retry (up from zero)
      refetchOnWindowFocus: false // no surprise refetches on mobile
    },
    mutations: {
      onError: (error) => {
        Alert.alert('', error.message || 'An unexpected error occurred')
      }
    }
  }
})
```

Wrapped in existing `packages/app/provider/Provider.tsx` alongside Redux.

---

## Error Handling Strategy

Three layers, no changes to existing error flow:

1. **`fetchData<T>` (unchanged)**: Handles SUCCESS/FAILURE envelope, calls `onFailure` or `Alert.alert()`
2. **QueryClient defaults**: Global `onError` for mutations, retry config for queries
3. **Per-hook overrides**: Individual hooks can override for domain-specific needs

`CallPostService` session expiration detection (`emitSessionExpired()`) continues to work unchanged.

---

## Domains

| Domain          | Folder                  | Key Endpoints                                                                   |
| --------------- | ----------------------- | ------------------------------------------------------------------------------- |
| Appointments    | `data/appointments/`    | list, details, create, update, delete, notes, reminders, status, transportation |
| Doctors         | `data/doctors/`         | list, details, create, update, delete, locations                                |
| Facilities      | `data/facilities/`      | list, details, create, update, delete, locations, pharmacy                      |
| Incidents       | `data/incidents/`       | list, details, create, update, delete, notes                                    |
| Events          | `data/events/`          | list, details, create, update, delete, notes, reminders, status, transportation |
| Prescriptions   | `data/prescriptions/`   | list, details, create, update, delete                                           |
| Medical Devices | `data/medical-devices/` | list, details, create, update, delete, notes, reminders                         |
| Caregivers      | `data/caregivers/`      | list, details, create, update, delete, find, resend                             |
| Messages        | `data/messages/`        | threads, thread details, create thread, participants                            |
| Auth            | `data/auth/`            | login, logout, create account, forgot password, verify, OTP                     |

---

## Proof-of-Concept Migration

Migrate two appointment screens to validate the pattern:

- `appointmentsList/screen.tsx` (690 lines) — uses `useAppointments()` hook, removes manual useState/useCallback/CallPostService
- `appointmentDetails/screen.tsx` — uses `useAppointmentDetails()` + mutation hooks for notes, reminders, status changes

Client-side filtering logic stays in the component (UI concern, not data concern).

---

## Follow-Up (Still Phase 4)

- Migrate remaining 53 screens to use typed data hooks (separate PR)
- Create data modules for remaining endpoint domains not in the 10 above (payment, profile, transportation, static data, etc.)

---

## Out of Scope

- Changing `CallPostService` or `fetchData<T>` internals
- React Query Devtools
- RBAC/permissions refactoring (noted in roadmap for review)
