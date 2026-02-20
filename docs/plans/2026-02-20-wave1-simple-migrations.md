# Wave 1: Simple Screen Migrations — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate 12 screens across 4 domains (doctors, facilities, caregivers, prescriptions) from CallPostService to TanStack Query hooks.

**Architecture:** Each screen replaces its CallPostService calls with existing TanStack Query hooks from `packages/app/data/<domain>/`. Two hooks need to be added first (share contact info for doctors and facilities). Screens follow the migration pattern established by appointmentsList and appointmentDetails.

**Tech Stack:** @tanstack/react-query, TypeScript, existing data module hooks

---

### Task 1: Add shareDoctor hook to doctors module

**Files:**

- Modify: `packages/app/data/doctors/types.ts`
- Modify: `packages/app/data/doctors/api.ts`
- Modify: `packages/app/data/doctors/hooks.ts`
- Modify: `packages/app/data/doctors/index.ts`

**Step 1: Add type**

Add to `packages/app/data/doctors/types.ts`:

```typescript
export interface ShareDoctorParams {
  doctorSharingInfo: {
    doctorid: number | string
    targetemail: string
  }
}
```

**Step 2: Add API function**

Add to `packages/app/data/doctors/api.ts`:

```typescript
import { SHARE_CONTACT_INFO } from 'app/utils/urlConstants'

export async function shareDoctor(
  header: AuthHeader,
  params: ShareDoctorParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: SHARE_CONTACT_INFO,
    data: params
  })
}
```

**Step 3: Add hook**

Add to `packages/app/data/doctors/hooks.ts`:

```typescript
export function useShareDoctor(header: AuthHeader) {
  return useMutation({
    mutationFn: (params: ShareDoctorParams) => shareDoctor(header, params)
  })
}
```

**Step 4: Update barrel export**

Ensure `index.ts` re-exports the new function, hook, and type.

**Step 5: Commit**

```bash
git add packages/app/data/doctors/
git commit -m "feat: add shareDoctor hook to doctors data module"
```

---

### Task 2: Add shareFacility hook to facilities module

**Files:**

- Modify: `packages/app/data/facilities/types.ts`
- Modify: `packages/app/data/facilities/api.ts`
- Modify: `packages/app/data/facilities/hooks.ts`
- Modify: `packages/app/data/facilities/index.ts`

**Step 1: Add type**

Add to `packages/app/data/facilities/types.ts`:

```typescript
export interface ShareFacilityParams {
  doctorSharingInfo: {
    facilityid: number | string
    targetemail: string
  }
}
```

Note: The server uses `doctorSharingInfo` as the wrapper key even for facilities.

**Step 2: Add API function**

Add to `packages/app/data/facilities/api.ts`:

```typescript
import { SHARE_CONTACT_INFO } from 'app/utils/urlConstants'

export async function shareFacility(
  header: AuthHeader,
  params: ShareFacilityParams
) {
  return fetchData<Record<string, unknown>>({
    header,
    route: SHARE_CONTACT_INFO,
    data: params
  })
}
```

**Step 3: Add hook**

Add to `packages/app/data/facilities/hooks.ts`:

```typescript
export function useShareFacility(header: AuthHeader) {
  return useMutation({
    mutationFn: (params: ShareFacilityParams) => shareFacility(header, params)
  })
}
```

**Step 4: Update barrel export**

Ensure `index.ts` re-exports the new function, hook, and type.

**Step 5: Commit**

```bash
git add packages/app/data/facilities/
git commit -m "feat: add shareFacility hook to facilities data module"
```

---

### Task 3: Migrate doctorsList screen

**Files:**

- Modify: `packages/app/features/doctorsList/screen.tsx`

**Migration spec:**

- Replace `GET_MEMBER_DOCTORS` CallPostService call with `useMemberDoctors` hook from `app/data/doctors`
- Remove `CallPostService` import if no longer needed
- Remove URL constant imports that are replaced
- Add useEffect to process query data (privileges, doctor list)
- Derive isLoading from hook state
- Preserve all navigation, alerts, state updates

**Commit:**

```bash
git add packages/app/features/doctorsList/screen.tsx
git commit -m "feat: migrate doctorsList screen to TanStack Query hooks"
```

---

### Task 4: Migrate doctorDetails screen

**Files:**

- Modify: `packages/app/features/doctorDetails/screen.tsx`

**Migration spec:**

- Replace `GET_DOCTOR_DETAILS` with `useDoctorDetails` query hook
- Replace `DELETE_DOCTOR` with `useDeleteDoctor` mutation hook
- Replace `SHARE_CONTACT_INFO` with `useShareDoctor` mutation hook (from Task 1)
- Remove CallPostService and URL constant imports that are replaced
- Add useEffect to process query data
- Derive isLoading from hook states (query + mutations)
- Preserve all navigation, alerts, state updates

**Commit:**

```bash
git add packages/app/features/doctorDetails/screen.tsx
git commit -m "feat: migrate doctorDetails screen to TanStack Query hooks"
```

---

### Task 5: Migrate addEditDoctor screen

**Files:**

- Modify: `packages/app/features/addEditDoctor/screen.tsx`

**Migration spec:**

- Replace `CREATE_DOCTOR` with `useCreateDoctor` mutation hook
- Replace `UPDATE_DOCTOR` with `useUpdateDoctor` mutation hook
- Remove CallPostService and URL constant imports that are replaced
- Derive isLoading from mutation isPending states
- Preserve all navigation (router.push after success), alerts, form state

**Commit:**

```bash
git add packages/app/features/addEditDoctor/screen.tsx
git commit -m "feat: migrate addEditDoctor screen to TanStack Query hooks"
```

---

### Task 6: Migrate facilitiesList screen

**Files:**

- Modify: `packages/app/features/facilitiesList/screen.tsx`

**Migration spec:**

- Replace `GET_MEMBER_FACILITIES` CallPostService call with `useMemberFacilities` hook from `app/data/facilities`
- Remove CallPostService and URL constant imports that are replaced
- Add useEffect to process query data
- Derive isLoading from hook state
- Preserve all navigation, alerts, state updates

**Commit:**

```bash
git add packages/app/features/facilitiesList/screen.tsx
git commit -m "feat: migrate facilitiesList screen to TanStack Query hooks"
```

---

### Task 7: Migrate facilityDetails screen

**Files:**

- Modify: `packages/app/features/facilityDetails/screen.tsx`

**Migration spec:**

- Replace `GET_FACILITY_DETAILS` with `useFacilityDetails` query hook
- Replace `DELETE_FACILITY` with `useDeleteFacility` mutation hook
- Replace `SHARE_CONTACT_INFO` with `useShareFacility` mutation hook (from Task 2)
- Remove CallPostService and URL constant imports that are replaced
- Add useEffect to process query data
- Derive isLoading from hook states
- Preserve all navigation, alerts, state updates

**Commit:**

```bash
git add packages/app/features/facilityDetails/screen.tsx
git commit -m "feat: migrate facilityDetails screen to TanStack Query hooks"
```

---

### Task 8: Migrate addEditFacility screen

**Files:**

- Modify: `packages/app/features/addEditFacility/screen.tsx`

**Migration spec:**

- Replace `CREATE_FACILITY` with `useCreateFacility` mutation hook
- Replace `UPDATE_FACILITY` with `useUpdateFacility` mutation hook
- Remove CallPostService and URL constant imports that are replaced
- Derive isLoading from mutation isPending states
- Preserve all navigation (router.push after success), alerts, form state

**Commit:**

```bash
git add packages/app/features/addEditFacility/screen.tsx
git commit -m "feat: migrate addEditFacility screen to TanStack Query hooks"
```

---

### Task 9: Migrate caregiersList screen

**Files:**

- Modify: `packages/app/features/caregiersList/screen.tsx`

**Migration spec:**

- Replace `GET_MEMBER_CAREGIVERS` with `useMemberCaregivers` query hook from `app/data/caregivers`
- Replace `RESEND_CAREGIVER_REQEST` with `useResendCaregiverRequest` mutation hook
- Remove CallPostService and URL constant imports that are replaced
- Add useEffect to process query data
- Derive isLoading from hook states
- Preserve all navigation, alerts, state updates

**Commit:**

```bash
git add packages/app/features/caregiersList/screen.tsx
git commit -m "feat: migrate caregiersList screen to TanStack Query hooks"
```

---

### Task 10: Migrate caregiverDetails screen

**Files:**

- Modify: `packages/app/features/caregiverDetails/screen.tsx`

**Migration spec:**

- Replace `GET_CAREGIVER_DETAILS` with `useCaregiverDetails` query hook
- Replace `DELETE_CAREGIVER` with `useDeleteCaregiver` mutation hook
- Remove CallPostService and URL constant imports that are replaced
- Add useEffect to process query data
- Derive isLoading from hook states
- Preserve all navigation, alerts, state updates

**Commit:**

```bash
git add packages/app/features/caregiverDetails/screen.tsx
git commit -m "feat: migrate caregiverDetails screen to TanStack Query hooks"
```

---

### Task 11: Migrate addEditCaregiver screen

**Files:**

- Modify: `packages/app/features/addEditCaregiver/screen.tsx`

**Migration spec:**

- Replace `FIND_CAREGIVER_BY_EMAIL_PHONE` with `useFindCaregiverByEmailPhone` hook (note: this is currently a query hook but the screen calls it imperatively — may need to convert to mutation or use refetch pattern)
- Replace `CREATE_CAREGIVER` with `useCreateCaregiver` mutation hook
- Replace `UPDATE_CAREGIVER` with `useUpdateCaregiver` mutation hook
- Remove CallPostService and URL constant imports that are replaced
- Derive isLoading from hook states
- Preserve all navigation, alerts, form state

**Commit:**

```bash
git add packages/app/features/addEditCaregiver/screen.tsx
git commit -m "feat: migrate addEditCaregiver screen to TanStack Query hooks"
```

---

### Task 12: Migrate prescriptionsList screen

**Files:**

- Modify: `packages/app/features/prescriptionsList/screen.tsx`

**Migration spec:**

- Replace `GET_PRESCRIPTION_LIST` with `usePrescriptionList` hook from `app/data/prescriptions`
- Replace `GET_PHARMACY_LIST` with `usePharmacyList` hook from `app/data/facilities` (cross-domain import)
- Replace `GET_ACTIVE_DOCTORS` with `useActiveDoctors` hook from `app/data/doctors` (cross-domain import)
- Remove CallPostService and URL constant imports that are replaced
- Add useEffect to process query data
- Derive isLoading from all hook states
- Preserve all navigation, alerts, filter state

**Commit:**

```bash
git add packages/app/features/prescriptionsList/screen.tsx
git commit -m "feat: migrate prescriptionsList screen to TanStack Query hooks"
```

---

### Task 13: Migrate prescriptionDetails screen

**Files:**

- Modify: `packages/app/features/prescriptionDetails/screen.tsx`

**Migration spec:**

- Replace `GET_PRESCRIPTION` with `usePrescription` query hook
- Replace `DELETE_PRESCRIPTION` with `useDeletePrescription` mutation hook
- Remove CallPostService and URL constant imports that are replaced
- Add useEffect to process query data
- Derive isLoading from hook states
- Preserve all navigation, alerts, state updates

**Commit:**

```bash
git add packages/app/features/prescriptionDetails/screen.tsx
git commit -m "feat: migrate prescriptionDetails screen to TanStack Query hooks"
```

---

### Task 14: Migrate addEditPrescription screen

**Files:**

- Modify: `packages/app/features/addEditPrescription/screen.tsx`

**Migration spec:**

- Replace `CREATE_PRESCRIPTION` with `useCreatePrescription` mutation hook
- Replace `UPDATE_PRESCRIPTION` with `useUpdatePrescription` mutation hook
- Remove CallPostService and URL constant imports that are replaced
- Derive isLoading from mutation isPending states
- Preserve all navigation (router.push after success), alerts, form state

**Commit:**

```bash
git add packages/app/features/addEditPrescription/screen.tsx
git commit -m "feat: migrate addEditPrescription screen to TanStack Query hooks"
```

---

## Reference Migration Pattern

Every screen migration follows this pattern (established by appointmentsList and appointmentDetails):

1. **Replace imports**: Remove `CallPostService` + URL constants, add hook imports from data modules
2. **Add hooks at top of component**: Query hooks for reads, mutation hooks for writes
3. **Add useEffect for query data processing**: Extract privileges, lists, etc. from query response
4. **Replace imperative functions**: Old `async function doThing()` with `mutation.mutate(params, { onSuccess, onError })`
5. **Derive loading state**: `const isMutating = mut1.isPending || mut2.isPending || ...`
6. **Update PtsLoader**: `<PtsLoader loading={isLoading || isQueryLoading || isMutating} />`
7. **Preserve behavior**: Navigation (router.push/dismiss), Alert.alert calls, state updates

## Critical Rules

- Do NOT add comments to the code (per CLAUDE.md)
- Use NativeWind styling (don't change any styles)
- Keep `CallPostService` for any endpoints that don't have data module hooks
- Match the exact parameter shapes the server expects (check existing screen code for payload structure)
- When a hook's TypeScript type is narrower than what the screen sends, widen the type (use `Record<string, unknown>`)
