# Phase 4: Data Layer Modernization — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Install TanStack Query, build typed data modules for 10 domains, and migrate appointment screens as proof-of-concept.

**Architecture:** Typed async functions in `data/<domain>/api.ts` wrap `fetchData<T>`. TanStack Query hooks in `data/<domain>/hooks.ts` provide caching, deduplication, and loading/error states. Screens consume hooks instead of raw `CallPostService`.

**Tech Stack:** @tanstack/react-query, TypeScript, existing fetchData<T> wrapper

---

### Task 1: Install TanStack Query

**Files:**

- Modify: `packages/app/package.json`

**Step 1: Install the dependency**

Run: `yarn workspace app add @tanstack/react-query`
Expected: Package added to `packages/app/package.json` dependencies

**Step 2: Verify installation**

Run: `yarn install`
Expected: Clean install with no errors

**Step 3: Commit**

```bash
git add packages/app/package.json yarn.lock
git commit -m "chore: install @tanstack/react-query for data layer modernization"
```

---

### Task 2: Create QueryProvider and Wire Into Provider Tree

**Files:**

- Create: `packages/app/provider/query.tsx`
- Modify: `packages/app/provider/index.tsx`
- Modify: `packages/app/provider/index.web.tsx`

**Step 1: Create the QueryProvider**

Create `packages/app/provider/query.tsx`:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Alert } from 'react-native'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error: Error) => {
        Alert.alert('', error.message || 'An unexpected error occurred')
      },
    },
  },
})

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

**Step 2: Wire into native provider**

Modify `packages/app/provider/index.tsx` — wrap `QueryProvider` around `AuthGuard` (inside ReduxProvider, since hooks may read Redux state for headers):

```typescript
'use client'
import { SafeArea } from './safe-area'
import { ReduxProvider } from './redux'
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown'
import { StylesProvider } from './styles-provider'
import { AuthGuard } from './auth-guard'
import { QueryProvider } from './query'

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StylesProvider>
        <ReduxProvider>
          <QueryProvider>
            <SafeArea>
              <AutocompleteDropdownContextProvider>
                <AuthGuard>{children}</AuthGuard>
              </AutocompleteDropdownContextProvider>
            </SafeArea>
          </QueryProvider>
        </ReduxProvider>
      </StylesProvider>
    </>
  )
}
```

**Step 3: Wire into web provider**

Modify `packages/app/provider/index.web.tsx`:

```typescript
'use client'
import { ReduxProvider } from './redux'
import { StylesProvider } from './styles-provider'
import { AuthGuard } from './auth-guard'
import { QueryProvider } from './query'

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <StylesProvider>
      <ReduxProvider>
        <QueryProvider>
          <AuthGuard>{children}</AuthGuard>
        </QueryProvider>
      </ReduxProvider>
    </StylesProvider>
  )
}
```

**Step 4: Verify the build compiles**

Run: `cd /Users/jshebert/Development/fcc/fcc-monorepo && yarn workspace next-app lint`
Expected: No new lint errors

**Step 5: Commit**

```bash
git add packages/app/provider/query.tsx packages/app/provider/index.tsx packages/app/provider/index.web.tsx
git commit -m "feat: add QueryProvider to provider tree for TanStack Query"
```

---

### Task 3: Add Shared Types (AuthHeader, DomainPrivileges)

**Files:**

- Modify: `packages/app/data/base.ts`
- Modify: `packages/app/data/types.d.ts`

**Step 1: Add AuthHeader to base.ts**

In `packages/app/data/base.ts`, add the type alias and update the `fetchDataProps` type to use it:

```typescript
export type AuthHeader = any

type fetchDataProps<DataType> = {
  header: AuthHeader
  route: string
  data?: any
  onFailure?: (response: CallPostServiceResponse<DataType>) => void
}
```

**Step 2: Add DomainPrivileges to types.d.ts**

Append to `packages/app/data/types.d.ts`:

```typescript
export type PrivilegeAction = '*' | 'Create' | 'Read' | 'Update' | 'Delete'
export type DomainPrivileges = Record<string, PrivilegeAction[]>
```

**Step 3: Commit**

```bash
git add packages/app/data/base.ts packages/app/data/types.d.ts
git commit -m "feat: add AuthHeader alias and DomainPrivileges shared types"
```

---

### Task 4: Build Appointments Data Module

This is the most complex domain (~20 endpoints) and serves as the reference implementation for all other domains. Response types must be derived from actual screen usage — see `features/appointmentsList/screen.tsx` and `features/appointmentDetails/screen.tsx` for response shapes.

**Files:**

- Create: `packages/app/data/appointments/types.ts`
- Create: `packages/app/data/appointments/api.ts`
- Create: `packages/app/data/appointments/hooks.ts`
- Create: `packages/app/data/appointments/index.ts`

**Step 1: Create types.ts**

Create `packages/app/data/appointments/types.ts`. Derive response types from the actual `CallPostService` usage in `features/appointmentsList/screen.tsx:156-178` and `features/appointmentDetails/screen.tsx`. The appointment list response data shape (extracted from screen code) is:

```typescript
import type { DomainPrivileges } from '../types.d'

export interface AppointmentListItem {
  id: number
  date: string
  status: string
  purpose: string
  appointment: string
  type: string
  hasNotes: boolean
  hasReminders: boolean
  hasTransportation: boolean
  unreadMessageCount: number
  activeReminderCount: number
  transportationStatus: string
  markCompleteCancel: boolean
}

export interface AppointmentListResponse {
  domainObjectPrivileges: DomainPrivileges
  list: AppointmentListItem[]
}

export interface GetAppointmentsParams {
  id: number | string
  month?: string
  year?: string
  type?: string
  doctorId?: string | number
  facilityId?: string | number
}

export interface DoctorFacilityItem {
  name: string
  doctorId: number | null
  facilityId: number | null
}

export type DoctorFacilityListResponse = DoctorFacilityItem[]

export interface GetDoctorFacilitiesParams {
  memberId: number | string
  appointmentType: string
}

export interface CreateAppointmentParams {
  appointment: Record<string, unknown>
}

export interface UpdateAppointmentParams {
  appointment: Record<string, unknown>
}

export interface DeleteAppointmentParams {
  appointment: { id: number }
}

export interface AppointmentNoteParams {
  note: Record<string, unknown>
}

export interface AppointmentReminderParams {
  reminder: Record<string, unknown>
}

export interface UpdateAppointmentStatusParams {
  appointment: { id: number; status: string }
}
```

**Step 2: Create api.ts**

Create `packages/app/data/appointments/api.ts`:

```typescript
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
  params: { note: { id: number } }
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: DELETE_APPOINTMENT_NOTE,
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
  params: { reminder: { id: number } }
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
```

**Step 3: Create hooks.ts**

Create `packages/app/data/appointments/hooks.ts`:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { AuthHeader } from '../base'
import {
  getAppointments,
  getDoctorFacilities,
  getAppointmentDetails,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  createAppointmentNote,
  updateAppointmentNote,
  deleteAppointmentNote,
  createAppointmentReminder,
  updateAppointmentReminder,
  deleteAppointmentReminder,
  updateAppointmentStatus,
  getAppointmentDoctors,
  getAppointmentFacilities
} from './api'
import type {
  GetAppointmentsParams,
  GetDoctorFacilitiesParams,
  CreateAppointmentParams,
  UpdateAppointmentParams,
  DeleteAppointmentParams,
  AppointmentNoteParams,
  AppointmentReminderParams,
  UpdateAppointmentStatusParams
} from './types'

export const appointmentKeys = {
  all: ['appointments'] as const,
  lists: () => [...appointmentKeys.all, 'list'] as const,
  list: (params: GetAppointmentsParams) =>
    [...appointmentKeys.lists(), params] as const,
  details: () => [...appointmentKeys.all, 'detail'] as const,
  detail: (id: number) => [...appointmentKeys.details(), id] as const,
  doctorFacilities: (params: GetDoctorFacilitiesParams) =>
    [...appointmentKeys.all, 'doctorFacilities', params] as const,
  doctors: (memberId: number) =>
    [...appointmentKeys.all, 'doctors', memberId] as const,
  facilities: (memberId: number) =>
    [...appointmentKeys.all, 'facilities', memberId] as const
}

export function useAppointments(
  header: AuthHeader,
  params: GetAppointmentsParams
) {
  return useQuery({
    queryKey: appointmentKeys.list(params),
    queryFn: () => getAppointments(header, params),
    enabled: !!header
  })
}

export function useDoctorFacilities(
  header: AuthHeader,
  params: GetDoctorFacilitiesParams
) {
  return useQuery({
    queryKey: appointmentKeys.doctorFacilities(params),
    queryFn: () => getDoctorFacilities(header, params),
    enabled: !!header
  })
}

export function useAppointmentDetails(header: AuthHeader, id: number) {
  return useQuery({
    queryKey: appointmentKeys.detail(id),
    queryFn: () => getAppointmentDetails(header, { id }),
    enabled: !!header && !!id
  })
}

export function useAppointmentDoctors(header: AuthHeader, memberId: number) {
  return useQuery({
    queryKey: appointmentKeys.doctors(memberId),
    queryFn: () => getAppointmentDoctors(header, { memberId }),
    enabled: !!header && !!memberId
  })
}

export function useAppointmentFacilities(header: AuthHeader, memberId: number) {
  return useQuery({
    queryKey: appointmentKeys.facilities(memberId),
    queryFn: () => getAppointmentFacilities(header, { memberId }),
    enabled: !!header && !!memberId
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

export function useUpdateAppointment(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: UpdateAppointmentParams) =>
      updateAppointment(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all })
    }
  })
}

export function useDeleteAppointment(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: DeleteAppointmentParams) =>
      deleteAppointment(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() })
    }
  })
}

export function useCreateAppointmentNote(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: AppointmentNoteParams) =>
      createAppointmentNote(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all })
    }
  })
}

export function useUpdateAppointmentNote(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: AppointmentNoteParams) =>
      updateAppointmentNote(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all })
    }
  })
}

export function useDeleteAppointmentNote(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: { note: { id: number } }) =>
      deleteAppointmentNote(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all })
    }
  })
}

export function useCreateAppointmentReminder(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: AppointmentReminderParams) =>
      createAppointmentReminder(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all })
    }
  })
}

export function useUpdateAppointmentReminder(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: AppointmentReminderParams) =>
      updateAppointmentReminder(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all })
    }
  })
}

export function useDeleteAppointmentReminder(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: { reminder: { id: number } }) =>
      deleteAppointmentReminder(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all })
    }
  })
}

export function useUpdateAppointmentStatus(header: AuthHeader) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: UpdateAppointmentStatusParams) =>
      updateAppointmentStatus(header, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all })
    }
  })
}
```

**Step 4: Create barrel index.ts**

Create `packages/app/data/appointments/index.ts`:

```typescript
export * from './api'
export * from './hooks'
export * from './types'
```

**Step 5: Verify lint passes**

Run: `yarn workspace next-app lint`
Expected: No new errors

**Step 6: Commit**

```bash
git add packages/app/data/appointments/
git commit -m "feat: add appointments data module with typed API functions and TanStack Query hooks"
```

---

### Task 5: Build Doctors Data Module

**Files:**

- Create: `packages/app/data/doctors/types.ts`
- Create: `packages/app/data/doctors/api.ts`
- Create: `packages/app/data/doctors/hooks.ts`
- Create: `packages/app/data/doctors/index.ts`

Follow the same pattern as Task 4. Reference endpoints from `urlConstants.tsx`:

- `GET_MEMBER_DOCTORS` (`doctorms/getMemberDoctors`)
- `GET_DOCTOR_DETAILS` (`doctorms/getDoctorWithAppointments`)
- `CREATE_DOCTOR` (`doctorms/create`)
- `UPDATE_DOCTOR` (`doctorms/update`)
- `DELETE_DOCTOR` (`doctorms/delete`)
- `CREATE_DOCTOR_LOCATION` (`doctorms/createLocation`)
- `UPDATE_DOCTOR_LOCATION` (`doctorms/updateLocation`)
- `DELETE_DOCTOR_LOCATION` (`doctorms/deleteLocation`)
- `GET_ACTIVE_DOCTORS` (`doctorms/getActiveDoctors`)

Derive response types from `features/doctorsList/screen.tsx` and `features/doctorDetails/screen.tsx`. Query key factory: `doctorKeys`.

**Step 1: Create types.ts, api.ts, hooks.ts, index.ts** following Task 4 pattern

**Step 2: Verify lint passes**

Run: `yarn workspace next-app lint`

**Step 3: Commit**

```bash
git add packages/app/data/doctors/
git commit -m "feat: add doctors data module with typed API functions and TanStack Query hooks"
```

---

### Task 6: Build Facilities Data Module

**Files:**

- Create: `packages/app/data/facilities/types.ts`
- Create: `packages/app/data/facilities/api.ts`
- Create: `packages/app/data/facilities/hooks.ts`
- Create: `packages/app/data/facilities/index.ts`

Reference endpoints:

- `GET_MEMBER_FACILITIES`, `GET_FACILITY_DETAILS`, `CREATE_FACILITY`, `UPDATE_FACILITY`, `DELETE_FACILITY`
- `CREATE_FACILITY_LOCATION`, `UPDATE_FACILITY_LOCATION`, `DELETE_FACILITY_LOCATION`
- `GET_PHARMACY_LIST`

Derive response types from `features/facilitiesList/screen.tsx` and `features/facilityDetails/screen.tsx`. Query key factory: `facilityKeys`.

**Step 1: Create types.ts, api.ts, hooks.ts, index.ts** following Task 4 pattern

**Step 2: Verify lint passes**

**Step 3: Commit**

```bash
git add packages/app/data/facilities/
git commit -m "feat: add facilities data module with typed API functions and TanStack Query hooks"
```

---

### Task 7: Build Incidents Data Module

**Files:**

- Create: `packages/app/data/incidents/types.ts`
- Create: `packages/app/data/incidents/api.ts`
- Create: `packages/app/data/incidents/hooks.ts`
- Create: `packages/app/data/incidents/index.ts`

Reference endpoints:

- `GET_INCIDENTS`, `GET_INCIDENT_DETAILS`, `CREATE_INCIDENT`, `UPDATE_INCIDENT`, `DELETE_INCIDENT`
- `CREATE_INCIDENT_NOTE`, `UPDATE_INCIDENT_NOTE`, `DELETE_INCIDENT_NOTE`, `GET_INCIDENT_NOTE`

Derive response types from `features/incidentsList/screen.tsx` (if exists) and `features/incidentDetails/screen.tsx`. Query key factory: `incidentKeys`.

**Step 1: Create types.ts, api.ts, hooks.ts, index.ts** following Task 4 pattern

**Step 2: Verify lint passes**

**Step 3: Commit**

```bash
git add packages/app/data/incidents/
git commit -m "feat: add incidents data module with typed API functions and TanStack Query hooks"
```

---

### Task 8: Build Events Data Module

**Files:**

- Create: `packages/app/data/events/types.ts`
- Create: `packages/app/data/events/api.ts`
- Create: `packages/app/data/events/hooks.ts`
- Create: `packages/app/data/events/index.ts`

Reference endpoints:

- `GET_EVENTS`, `GET_EVENT_DETAILS`, `CREATE_EVENT`, `UPDATE_EVENT`, `DELETE_EVENT`
- `CREATE_EVENT_NOTE`, `UPDATE_EVENT_NOTE`, `DELETE_EVENT_NOTE`, `GET_EVENT_NOTE`
- `CREATE_EVENT_REMINDER`, `UPDATE_EVENT_REMINDER`, `DELETE_EVENT_REMINDER`
- `UPDATE_EVENT_STATUS`

Derive response types from `features/eventDetails/screen.tsx`. Query key factory: `eventKeys`.

**Step 1: Create types.ts, api.ts, hooks.ts, index.ts** following Task 4 pattern

**Step 2: Verify lint passes**

**Step 3: Commit**

```bash
git add packages/app/data/events/
git commit -m "feat: add events data module with typed API functions and TanStack Query hooks"
```

---

### Task 9: Build Prescriptions Data Module

**Files:**

- Create: `packages/app/data/prescriptions/types.ts`
- Create: `packages/app/data/prescriptions/api.ts`
- Create: `packages/app/data/prescriptions/hooks.ts`
- Create: `packages/app/data/prescriptions/index.ts`

Reference endpoints:

- `GET_PRESCRIPTION_LIST`, `GET_PRESCRIPTION`, `CREATE_PRESCRIPTION`, `UPDATE_PRESCRIPTION`, `DELETE_PRESCRIPTION`

Derive response types from `features/prescriptionDetails/screen.tsx`. Query key factory: `prescriptionKeys`.

**Step 1: Create types.ts, api.ts, hooks.ts, index.ts** following Task 4 pattern

**Step 2: Verify lint passes**

**Step 3: Commit**

```bash
git add packages/app/data/prescriptions/
git commit -m "feat: add prescriptions data module with typed API functions and TanStack Query hooks"
```

---

### Task 10: Build Medical Devices Data Module

**Files:**

- Create: `packages/app/data/medical-devices/types.ts`
- Create: `packages/app/data/medical-devices/api.ts`
- Create: `packages/app/data/medical-devices/hooks.ts`
- Create: `packages/app/data/medical-devices/index.ts`

Reference endpoints:

- `GET_MEDICAL_DEVICES`, `GET_MEDICAL_DEVICE_DETAILS`, `CREATE_MEDICAL_DEVICE`, `UPDATE_MEDICAL_DEVICE`, `DELETE_MEDICAL_DEVICE`
- `CREATE_MEDICAL_DEVICE_NOTE`, `UPDATE_MEDICAL_DEVICE_NOTE`, `DELETE_MEDICAL_DEVICE_NOTE`, `GET_MEDICAL_DEVICE_NOTE`
- `CREATE_MEDICAL_DEVICE_REMINDER`, `UPDATE_MEDICAL_DEVICE_REMINDER`, `DELETE_MEDICAL_DEVICE_REMINDER`

Derive response types from `features/medicalDevicesDetails/screen.tsx`. Query key factory: `medicalDeviceKeys`.

**Step 1: Create types.ts, api.ts, hooks.ts, index.ts** following Task 4 pattern

**Step 2: Verify lint passes**

**Step 3: Commit**

```bash
git add packages/app/data/medical-devices/
git commit -m "feat: add medical-devices data module with typed API functions and TanStack Query hooks"
```

---

### Task 11: Build Caregivers Data Module

**Files:**

- Create: `packages/app/data/caregivers/types.ts`
- Create: `packages/app/data/caregivers/api.ts`
- Create: `packages/app/data/caregivers/hooks.ts`
- Create: `packages/app/data/caregivers/index.ts`

Reference endpoints:

- `GET_MEMBER_CAREGIVERS`, `GET_CAREGIVER_DETAILS`, `CREATE_CAREGIVER`, `UPDATE_CAREGIVER`, `DELETE_CAREGIVER`
- `FIND_CAREGIVER_BY_EMAIL_PHONE`, `RESEND_CAREGIVER_REQEST`

Derive response types from `features/caregiverDetails/screen.tsx`. Query key factory: `caregiverKeys`.

**Step 1: Create types.ts, api.ts, hooks.ts, index.ts** following Task 4 pattern

**Step 2: Verify lint passes**

**Step 3: Commit**

```bash
git add packages/app/data/caregivers/
git commit -m "feat: add caregivers data module with typed API functions and TanStack Query hooks"
```

---

### Task 12: Build Messages Data Module

**Files:**

- Create: `packages/app/data/messages/types.ts`
- Create: `packages/app/data/messages/api.ts`
- Create: `packages/app/data/messages/hooks.ts`
- Create: `packages/app/data/messages/index.ts`

Reference endpoints:

- `GET_MEMBER_THREADS`, `GET_THREAD`, `CREATE_MESSAGE_THREAD`, `UPDATE_MESSAGE_THREAD`
- `GET_THREAD_PARTICIPANTS`, `UPDATE_THREAD_PARTICIPANTS`

Derive response types from `features/messages/screen.tsx`. Query key factory: `messageKeys`.

**Step 1: Create types.ts, api.ts, hooks.ts, index.ts** following Task 4 pattern

**Step 2: Verify lint passes**

**Step 3: Commit**

```bash
git add packages/app/data/messages/
git commit -m "feat: add messages data module with typed API functions and TanStack Query hooks"
```

---

### Task 13: Build Auth Data Module

**Files:**

- Create: `packages/app/data/auth/types.ts`
- Create: `packages/app/data/auth/api.ts`
- Create: `packages/app/data/auth/hooks.ts`
- Create: `packages/app/data/auth/index.ts`

Reference endpoints:

- `USER_LOGIN`, `USER_LOGOUT`, `CREATE_ACCOUNT`, `FORGOT_PASSWORD`, `RESET_PASSWORD`
- `VERIFY_ACCOUNT`, `RESEND_OTP`, `CHECK_VALID_CREDENTIAL`

Auth operations are mostly mutations (login, logout, create account, etc.) with no persistent query caching. The hooks.ts will primarily export `useMutation` wrappers. Query key factory: `authKeys`.

**Step 1: Create types.ts, api.ts, hooks.ts, index.ts** following Task 4 pattern

**Step 2: Verify lint passes**

**Step 3: Commit**

```bash
git add packages/app/data/auth/
git commit -m "feat: add auth data module with typed API functions and TanStack Query hooks"
```

---

### Task 14: Migrate appointmentsList Screen to Use Hooks

This is the proof-of-concept migration. Replace `CallPostService` calls with TanStack Query hooks.

**Files:**

- Modify: `packages/app/features/appointmentsList/screen.tsx`

**Step 1: Study current data fetching in the screen**

The screen currently has two `CallPostService` calls:

1. `getDoctorFacilities` (line 101-141) — fetches doctor/facility filter options
2. `getAppointmentDetails` (line 142-179) — fetches appointment list with filters

Both are called in `useEffect` on mount (line 198-208). Filter changes trigger `getAppointmentDetails()` again.

**Step 2: Replace imports and data fetching**

Replace `CallPostService`, `BASE_URL`, `GET_APPOINTMENTS`, `GET_DOCTOR_FACILITIES` imports with hooks from the appointments data module.

Key changes:

- Remove: `import { CallPostService } from 'app/utils/fetchServerData'`
- Remove: `import { BASE_URL, GET_APPOINTMENTS, GET_DOCTOR_FACILITIES } from 'app/utils/urlConstants'`
- Add: `import { useAppointments, useDoctorFacilities } from 'app/data/appointments'`
- Remove: `useState` for `isLoading`, manual loading management
- Remove: `useCallback` wrappers for `getDoctorFacilities` and `getAppointmentDetails`
- Replace with `useAppointments(header, filterParams)` and `useDoctorFacilities(header, doctorFacilityParams)`
- Keep: All client-side filtering logic (`getFilteredList`, `setFilteredList`, `filterAppointment`)
- Keep: All UI rendering code
- The `appointmentPrivilegesRef` can be derived from `data.domainObjectPrivileges?.Appointment`
- Use `isLoading` from the hook instead of manual `useState`
- Use `refetch` from the hook when filters change instead of calling the function manually

**Important considerations:**

- The current screen re-fetches appointments when filters change by calling `getAppointmentDetails()` directly. With TanStack Query, changing the `params` object passed to `useAppointments` will automatically trigger a re-fetch (new query key = new query).
- The `doctorFacilities` query depends on the selected type filter. Pass the type as part of the query params so it auto-refetches.
- The `domainObjectPrivileges` extraction moves from the callback into a derived value from `data`.

**Step 3: Verify lint passes**

Run: `yarn workspace next-app lint`

**Step 4: Commit**

```bash
git add packages/app/features/appointmentsList/screen.tsx
git commit -m "refactor: migrate appointmentsList screen to TanStack Query hooks"
```

---

### Task 15: Migrate appointmentDetails Screen to Use Hooks

**Files:**

- Modify: `packages/app/features/appointmentDetails/screen.tsx`

**Step 1: Study current data fetching**

Read the screen file to identify all `CallPostService` calls — these will include fetching appointment details, creating/updating/deleting notes, creating/updating/deleting reminders, updating status, and transportation operations.

**Step 2: Replace data fetching with hooks**

- Replace detail fetch with `useAppointmentDetails(header, appointmentId)`
- Replace note operations with `useCreateAppointmentNote`, `useUpdateAppointmentNote`, `useDeleteAppointmentNote`
- Replace reminder operations with `useCreateAppointmentReminder`, `useUpdateAppointmentReminder`, `useDeleteAppointmentReminder`
- Replace status update with `useUpdateAppointmentStatus`
- Keep transportation operations as `CallPostService` for now (transportation has its own domain, not yet migrated)

**Step 3: Verify lint passes**

Run: `yarn workspace next-app lint`

**Step 4: Commit**

```bash
git add packages/app/features/appointmentDetails/screen.tsx
git commit -m "refactor: migrate appointmentDetails screen to TanStack Query hooks"
```

---

### Task 16: Final Verification and Follow-Up Issues

**Step 1: Run full lint and type check**

Run: `yarn workspace next-app lint`
Expected: No new errors

**Step 2: Create follow-up GitHub issues**

Create two GitHub issues for the remaining Phase 4 work:

Issue 1: "Migrate remaining screens to typed data hooks"

- Body: List all 53 remaining screens that still use `CallPostService` directly
- Label: `modernization`

Issue 2: "Create data modules for remaining endpoint domains"

- Body: List domains not covered (payment, profile, transportation, static data, home/dashboard, circle/members)
- Label: `modernization`

Run:

```bash
gh issue create --title "[Phase 4] Migrate remaining screens to typed data hooks" --label "modernization" --body "Follow-up from Phase 4 infrastructure PR. Migrate remaining 53 screens from raw CallPostService to typed data module hooks."

gh issue create --title "[Phase 4] Create data modules for remaining endpoint domains" --label "modernization" --body "Follow-up from Phase 4 infrastructure PR. Create typed data modules for: payment, profile, transportation, static data, home/dashboard, circle/members."
```

**Step 3: Final commit and verification**

Run: `git log --oneline fix/gh-101/phase4-data-layer`
Expected: Clean commit history with one commit per logical unit of work
